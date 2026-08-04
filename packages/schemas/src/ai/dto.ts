import { createZodDto } from 'nestjs-zod';
import { UpsertAiConfigSchema } from './backend.js';

export class UpsertAiConfigDto extends createZodDto(UpsertAiConfigSchema) {}
