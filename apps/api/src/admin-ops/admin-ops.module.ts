import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KnowledgeBaseArticleEntity } from '../knowledge-base/entities/knowledge-base-article.entity';
import { MediaAssetEntity } from '../media/media-asset.entity';
import { TicketCommentEntity } from '../tickets/entities/ticket-comment.entity';
import { TicketEntity } from '../tickets/entities/ticket.entity';
import { UserEntity } from '../users/user.entity';
import { AdminOpsController } from './admin-ops.controller';
import { AdminOpsService } from './admin-ops.service';
import { AdminSettingEntity } from './entities/admin-setting.entity';
import { AuditLogEntity } from './entities/audit-log.entity';
import { StaffPresenceEntity } from './entities/staff-presence.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StaffPresenceEntity,
      AdminSettingEntity,
      AuditLogEntity,
      UserEntity,
      TicketEntity,
      TicketCommentEntity,
      KnowledgeBaseArticleEntity,
      MediaAssetEntity,
    ]),
  ],
  controllers: [AdminOpsController],
  providers: [AdminOpsService],
  exports: [AdminOpsService],
})
export class AdminOpsModule {}
