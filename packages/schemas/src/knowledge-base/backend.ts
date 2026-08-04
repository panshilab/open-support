import { z } from 'zod';
import {
  KnowledgeBaseEntryFieldsSchema,
  KnowledgeBaseEntryFormSchema,
  KnowledgeBaseSearchFormSchema,
} from './frontend.js';
import { PaginationQuerySchema } from '../common.js';

export const CreateKnowledgeBaseEntrySchema = KnowledgeBaseEntryFormSchema;
export const UpdateKnowledgeBaseEntrySchema = KnowledgeBaseEntryFieldsSchema.partial();

export const KnowledgeBaseSearchQuerySchema = KnowledgeBaseSearchFormSchema
  .merge(PaginationQuerySchema)
  .extend({
    minScore: z.coerce.number().min(0).max(1).optional(),
  });
