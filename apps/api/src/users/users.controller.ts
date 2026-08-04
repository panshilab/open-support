import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import {
  UpdateNotificationPreferencesDto,
  type UpdateNotificationPreferencesInput,
  UpdateProfileDto,
  type UpdateProfileInput,
  UpdateUserRoleDto,
  type UpdateUserRoleInput,
  UserIdParamDto,
} from '@open-support/schemas/user';
import { CurrentUser } from '../auth/current-user.decorator';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { SessionGuard } from '../auth/session.guard';
import type { SessionUser } from '../auth/session.service';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(SessionGuard)
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('me')
  async me(@CurrentUser() user: SessionUser) {
    return this.users.getById(user.id);
  }

  @Patch('me/profile')
  async updateProfile(@CurrentUser() user: SessionUser, @Body() body: UpdateProfileDto) {
    return this.users.updateProfile(user.id, body as UpdateProfileInput);
  }

  @Patch('me/notifications')
  async updateNotifications(
    @CurrentUser() user: SessionUser,
    @Body() body: UpdateNotificationPreferencesDto,
  ) {
    return this.users.updateNotificationPreferences(
      user.id,
      body as UpdateNotificationPreferencesInput,
    );
  }

  @Patch(':id/role')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async updateRole(@Param() params: UserIdParamDto, @Body() body: UpdateUserRoleDto) {
    return this.users.updateRole(params.id, body as UpdateUserRoleInput);
  }
}
