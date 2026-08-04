import type { z } from 'zod';
import { BaseTicketCommentSchema, BaseTicketSchema } from './base.js';

export const CreateTicketFormSchema = BaseTicketSchema.pick({
  productId: true,
  categoryId: true,
  title: true,
  descriptionHtml: true,
});
export type CreateTicketForm = z.infer<typeof CreateTicketFormSchema>;

export const CreateTicketCommentFormSchema = BaseTicketCommentSchema.pick({
  contentHtml: true,
});
export type CreateTicketCommentForm = z.infer<typeof CreateTicketCommentFormSchema>;
