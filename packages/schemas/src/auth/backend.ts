import { createZodDto } from 'nestjs-zod';
import type { z } from 'zod';
import { SendOtpFormSchema, VerifyOtpFormSchema } from './frontend.js';

export const SendOtpSchema = SendOtpFormSchema;
export const VerifyOtpSchema = VerifyOtpFormSchema;
export type SendOtpInput = z.infer<typeof SendOtpSchema>;
export type VerifyOtpInput = z.infer<typeof VerifyOtpSchema>;

export class SendOtpDto extends createZodDto(SendOtpSchema) {}
export class VerifyOtpDto extends createZodDto(VerifyOtpSchema) {}
