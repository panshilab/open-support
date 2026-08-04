# Open Support

Open Support is an Nx monorepo for a customer support portal with a TanStack Start web app, NestJS API, PostgreSQL, pgvector, Redis-backed caching when configured, and shared Zod schemas.

## Stack

- Package manager: pnpm
- Monorepo: Nx
- Frontend: TanStack Start, React, MUI, Formik, Tiptap
- Backend: NestJS, TypeORM
- Database: PostgreSQL with pgvector
- Cache: Redis when configured, in-memory fallback otherwise
- Validation and shared types: Zod in `packages/schemas`
- Email templates: React Email in `apps/api/src/email-templates`

## Apps And Packages

- `apps/api`: NestJS API
- `apps/web`: TanStack Start frontend
- `packages/schemas`: shared Zod schemas, inferred types, and backend DTOs

## Local Setup

Install dependencies:

```sh
pnpm install
```

Create/update `apps/api/.env` with local credentials:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=open_support
DATABASE_USER=asifsaho
DATABASE_PASSWORD=
DATABASE_SSL=false

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=2
REDIS_PASSWORD=
```

Run both apps in dev mode:

```sh
pnpm dev
```

Run separately:

```sh
pnpm api:dev
pnpm web:dev
```

Default URLs:

- Web: `http://localhost:3000`
- API: `http://localhost:3001/api`

## Seeded Admin

The migration `0000000000006-create-invitations-and-admin-seed` creates a local admin account.

- Email: `admin@opensupport.local`
- Temporary password: `OpenSupportAdmin123`

After the first password login, the app asks the admin to change this temporary password before continuing.

## Authentication

- Email OTP login is available for all local users.
- Google login creates or updates a local user when Google is configured.
- Password login is available for seeded or invited staff users.
- Users can have `admin`, `support_agent`, or `user` roles.

## Google Login Setup

Create a Google OAuth web client ID:

1. Go to Google Cloud Console: `https://console.cloud.google.com/`
2. Create or select a project.
3. Open `APIs & Services` -> `OAuth consent screen` and complete the required app details.
4. Open `APIs & Services` -> `Credentials`.
5. Click `Create Credentials` -> `OAuth client ID`.
6. Choose `Web application`.
7. Add authorized JavaScript origins:

```txt
http://localhost:3000
```

For production, also add the production frontend origin:

```txt
https://support.yourdomain.com
```

Save the client and copy the generated client ID into `apps/api/.env`:

```env
GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
```

Restart the API and web dev servers after changing the env file.

## Staff Invitations

Admins can invite staff from `admin/staff`.

The backend stores only a hashed invitation token. The invited staff member receives an email with an invitation link, accepts it, sets their name/password, and is created locally with the invited role.

If SMTP is not configured, invitation links and OTPs are logged by the API.

## Useful Commands

```sh
pnpm lint
pnpm format:check
pnpm typecheck
pnpm api:typecheck
pnpm api:build
pnpm web:typecheck
pnpm web:build
pnpm schemas:typecheck
pnpm schemas:build
```

## Notes

- Do not use `class-validator` or `class-transformer` for request validation.
- Keep schemas topic-first in `packages/schemas/src/<topic>`.
- DTOs live beside backend schemas using `nestjs-zod`.
- TypeORM entities live in `apps/api`.
- Use Redis only through the centralized cache module.
