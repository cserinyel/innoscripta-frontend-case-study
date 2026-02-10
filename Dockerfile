# ---- Stage 1: Build ----
FROM node:22-alpine AS build

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy dependency manifests first for layer caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

# Copy application source
COPY . .

# Accept Vite env vars as build args (baked into the JS bundle at build time)
ARG VITE_GUARDIAN_API_KEY
ARG VITE_GUARDIAN_BASE_URL
ARG VITE_NYT_API_KEY
ARG VITE_NYT_BASE_URL
ARG VITE_NEWSAPI_API_KEY
ARG VITE_NEWSAPI_BASE_URL

RUN pnpm build

# ---- Stage 2: Serve ----
FROM nginx:stable-alpine

# Copy built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
