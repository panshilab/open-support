import { createHash, randomBytes } from 'node:crypto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { AcceptInvitationInput } from '@open-support/schemas/auth';
import type {
  AuditAction,
  AuditLogQuery,
  InviteStaffInput,
  StaffHeartbeatInput,
  UpsertAdminSettingInput,
} from '@open-support/schemas/dashboard';
import { In, Repository } from 'typeorm';
import { MailerService } from '../auth/mailer.service';
import { PasswordService } from '../auth/password.service';
import type { SessionUser } from '../auth/session.service';
import { EnvService } from '../config/env.service';
import { KnowledgeBaseArticleEntity } from '../knowledge-base/entities/knowledge-base-article.entity';
import { MediaAssetEntity } from '../media/media-asset.entity';
import { TicketCommentEntity } from '../tickets/entities/ticket-comment.entity';
import { TicketEntity } from '../tickets/entities/ticket.entity';
import { UserEntity } from '../users/user.entity';
import { AdminSettingEntity } from './entities/admin-setting.entity';
import { AuditLogEntity } from './entities/audit-log.entity';
import { StaffInvitationEntity } from './entities/staff-invitation.entity';
import { StaffPresenceEntity } from './entities/staff-presence.entity';

@Injectable()
export class AdminOpsService {
  constructor(
    @InjectRepository(StaffPresenceEntity)
    private readonly staffPresence: Repository<StaffPresenceEntity>,
    @InjectRepository(StaffInvitationEntity)
    private readonly staffInvitations: Repository<StaffInvitationEntity>,
    @InjectRepository(AdminSettingEntity)
    private readonly adminSettings: Repository<AdminSettingEntity>,
    @InjectRepository(AuditLogEntity)
    private readonly auditLogs: Repository<AuditLogEntity>,
    @InjectRepository(UserEntity)
    private readonly users: Repository<UserEntity>,
    @InjectRepository(TicketEntity)
    private readonly tickets: Repository<TicketEntity>,
    @InjectRepository(TicketCommentEntity)
    private readonly ticketComments: Repository<TicketCommentEntity>,
    @InjectRepository(KnowledgeBaseArticleEntity)
    private readonly articles: Repository<KnowledgeBaseArticleEntity>,
    @InjectRepository(MediaAssetEntity)
    private readonly mediaAssets: Repository<MediaAssetEntity>,
    private readonly env: EnvService,
    private readonly mailer: MailerService,
    private readonly passwords: PasswordService,
  ) {}

  async stats() {
    const [openTickets, resolvedTickets, customerReplies, articles, mediaAssets, onlineStaff] =
      await Promise.all([
        this.tickets.count({ where: { status: In(['open', 'customer_reply', 'replied']) } }),
        this.tickets.count({ where: { status: 'resolved' } }),
        this.tickets.count({ where: { status: 'customer_reply' } }),
        this.articles.count(),
        this.mediaAssets.count(),
        this.staffPresence
          .createQueryBuilder('presence')
          .where("presence.status != 'offline'")
          .andWhere("presence.lastSeenAt > now() - interval '5 minutes'")
          .getCount(),
      ]);

    return {
      openTickets,
      resolvedTickets,
      customerReplies,
      articles,
      mediaAssets,
      onlineStaff,
    };
  }

  recentTickets() {
    return this.tickets.find({ order: { updatedAt: 'DESC' }, take: 8 });
  }

  async staffStats() {
    const staff = await this.users.find({
      where: [{ role: 'admin' }, { role: 'support_agent' }],
      order: { email: 'ASC' },
    });
    const staffIds = staff.map((user) => user.id);
    const replyRows = staffIds.length
      ? await this.ticketComments
          .createQueryBuilder('comment')
          .select('comment.authorUserId', 'userId')
          .addSelect('count(*)', 'replyCount')
          .where('comment.authorUserId IN (:...staffIds)', { staffIds })
          .andWhere('comment.isStaff = true')
          .groupBy('comment.authorUserId')
          .getRawMany<{ userId: string; replyCount: string }>()
      : [];
    const replies = new Map(replyRows.map((row) => [row.userId, Number(row.replyCount)]));

    return staff.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      replyCount: replies.get(user.id) ?? 0,
    }));
  }

  async heartbeat(user: SessionUser, input: StaffHeartbeatInput) {
    const presence = this.staffPresence.create({
      userId: user.id,
      status: input.status,
      lastSeenAt: new Date(),
    });

    return this.staffPresence.save(presence);
  }

  async listPresence() {
    const staff = await this.users.find({
      where: [{ role: 'admin' }, { role: 'support_agent' }],
      order: { email: 'ASC' },
    });
    const presences = await this.staffPresence.findBy({ userId: In(staff.map((user) => user.id)) });
    const byUserId = new Map(presences.map((presence) => [presence.userId, presence]));
    const offlineThreshold = Date.now() - 5 * 60 * 1000;

    return staff.map((user) => {
      const presence = byUserId.get(user.id);
      const lastSeenAt = presence?.lastSeenAt ?? user.updatedAt;
      const status =
        presence && presence.lastSeenAt.getTime() > offlineThreshold ? presence.status : 'offline';

      return {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status,
        lastSeenAt,
      };
    });
  }

  async inviteStaff(actor: SessionUser, input: InviteStaffInput) {
    const token = randomBytes(32).toString('base64url');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const invitation = await this.staffInvitations.save(
      this.staffInvitations.create({
        email: input.email.toLowerCase(),
        role: input.role,
        tokenHash: this.hashToken(token),
        invitedByUserId: actor.id,
        expiresAt,
      }),
    );
    const invitationUrl = `${this.env.appUrl}/accept-invitation?token=${token}`;

    await this.mailer.sendInvitation(invitation.email, invitationUrl, invitation.role, expiresAt);
    await this.recordAudit(actor, 'invitation.created', 'staff_invitation', invitation.id, {
      email: invitation.email,
      role: invitation.role,
    });

    return this.toPublicInvitation(invitation);
  }

  async listInvitations() {
    const invitations = await this.staffInvitations.find({
      order: { createdAt: 'DESC' },
      take: 50,
    });

    return invitations.map((invitation) => this.toPublicInvitation(invitation));
  }

  async acceptInvitation(input: AcceptInvitationInput) {
    const invitation = await this.staffInvitations.findOne({
      where: { tokenHash: this.hashToken(input.token) },
    });

    if (!invitation || invitation.acceptedAt) {
      throw new BadRequestException('Invitation is invalid');
    }

    if (invitation.expiresAt.getTime() < Date.now()) {
      throw new BadRequestException('Invitation has expired');
    }

    const existingUser = await this.users.findOne({ where: { email: invitation.email } });
    const user = await this.users.save(
      this.users.create({
        ...(existingUser ?? {}),
        email: invitation.email,
        name: input.name,
        role: invitation.role,
        passwordHash: this.passwords.hash(input.password),
        mustChangePassword: false,
      }),
    );

    invitation.acceptedByUserId = user.id;
    invitation.acceptedAt = new Date();
    await this.staffInvitations.save(invitation);
    await this.auditLogs.save(
      this.auditLogs.create({
        actorUserId: user.id,
        actorEmail: user.email,
        action: 'invitation.accepted',
        targetType: 'staff_invitation',
        targetId: invitation.id,
        metadata: { role: invitation.role },
      }),
    );

    return user;
  }

  settings() {
    return this.adminSettings.find({ order: { key: 'ASC' } });
  }

  async upsertSetting(user: SessionUser, input: UpsertAdminSettingInput) {
    const setting = await this.adminSettings.save(
      this.adminSettings.create({
        key: input.key,
        value: input.value,
        updatedByUserId: user.id,
      }),
    );
    await this.recordAudit(user, 'settings.updated', 'admin_setting', input.key, {
      value: input.value,
    });
    return setting;
  }

  async listAuditLogs(query: AuditLogQuery) {
    const builder = this.auditLogs
      .createQueryBuilder('audit')
      .orderBy('audit.createdAt', 'DESC')
      .skip((query.page - 1) * query.limit)
      .take(query.limit);

    if (query.action) {
      builder.andWhere('audit.action = :action', { action: query.action });
    }

    return builder.getMany();
  }

  recordAudit(
    actor: SessionUser,
    action: AuditAction,
    targetType: string,
    targetId: string | null,
    metadata?: Record<string, unknown>,
  ) {
    return this.auditLogs.save(
      this.auditLogs.create({
        actorUserId: actor.id,
        actorEmail: actor.email,
        action,
        targetType,
        targetId,
        metadata: metadata ?? null,
      }),
    );
  }

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  private toPublicInvitation(invitation: StaffInvitationEntity) {
    return {
      id: invitation.id,
      email: invitation.email,
      role: invitation.role,
      invitedByUserId: invitation.invitedByUserId,
      acceptedByUserId: invitation.acceptedByUserId,
      expiresAt: invitation.expiresAt,
      acceptedAt: invitation.acceptedAt,
      createdAt: invitation.createdAt,
    };
  }
}
