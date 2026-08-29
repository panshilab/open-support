import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { ChatModule } from './chat/chat.module';
import { ObservabilityModule } from './observability/observability.module';
import { requestContextMiddleware } from './observability/request-context.middleware';
import { RateLimitMiddleware } from './observability/rate-limit.middleware';
import { RequestLoggingMiddleware } from './observability/request-logging.middleware';

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
    ChatModule,
    ObservabilityModule,
  ],
  controllers: [HealthController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(requestContextMiddleware, RequestLoggingMiddleware, RateLimitMiddleware)
      .forRoutes('*');
  }
}
