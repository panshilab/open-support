import { createZodDto } from 'nestjs-zod';
import {
  CreateKnowledgeBaseEntrySchema,
  KnowledgeBaseSearchQuerySchema,
  UpdateKnowledgeBaseEntrySchema,
} from '../backend/knowledge-base.schema.js';

export class CreateKnowledgeBaseEntryDto extends createZodDto(CreateKnowledgeBaseEntrySchema) {}
export class UpdateKnowledgeBaseEntryDto extends createZodDto(UpdateKnowledgeBaseEntrySchema) {}
export class KnowledgeBaseSearchQueryDto extends createZodDto(KnowledgeBaseSearchQuerySchema) {}
