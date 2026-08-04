import { Module } from '@nestjs/common';
import { AppCacheModule } from './cache/cache.module';
import { AppConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [AppConfigModule, AppCacheModule, DatabaseModule],
  controllers: [HealthController],
})
export class AppModule {}
