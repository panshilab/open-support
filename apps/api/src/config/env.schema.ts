import { z } from 'zod';

const booleanStringSchema = z.enum(['true', 'false']).transform((value) => value === 'true');
const optionalStringSchema = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : undefined))
  .optional();
const optionalUrlSchema = optionalStringSchema.pipe(z.string().url().optional());
const optionalEmailSchema = optionalStringSchema.pipe(z.string().email().optional());

export const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  APP_NAME: z.string().min(1).default('Open Support'),
  APP_URL: z.string().url().default('http://localhost:3000'),
  API_HOST: z.string().min(1).default('0.0.0.0'),
  API_PORT: z.coerce.number().int().min(1).max(65535).default(3001),

  DATABASE_HOST: z.string().min(1).default('localhost'),
  DATABASE_PORT: z.coerce.number().int().min(1).max(65535).default(5432),
  DATABASE_NAME: z.string().min(1).default('open_support'),
  DATABASE_USER: z.string().min(1).default('postgres'),
  DATABASE_PASSWORD: z.string().default('postgres'),
  DATABASE_SSL: booleanStringSchema.default(false),

  REDIS_URL: optionalUrlSchema,
  REDIS_HOST: optionalStringSchema,
  REDIS_PORT: z.coerce.number().int().min(1).max(65535).optional(),
  REDIS_DB: z.coerce.number().int().min(0).default(0),
  REDIS_PASSWORD: optionalStringSchema,
  CACHE_DEFAULT_TTL_SECONDS: z.coerce.number().int().min(1).default(300),

  SESSION_SECRET: z.string().min(32).default('change-this-session-secret-before-production'),
  SESSION_COOKIE_NAME: z.string().min(1).default('open_support_session'),
  SESSION_TTL_SECONDS: z.coerce.number().int().min(60).default(604800),
  ADMIN_EMAILS: z.string().default(''),

  OTP_EXPIRES_IN_SECONDS: z.coerce.number().int().min(60).default(600),
  OTP_LENGTH: z.coerce.number().int().min(6).max(8).default(6),

  SMTP_HOST: optionalStringSchema,
  SMTP_PORT: z.coerce.number().int().min(1).max(65535).default(587),
  SMTP_SECURE: booleanStringSchema.default(false),
  SMTP_USER: optionalStringSchema,
  SMTP_PASS: optionalStringSchema,
  SMTP_FROM_EMAIL: optionalEmailSchema,
  SMTP_FROM_NAME: z.string().min(1).default('Open Support'),

  GOOGLE_CLIENT_ID: optionalStringSchema,
  OPENAI_API_KEY: optionalStringSchema,
  OPENAI_EMBEDDING_MODEL: z.string().min(1).default('text-embedding-3-small'),
  OPENAI_EMBEDDING_DIMENSIONS: z.coerce.number().int().positive().default(1536),
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
