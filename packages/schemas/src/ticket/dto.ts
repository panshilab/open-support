import { createZodDto } from 'nestjs-zod';
import {
  CreateTicketCommentSchema,
  CreateTicketSchema,
  MarkTicketSeenSchema,
  UpdateTicketStatusSchema,
} from './backend.js';

export class CreateTicketDto extends createZodDto(CreateTicketSchema) {}
export class CreateTicketCommentDto extends createZodDto(CreateTicketCommentSchema) {}
export class UpdateTicketStatusDto extends createZodDto(UpdateTicketStatusSchema) {}
export class MarkTicketSeenDto extends createZodDto(MarkTicketSeenSchema) {}
