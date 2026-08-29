import { Global, Module } from '@nestjs/common';
import { AppCacheModule } from '../cache/cache.module';
import { HttpExceptionFilter } from './http-exception.filter';
import { RateLimitMiddleware } from './rate-limit.middleware';
import { RequestLoggingMiddleware } from './request-logging.middleware';
import { ProductionLogger } from './production.logger';
import { ErrorMonitoringService } from './error-monitoring.service';

@Global()
@Module({
  imports: [AppCacheModule],
  providers: [
    HttpExceptionFilter,
    RateLimitMiddleware,
    RequestLoggingMiddleware,
    ProductionLogger,
    ErrorMonitoringService,
  ],
  exports: [
    HttpExceptionFilter,
    RateLimitMiddleware,
    RequestLoggingMiddleware,
    ProductionLogger,
    ErrorMonitoringService,
  ],
})
export class ObservabilityModule {}
