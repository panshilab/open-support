import { z } from 'zod';
import { EmailSchema } from '../common.js';

export const SendOtpFormSchema = z.object({
  email: EmailSchema,
});
export type SendOtpForm = z.infer<typeof SendOtpFormSchema>;

export const VerifyOtpFormSchema = z.object({
  email: EmailSchema,
  otp: z
    .string()
    .trim()
    .regex(/^[0-9]{6}$/),
});
export type VerifyOtpForm = z.infer<typeof VerifyOtpFormSchema>;
