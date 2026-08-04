import { z } from 'zod';

const booleanStringSchema = z
  .enum(['true', 'false'])
  .transform((value) => value === 'true');

export const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  API_HOST: z.string().min(1).default('0.0.0.0'),
  API_PORT: z.coerce.number().int().min(1).max(65535).default(3001),

  DATABASE_HOST: z.string().min(1).default('localhost'),
  DATABASE_PORT: z.coerce.number().int().min(1).max(65535).default(5432),
  DATABASE_NAME: z.string().min(1).default('open_support'),
  DATABASE_USER: z.string().min(1).default('postgres'),
  DATABASE_PASSWORD: z.string().default('postgres'),
  DATABASE_SSL: booleanStringSchema.default(false),

  REDIS_URL: z.string().url().optional(),
  REDIS_PASSWORD: z.string().optional(),
  CACHE_DEFAULT_TTL_SECONDS: z.coerce.number().int().min(1).default(300),
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
