# AGENTS.md

Guidance for coding agents working in this repository.

## Project

Open Support is a support portal built as an Nx monorepo.

Current stack:

- Package manager: pnpm
- Monorepo: Nx
- Backend: NestJS
- ORM: TypeORM
- Database: PostgreSQL with pgvector
- Cache: centralized cache module using Redis when configured, in-memory fallback otherwise
- Shared validation/types: Zod schemas in `packages/schemas`

## Commands

Use pnpm, not npm.

```sh
pnpm install
pnpm lint
pnpm format:check
pnpm api:typecheck
pnpm api:build
pnpm web:typecheck
pnpm web:build
pnpm schemas:typecheck
pnpm schemas:build
```

If Nx project graph commands hang in a sandbox, verify directly:

```sh
./node_modules/.bin/tsc -p packages/schemas/tsconfig.json --noEmit
./node_modules/.bin/tsc -p packages/schemas/tsconfig.json
./node_modules/.bin/tsc -p apps/api/tsconfig.json --noEmit
./node_modules/.bin/tsc -p apps/api/tsconfig.build.json
./node_modules/.bin/tsc -p apps/web/tsconfig.json --noEmit
```

## Validation And Types

Do not use `class-validator`.

Do not use `class-transformer` for request validation.

Zod is the source of truth for validation and inferred TypeScript types.

Schema package layout is topic-first:

```txt
packages/schemas/src/<topic>/
  base.ts
  frontend.ts
  backend.ts
  index.ts
```

Rules:

- Put shared persisted/domain schemas in `base.ts`.
- Put frontend form schemas in `frontend.ts`.
- Put backend request schemas, inferred input types, and NestJS DTO classes in `backend.ts`.
- Export inferred types beside the schema using `z.infer`.
- Keep aggregate type-only exports in `packages/schemas/src/types/index.ts`.
- TypeORM entities stay in `apps/api`, not in `packages/schemas`.

Example:

```ts
export const CreateTicketSchema = CreateTicketFormSchema;
export type CreateTicketInput = z.infer<typeof CreateTicketSchema>;
export class CreateTicketDto extends createZodDto(CreateTicketSchema) {}
```

## Backend Conventions

- Use NestJS modules by domain.
- Use TypeORM entities, repositories, and migrations.
- Use raw SQL migrations/queries for pgvector-specific features.
- All runtime environment variables must go through the universal Zod validation layer in `apps/api/src/config/env.schema.ts`.
- Required environment variables must not have silent defaults. If a required variable is missing or malformed, the API must fail during startup.
- Optional integrations such as Redis, SMTP, Google login, and OpenAI must be represented as optional schema fields and conditionally validated when one related credential implies another.
- Access environment values only through `EnvService`; do not read `process.env` directly in feature modules.
- Do not call Redis directly from feature modules.
- Use `CacheService` from `apps/api/src/cache`.
- Cache should automatically use Redis only when `REDIS_URL` is configured.
- Without Redis credentials, use the in-memory cache implementation.

## Frontend Design Guidelines

- Put app-wide visual decisions in the MUI theme in `apps/web/src/routes/__root.tsx`, not as one-off route styles.
- Preserve the existing green brand color `#14532d`; use soft green/teal supporting colors and muted green dividers/backgrounds.
- Use 90% black for primary text: `rgba(0, 0, 0, 0.9)`.
- Keep shared component polish in theme overrides for cards, chips, inputs, buttons, app bar, and focus/hover states.
- Use MUI `Container` for page width. Prefer `maxWidth="lg"` for knowledgebase-style reading surfaces.
- If a header/filter band needs full-browser-width background, use a balanced full-bleed wrapper such as `mx: 'calc(50% - 50vw)'`, then place the actual controls inside `Container maxWidth="lg"`.
- Do not use CSS grid on the knowledgebase route. Use MUI `Grid` for the title/filter row and article card layouts.
- Keep knowledgebase title, search, product filter, and category filter together in one sticky row on desktop, with responsive wrapping on smaller screens.
- Keep knowledgebase content below the sticky header in `Container maxWidth="lg"` so article cards align with the header controls.
- Avoid fixed viewport widths for content areas; only full-bleed background bands should break out.

## Git

Commit coherent chunks as checkpoints. Do not wait for one giant commit.

Good commit examples:

- `chore: scaffold nx workspace and shared schemas`
- `refactor: colocate schema dto and inferred types`
- `feat: scaffold backend api phase one`

Before committing:

- Check `git status --short`
- Run relevant typecheck/build commands
- Avoid committing generated `dist`, `.nx`, `.pnpm-store`, or `node_modules`
