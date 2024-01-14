FROM node:18-alpine AS base
RUN corepack enable 

FROM base AS builder
RUN apk add --no-cache libc6-compat
RUN apk update
RUN npm install -g turbo

# Set working directory
WORKDIR /app
COPY . .
RUN turbo prune @morten-olsen/mini-loader-server --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
RUN pnpm install

# Build the project
COPY --from=builder /app/out/full/ .
RUN pnpm turbo run build --filter=@morten-olsen/mini-loader-server

FROM base AS runner
ENV \
  NODE_ENV=production \
  DATA_DIR=/data \
  CACHE_DIR=/cache
RUN apk add --no-cache jq curl
WORKDIR /app

# Don't run production as root
RUN \
  ln -s /app/packages/server/bin/index.mjs /usr/local/bin/mini-loader-server

COPY ./docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

COPY --from=installer /app .
EXPOSE 4500
VOLUME /data

HEALTHCHECK \
  --interval=10s \
  --start-period=10s \
  CMD curl -f http://localhost:4500/health || exit 1

ENTRYPOINT ["/entrypoint.sh"]
CMD ["mini-loader-server", "start"]