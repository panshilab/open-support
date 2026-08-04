import type { z } from 'zod';
import { BaseAdminSettingSchema } from './base.js';

export const AdminSettingFormSchema = BaseAdminSettingSchema.pick({
  key: true,
  value: true,
});
export type AdminSettingForm = z.infer<typeof AdminSettingFormSchema>;
