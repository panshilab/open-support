import { z } from 'zod';
import { EmailSchema } from '../common.js';

export const SendOtpFormSchema = z.object({
  email: EmailSchema,
});

export const VerifyOtpFormSchema = z.object({
  email: EmailSchema,
  otp: z.string().trim().regex(/^[0-9]{6}$/),
});
