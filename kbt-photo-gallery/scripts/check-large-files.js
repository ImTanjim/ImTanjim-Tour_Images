#!/usr/bin/env node
/**
 * check-large-files.js
 * =====================
 * Blocks any file >= 99 MB (configurable) from being committed or pushed.
 *
 * Why not .gitignore?
 *   Git's .gitignore only matches names/patterns — it has NO size-based
 *   rules. So this runs as a git hook instead (see .githooks/, wired up
 *   via `git config core.hooksPath .githooks`).
 *
 * Usage (called by the hooks, can also be run manually):
 *   node scripts/check-large-files.js --pre-commit
 *   node scripts/check-large-files.js --pre-push
 *
 * Threshold override (one-off, without editing this file):
 *   MAX_FILE_MB=200 node scripts/check-large-files.js --pre-commit
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

// ---------- Configuration ----------
const DEFAULT_MAX_MB = 99; // "99 MB ba tar besi" -> block 99 MB and above
const MAX_BYTES = Number(process.env.MAX_FILE_MB ?? DEFAULT_MAX_MB) * 1024 * 1024;

const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const GREEN = '\x1b[32m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';

const mode = process.argv.includes('--pre-push') ? 'pre-push' : 'pre-commit';

/** Run a git command, stdout as string. */
function git(args) {
  return execSync(`git ${args}`, {
    cwd: repoRoot,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 64,
    stdio: ['ignore', 'pipe', 'ignore'],
  });
}

const repoRoot = execSync('git rev-parse --show-toplevel', {
  encoding: 'utf8',
}).trim();

/**
 * Pre-commit: every file in the index (added / copied / modified),
 * measured from the working tree.
 */
function checkStaged() {
  const out = git('diff --cached --name-only --diff-filter=ACMR -z');
  const files = out.split('\0').filter(Boolean);

  const violations = [];
  for (const file of files) {
    const abs = path.join(repoRoot, file);
    let size;
    try {
      size = fs.statSync(abs).size;
    } catch {
      continue; // raced delete / intent-to-add without content
    }
    if (size >= MAX_BYTES) violations.push({ file, size });
  }
  return violations;
}

/**
 * Pre-push: every blob inside the commits about to be pushed, so that
 * oversized files already committed (e.g. with --no-verify) still get
 * blocked at push time. Reads "<local-sha> <remote-sha> <ref>" from stdin.
 */
function checkPushRange() {
  const lines = fs.readFileSync(0, 'utf8').split('\n').filter(Boolean);

  const ranges = new Set();
  for (const line of lines) {
    const [localSha, remoteSha] = line.trim().split(/\s+/);
    if (!localSha || /^0+$/.test(localSha)) continue; // branch deletion

    if (remoteSha && !/^0+$/.test(remoteSha)) {
      ranges.add(`${remoteSha}..${localSha}`);
    } else {
      // New branch: compare against everything already known on the remote
      ranges.add(`${localSha} --not --remotes`);
    }
  }

  const violations = [];
  for (const range of ranges) {
    // "<sha> <path>" for every object in the range
    const objects = git(`rev-list --objects ${range}`).split('\n').filter(Boolean);
    if (objects.length === 0) continue;

    // Feed shas to cat-file to get their sizes in one pass
    const shas = objects.map((o) => o.split(' ')[0]).join('\n');
    const batch = execSync(
      'git cat-file --batch-check="%(objecttype) %(objectsize) %(objectname)"',
      {
        cwd: repoRoot,
        input: `${shas}\n`,
        encoding: 'utf8',
        maxBuffer: 1024 * 1024 * 64,
      },
    );

    const sizeBySha = new Map();
    for (const row of batch.split('\n')) {
      const [type, size, sha] = row.split(' ');
      if (type === 'blob') sizeBySha.set(sha, Number(size));
    }

    for (const obj of objects) {
      const [sha, ...rest] = obj.split(' ');
      const file = rest.join(' ') || sha;
      const size = sizeBySha.get(sha);
      if (size !== undefined && size >= MAX_BYTES) {
        violations.push({ file, size });
      }
    }
  }
  return violations;
}

// ---------- Main ----------
let violations;
try {
  violations = mode === 'pre-push' ? checkPushRange() : checkStaged();
} catch (err) {
  // Never let a broken hook hard-block the workflow — warn loudly instead.
  console.error(`${YELLOW}⚠ check-large-files.js could not run (${err.message}). Skipping size check.${RESET}`);
  process.exit(0);
}

if (violations.length > 0) {
  const mb = (b) => `${(b / (1024 * 1024)).toFixed(2)} MB`;
  console.error(`${RED}✖ ${mode}: file(s) >= ${MAX_BYTES / (1024 * 1024)} MB found — commit/push blocked:${RESET}\n`);
  for (const { file, size } of violations) {
    console.error(`   ${mb(size).padStart(12)}  ${file}`);
  }
  console.error(`\n${YELLOW}GitHub hard-rejects files over 100 MB, so they must stay out of git.${RESET}`);
  console.error(`Options:`);
  console.error(`  1. Remove the file:           git rm --cached "<file>"`);
  console.error(`  2. Keep it untracked locally: add its path to .gitignore`);
  console.error(`  3. Host it elsewhere (CDN / Git LFS / cloud drive) and link to it.`);
  console.error(`\n${DIM}One-off override:  MAX_FILE_MB=<n> git ${mode === 'pre-push' ? 'push' : 'commit'} ...${RESET}`);
  process.exit(1);
}

console.error(`${GREEN}✔ ${mode}: no file >= ${MAX_BYTES / (1024 * 1024)} MB — size check passed${RESET}`);
process.exit(0);
