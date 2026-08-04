import { createZodDto } from 'nestjs-zod';
import {
  CreateCategorySchema,
  CreateProductSchema,
  UpdateCategorySchema,
} from '../backend/category.schema.js';

export class CreateProductDto extends createZodDto(CreateProductSchema) {}
export class CreateCategoryDto extends createZodDto(CreateCategorySchema) {}
export class UpdateCategoryDto extends createZodDto(UpdateCategorySchema) {}
