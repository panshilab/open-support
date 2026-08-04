import type { z } from 'zod';
import type {
  AiProviderSchema,
  BaseAiConfigSchema,
  BaseCategorySchema,
  BaseChatMessageSchema,
  BaseChatMetaSchema,
  BaseChatSchema,
  BaseKnowledgeBaseEntrySchema,
  BaseMediaAssetSchema,
  BaseProductSchema,
  BaseTicketCommentSchema,
  BaseTicketSchema,
  BaseUserSchema,
  CategoryTreeNodeSchema,
  ChatSenderSchema,
  ChatStatusSchema,
  EmbeddingStatusSchema,
  KnowledgeBaseEntryTypeSchema,
  MediaProviderSchema,
  PublicUserSchema,
  TicketStatusSchema,
  UserRoleSchema,
} from '../base/index.js';
import type {
  CreateCategorySchema,
  CreateKnowledgeBaseEntrySchema,
  CreateProductSchema,
  CreateTicketCommentSchema,
  CreateTicketSchema,
  MarkTicketSeenSchema,
  SendChatMessageSchema,
  SendOtpSchema,
  StartChatSchema,
  UpdateCategorySchema,
  UpdateKnowledgeBaseEntrySchema,
  UpdateNotificationPreferencesSchema,
  UpdateProfileSchema,
  UpdateTicketStatusSchema,
  UpdateUserRoleSchema,
  UpsertAiConfigSchema,
  VerifyOtpSchema,
} from '../backend/index.js';
import type {
  CreateTicketFormSchema,
  KnowledgeBaseEntryFormSchema,
  KnowledgeBaseSearchFormSchema,
  StartChatFormSchema,
  UpdateProfileFormSchema,
} from '../frontend/index.js';

export type Id = string;
export type UserRole = z.infer<typeof UserRoleSchema>;
export type TicketStatus = z.infer<typeof TicketStatusSchema>;
export type ChatStatus = z.infer<typeof ChatStatusSchema>;
export type ChatSender = z.infer<typeof ChatSenderSchema>;
export type KnowledgeBaseEntryType = z.infer<typeof KnowledgeBaseEntryTypeSchema>;
export type EmbeddingStatus = z.infer<typeof EmbeddingStatusSchema>;
export type AiProvider = z.infer<typeof AiProviderSchema>;
export type MediaProvider = z.infer<typeof MediaProviderSchema>;

export type User = z.infer<typeof BaseUserSchema>;
export type PublicUser = z.infer<typeof PublicUserSchema>;
export type Product = z.infer<typeof BaseProductSchema>;
export type Category = z.infer<typeof BaseCategorySchema>;
export type CategoryTreeNode = z.infer<typeof CategoryTreeNodeSchema>;
export type KnowledgeBaseEntry = z.infer<typeof BaseKnowledgeBaseEntrySchema>;
export type Ticket = z.infer<typeof BaseTicketSchema>;
export type TicketComment = z.infer<typeof BaseTicketCommentSchema>;
export type Chat = z.infer<typeof BaseChatSchema>;
export type ChatMessage = z.infer<typeof BaseChatMessageSchema>;
export type ChatMeta = z.infer<typeof BaseChatMetaSchema>;
export type AiConfig = z.infer<typeof BaseAiConfigSchema>;
export type MediaAsset = z.infer<typeof BaseMediaAssetSchema>;

export type SendOtpInput = z.infer<typeof SendOtpSchema>;
export type VerifyOtpInput = z.infer<typeof VerifyOtpSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
export type UpdateNotificationPreferencesInput = z.infer<typeof UpdateNotificationPreferencesSchema>;
export type UpdateUserRoleInput = z.infer<typeof UpdateUserRoleSchema>;
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;
export type CreateKnowledgeBaseEntryInput = z.infer<typeof CreateKnowledgeBaseEntrySchema>;
export type UpdateKnowledgeBaseEntryInput = z.infer<typeof UpdateKnowledgeBaseEntrySchema>;
export type CreateTicketInput = z.infer<typeof CreateTicketSchema>;
export type CreateTicketCommentInput = z.infer<typeof CreateTicketCommentSchema>;
export type UpdateTicketStatusInput = z.infer<typeof UpdateTicketStatusSchema>;
export type MarkTicketSeenInput = z.infer<typeof MarkTicketSeenSchema>;
export type StartChatInput = z.infer<typeof StartChatSchema>;
export type SendChatMessageInput = z.infer<typeof SendChatMessageSchema>;
export type UpsertAiConfigInput = z.infer<typeof UpsertAiConfigSchema>;

export type UpdateProfileForm = z.infer<typeof UpdateProfileFormSchema>;
export type CreateTicketForm = z.infer<typeof CreateTicketFormSchema>;
export type KnowledgeBaseEntryForm = z.infer<typeof KnowledgeBaseEntryFormSchema>;
export type KnowledgeBaseSearchForm = z.infer<typeof KnowledgeBaseSearchFormSchema>;
export type StartChatForm = z.infer<typeof StartChatFormSchema>;
