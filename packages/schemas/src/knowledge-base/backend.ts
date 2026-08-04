import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import {
  KnowledgeBaseEntryFieldsSchema,
  KnowledgeBaseEntryFormSchema,
  KnowledgeBaseSearchFormSchema,
} from './frontend.js';
import { PaginationQuerySchema } from '../common.js';
import { IdSchema } from '../common.js';

export const CreateKnowledgeBaseEntrySchema = KnowledgeBaseEntryFormSchema;
export const UpdateKnowledgeBaseEntrySchema = KnowledgeBaseEntryFieldsSchema.partial();
export const KnowledgeBaseEntryIdParamSchema = z.object({
  articleId: IdSchema,
});
export const ListKnowledgeBaseArticlesQuerySchema = PaginationQuerySchema.extend({
  productId: IdSchema.optional(),
  categoryId: IdSchema.optional(),
});
export type CreateKnowledgeBaseEntryInput = z.infer<typeof CreateKnowledgeBaseEntrySchema>;
export type UpdateKnowledgeBaseEntryInput = z.infer<typeof UpdateKnowledgeBaseEntrySchema>;
export type KnowledgeBaseEntryIdParam = z.infer<typeof KnowledgeBaseEntryIdParamSchema>;
export type ListKnowledgeBaseArticlesQuery = z.infer<typeof ListKnowledgeBaseArticlesQuerySchema>;

export const KnowledgeBaseSearchQuerySchema = KnowledgeBaseSearchFormSchema.merge(
  PaginationQuerySchema,
).extend({
  minScore: z.coerce.number().min(0).max(1).optional(),
});
export const BackfillKnowledgeBaseEmbeddingsSchema = z.object({
  limit: z.coerce.number().int().min(1).max(200).default(50),
  force: z.boolean().default(false),
});
export type KnowledgeBaseSearchQuery = z.infer<typeof KnowledgeBaseSearchQuerySchema>;
export type BackfillKnowledgeBaseEmbeddingsInput = z.infer<
  typeof BackfillKnowledgeBaseEmbeddingsSchema
>;

export class CreateKnowledgeBaseEntryDto extends createZodDto(CreateKnowledgeBaseEntrySchema) {}
export class UpdateKnowledgeBaseEntryDto extends createZodDto(UpdateKnowledgeBaseEntrySchema) {}
export class ListKnowledgeBaseArticlesQueryDto extends createZodDto(
  ListKnowledgeBaseArticlesQuerySchema,
) {}
export class KnowledgeBaseSearchQueryDto extends createZodDto(KnowledgeBaseSearchQuerySchema) {}
export class KnowledgeBaseEntryIdParamDto extends createZodDto(KnowledgeBaseEntryIdParamSchema) {}
export class BackfillKnowledgeBaseEmbeddingsDto extends createZodDto(
  BackfillKnowledgeBaseEmbeddingsSchema,
) {}
