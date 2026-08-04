import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { PaginationQuerySchema } from '../common.js';
import { AdminSettingFormSchema } from './frontend.js';

export const StaffHeartbeatSchema = z.object({
  status: z.enum(['online', 'away']).default('online'),
});
export const AuditLogQuerySchema = PaginationQuerySchema.extend({
  action: z.string().trim().max(80).optional(),
});
export const UpsertAdminSettingSchema = AdminSettingFormSchema;
export const InviteStaffSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  role: z.enum(['support_agent', 'admin']).default('support_agent'),
});

export type StaffHeartbeatInput = z.infer<typeof StaffHeartbeatSchema>;
export type AuditLogQuery = z.infer<typeof AuditLogQuerySchema>;
export type UpsertAdminSettingInput = z.infer<typeof UpsertAdminSettingSchema>;
export type InviteStaffInput = z.infer<typeof InviteStaffSchema>;

export class StaffHeartbeatDto extends createZodDto(StaffHeartbeatSchema) {}
export class AuditLogQueryDto extends createZodDto(AuditLogQuerySchema) {}
export class UpsertAdminSettingDto extends createZodDto(UpsertAdminSettingSchema) {}
export class InviteStaffDto extends createZodDto(InviteStaffSchema) {}
