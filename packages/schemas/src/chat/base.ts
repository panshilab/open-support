import { z } from 'zod';
import { EmailSchema, IdSchema, IsoDateStringSchema } from '../common.js';

export const ChatStatusSchema = z.enum(['waiting', 'active', 'closed']);
export const ChatSenderSchema = z.enum(['visitor', 'staff', 'system', 'bot']);
export type ChatStatus = z.infer<typeof ChatStatusSchema>;
export type ChatSender = z.infer<typeof ChatSenderSchema>;

export const BaseChatSchema = z.object({
  id: IdSchema,
  visitorEmail: EmailSchema,
  visitorName: z.string().trim().min(1).max(120),
  status: ChatStatusSchema.default('waiting'),
  staffUserId: IdSchema.nullable(),
  staffName: z.string().trim().min(1).max(120).nullable(),
  botActive: z.boolean().default(false),
  createdAt: IsoDateStringSchema,
  updatedAt: IsoDateStringSchema,
});
export type Chat = z.infer<typeof BaseChatSchema>;

export const BaseChatMessageSchema = z.object({
  id: IdSchema,
  chatId: IdSchema,
  sender: ChatSenderSchema,
  senderEmail: EmailSchema.nullable(),
  senderName: z.string().trim().min(1).max(120),
  content: z.string().trim().min(1).max(5000),
  staffOnly: z.boolean().default(false),
  createdAt: IsoDateStringSchema,
});
export type ChatMessage = z.infer<typeof BaseChatMessageSchema>;

export const BaseChatMetaSchema = z.object({
  chatId: IdSchema,
  currentPage: z.string().url().max(2048).nullable(),
  ipAddress: z.string().max(80).nullable(),
  timezone: z.string().max(120).nullable(),
  browser: z.string().max(120).nullable(),
  os: z.string().max(120).nullable(),
  language: z.string().max(80).nullable(),
});
export type ChatMeta = z.infer<typeof BaseChatMetaSchema>;
