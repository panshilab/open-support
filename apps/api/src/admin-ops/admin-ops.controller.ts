import { Body, Controller, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import {
  AuditLogQueryDto,
  InviteStaffDto,
  StaffHeartbeatDto,
  type AuditLogQuery,
  type InviteStaffInput,
  type StaffHeartbeatInput,
  type UpsertAdminSettingInput,
  UpsertAdminSettingDto,
} from '@open-support/schemas/dashboard';
import { CurrentUser } from '../auth/current-user.decorator';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { SessionGuard } from '../auth/session.guard';
import type { SessionUser } from '../auth/session.service';
import { AdminOpsService } from './admin-ops.service';

@Controller('admin')
@UseGuards(SessionGuard, RolesGuard)
@Roles('admin', 'support_agent')
export class AdminOpsController {
  constructor(private readonly adminOps: AdminOpsService) {}

  @Get('dashboard/stats')
  stats() {
    return this.adminOps.stats();
  }

  @Get('dashboard/recent-tickets')
  recentTickets() {
    return this.adminOps.recentTickets();
  }

  @Get('staff/stats')
  staffStats() {
    return this.adminOps.staffStats();
  }

  @Get('staff/presence')
  presence() {
    return this.adminOps.listPresence();
  }

  @Get('staff/invitations')
  @Roles('admin')
  invitations() {
    return this.adminOps.listInvitations();
  }

  @Post('staff/invitations')
  @Roles('admin')
  inviteStaff(@CurrentUser() user: SessionUser, @Body() body: InviteStaffDto) {
    return this.adminOps.inviteStaff(user, body as InviteStaffInput);
  }

  @Post('staff/heartbeat')
  heartbeat(@CurrentUser() user: SessionUser, @Body() body: StaffHeartbeatDto) {
    return this.adminOps.heartbeat(user, body as StaffHeartbeatInput);
  }

  @Get('settings')
  settings() {
    return this.adminOps.settings();
  }

  @Patch('settings')
  @Roles('admin')
  upsertSetting(@CurrentUser() user: SessionUser, @Body() body: UpsertAdminSettingDto) {
    return this.adminOps.upsertSetting(user, body as UpsertAdminSettingInput);
  }

  @Get('audit-logs')
  @Roles('admin')
  auditLogs(@Query() query: AuditLogQueryDto) {
    return this.adminOps.listAuditLogs(query as AuditLogQuery);
  }
}
