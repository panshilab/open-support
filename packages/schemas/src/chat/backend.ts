import { z } from 'zod';
import { SendChatMessageFormSchema, StartChatFormSchema } from './frontend.js';

export const StartChatSchema = StartChatFormSchema;
export const SendChatMessageSchema = SendChatMessageFormSchema.extend({
  token: z.string().trim().min(24).max(255).optional(),
});

export const ChatTokenSchema = z.object({
  token: z.string().trim().min(24).max(255),
});

export const ChatTypingSchema = ChatTokenSchema.extend({
  isTyping: z.boolean(),
});
