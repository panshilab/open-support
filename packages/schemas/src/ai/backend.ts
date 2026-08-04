import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AiProviderSchema } from './base.js';

export const UpsertAiConfigSchema = z.object({
  provider: AiProviderSchema,
  apiKey: z.string().trim().min(1).max(5000),
  model: z.string().trim().min(1).max(120).optional().nullable(),
  enabled: z.boolean().default(false),
});
export type UpsertAiConfigInput = z.infer<typeof UpsertAiConfigSchema>;

export class UpsertAiConfigDto extends createZodDto(UpsertAiConfigSchema) {}
