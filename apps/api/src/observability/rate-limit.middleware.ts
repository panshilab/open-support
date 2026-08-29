import { HttpStatus, Injectable, type NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { CacheService } from '../cache/cache.service';

const RULES = [
  { prefix: '/auth/send-otp', limit: 5, windowSeconds: 600 },
  { prefix: '/auth/password', limit: 10, windowSeconds: 60 },
  { prefix: '/auth/google', limit: 10, windowSeconds: 60 },
  { prefix: '/chats', limit: 60, windowSeconds: 60 },
];

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  constructor(private readonly cache: CacheService) {}

  async use(request: Request, response: Response, next: NextFunction) {
    const rule = RULES.find(
      ({ prefix }) => request.path === prefix || request.path.startsWith(`${prefix}/`),
    );
    if (!rule) return next();

    const identity = request.ip ?? request.socket.remoteAddress ?? 'unknown';
    const count = await this.cache.increment(`rate-limit:${rule.prefix}:${identity}`, {
      ttlSeconds: rule.windowSeconds,
    });
    response.setHeader('X-RateLimit-Limit', rule.limit);
    response.setHeader('X-RateLimit-Remaining', Math.max(0, rule.limit - count));
    if (count > rule.limit) {
      response.setHeader('Retry-After', rule.windowSeconds);
      response.status(HttpStatus.TOO_MANY_REQUESTS).json({
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message: 'Too many requests. Please try again later.',
      });
      return;
    }
    next();
  }
}
