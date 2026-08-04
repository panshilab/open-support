import { z } from 'zod';
import { TicketStatusSchema } from './base.js';
import { CreateTicketCommentFormSchema, CreateTicketFormSchema } from './frontend.js';

export const CreateTicketSchema = CreateTicketFormSchema;
export const CreateTicketCommentSchema = CreateTicketCommentFormSchema;

export const UpdateTicketStatusSchema = z.object({
  status: TicketStatusSchema,
});

export const MarkTicketSeenSchema = z.object({
  side: z.enum(['customer', 'staff']),
});
