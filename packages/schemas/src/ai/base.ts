import { z } from 'zod';
import { IdSchema, IsoDateStringSchema } from '../common.js';

export const AiProviderSchema = z.enum(['anthropic', 'openai', 'gemini']);
export type AiProvider = z.infer<typeof AiProviderSchema>;

export const BaseAiConfigSchema = z.object({
  id: IdSchema,
  provider: AiProviderSchema,
  model: z.string().trim().min(1).max(120).nullable(),
  enabled: z.boolean().default(false),
  createdAt: IsoDateStringSchema,
  updatedAt: IsoDateStringSchema,
});
export type AiConfig = z.infer<typeof BaseAiConfigSchema>;
