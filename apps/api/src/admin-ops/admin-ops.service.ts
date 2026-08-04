import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type {
  AuditAction,
  AuditLogQuery,
  StaffHeartbeatInput,
  UpsertAdminSettingInput,
} from '@open-support/schemas/dashboard';
import { In, Repository } from 'typeorm';
import type { SessionUser } from '../auth/session.service';
import { KnowledgeBaseArticleEntity } from '../knowledge-base/entities/knowledge-base-article.entity';
import { MediaAssetEntity } from '../media/media-asset.entity';
import { TicketCommentEntity } from '../tickets/entities/ticket-comment.entity';
import { TicketEntity } from '../tickets/entities/ticket.entity';
import { UserEntity } from '../users/user.entity';
import { AdminSettingEntity } from './entities/admin-setting.entity';
import { AuditLogEntity } from './entities/audit-log.entity';
import { StaffPresenceEntity } from './entities/staff-presence.entity';

@Injectable()
export class AdminOpsService {
  constructor(
    @InjectRepository(StaffPresenceEntity)
    private readonly staffPresence: Repository<StaffPresenceEntity>,
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
}
