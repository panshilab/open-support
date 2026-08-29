import { Module } from '@nestjs/common';
import { AdminOpsModule } from './admin-ops/admin-ops.module';
import { AppCacheModule } from './cache/cache.module';
import { AppConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { HealthController } from './health/health.controller';
import { KnowledgeBaseModule } from './knowledge-base/knowledge-base.module';
import { MediaModule } from './media/media.module';
import { TicketsModule } from './tickets/tickets.module';
import { UsersModule } from './users/users.module';
import { AssistantModule } from './assistant/assistant.module';
import { RealtimeModule } from './realtime/realtime.module';

@Module({
  imports: [
    AppConfigModule,
    AppCacheModule,
    DatabaseModule,
    AdminOpsModule,
    UsersModule,
    AuthModule,
    KnowledgeBaseModule,
    MediaModule,
    TicketsModule,
    AssistantModule,
    RealtimeModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
