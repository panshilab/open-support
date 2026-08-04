import { createZodDto } from 'nestjs-zod';
import {
  UpdateNotificationPreferencesSchema,
  UpdateProfileSchema,
  UpdateUserRoleSchema,
} from '../backend/user.schema.js';

export class UpdateProfileDto extends createZodDto(UpdateProfileSchema) {}
export class UpdateNotificationPreferencesDto extends createZodDto(UpdateNotificationPreferencesSchema) {}
export class UpdateUserRoleDto extends createZodDto(UpdateUserRoleSchema) {}
