import { z } from 'zod';
import { BaseChatMessageSchema, BaseChatMetaSchema, BaseChatSchema } from './base.js';
import { EmailSchema } from '../common.js';

export const StartChatFormSchema = BaseChatSchema.pick({
  visitorName: true,
}).extend({
  visitorEmail: EmailSchema,
  message: z.string().trim().min(1).max(5000),
  meta: BaseChatMetaSchema.omit({ chatId: true }).partial().optional(),
});

export const SendChatMessageFormSchema = BaseChatMessageSchema.pick({
  content: true,
});
