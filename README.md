# club-gallery-images

Simple Basic Our Club Photo Galley. To store Few Memory our photo Gallery.

## Large-file protection (99 MB+)

Git has **no size-based `.gitignore` rule**, so files **≥ 99 MB** are blocked
from `git commit` and `git push` by repository hooks instead:

- `scripts/check-large-files.js` — the checker (threshold overridable with
  the `MAX_FILE_MB` env var, e.g. `MAX_FILE_MB=200 git commit ...`)
- `.githooks/pre-commit` — blocks oversized files at commit time
- `.githooks/pre-push` — also scans every commit about to be pushed, so
  files committed with `--no-verify` (or on another machine) can't slip
  through to GitHub (which hard-rejects files over 100 MB)

### One-time setup (after cloning)

```sh
git config core.hooksPath .githooks
```

> Inside `club-photo-gallery/`, running `npm install` does this
> automatically via the `prepare` script.

