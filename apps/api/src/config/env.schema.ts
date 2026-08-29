import { z } from 'zod';

const requiredStringSchema = z.string().trim().min(1);
const requiredUrlSchema = requiredStringSchema.pipe(z.string().url());
const booleanStringSchema = z.enum(['true', 'false']).transform((value) => value === 'true');
const optionalStringSchema = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : undefined))
  .optional();
const optionalUrlSchema = optionalStringSchema.pipe(z.string().url().optional());
const optionalEmailSchema = optionalStringSchema.pipe(z.string().email().optional());

export const EnvSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    APP_NAME: requiredStringSchema,
    APP_URL: requiredUrlSchema,
    API_HOST: requiredStringSchema,
    API_PORT: z.coerce.number().int().min(1).max(65535),
    CORS_ORIGINS: optionalStringSchema,

    DATABASE_HOST: requiredStringSchema,
    DATABASE_PORT: z.coerce.number().int().min(1).max(65535),
    DATABASE_NAME: requiredStringSchema,
    DATABASE_USER: requiredStringSchema,
    DATABASE_PASSWORD: z.string(),
    DATABASE_SSL: booleanStringSchema,

    REDIS_URL: optionalUrlSchema,
    REDIS_HOST: optionalStringSchema,
    REDIS_PORT: z.coerce.number().int().min(1).max(65535).optional(),
    REDIS_DB: z.coerce.number().int().min(0).default(0),
    REDIS_PASSWORD: optionalStringSchema,
    CACHE_DEFAULT_TTL_SECONDS: z.coerce.number().int().min(1).default(300),

    SESSION_SECRET: z.string().min(32),
    SESSION_COOKIE_NAME: requiredStringSchema,
    SESSION_TTL_SECONDS: z.coerce.number().int().min(60),
    ADMIN_EMAILS: z.string().default(''),

    OTP_EXPIRES_IN_SECONDS: z.coerce.number().int().min(60),
    OTP_LENGTH: z.coerce.number().int().min(6).max(8),

    SMTP_HOST: optionalStringSchema,
    SMTP_PORT: z.coerce.number().int().min(1).max(65535).default(587),
    SMTP_SECURE: booleanStringSchema.default(false),
    SMTP_USER: optionalStringSchema,
    SMTP_PASS: optionalStringSchema,
    SMTP_FROM_EMAIL: optionalEmailSchema,
    SMTP_FROM_NAME: z.string().min(1).default('Open Support'),

    GOOGLE_CLIENT_ID: optionalStringSchema,
    OPENAI_API_KEY: optionalStringSchema,
    OPENAI_ASSISTANT_MODEL: z.string().min(1).default('gpt-5-mini'),
    OPENAI_EMBEDDING_MODEL: z.string().min(1).default('text-embedding-3-small'),
    OPENAI_EMBEDDING_DIMENSIONS: z.coerce.number().int().positive().default(1536),
    SENTRY_DSN: optionalUrlSchema,
    SLACK_ERROR_WEBHOOK_URL: optionalUrlSchema,

    MEDIA_PROVIDER: z.enum(['local', 's3', 'cloudinary']),
    MEDIA_LOCAL_DIR: requiredStringSchema,
    MEDIA_PUBLIC_URL: requiredUrlSchema,
    MEDIA_MAX_FILE_SIZE_BYTES: z.coerce.number().int().min(1),
    MEDIA_ALLOWED_MIME_TYPES: requiredStringSchema,
    MEDIA_S3_ENDPOINT: optionalUrlSchema,
    MEDIA_S3_REGION: optionalStringSchema,
    MEDIA_S3_BUCKET: optionalStringSchema,
    MEDIA_S3_ACCESS_KEY_ID: optionalStringSchema,
    MEDIA_S3_SECRET_ACCESS_KEY: optionalStringSchema,
    MEDIA_S3_PREFIX: optionalStringSchema,
  })
  .superRefine((env, context) => {
    if (env.REDIS_HOST && !env.REDIS_PORT) {
      context.addIssue({
        code: 'custom',
        message: 'REDIS_PORT is required when REDIS_HOST is set',
        path: ['REDIS_PORT'],
      });
    }

    if (env.SMTP_HOST && !env.SMTP_FROM_EMAIL) {
      context.addIssue({
        code: 'custom',
        message: 'SMTP_FROM_EMAIL is required when SMTP_HOST is set',
        path: ['SMTP_FROM_EMAIL'],
      });
    }

    if ((env.SMTP_USER && !env.SMTP_PASS) || (!env.SMTP_USER && env.SMTP_PASS)) {
      context.addIssue({
        code: 'custom',
        message: 'SMTP_USER and SMTP_PASS must be configured together',
        path: ['SMTP_USER'],
      });
    }

    if (env.MEDIA_PROVIDER === 's3') {
      for (const [key, value] of [
        ['MEDIA_S3_REGION', env.MEDIA_S3_REGION],
        ['MEDIA_S3_BUCKET', env.MEDIA_S3_BUCKET],
        ['MEDIA_S3_ACCESS_KEY_ID', env.MEDIA_S3_ACCESS_KEY_ID],
        ['MEDIA_S3_SECRET_ACCESS_KEY', env.MEDIA_S3_SECRET_ACCESS_KEY],
      ] as const) {
        if (!value) {
          context.addIssue({
            code: 'custom',
            message: `${key} is required when MEDIA_PROVIDER is s3`,
            path: [key],
          });
        }
      }
    }
  });

export type Env = z.infer<typeof EnvSchema>;

export function validateEnv(config: Record<string, unknown>): Env {
  const parsed = EnvSchema.safeParse(config);

  if (!parsed.success) {
    const message = parsed.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');
    throw new Error(`Invalid environment configuration: ${message}`);
  }

  return parsed.data;
}
