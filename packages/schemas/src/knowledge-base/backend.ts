import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import {
  KnowledgeBaseEntryFieldsSchema,
  KnowledgeBaseEntryFormSchema,
  KnowledgeBaseSearchFormSchema,
} from './frontend.js';
import { PaginationQuerySchema } from '../common.js';

export const CreateKnowledgeBaseEntrySchema = KnowledgeBaseEntryFormSchema;
export const UpdateKnowledgeBaseEntrySchema = KnowledgeBaseEntryFieldsSchema.partial();
export type CreateKnowledgeBaseEntryInput = z.infer<typeof CreateKnowledgeBaseEntrySchema>;
export type UpdateKnowledgeBaseEntryInput = z.infer<typeof UpdateKnowledgeBaseEntrySchema>;

export const KnowledgeBaseSearchQuerySchema = KnowledgeBaseSearchFormSchema
  .merge(PaginationQuerySchema)
  .extend({
    minScore: z.coerce.number().min(0).max(1).optional(),
  });
export type KnowledgeBaseSearchQuery = z.infer<typeof KnowledgeBaseSearchQuerySchema>;

export class CreateKnowledgeBaseEntryDto extends createZodDto(CreateKnowledgeBaseEntrySchema) {}
export class UpdateKnowledgeBaseEntryDto extends createZodDto(UpdateKnowledgeBaseEntrySchema) {}
export class KnowledgeBaseSearchQueryDto extends createZodDto(KnowledgeBaseSearchQuerySchema) {}
