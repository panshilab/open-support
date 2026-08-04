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

export const PasswordSchema = z.string().min(10).max(120);

export const PasswordLoginFormSchema = z.object({
  email: EmailSchema,
  password: z.string().min(1).max(120),
});
export type PasswordLoginForm = z.infer<typeof PasswordLoginFormSchema>;

export const ChangePasswordFormSchema = z
  .object({
    currentPassword: z.string().min(1).max(120),
    newPassword: PasswordSchema,
    confirmPassword: z.string().min(1).max(120),
  })
  .refine((input) => input.newPassword === input.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
export type ChangePasswordForm = z.infer<typeof ChangePasswordFormSchema>;

export const AcceptInvitationFormSchema = z
  .object({
    token: z.string().trim().min(32).max(200),
    name: z.string().trim().min(1).max(120),
    password: PasswordSchema,
    confirmPassword: z.string().min(1).max(120),
  })
  .refine((input) => input.password === input.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
export type AcceptInvitationForm = z.infer<typeof AcceptInvitationFormSchema>;
