import { z } from 'zod';

export const IdSchema = z.uuid().describe("UUID identifier");

export const IsoDateStringSchema = z
  .string()
  .datetime()
  .describe('ISO 8601 date-time string');

export const EmailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email()
  .max(255)
  .describe('Email address');

export const HtmlSchema = z
  .string()
  .trim()
  .min(1)
  .describe('Sanitized HTML content');

export const SlugSchema = z
  .string()
  .trim()
  .min(1)
  .max(160)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .describe('URL-safe slug');

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const SortDirectionSchema = z.enum(['asc', 'desc']);
