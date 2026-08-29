import { createZodDto } from 'nestjs-zod';
import { AskAssistantFormSchema } from './frontend.js';

export const AskAssistantSchema = AskAssistantFormSchema;
export type AskAssistantInput = import('zod').infer<typeof AskAssistantSchema>;

export class AskAssistantDto extends createZodDto(AskAssistantSchema) {}
