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

  get appName() {
    return this.config.get('APP_NAME', { infer: true });
  }

  get appUrl() {
    return this.config.get('APP_URL', { infer: true });
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

  get session() {
    return {
      secret: this.config.get('SESSION_SECRET', { infer: true }),
      cookieName: this.config.get('SESSION_COOKIE_NAME', { infer: true }),
      ttlSeconds: this.config.get('SESSION_TTL_SECONDS', { infer: true }),
    };
  }

  get adminEmails() {
    return this.config
      .get('ADMIN_EMAILS', { infer: true })
      .split(',')
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);
  }

  get otp() {
    return {
      expiresInSeconds: this.config.get('OTP_EXPIRES_IN_SECONDS', { infer: true }),
      length: this.config.get('OTP_LENGTH', { infer: true }),
    };
  }

  get smtp() {
    return {
      host: this.config.get('SMTP_HOST', { infer: true }),
      port: this.config.get('SMTP_PORT', { infer: true }),
      secure: this.config.get('SMTP_SECURE', { infer: true }),
      user: this.config.get('SMTP_USER', { infer: true }),
      pass: this.config.get('SMTP_PASS', { infer: true }),
      fromEmail: this.config.get('SMTP_FROM_EMAIL', { infer: true }),
      fromName: this.config.get('SMTP_FROM_NAME', { infer: true }),
    };
  }

  get googleClientId() {
    return this.config.get('GOOGLE_CLIENT_ID', { infer: true });
  }

  get openAi() {
    return {
      apiKey: this.config.get('OPENAI_API_KEY', { infer: true }),
      embeddingModel: this.config.get('OPENAI_EMBEDDING_MODEL', { infer: true }),
      embeddingDimensions: this.config.get('OPENAI_EMBEDDING_DIMENSIONS', { infer: true }),
    };
  }
}
