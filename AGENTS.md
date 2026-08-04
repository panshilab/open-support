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
pnpm api:typecheck
pnpm api:build
pnpm schemas:typecheck
pnpm schemas:build
```

If Nx project graph commands hang in a sandbox, verify directly:

```sh
./node_modules/.bin/tsc -p packages/schemas/tsconfig.json --noEmit
./node_modules/.bin/tsc -p packages/schemas/tsconfig.json
./node_modules/.bin/tsc -p apps/api/tsconfig.json --noEmit
./node_modules/.bin/tsc -p apps/api/tsconfig.build.json
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
- Do not call Redis directly from feature modules.
- Use `CacheService` from `apps/api/src/cache`.
- Cache should automatically use Redis only when `REDIS_URL` is configured.
- Without Redis credentials, use the in-memory cache implementation.

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

