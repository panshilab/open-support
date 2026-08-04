import { createZodDto } from 'nestjs-zod';
import { UpsertAiConfigSchema } from '../backend/ai.schema.js';

export class UpsertAiConfigDto extends createZodDto(UpsertAiConfigSchema) {}
