# @open-support/schemas

Shared Zod schemas and inferred TypeScript types for the Open Support frontend and backend.

## Rules

- Do not use `class-validator`.
- Zod is the validation source of truth.
- Frontend forms import from `@open-support/schemas/frontend`.
- Backend controllers/services import from `@open-support/schemas/backend`.
- NestJS DTO classes import from `@open-support/schemas/dto`.
- Topic-specific imports are available, for example `@open-support/schemas/category`.
- TypeORM entities stay in the backend app and map to/from these DTOs in services.

## Exports

```ts
import { BaseUserSchema } from '@open-support/schemas/base';
import { BaseCategorySchema, CreateCategoryDto } from '@open-support/schemas/category';
import { CreateTicketFormSchema } from '@open-support/schemas/frontend';
import { CreateTicketSchema } from '@open-support/schemas/backend';
import type { User, CreateTicketInput } from '@open-support/schemas/types';
import { CreateTicketDto } from '@open-support/schemas/dto';
```
