import { z } from 'zod';
import { AssistantMessageSchema } from './base.js';

export const AskAssistantFormSchema = z.object({
  message: z.string().trim().min(2).max(5000),
  history: z.array(AssistantMessageSchema).max(12).default([]),
});
export type AskAssistantForm = z.infer<typeof AskAssistantFormSchema>;
