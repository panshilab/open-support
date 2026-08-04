import { z } from 'zod';
import { BaseUserSchema, UserRoleSchema } from './base.js';

export const UpdateProfileFormSchema = BaseUserSchema.pick({
  name: true,
}).extend({
  name: z.string().trim().min(1).max(120),
});

export const UpdateNotificationPreferencesFormSchema = BaseUserSchema.pick({
  receiveEmailNotifications: true,
  receiveNewTicketEmails: true,
});

export const UpdateUserRoleFormSchema = z.object({
  role: UserRoleSchema,
});
