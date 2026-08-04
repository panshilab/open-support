import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type {
  UpdateNotificationPreferencesInput,
  UpdateProfileInput,
  UpdateUserRoleInput,
} from '@open-support/schemas/user';
import { Repository } from 'typeorm';
import { AdminOpsService } from '../admin-ops/admin-ops.service';
import type { SessionUser } from '../auth/session.service';
import { EnvService } from '../config/env.service';
import { UserEntity } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly users: Repository<UserEntity>,
    private readonly env: EnvService,
    private readonly adminOps: AdminOpsService,
  ) {}

  async findByEmail(email: string) {
    return this.users.findOne({ where: { email: email.toLowerCase() } });
  }

  async findById(id: string) {
    return this.users.findOne({ where: { id } });
  }

  async getById(id: string) {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findOrCreateLocalUser(email: string, name?: string | null) {
    const normalizedEmail = email.toLowerCase();
    const adminEmails = this.env.adminEmails;
    const shouldBeAdmin = adminEmails.includes(normalizedEmail);
    const existing = await this.findByEmail(normalizedEmail);

    if (existing) {
      if (shouldBeAdmin && existing.role !== 'admin') {
        existing.role = 'admin';
      }

      if (name && !existing.name) {
        existing.name = name;
      }

      return this.users.save(existing);
    }

    return this.users.save(
      this.users.create({
        email: normalizedEmail,
        name: name ?? null,
        role: shouldBeAdmin ? 'admin' : 'user',
      }),
    );
  }

  async setPassword(userId: string, passwordHash: string, mustChangePassword: boolean) {
    const user = await this.getById(userId);
    user.passwordHash = passwordHash;
    user.mustChangePassword = mustChangePassword;
    return this.users.save(user);
  }

  async createInvitedStaffUser(
    email: string,
    name: string,
    role: 'support_agent' | 'admin',
    passwordHash: string,
  ) {
    const normalizedEmail = email.toLowerCase();
    const existing = await this.findByEmail(normalizedEmail);

    if (existing) {
      existing.name = name;
      existing.role = role;
      existing.passwordHash = passwordHash;
      existing.mustChangePassword = false;
      return this.users.save(existing);
    }

    return this.users.save(
      this.users.create({
        email: normalizedEmail,
        name,
        role,
        passwordHash,
        mustChangePassword: false,
      }),
    );
  }

  async updateProfile(userId: string, input: UpdateProfileInput) {
    const user = await this.getById(userId);
    user.name = input.name;
    return this.users.save(user);
  }

  async updateNotificationPreferences(userId: string, input: UpdateNotificationPreferencesInput) {
    const user = await this.getById(userId);
    user.receiveEmailNotifications = input.receiveEmailNotifications;
    user.receiveNewTicketEmails = input.receiveNewTicketEmails;
    return this.users.save(user);
  }

  async updateRole(actor: SessionUser, userId: string, input: UpdateUserRoleInput) {
    const user = await this.getById(userId);
    const previousRole = user.role;
    user.role = input.role;
    const saved = await this.users.save(user);
    await this.adminOps.recordAudit(actor, 'user.role_updated', 'user', user.id, {
      previousRole,
      role: input.role,
    });
    return saved;
  }
}
