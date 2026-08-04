import { z } from 'zod';
import { HtmlSchema, IdSchema, IsoDateStringSchema, SlugSchema } from '../common.js';

export const KnowledgeBaseEntryTypeSchema = z.enum(['article', 'faq']);
export const EmbeddingStatusSchema = z.enum(['pending', 'ready', 'failed']);
export type KnowledgeBaseEntryType = z.infer<typeof KnowledgeBaseEntryTypeSchema>;
export type EmbeddingStatus = z.infer<typeof EmbeddingStatusSchema>;

export const BaseKnowledgeBaseEntrySchema = z.object({
  id: IdSchema,
  productId: IdSchema.nullable(),
  categoryId: IdSchema.nullable(),
  categoryPath: z.string().trim().max(500).nullable(),
  name: z.string().trim().min(1).max(180),
  slug: SlugSchema,
  type: KnowledgeBaseEntryTypeSchema,
  contentHtml: HtmlSchema.nullable(),
  excerpt: z.string().trim().max(300).nullable(),
  question: z.string().trim().min(1).max(300).nullable(),
  answerHtml: HtmlSchema.nullable(),
  searchText: z.string().trim().nullable(),
  embeddingModel: z.string().trim().max(120).nullable(),
  embeddingDimensions: z.number().int().positive().nullable(),
  embeddingStatus: EmbeddingStatusSchema.default('pending'),
  embeddedAt: IsoDateStringSchema.nullable(),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
  createdAt: IsoDateStringSchema,
  updatedAt: IsoDateStringSchema,
});
export type KnowledgeBaseEntry = z.infer<typeof BaseKnowledgeBaseEntrySchema>;
