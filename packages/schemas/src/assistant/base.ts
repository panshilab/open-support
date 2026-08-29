import { z } from 'zod';

export const AssistantRoleSchema = z.enum(['user', 'assistant']);
export type AssistantRole = z.infer<typeof AssistantRoleSchema>;

export const AssistantMessageSchema = z.object({
  role: AssistantRoleSchema,
  content: z.string().trim().min(1).max(5000),
});
export type AssistantMessage = z.infer<typeof AssistantMessageSchema>;

export const AssistantSourceSchema = z.object({
  id: z.string().trim().min(1),
  title: z.string().trim().min(1),
  type: z.string().trim().min(1),
  categoryPath: z.string().trim().nullable(),
});
export type AssistantSource = z.infer<typeof AssistantSourceSchema>;

export const AssistantResponseSchema = z.object({
  answer: z.string().trim().min(1),
  confidence: z.enum(['low', 'medium', 'high']),
  sources: z.array(AssistantSourceSchema),
  shouldEscalate: z.boolean(),
});
export type AssistantResponse = z.infer<typeof AssistantResponseSchema>;
