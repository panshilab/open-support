import { z } from 'zod';
import { CreateTicketCommentFormSchema, CreateTicketFormSchema } from '../frontend/ticket.schema.js';
import { TicketStatusSchema } from '../base/ticket.schema.js';

export const CreateTicketSchema = CreateTicketFormSchema;
export const CreateTicketCommentSchema = CreateTicketCommentFormSchema;

export const UpdateTicketStatusSchema = z.object({
  status: TicketStatusSchema,
});

export const MarkTicketSeenSchema = z.object({
  side: z.enum(['customer', 'staff']),
});
