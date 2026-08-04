import { z } from 'zod';
import { EmailSchema, HtmlSchema, IdSchema, IsoDateStringSchema } from '../common.js';

export const TicketStatusSchema = z.enum(['open', 'customer_reply', 'replied', 'resolved']);
export type TicketStatus = z.infer<typeof TicketStatusSchema>;

export const BaseTicketSchema = z.object({
  id: IdSchema,
  userId: IdSchema,
  productId: IdSchema.nullable(),
  categoryId: IdSchema,
  categoryPath: z.string().trim().min(1).max(500),
  title: z.string().trim().min(10).max(180),
  descriptionHtml: HtmlSchema,
  status: TicketStatusSchema.default('open'),
  createdAt: IsoDateStringSchema,
  updatedAt: IsoDateStringSchema,
});
export type Ticket = z.infer<typeof BaseTicketSchema>;

export const BaseTicketCommentSchema = z.object({
  id: IdSchema,
  ticketId: IdSchema,
  authorUserId: IdSchema,
  authorEmail: EmailSchema,
  contentHtml: HtmlSchema,
  isStaff: z.boolean().default(false),
  isSystem: z.boolean().default(false),
  createdAt: IsoDateStringSchema,
});
export type TicketComment = z.infer<typeof BaseTicketCommentSchema>;

export const BaseTicketSeenStateSchema = z.object({
  ticketId: IdSchema,
  customerSeenAt: IsoDateStringSchema.nullable(),
  staffSeenAt: IsoDateStringSchema.nullable(),
});
export type TicketSeenState = z.infer<typeof BaseTicketSeenStateSchema>;
