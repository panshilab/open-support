import { z } from 'zod';
import { EmailSchema, IdSchema, IsoDateStringSchema } from '../common.js';

export const UserRoleSchema = z.enum(['admin', 'support_agent', 'user']);

export const BaseUserSchema = z.object({
  id: IdSchema,
  email: EmailSchema,
  name: z.string().trim().min(1).max(120).nullable(),
  role: UserRoleSchema,
  receiveEmailNotifications: z.boolean().default(true),
  receiveNewTicketEmails: z.boolean().default(true),
  createdAt: IsoDateStringSchema,
  updatedAt: IsoDateStringSchema,
});

export const PublicUserSchema = BaseUserSchema.pick({
  id: true,
  email: true,
  name: true,
  role: true,
});
