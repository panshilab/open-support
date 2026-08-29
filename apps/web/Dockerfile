# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS deps

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.11.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml nx.json tsconfig.base.json ./
COPY apps/web/package.json apps/web/package.json
COPY packages/schemas/package.json packages/schemas/package.json
COPY packages/services/package.json packages/services/package.json

RUN pnpm install --frozen-lockfile

FROM deps AS build

COPY apps/web apps/web
COPY packages/schemas packages/schemas
COPY packages/services packages/services

RUN pnpm --filter @open-support/schemas run build
RUN pnpm --filter @open-support/services run build
RUN pnpm --filter @open-support/web run build

FROM node:22-alpine AS runner

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=7000
ENV API_ORIGIN=http://api:7001
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH

WORKDIR /app

RUN apk add --no-cache bash

RUN corepack enable && corepack prepare pnpm@11.11.0 --activate

COPY --from=deps --chown=node:node /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml /app/nx.json ./
COPY --from=deps --chown=node:node /app/node_modules node_modules
COPY --from=deps --chown=node:node /app/apps/web/node_modules apps/web/node_modules
COPY --from=deps --chown=node:node /app/packages/schemas/node_modules packages/schemas/node_modules
COPY --from=deps --chown=node:node /app/packages/services/node_modules packages/services/node_modules
COPY --from=build --chown=node:node /app/apps/web/package.json apps/web/package.json
COPY --from=build --chown=node:node /app/apps/web/dist apps/web/dist
COPY --from=build --chown=node:node /app/apps/web/vite.config.ts apps/web/vite.config.ts
COPY --from=build --chown=node:node /app/packages/schemas/package.json packages/schemas/package.json
COPY --from=build --chown=node:node /app/packages/schemas/dist packages/schemas/dist
COPY --from=build --chown=node:node /app/packages/services/package.json packages/services/package.json
COPY --from=build --chown=node:node /app/packages/services/dist packages/services/dist

USER node

WORKDIR /app/apps/web

EXPOSE 7000

CMD ["pnpm", "run", "start"]
