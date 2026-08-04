import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Env } from './env.schema';

@Injectable()
export class EnvService {
  constructor(private readonly config: ConfigService<Env, true>) {}

  get nodeEnv() {
    return this.config.get('NODE_ENV', { infer: true });
  }

  get host() {
    return this.config.get('API_HOST', { infer: true });
  }

  get port() {
    return this.config.get('API_PORT', { infer: true });
  }

  get cacheDefaultTtlSeconds() {
    return this.config.get('CACHE_DEFAULT_TTL_SECONDS', { infer: true });
  }

  get redisUrl() {
    return this.config.get('REDIS_URL', { infer: true });
  }

  get redisPassword() {
    return this.config.get('REDIS_PASSWORD', { infer: true });
  }

  get database() {
    return {
      host: this.config.get('DATABASE_HOST', { infer: true }),
      port: this.config.get('DATABASE_PORT', { infer: true }),
      name: this.config.get('DATABASE_NAME', { infer: true }),
      user: this.config.get('DATABASE_USER', { infer: true }),
      password: this.config.get('DATABASE_PASSWORD', { infer: true }),
      ssl: this.config.get('DATABASE_SSL', { infer: true }),
    };
  }
}
