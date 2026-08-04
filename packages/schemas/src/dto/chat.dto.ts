import { createZodDto } from 'nestjs-zod';
import {
  ChatTokenSchema,
  ChatTypingSchema,
  SendChatMessageSchema,
  StartChatSchema,
} from '../backend/chat.schema.js';

export class StartChatDto extends createZodDto(StartChatSchema) {}
export class SendChatMessageDto extends createZodDto(SendChatMessageSchema) {}
export class ChatTokenDto extends createZodDto(ChatTokenSchema) {}
export class ChatTypingDto extends createZodDto(ChatTypingSchema) {}
