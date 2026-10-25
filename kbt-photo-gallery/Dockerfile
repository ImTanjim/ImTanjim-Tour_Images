# ================== Build stage ==================
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
# Full install (not --only=production): vite & other build tools
# live in devDependencies, without them `npm run build` fails.
RUN npm ci

COPY . .

RUN npm run build

# ================== Development stage (used by docker-compose `target: development`) ==================
FROM node:22-alpine AS development

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ================== Production (nginx) stage ==================
FROM nginx:alpine

# SPA fallback + cache headers (see nginx.config)
COPY nginx.config /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
