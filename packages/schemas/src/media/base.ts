import { z } from 'zod';
import { IdSchema, IsoDateStringSchema } from '../common.js';

export const MediaProviderSchema = z.enum(['local', 's3', 'cloudinary']);
export type MediaProvider = z.infer<typeof MediaProviderSchema>;

export const BaseMediaAssetSchema = z.object({
  id: IdSchema,
  url: z.string().url().max(2048),
  key: z.string().trim().min(1).max(500),
  filename: z.string().trim().min(1).max(255),
  mimeType: z.string().trim().min(1).max(120),
  size: z.number().int().min(1),
  provider: MediaProviderSchema,
  altText: z.string().trim().max(180).nullable(),
  caption: z.string().trim().max(300).nullable(),
  createdAt: IsoDateStringSchema,
  uploadedByUserId: IdSchema,
});
export type MediaAsset = z.infer<typeof BaseMediaAssetSchema>;
