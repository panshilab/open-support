import { createZodDto } from 'nestjs-zod';
import type { z } from 'zod';
import {
  CreateCategoryFormSchema,
  CreateProductFormSchema,
  UpdateCategoryFormSchema,
} from './frontend.js';

export const CreateProductSchema = CreateProductFormSchema;
export const CreateCategorySchema = CreateCategoryFormSchema;
export const UpdateCategorySchema = UpdateCategoryFormSchema;
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;

export class CreateProductDto extends createZodDto(CreateProductSchema) {}
export class CreateCategoryDto extends createZodDto(CreateCategorySchema) {}
export class UpdateCategoryDto extends createZodDto(UpdateCategorySchema) {}
