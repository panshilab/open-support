import { BaseTicketCommentSchema, BaseTicketSchema } from './base.js';

export const CreateTicketFormSchema = BaseTicketSchema.pick({
  productId: true,
  categoryId: true,
  title: true,
  descriptionHtml: true,
});

export const CreateTicketCommentFormSchema = BaseTicketCommentSchema.pick({
  contentHtml: true,
});
