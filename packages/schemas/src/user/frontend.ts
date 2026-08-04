import { z } from 'zod';
import { BaseUserSchema, UserRoleSchema } from './base.js';

export const UpdateProfileFormSchema = BaseUserSchema.pick({
  name: true,
}).extend({
  name: z.string().trim().min(1).max(120),
});
export type UpdateProfileForm = z.infer<typeof UpdateProfileFormSchema>;

export const UpdateNotificationPreferencesFormSchema = BaseUserSchema.pick({
  receiveEmailNotifications: true,
  receiveNewTicketEmails: true,
});
export type UpdateNotificationPreferencesForm = z.infer<
  typeof UpdateNotificationPreferencesFormSchema
>;

export const UpdateUserRoleFormSchema = z.object({
  role: UserRoleSchema,
});
export type UpdateUserRoleForm = z.infer<typeof UpdateUserRoleFormSchema>;
