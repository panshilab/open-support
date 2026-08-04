import { z } from 'zod';
import { EmailSchema, IdSchema, IsoDateStringSchema } from '../common.js';

export const UserRoleSchema = z.enum(['admin', 'support_agent', 'user']);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const BaseUserSchema = z.object({
  id: IdSchema,
  email: EmailSchema,
  name: z.string().trim().min(1).max(120).nullable(),
  role: UserRoleSchema,
  mustChangePassword: z.boolean().default(false),
  receiveEmailNotifications: z.boolean().default(true),
  receiveNewTicketEmails: z.boolean().default(true),
  createdAt: IsoDateStringSchema,
  updatedAt: IsoDateStringSchema,
});
export type User = z.infer<typeof BaseUserSchema>;

export const PublicUserSchema = BaseUserSchema.pick({
  id: true,
  email: true,
  name: true,
  role: true,
});
export type PublicUser = z.infer<typeof PublicUserSchema>;
