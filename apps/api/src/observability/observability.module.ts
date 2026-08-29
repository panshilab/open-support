import { Global, Module } from '@nestjs/common';
import { AppCacheModule } from '../cache/cache.module';
import { HttpExceptionFilter } from './http-exception.filter';
import { RateLimitMiddleware } from './rate-limit.middleware';
import { RequestLoggingMiddleware } from './request-logging.middleware';

@Global()
@Module({
  imports: [AppCacheModule],
  providers: [HttpExceptionFilter, RateLimitMiddleware, RequestLoggingMiddleware],
  exports: [HttpExceptionFilter, RateLimitMiddleware, RequestLoggingMiddleware],
})
export class ObservabilityModule {}
