import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { SendChatMessageFormSchema, StartChatFormSchema } from './frontend.js';

export const StartChatSchema = StartChatFormSchema;
export type StartChatInput = z.infer<typeof StartChatSchema>;

export const SendChatMessageSchema = SendChatMessageFormSchema.extend({
  token: z.string().trim().min(24).max(255).optional(),
});
export type SendChatMessageInput = z.infer<typeof SendChatMessageSchema>;

export const ChatTokenSchema = z.object({
  token: z.string().trim().min(24).max(255),
});
export type ChatTokenInput = z.infer<typeof ChatTokenSchema>;

export const ChatTypingSchema = ChatTokenSchema.extend({
  isTyping: z.boolean(),
});
export type ChatTypingInput = z.infer<typeof ChatTypingSchema>;

export class StartChatDto extends createZodDto(StartChatSchema) {}
export class SendChatMessageDto extends createZodDto(SendChatMessageSchema) {}
export class ChatTokenDto extends createZodDto(ChatTokenSchema) {}
export class ChatTypingDto extends createZodDto(ChatTypingSchema) {}
