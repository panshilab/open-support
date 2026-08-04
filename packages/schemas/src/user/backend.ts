import { createZodDto } from 'nestjs-zod';
import type { z } from 'zod';
import {
  UpdateNotificationPreferencesFormSchema,
  UpdateProfileFormSchema,
  UpdateUserRoleFormSchema,
} from './frontend.js';

export const UpdateProfileSchema = UpdateProfileFormSchema;
export const UpdateNotificationPreferencesSchema = UpdateNotificationPreferencesFormSchema;
export const UpdateUserRoleSchema = UpdateUserRoleFormSchema;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
export type UpdateNotificationPreferencesInput = z.infer<
  typeof UpdateNotificationPreferencesSchema
>;
export type UpdateUserRoleInput = z.infer<typeof UpdateUserRoleSchema>;

export class UpdateProfileDto extends createZodDto(UpdateProfileSchema) {}
export class UpdateNotificationPreferencesDto extends createZodDto(
  UpdateNotificationPreferencesSchema,
) {}
export class UpdateUserRoleDto extends createZodDto(UpdateUserRoleSchema) {}
