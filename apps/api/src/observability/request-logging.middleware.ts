import { Injectable, Logger, type NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction) {
    const startedAt = Date.now();
    response.on('finish', () => {
      const requestId = (request as Request & { requestId?: string }).requestId ?? 'unknown';
      this.logger.log(
        `${request.method} ${request.originalUrl} ${response.statusCode} ${Date.now() - startedAt}ms requestId=${requestId}`,
      );
    });
    next();
  }
}
