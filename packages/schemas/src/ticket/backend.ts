import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { TicketStatusSchema } from './base.js';
import { CreateTicketCommentFormSchema, CreateTicketFormSchema } from './frontend.js';
import { IdSchema } from '../common.js';

export const CreateTicketSchema = CreateTicketFormSchema;
export const CreateTicketCommentSchema = CreateTicketCommentFormSchema;
export const TicketIdParamSchema = z.object({
  ticketId: IdSchema,
});
export type CreateTicketInput = z.infer<typeof CreateTicketSchema>;
export type CreateTicketCommentInput = z.infer<typeof CreateTicketCommentSchema>;
export type TicketIdParam = z.infer<typeof TicketIdParamSchema>;

export const UpdateTicketStatusSchema = z.object({
  status: TicketStatusSchema,
});
export type UpdateTicketStatusInput = z.infer<typeof UpdateTicketStatusSchema>;

export const MarkTicketSeenSchema = z.object({
  side: z.enum(['customer', 'staff']),
});
export type MarkTicketSeenInput = z.infer<typeof MarkTicketSeenSchema>;

export class CreateTicketDto extends createZodDto(CreateTicketSchema) {}
export class CreateTicketCommentDto extends createZodDto(CreateTicketCommentSchema) {}
export class UpdateTicketStatusDto extends createZodDto(UpdateTicketStatusSchema) {}
export class MarkTicketSeenDto extends createZodDto(MarkTicketSeenSchema) {}
export class TicketIdParamDto extends createZodDto(TicketIdParamSchema) {}
