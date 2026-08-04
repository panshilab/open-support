import type { z } from 'zod';
import { UploadMediaMetadataSchema } from './backend.js';

export const UploadMediaFormSchema = UploadMediaMetadataSchema;
export type UploadMediaForm = z.infer<typeof UploadMediaFormSchema>;
