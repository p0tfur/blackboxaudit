# syntax=docker/dockerfile:1.7

# Base image with pnpm enabled via Corepack
FROM node:20-bookworm AS base
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable

# Install dependencies using pnpm (shared across build layers)
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Build the Nuxt application
FROM deps AS build
COPY . .
RUN pnpm run build

# Runtime image that only contains the compiled output
FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Copy compiled server output
COPY --from=build /app/.output ./.output

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
