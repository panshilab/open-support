import { z } from 'zod';
import { EmailSchema, IdSchema, IsoDateStringSchema } from '../common.js';
import { UserRoleSchema } from '../user/base.js';

export const StaffPresenceStatusSchema = z.enum(['online', 'away', 'offline']);
export type StaffPresenceStatus = z.infer<typeof StaffPresenceStatusSchema>;

export const BaseStaffPresenceSchema = z.object({
  userId: IdSchema,
  email: z.string().email(),
  name: z.string().trim().max(120).nullable(),
  role: UserRoleSchema,
  status: StaffPresenceStatusSchema,
  lastSeenAt: IsoDateStringSchema,
});
export type StaffPresence = z.infer<typeof BaseStaffPresenceSchema>;

export const AuditActionSchema = z.enum([
  'invitation.accepted',
  'invitation.created',
  'media.deleted',
  'settings.updated',
  'user.role_updated',
]);
export type AuditAction = z.infer<typeof AuditActionSchema>;

export const BaseAuditLogSchema = z.object({
  id: IdSchema,
  actorUserId: IdSchema,
  actorEmail: z.string().email(),
  action: AuditActionSchema,
  targetType: z.string().trim().min(1).max(80),
  targetId: z.string().trim().max(160).nullable(),
  metadata: z.record(z.string(), z.unknown()).nullable(),
  createdAt: IsoDateStringSchema,
});
export type AuditLog = z.infer<typeof BaseAuditLogSchema>;

export const BaseAdminSettingSchema = z.object({
  key: z.string().trim().min(1).max(120),
  value: z.record(z.string(), z.unknown()),
  updatedByUserId: IdSchema,
  updatedAt: IsoDateStringSchema,
});
export type AdminSetting = z.infer<typeof BaseAdminSettingSchema>;

export const BaseStaffInvitationSchema = z.object({
  id: IdSchema,
  email: EmailSchema,
  role: UserRoleSchema.extract(['support_agent', 'admin']),
  invitedByUserId: IdSchema,
  acceptedByUserId: IdSchema.nullable(),
  expiresAt: IsoDateStringSchema,
  acceptedAt: IsoDateStringSchema.nullable(),
  createdAt: IsoDateStringSchema,
});
export type StaffInvitation = z.infer<typeof BaseStaffInvitationSchema>;

export const DashboardStatsSchema = z.object({
  openTickets: z.number().int().min(0),
  resolvedTickets: z.number().int().min(0),
  customerReplies: z.number().int().min(0),
  articles: z.number().int().min(0),
  mediaAssets: z.number().int().min(0),
  onlineStaff: z.number().int().min(0),
});
export type DashboardStats = z.infer<typeof DashboardStatsSchema>;
