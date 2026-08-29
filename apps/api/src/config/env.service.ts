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

  get corsOrigins() {
    const origins = this.config.get('CORS_ORIGINS', { infer: true });

    if (!origins) {
      return [this.appUrl];
    }

    return origins
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean);
  }

  get cacheDefaultTtlSeconds() {
    return this.config.get('CACHE_DEFAULT_TTL_SECONDS', { infer: true });
  }

  get redisUrl() {
    const redisUrl = this.config.get('REDIS_URL', { infer: true });

    if (redisUrl) {
      return redisUrl;
    }

    const host = this.config.get('REDIS_HOST', { infer: true });
    const port = this.config.get('REDIS_PORT', { infer: true });
    const db = this.config.get('REDIS_DB', { infer: true });

    if (!host || !port) {
      return undefined;
    }

    return `redis://${host}:${port}/${db}`;
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
      assistantModel: this.config.get('OPENAI_ASSISTANT_MODEL', { infer: true }),
      embeddingModel: this.config.get('OPENAI_EMBEDDING_MODEL', { infer: true }),
      embeddingDimensions: this.config.get('OPENAI_EMBEDDING_DIMENSIONS', { infer: true }),
    };
  }

  get media() {
    return {
      provider: this.config.get('MEDIA_PROVIDER', { infer: true }),
      localDir: this.config.get('MEDIA_LOCAL_DIR', { infer: true }),
      publicUrl: this.config.get('MEDIA_PUBLIC_URL', { infer: true }),
      maxFileSizeBytes: this.config.get('MEDIA_MAX_FILE_SIZE_BYTES', { infer: true }),
      allowedMimeTypes: this.config
        .get('MEDIA_ALLOWED_MIME_TYPES', { infer: true })
        .split(',')
        .map((mimeType) => mimeType.trim())
        .filter(Boolean),
      s3: {
        endpoint: this.config.get('MEDIA_S3_ENDPOINT', { infer: true }),
        region: this.config.get('MEDIA_S3_REGION', { infer: true }),
        bucket: this.config.get('MEDIA_S3_BUCKET', { infer: true }),
        accessKeyId: this.config.get('MEDIA_S3_ACCESS_KEY_ID', { infer: true }),
        secretAccessKey: this.config.get('MEDIA_S3_SECRET_ACCESS_KEY', { infer: true }),
        prefix: this.config.get('MEDIA_S3_PREFIX', { infer: true }),
      },
    };
  }
}
