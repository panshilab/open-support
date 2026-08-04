# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS deps

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.11.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml nx.json tsconfig.base.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/schemas/package.json packages/schemas/package.json

RUN pnpm install --frozen-lockfile

FROM deps AS build

COPY apps/api apps/api
COPY packages/schemas packages/schemas

RUN pnpm --filter @open-support/schemas run build
RUN pnpm --filter @open-support/api run build

FROM node:22-alpine AS runner

ENV NODE_ENV=production
ENV API_HOST=0.0.0.0
ENV API_PORT=3001
ENV MEDIA_LOCAL_DIR=/app/uploads/media
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.11.0 --activate

COPY --from=deps --chown=node:node /app/node_modules node_modules
COPY --from=deps --chown=node:node /app/apps/api/node_modules apps/api/node_modules
COPY --from=deps --chown=node:node /app/packages/schemas/node_modules packages/schemas/node_modules
COPY --from=build --chown=node:node /app/apps/api/package.json apps/api/package.json
COPY --from=build --chown=node:node /app/apps/api/dist apps/api/dist
COPY --from=build --chown=node:node /app/packages/schemas/package.json packages/schemas/package.json
COPY --from=build --chown=node:node /app/packages/schemas/dist packages/schemas/dist

RUN mkdir -p /app/uploads/media && chown -R node:node /app/uploads

USER node

WORKDIR /app/apps/api

EXPOSE 3001

CMD ["pnpm", "run", "start"]
