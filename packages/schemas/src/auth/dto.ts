import { createZodDto } from 'nestjs-zod';
import { SendOtpSchema, VerifyOtpSchema } from './backend.js';

export class SendOtpDto extends createZodDto(SendOtpSchema) {}
export class VerifyOtpDto extends createZodDto(VerifyOtpSchema) {}
