import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { IdSchema, PaginationQuerySchema } from '../common.js';
import { MediaProviderSchema } from './base.js';

export const MediaAssetIdParamSchema = z.object({
  mediaId: IdSchema,
});
export const MediaListQuerySchema = PaginationQuerySchema.extend({
  provider: MediaProviderSchema.optional(),
  mimeType: z.string().trim().max(120).optional(),
});
export const UploadMediaMetadataSchema = z.object({
  altText: z.string().trim().max(180).optional(),
  caption: z.string().trim().max(300).optional(),
});

export type MediaAssetIdParam = z.infer<typeof MediaAssetIdParamSchema>;
export type MediaListQuery = z.infer<typeof MediaListQuerySchema>;
export type UploadMediaMetadataInput = z.infer<typeof UploadMediaMetadataSchema>;

export class MediaAssetIdParamDto extends createZodDto(MediaAssetIdParamSchema) {}
export class MediaListQueryDto extends createZodDto(MediaListQuerySchema) {}
export class UploadMediaMetadataDto extends createZodDto(UploadMediaMetadataSchema) {}
