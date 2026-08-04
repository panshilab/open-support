import { createZodDto } from 'nestjs-zod';
import { SendOtpSchema, VerifyOtpSchema } from '../backend/auth.schema.js';

export class SendOtpDto extends createZodDto(SendOtpSchema) {}
export class VerifyOtpDto extends createZodDto(VerifyOtpSchema) {}
