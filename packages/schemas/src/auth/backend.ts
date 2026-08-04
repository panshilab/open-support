import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { SendOtpFormSchema, VerifyOtpFormSchema } from './frontend.js';

export const SendOtpSchema = SendOtpFormSchema;
export const VerifyOtpSchema = VerifyOtpFormSchema;
export const GoogleLoginSchema = z.object({
  idToken: z.string().trim().min(1).max(5000),
});
export type SendOtpInput = z.infer<typeof SendOtpSchema>;
export type VerifyOtpInput = z.infer<typeof VerifyOtpSchema>;
export type GoogleLoginInput = z.infer<typeof GoogleLoginSchema>;

export class SendOtpDto extends createZodDto(SendOtpSchema) {}
export class VerifyOtpDto extends createZodDto(VerifyOtpSchema) {}
export class GoogleLoginDto extends createZodDto(GoogleLoginSchema) {}
