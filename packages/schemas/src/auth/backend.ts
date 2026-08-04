import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import {
  ChangePasswordFormSchema,
  PasswordSchema,
  PasswordLoginFormSchema,
  SendOtpFormSchema,
  VerifyOtpFormSchema,
} from './frontend.js';

export const SendOtpSchema = SendOtpFormSchema;
export const VerifyOtpSchema = VerifyOtpFormSchema;
export const PasswordLoginSchema = PasswordLoginFormSchema;
export const ChangePasswordSchema = ChangePasswordFormSchema;
export const AcceptInvitationSchema = z.object({
  token: z.string().trim().min(32).max(200),
  name: z.string().trim().min(1).max(120),
  password: PasswordSchema,
});
export const GoogleLoginSchema = z.object({
  idToken: z.string().trim().min(1).max(5000),
});
export type SendOtpInput = z.infer<typeof SendOtpSchema>;
export type VerifyOtpInput = z.infer<typeof VerifyOtpSchema>;
export type PasswordLoginInput = z.infer<typeof PasswordLoginSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
export type AcceptInvitationInput = z.infer<typeof AcceptInvitationSchema>;
export type GoogleLoginInput = z.infer<typeof GoogleLoginSchema>;

export class SendOtpDto extends createZodDto(SendOtpSchema) {}
export class VerifyOtpDto extends createZodDto(VerifyOtpSchema) {}
export class PasswordLoginDto extends createZodDto(PasswordLoginSchema) {}
export class ChangePasswordDto extends createZodDto(ChangePasswordSchema) {}
export class AcceptInvitationDto extends createZodDto(AcceptInvitationSchema) {}
export class GoogleLoginDto extends createZodDto(GoogleLoginSchema) {}
