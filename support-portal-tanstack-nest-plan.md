# Support Portal Rebuild Plan

Source reference: `raselupm/support-portal`

Target stack:

- Monorepo: Nx
- Frontend: TanStack Start, React, TypeScript
- Backend: NestJS, TypeScript
- Primary database: PostgreSQL with pgvector
- ORM: TypeORM
- Validation/types: Zod schemas in a shared package, converted to NestJS DTOs
- Cache/realtime helper: centralized NestJS cache module using Redis when configured, otherwise Node in-memory cache
- Realtime transport: Socket.IO, NestJS WebSocket Gateway, or Pusher
- Rich text: Tiptap
- Storage: S3-compatible storage or Cloudinary

## Product Summary

Build a customer support platform with four main surfaces:

- Public knowledge base for self-service documentation
- Customer portal for authentication, profile, tickets, and replies
- Embeddable live chat widget for external websites
- Admin/staff panel for tickets, chats, docs, staff, AI settings, and notifications

The original repo is a Next.js Redis-backed monolith. The rebuild should separate concerns into a TanStack Start frontend and a NestJS API, using PostgreSQL for durable relational data and a centralized cache service for short-lived operational state. The cache service should use Redis when credentials are configured and automatically fall back to Node in-memory caching when Redis is not configured.

## Feature Inventory

### Public Knowledge Base

- Public homepage with latest articles and product/category groups
- FAQ-style knowledge base entries
- Multi-level category pages with article counts
- Category tree navigation
- Article detail pages
- Breadcrumb navigation
- Sidebar navigation grouped by product/category
- Right-side table of contents generated from article headings
- Article search with live keyword filtering
- Category/product filter in search
- Article feedback with happy, neutral, and sad reactions
- Cookie or user/session-based feedback tracking
- CTA block for users who did not find an answer
- Header that adapts to login state
- Admin/staff panel link for authorized users
- Chat widget embedded on public docs pages

### Customer Portal

- Email OTP passwordless login
- Optional Google login that creates or links a local user account
- Optional Google reCAPTCHA on login
- Session-based authentication
- Profile page
- Display name update
- Email notification preferences
- Prompt users to set name if missing
- Submit support ticket
- Multi-level category selection when creating ticket
- Category path display, for example `Billing > Invoices > Failed payment`
- Rich text ticket description
- Minimum title and description validation
- Ticket list for logged-in customer
- Ticket status tracking
- Ticket detail page
- Threaded comments/replies
- Realtime ticket comment updates
- Seen indicators for customer and staff
- Delete/close actions where allowed
- Email notifications for staff/customer replies

### Live Chat Widget

- Embeddable `chat-widget.js` script
- Configurable portal URL via script attribute
- Configurable accent color via script attribute
- Optional product filter via script attribute
- Floating chat launcher
- Home tab with docs search and latest articles
- Ask tab for live chat
- Inline article reader inside widget
- Maximize/restore widget mode
- Visitor name and email capture before starting chat
- Visitor metadata capture:
  - Current page URL
  - IP address
  - Timezone
  - Browser
  - OS
  - Language
- Realtime visitor/staff messages
- Message history persistence across reloads
- Auto-growing textarea
- Typing indicators
- Seen indicators
- Visitor close chat flow
- Empty state with support ticket CTA
- Notification sounds

### Admin/Staff Panel

- Protected admin/staff layout
- Dashboard overview
- Ticket statistics
- Recent tickets
- Recent chats
- Staff activity stats
- Ticket management:
  - List all tickets
  - View ticket detail
  - Reply to tickets
  - Update ticket status
  - Delete ticket
- Live chat management:
  - List waiting, active, and closed chats
  - View chat detail
  - Join conversation
  - Close conversation
  - Delete chat
  - Take over from AI bot
  - Staff-only system messages
- Staff management:
  - Add staff member
  - List staff members
  - Remove staff member
  - Restrict staff management to admins
- Docs management:
  - Create product/category
  - Create nested categories
  - Edit category parent/ordering
  - Delete product/category
  - Create article
  - Edit article
  - Delete article
  - Assign article to product/category path
  - Reorder or sort articles
  - Show article feedback counts
- Knowledge base management:
  - List knowledge base articles and FAQs
  - Create FAQ or article entries
  - Edit FAQ or article entries
  - Assign entries to product/category path
  - Publish or unpublish entries
  - Mark entries as featured/common questions
- Media management:
  - Upload image
  - List uploaded images
  - Select image for editor
  - Delete uploaded image
- Settings:
  - Configure AI provider
  - Configure AI model
  - Store API key securely
  - Enable/disable AI bot
- Realtime notifications:
  - New chat alert
  - New ticket alert
  - Ticket reply alert
  - Waiting chat badge
  - Toast and sound notifications
- Staff online heartbeat

### AI Support Bot

- Provider support:
  - OpenAI
  - Anthropic
  - Google Gemini
- Admin configuration page
- Knowledge-base-grounded answers
- Bot joins new chats automatically when enabled
- Bot replies to first visitor message
- Bot handles follow-up messages
- Typing indicator while AI is processing
- Fallback response when answer is not found in docs
- Human takeover button
- Implicit takeover when staff sends a message
- Visual distinction for bot messages
- Bot active badge

### Rich Text and Media

- Tiptap editor
- Heading controls
- Link support
- Image insertion
- Media library modal
- Drag-and-drop image upload
- Image delete
- Resizable images
- Image captions
- Paragraph support in chat/ticket replies
- HTML persistence with server-side sanitization

### Notifications and Email

- OTP email for all user login
- SMTP configuration through environment variables
- New ticket email to staff/admin
- Ticket reply email to customer or staff/admin
- Delayed reply email if recipient has not viewed ticket
- Notification preference checks
- Local development email provider
- Production transactional email provider

### Security and Reliability

- Encrypted session cookies
- Role guards:
  - `admin`
  - `support_agent`
  - `user`
- Every user must have one assigned role
- API-level authorization for admin-only actions
- Rate limiting:
  - Open tickets per user
  - Waiting chats per IP
  - Chat messages per second
  - OTP requests per email/IP
- Input validation with DTOs
- HTML sanitization for rich text
- Secure media upload validation
- CSRF/session safety review
- Internal API secrets for background jobs if needed
- Audit logs for destructive admin actions

### PWA and UX

- App manifest
- Offline fallback page
- Service worker for static assets and pages
- Installable app icon
- Navigation progress bar
- Responsive layouts for mobile and desktop

## Recommended Architecture

### Monorepo Layout

```txt
nx.json
tsconfig.base.json
apps/
  web/
    src/
      routes/
      components/
      features/
      lib/
  api/
    src/
      auth/
      users/
      tickets/
      chats/
      docs/
      staff/
      media/
      ai/
      notifications/
      realtime/
      common/
packages/
  schemas/
    src/
      category/
        base.ts
        frontend.ts
        backend.ts
      ticket/
        base.ts
        frontend.ts
        backend.ts
      user/
        base.ts
        frontend.ts
        backend.ts
      ...
      types/
```

Use Nx for monorepo management:

- Root `package.json` declares `packageManager`.
- `pnpm-workspace.yaml` manages pnpm workspaces.
- `nx.json` defines target defaults and cacheable tasks.
- `tsconfig.base.json` defines shared path aliases.
- Each app/library gets a `project.json`.
- Use Nx targets for build, typecheck, test, lint, and serve tasks.
- Current shared schema library project name: `schemas`.

### Shared Types and DTO Strategy

Use one shared package for all reusable schemas and types:

- Schemas are grouped by topic under `packages/schemas/src/<topic>`
- Base schemas live in `packages/schemas/src/<topic>/base.ts`
- Frontend schemas extend base schemas in `packages/schemas/src/<topic>/frontend.ts`
- Backend schemas extend base schemas in `packages/schemas/src/<topic>/backend.ts`
- Backend DTO classes live beside backend schemas in `packages/schemas/src/<topic>/backend.ts`
- Shared inferred TypeScript types live in `packages/schemas/src/types`

Rules:

- Do not use `class-validator` anywhere.
- Do not use `class-transformer` for request validation.
- Zod is the single source of truth for validation schemas and inferred TypeScript types.
- Frontend and backend must import from the same shared schema package.
- Start every domain model with a base Zod schema.
- Extend the base schema for frontend form needs.
- Extend the base schema for backend API needs.
- Convert backend Zod schemas to DTO classes for NestJS controllers and services.
- Export `z.infer` types beside every schema, for example `CreateTicketInput`.
- Use DTO classes in controller decorators, request bodies, query params, route params, and Swagger decorators.
- Prefer validation metadata directly on Zod schemas using `.min()`, `.max()`, `.email()`, `.uuid()`, `.describe()`, `.default()`, `.optional()`, `.nullable()`, and enum schemas.
- Prefer NestJS decorators for controller/service/entity concerns:
  - `@Controller`
  - `@Post`, `@Get`, `@Patch`, `@Delete`
  - `@Body`, `@Param`, `@Query`
  - `@UseGuards`
  - `@ApiTags`, `@ApiOperation`, `@ApiOkResponse`, `@ApiCreatedResponse`
  - TypeORM decorators like `@Entity`, `@Column`, `@ManyToOne`, `@OneToMany`, `@Index`

Recommended DTO library:

- Prefer `nestjs-zod` for DTO generation and validation because it is actively maintained and has direct NestJS validation/OpenAPI helpers.
- `@anatine/zod-nestjs` is also acceptable, but it appears less active and relies on Swagger patching through its plugin flow.
- If the team specifically wants `@anatine/zod-nestjs`, use `createZodDto` and `ZodValidationPipe` from that package consistently.

Example schema flow:

```ts
// packages/schemas/src/user/base.ts
export const UserRoleSchema = z.enum(['admin', 'support_agent', 'user']);

export const BaseUserSchema = z.object({
  id: z.string().uuid().describe('User id'),
  email: z.string().email().describe('User email address'),
  name: z.string().min(1).max(120).nullable(),
  role: UserRoleSchema,
});

// packages/schemas/src/user/backend.ts
export const UpdateUserRoleSchema = BaseUserSchema.pick({
  role: true,
});
export type UpdateUserRoleInput = z.infer<typeof UpdateUserRoleSchema>;

export class UpdateUserRoleDto extends createZodDto(UpdateUserRoleSchema) {}
```

TypeORM entity classes should stay in the NestJS app, not the shared package. Shared schemas define API shape; TypeORM entities define persistence shape.

Validation boundary:

- Controllers receive Zod DTO classes.
- Services receive DTO types inferred from Zod schemas.
- Frontend forms use the same Zod schemas for client-side validation.
- Backend controllers use the same Zod schemas through the global Zod validation pipe.
- TypeORM entities should not contain validation decorators.

### TypeORM Persistence Strategy

Use TypeORM in `apps/api` for database access:

- Define one entity per persisted model.
- Use TypeORM decorators for persistence annotations.
- Use repositories/services for all database access.
- Use migrations for schema changes.
- Keep entities separate from DTOs.
- Map DTOs to entities inside services.

Entity rules:

- Use `@Entity()` for tables.
- Use `@Column()` for fields.
- Use `@Index()` for searchable fields.
- Use `@ManyToOne()` and `@OneToMany()` for relationships.
- Use `@CreateDateColumn()` and `@UpdateDateColumn()` for timestamps.
- Use explicit enum columns for roles, ticket status, chat status, article type, and embedding status.
- Use raw SQL migrations for pgvector extension, vector column, and vector indexes.

Example entity direction:

```ts
@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  email!: string;

  @Column({ type: 'varchar', length: 120, nullable: true })
  name!: string | null;

  @Column({ type: 'enum', enum: ['admin', 'support_agent', 'user'], default: 'user' })
  role!: UserRole;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
```

For pgvector, prefer migration SQL and raw similarity queries:

```sql
CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE knowledge_base_entries
  ADD COLUMN embedding vector(1536);

SELECT *
FROM knowledge_base_entries
WHERE embedding IS NOT NULL
ORDER BY embedding <=> $1
LIMIT 10;
```

### Frontend Responsibilities

TanStack Start should own:

- Routing and page composition
- Server-side rendering/data loading where useful
- Auth-aware UI
- Forms and validation UX
- Rich editor UI
- Admin/staff dashboards
- Public docs experience
- Ticket and chat client views
- Embeddable widget build output

### Backend Responsibilities

NestJS should own:

- Auth and sessions
- API routes
- Role-based authorization
- Database persistence with TypeORM entities, repositories, and migrations
- Request validation with Zod DTOs
- Realtime events
- Email delivery
- AI provider calls
- Media upload/signing/deletion
- Rate limiting
- Background jobs
- Audit logging

### Storage Choice

Use PostgreSQL for:

- Users
- Staff members
- Tickets
- Ticket comments
- Chats
- Chat messages
- Products/categories
- Multi-level category tree
- Docs articles
- Knowledge base embeddings with pgvector
- Article feedback
- AI config metadata
- Media assets
- Notification preferences
- Audit logs

PostgreSQL requirements:

- Enable the `vector` extension from pgvector
- Add a vector column to knowledge base/article records
- Create an approximate nearest-neighbor index for semantic search
- Store the embedding model name and embedding dimensions used for each row

Use the centralized cache module for:

- OTP codes
- Session cache if needed
- Rate limit counters
- Staff heartbeat
- Chat visitor tokens
- Temporary typing state
- Delayed notification locks
- Realtime fanout support if using Socket.IO adapter

Cache behavior:

- All application code must depend on one `CacheService` abstraction.
- If Redis credentials are present, `CacheService` should use Redis.
- If Redis credentials are missing, `CacheService` should use an in-memory Node cache.
- The in-memory cache is acceptable for local development and single-node deployments only.
- Production multi-instance deployments should use Redis so OTP, rate limit, heartbeat, and chat token state is shared across instances.

### Required Environment Variables

Authentication and email:

```env
# App
APP_URL=http://localhost:3000
APP_NAME=Support Portal
SESSION_SECRET=replace-with-strong-secret

# Initial admin bootstrap
ADMIN_EMAILS=admin@example.com

# SMTP
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=smtp-user
SMTP_PASS=smtp-password
SMTP_FROM_EMAIL=noreply@example.com
SMTP_FROM_NAME=Support Portal

# Google OAuth, optional
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# OTP
OTP_EXPIRES_IN_SECONDS=600
OTP_LENGTH=6

# Cache, optional
# If REDIS_URL is present, use Redis.
# If REDIS_URL is missing, use Node in-memory cache.
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=
CACHE_DEFAULT_TTL_SECONDS=300

# Embeddings for knowledge base semantic search
EMBEDDING_PROVIDER=openai
EMBEDDING_MODEL=text-embedding-3-small
EMBEDDING_DIMENSIONS=1536
EMBEDDING_API_KEY=your-embedding-provider-api-key
```

Notes:

- `ADMIN_EMAILS` should only be used to bootstrap initial admin access.
- After bootstrap, each user should have an explicit role in the database.
- OTP codes should be stored hashed in the centralized cache and should expire automatically.
- SMTP credentials must never be exposed to the frontend.
- Embedding API keys must only be used by the NestJS backend.

## Suggested NestJS Modules

### CacheModule

Responsibilities:

- Provide one application-wide `CacheService`
- Select Redis automatically when `REDIS_URL` is configured
- Fall back to Node in-memory cache when Redis credentials are missing
- Centralize TTL handling
- Support atomic-ish counters for rate limiting
- Hide Redis/client-specific code from feature modules

Required service methods:

- `get<T>(key)`
- `set(key, value, options?: { ttlSeconds?: number; nx?: boolean })`
- `delete(key)`
- `increment(key, options?: { ttlSeconds?: number })`
- `expire(key, ttlSeconds)`
- `exists(key)`

Implementations:

- `RedisCacheStore`
- `MemoryCacheStore`

Usage:

- `AuthModule` uses it for OTP codes
- `RateLimitModule` uses it for counters
- `StaffModule` uses it for heartbeat state
- `ChatModule` uses it for visitor tokens and typing state
- `NotificationsModule` uses it for delayed-notification locks

Important:

- Do not call Redis directly from feature modules.
- In-memory cache is process-local and clears on restart.
- If the app runs on multiple backend instances, Redis should be configured.

### AuthModule

Responsibilities:

- Send OTP to the user's email address
- Verify OTP and create an authenticated session
- Read SMTP settings from environment variables
- Create first-time users with the default `user` role
- Support Google login as an external identity provider
- Create a local user record on first Google login
- Link future Google logins to the existing local user by verified email
- Include user role in the authenticated session
- Google OAuth callback
- Logout
- Session creation/destruction
- Current user endpoint
- Optional reCAPTCHA verification

Endpoints:

- `POST /auth/send-otp`
- `POST /auth/verify-otp`
- `GET /auth/google`
- `GET /auth/google/callback`
- `POST /auth/logout`
- `GET /auth/me`

### UsersModule

Responsibilities:

- User profile
- Display name
- User role assignment
- Notification preferences

Endpoints:

- `GET /users/me`
- `PATCH /users/me`
- `PATCH /users/me/notifications`
- `PATCH /admin/users/:id/role`

### TicketsModule

Responsibilities:

- Customer ticket CRUD
- Admin/staff ticket management
- Ticket comments
- Status updates
- Seen tracking
- Reply notifications

Endpoints:

- `GET /tickets`
- `POST /tickets`
- `GET /tickets/:id`
- `PATCH /tickets/:id`
- `DELETE /tickets/:id`
- `POST /tickets/:id/comments`
- `POST /tickets/:id/seen`

### ChatModule

Responsibilities:

- Start visitor chat
- Visitor token validation
- Message history
- Send visitor/staff messages
- Join/close/takeover
- Typing indicators
- Seen state
- Visitor presence/close

Endpoints:

- `POST /chats/start`
- `GET /chats`
- `GET /chats/:id`
- `GET /chats/:id/messages`
- `POST /chats/:id/messages`
- `POST /chats/:id/join`
- `POST /chats/:id/close`
- `POST /chats/:id/visitor-close`
- `POST /chats/:id/takeover`
- `POST /chats/:id/typing`
- `POST /chats/:id/seen`
- `GET /chats/:id/status`
- `GET /chats/availability`

### DocsModule

Responsibilities:

- Public docs articles/products
- Multi-level category tree
- Public FAQ and knowledge base entries
- Admin article/product CRUD
- Admin category CRUD
- Admin knowledge base CRUD
- Article search
- Semantic knowledge base search with pgvector
- Generate and store embeddings when knowledge base entries are created or updated
- Article feedback

Endpoints:

- `GET /docs/products`
- `GET /docs/categories`
- `GET /docs/categories/:id`
- `GET /docs/articles`
- `GET /docs/articles/:id`
- `POST /docs/articles/:id/feedback`
- `GET /admin/docs/products`
- `POST /admin/docs/products`
- `DELETE /admin/docs/products/:id`
- `GET /admin/categories`
- `POST /admin/categories`
- `GET /admin/categories/:id`
- `PUT /admin/categories/:id`
- `DELETE /admin/categories/:id`
- `GET /admin/docs/articles`
- `POST /admin/docs/articles`
- `GET /admin/docs/articles/:id`
- `PUT /admin/docs/articles/:id`
- `DELETE /admin/docs/articles/:id`
- `GET /admin/knowledgebase`
- `POST /admin/knowledgebase`
- `GET /admin/knowledgebase/:id`
- `PUT /admin/knowledgebase/:id`
- `DELETE /admin/knowledgebase/:id`
- `GET /knowledgebase/search`

### EmbeddingsModule

Responsibilities:

- Convert knowledge base entries to plain searchable text
- Generate embeddings through the configured embedding provider
- Store embeddings in the pgvector column
- Rebuild embeddings when title, question, answer, content, product, or publish state changes
- Provide vector similarity search helpers for DocsModule and AiModule

Recommended behavior:

- On create/update, save the knowledge entry and generate its embedding in the same service workflow
- For small deployments, generate the embedding synchronously before returning success
- For larger deployments, save the entry as `embeddingStatus=pending`, queue a background job, and mark it `ready` after embedding succeeds
- If embedding generation fails, keep the entry saved but mark `embeddingStatus=failed` so admin can retry

### StaffModule

Responsibilities:

- Staff CRUD
- Staff heartbeat
- Staff online status
- Admin-only access

Endpoints:

- `GET /admin/staff`
- `POST /admin/staff`
- `DELETE /admin/staff/:email`
- `POST /admin/heartbeat`
- `DELETE /admin/heartbeat`

### MediaModule

Responsibilities:

- Upload media
- List media
- Delete media
- Storage provider abstraction

Endpoints:

- `GET /admin/media`
- `POST /admin/media`
- `DELETE /admin/media/:id`

### AiModule

Responsibilities:

- Store AI config
- Call configured provider
- Build docs context from vector search results
- Generate bot replies
- Handoff detection

Endpoints:

- `GET /admin/ai`
- `POST /admin/ai`
- `DELETE /admin/ai`

### NotificationsModule

Responsibilities:

- Send OTP email
- Send new ticket email
- Send delayed ticket reply email
- Send chat transcript if needed
- Respect notification preferences

### RealtimeModule

Responsibilities:

- WebSocket gateway or Pusher integration
- Ticket channels
- Chat channels
- Admin notification channels
- Typing events
- Seen events

Events:

- `new-ticket`
- `ticket-reply`
- `ticket-comment`
- `ticket-seen`
- `new-chat`
- `chat-updated`
- `new-message`
- `status-change`
- `messages-seen`
- `typing`

## Core Data Models

### User

- `id`
- `email`
- `name`
- `role`
- `createdAt`
- `updatedAt`
- `receiveEmailNotifications`
- `receiveNewTicketEmails`

Roles:

- `admin`
- `support_agent`
- `user`

### StaffMember

- `id`
- `email`
- `name`
- `createdAt`
- `createdByUserId`

### Ticket

- `id`
- `userId`
- `productId`
- `categoryId`
- `categoryPath`
- `title`
- `descriptionHtml`
- `status`
- `createdAt`
- `updatedAt`

Statuses:

- `open`
- `customer_reply`
- `replied`
- `resolved`

### TicketComment

- `id`
- `ticketId`
- `authorUserId`
- `contentHtml`
- `isStaff`
- `isSystem`
- `createdAt`

### TicketSeenState

- `ticketId`
- `customerSeenAt`
- `staffSeenAt`

### Chat

- `id`
- `visitorEmail`
- `visitorName`
- `status`
- `staffUserId`
- `staffName`
- `botActive`
- `createdAt`
- `updatedAt`

Statuses:

- `waiting`
- `active`
- `closed`

### ChatMessage

- `id`
- `chatId`
- `sender`
- `senderEmail`
- `senderName`
- `content`
- `staffOnly`
- `createdAt`

Senders:

- `visitor`
- `staff`
- `system`
- `bot`

### ChatMeta

- `id`
- `chatId`
- `currentPage`
- `ipAddress`
- `timezone`
- `browser`
- `os`
- `language`

### DocProduct

- `id`
- `name`
- `slug`
- `order`
- `createdAt`
- `updatedAt`

### Category

- `id`
- `productId`
- `parentId`
- `name`
- `slug`
- `path`
- `level`
- `order`
- `isActive`
- `createdAt`
- `updatedAt`

Notes:

- `parentId` is nullable for top-level categories.
- `path` stores the readable hierarchy, for example `Billing > Invoices > Failed payment`.
- `level` helps limit or display nesting depth.
- Tickets should reference the most specific selected category.
- Knowledge base entries can be attached to any category level.

### DocArticle

- `id`
- `productId`
- `categoryId`
- `categoryPath`
- `name`
- `slug`
- `type`
- `contentHtml`
- `excerpt`
- `question`
- `answerHtml`
- `searchText`
- `embedding`
- `embeddingModel`
- `embeddingDimensions`
- `embeddingStatus`
- `embeddedAt`
- `published`
- `featured`
- `order`
- `createdAt`
- `updatedAt`

Types:

- `article`
- `faq`

Embedding statuses:

- `pending`
- `ready`
- `failed`

Example PostgreSQL shape:

```sql
CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE knowledge_base_entries
  ADD COLUMN search_text text,
  ADD COLUMN embedding vector(1536),
  ADD COLUMN embedding_model text,
  ADD COLUMN embedding_dimensions integer,
  ADD COLUMN embedding_status text DEFAULT 'pending',
  ADD COLUMN embedded_at timestamptz;

CREATE INDEX knowledge_base_entries_embedding_idx
  ON knowledge_base_entries
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);
```

### ArticleFeedback

- `id`
- `articleId`
- `reaction`
- `visitorKey`
- `createdAt`
- `updatedAt`

Reactions:

- `happy`
- `normal`
- `sad`

### AiConfig

- `id`
- `provider`
- `encryptedApiKey`
- `model`
- `enabled`
- `createdAt`
- `updatedAt`

### MediaAsset

- `id`
- `url`
- `key`
- `filename`
- `mimeType`
- `size`
- `provider`
- `createdAt`
- `uploadedByUserId`

### AuditLog

- `id`
- `actorUserId`
- `action`
- `targetType`
- `targetId`
- `metadata`
- `createdAt`

## Frontend Route Plan

### Public Docs

- `/`
- `/docs/:articleId`
- `/docs/products/:productId`
- `/docs/categories/:categoryId`

### Auth

- `/login`
- `/verify`

### Customer Portal

- `/profile`
- `/tickets`
- `/tickets/new`
- `/tickets/:id`

### Admin/Staff

- `/admin`
- `/admin/dashboard`
- `/admin/tickets`
- `/admin/tickets/:id`
- `/admin/chats`
- `/admin/chats/:id`
- `/admin/knowledgebase`
- `/admin/knowledgebase/new`
- `/admin/knowledgebase/edit`
- `/admin/knowledgebase/edit/:id`
- `/admin/docs`
- `/admin/docs/new`
- `/admin/docs/:id/edit`
- `/admin/docs/products`
- `/admin/categories`
- `/admin/categories/new`
- `/admin/categories/:id/edit`
- `/admin/staff`
- `/admin/settings`

### Utility

- `/offline`

## Implementation Roadmap

### Phase 1: Project Foundation

- Create Nx monorepo structure
- Configure root pnpm workspaces
- Configure `nx.json`
- Configure `tsconfig.base.json` path aliases
- Add Nx `project.json` for each app/package
- Configure TanStack Start app
- Configure NestJS app
- Add shared package for types and validation schemas
- Add PostgreSQL
- Enable pgvector in PostgreSQL
- Configure TypeORM
- Add TypeORM entities and migrations
- Add centralized `CacheModule`
- Add Redis cache store implementation
- Add Node in-memory cache store implementation
- Add environment validation
- Add global Zod validation pipe
- Add DTO generation with `nestjs-zod`
- Add linting, formatting, and TypeScript config
- Add Docker Compose for local PostgreSQL and optional Redis
- Add migration for knowledge base vector column and vector index

Deliverable:

- Empty but running frontend and backend
- Health check endpoint
- Database connection verified
- pgvector extension verified
- TypeORM migration flow verified
- Cache module verified with memory fallback and Redis mode

### Phase 2: Auth, Users, and Roles

- Implement email OTP send/verify
- Configure SMTP from environment variables
- Send OTP emails through SMTP
- Store OTP in `CacheService` with expiry
- Hash OTP values before storing them
- Create user on first login
- Assign the default `user` role to new users
- Implement optional Google login
- On first Google login, create a local user record with role `user`
- On later Google logins, link by verified email and use the existing local role
- Implement encrypted session cookie
- Store user id, email, and role in the session
- Implement logout
- Implement current user endpoint
- Use `ADMIN_EMAILS` only for initial admin bootstrap
- Add role-based guards for `admin`, `support_agent`, and `user`
- Add admin-only user role assignment
- Add profile page and profile API

Deliverable:

- Users can log in, log out, edit profile, and access role-protected routes

### Phase 3: Knowledge Base

- Implement `Product`, `Category`, and `Article` as the core knowledge base entities
- Implement products table
- Implement multi-level categories table with `parentId`
- Link categories to products
- Link articles to one product and one category
- Add category tree APIs
- Add admin category tree management
- Implement articles table
- Support article types: article and FAQ
- Store FAQ content on the article entity using question and answer fields
- Implement publish/unpublish/draft state
- Implement `searchText` generation from title, question, answer, product, and content
- Add `OPENAI_API_KEY` as an optional environment variable for embeddings
- Add a centralized search mode resolver: use vector search only when `OPENAI_API_KEY` is configured; otherwise use regular text search
- Generate embeddings when creating or updating an article only when OpenAI embeddings are enabled
- Save embeddings to the pgvector column when vector search is enabled
- Leave the article pgvector column nullable so articles can be saved without an OpenAI token
- Implement regular search using `searchText`, `ILIKE`, and/or PostgreSQL full-text search as the default fallback
- Implement semantic search using vector similarity when embeddings are available
- If vector search is enabled but an entry has no embedding, fall back to regular search for that entry/query path
- Implement public article list
- Implement public FAQ listing/search
- Implement public product/category pages with nested category navigation
- Implement article detail page
- Implement search/filter
- Implement admin knowledge base CRUD at `/admin/knowledgebase`
- Implement create page at `/admin/knowledgebase/new`
- Implement edit page at `/admin/knowledgebase/edit/:id`
- Keep `/admin/knowledgebase/edit` as the edit selection/list route if no id is provided
- Implement admin docs CRUD if keeping the older `/admin/docs` naming as an alias
- Add Tiptap editor for articles
- Add article feedback API and UI
- Show feedback counts in admin

Deliverable:

- Admin can manage products, categories, articles, and FAQ-style articles; visitors can browse/search/read the knowledge base and leave feedback. Search works without OpenAI using regular text search, and automatically upgrades to vector search when `OPENAI_API_KEY` is configured.

### Phase 4: Ticket System

- Implement ticket create/list/detail APIs
- Implement ticket form with validation
- Add hierarchical category picker to ticket form
- Save the selected leaf category or most specific category on the ticket
- Display the selected category path on ticket list/detail/admin screens
- Implement customer ticket list
- Implement ticket comments
- Implement staff/admin ticket views
- Implement status changes
- Implement seen state
- Add realtime events for comments/status/seen
- Add email notifications for new tickets and replies
- Add delayed reply notification logic

Deliverable:

- Customers and staff can manage support tickets end to end

### Phase 5: Realtime Foundation

- Choose Pusher or NestJS WebSocket Gateway
- Define channels/rooms
- Add authenticated staff/admin realtime connection
- Add visitor chat realtime connection
- Implement event publishing service
- Add frontend realtime hooks
- Add notification sounds/toasts

Deliverable:

- Ticket and admin notifications update without page reload

### Phase 6: Media Library

- Implement storage abstraction
- Add S3-compatible provider
- Add Cloudinary provider if needed
- Implement media upload/list/delete APIs
- Add image picker modal
- Add editor image insertion
- Add image resize and caption support
- Validate mime type and file size

Deliverable:

- Admin can upload and insert images into docs/tickets

### Phase 7: Dashboard, Staff Operations, and Polish

- Implement dashboard stats
- Add recent ticket/chat panels
- Add staff reply stats
- Add staff online heartbeat
- Add staff management UI
- Add admin-only settings sections
- Add audit logs for deletes/config changes
- Add PWA manifest
- Add service worker/offline page
- Add navigation progress
- Improve loading/error/empty states

Deliverable:

- Admin/staff panel feels complete and operational

### Phase 8: Live Chat

- Implement chat start endpoint
- Store visitor token in `CacheService`
- Capture visitor metadata
- Implement chat message APIs
- Implement visitor chat widget UI
- Implement staff chat list/detail
- Implement join/close/takeover flows
- Implement typing indicators
- Implement seen indicators
- Persist chat history across reloads
- Add waiting chat badge

Deliverable:

- Visitors can chat from the widget; staff can answer from admin panel

### Phase 9: Embeddable Widget

- Build standalone `chat-widget.js`
- Support `data-portal-url`
- Support `data-color`
- Support `data-product`
- Add Home tab docs search
- Add inline article reader
- Add Ask tab live chat
- Add maximize/restore mode
- Add ticket CTA
- Ensure CSS isolation from host pages

Deliverable:

- External sites can embed the chat widget with a single script tag

### Phase 10: AI Bot

- Implement AI config admin API
- Encrypt provider API key at rest
- Implement provider adapters for OpenAI, Anthropic, and Gemini
- Build docs context from published articles
- Add grounded system prompt
- Add bot reply generation
- Add bot thinking indicator
- Auto-join bot to new chats when enabled
- Add fallback/handoff behavior
- Add human takeover
- Add bot visual states in admin and widget

Deliverable:

- AI bot can answer chat questions from documentation and hand off to humans

### Phase 11: Testing and Hardening

- Unit test NestJS services
- Integration test API endpoints
- E2E test main flows:
  - OTP login
  - Create ticket
  - Reply to ticket
  - Staff ticket management
  - Start live chat
  - Staff joins chat
  - Docs CRUD
  - AI handoff
- Add rate limit tests
- Add authorization tests
- Add rich text sanitization tests
- Add upload validation tests
- Add production logging
- Add error monitoring

Deliverable:

- Production-ready release candidate

## Suggested Build Order for Next Step

Start with the backend contract before building screens:

1. Finalize database schema
2. Create NestJS modules and DTOs
3. Implement auth/session/roles
4. Implement docs CRUD
5. Implement tickets
6. Add TanStack Start pages against real APIs
7. Add realtime
8. Add chat widget
9. Add AI/media/PWA polish

This order keeps the most important product data stable early and avoids rebuilding frontend flows around changing API shapes.

## MVP Scope

For a first usable version, build only:

- Email OTP auth
- Optional Google login that creates or links a local user
- SMTP-based OTP delivery
- User roles: `admin`, `support_agent`, `user`
- Profile name
- Public docs
- Admin knowledge base CRUD for articles and FAQs
- Customer ticket create/list/detail
- Support agent/admin ticket reply/status
- Basic email notifications
- Basic realtime ticket updates

Defer until after MVP:

- Live chat widget
- AI bot
- Media library
- reCAPTCHA
- PWA/offline
- Advanced dashboard stats
- Delayed email notification relay
