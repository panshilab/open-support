import { Module } from '@nestjs/common';
import { AppCacheModule } from './cache/cache.module';
import { AppConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { HealthController } from './health/health.controller';
import { KnowledgeBaseModule } from './knowledge-base/knowledge-base.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AppConfigModule,
    AppCacheModule,
    DatabaseModule,
    UsersModule,
    AuthModule,
    KnowledgeBaseModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
