import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import {
  UpdateNotificationPreferencesFormSchema,
  UpdateProfileFormSchema,
  UpdateUserRoleFormSchema,
} from './frontend.js';

export const UpdateProfileSchema = UpdateProfileFormSchema;
export const UpdateNotificationPreferencesSchema = UpdateNotificationPreferencesFormSchema;
export const UpdateUserRoleSchema = UpdateUserRoleFormSchema;
export const UserIdParamSchema = z.object({
  id: z.string().uuid(),
});
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
export type UpdateNotificationPreferencesInput = z.infer<
  typeof UpdateNotificationPreferencesSchema
>;
export type UpdateUserRoleInput = z.infer<typeof UpdateUserRoleSchema>;
export type UserIdParam = z.infer<typeof UserIdParamSchema>;

export class UpdateProfileDto extends createZodDto(UpdateProfileSchema) {}
export class UpdateNotificationPreferencesDto extends createZodDto(
  UpdateNotificationPreferencesSchema,
) {}
export class UpdateUserRoleDto extends createZodDto(UpdateUserRoleSchema) {}
export class UserIdParamDto extends createZodDto(UserIdParamSchema) {}
