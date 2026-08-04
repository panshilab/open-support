import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import {
  CreateCategoryFormSchema,
  CreateProductFormSchema,
  UpdateCategoryFormSchema,
} from './frontend.js';
import { IdSchema } from '../common.js';

export const CreateProductSchema = CreateProductFormSchema;
export const UpdateProductSchema = CreateProductFormSchema.partial();
export const CreateCategorySchema = CreateCategoryFormSchema;
export const UpdateCategorySchema = UpdateCategoryFormSchema;
export const ProductIdParamSchema = z.object({
  productId: IdSchema,
});
export const CategoryIdParamSchema = z.object({
  categoryId: IdSchema,
});
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;
export type ProductIdParam = z.infer<typeof ProductIdParamSchema>;
export type CategoryIdParam = z.infer<typeof CategoryIdParamSchema>;

export class CreateProductDto extends createZodDto(CreateProductSchema) {}
export class UpdateProductDto extends createZodDto(UpdateProductSchema) {}
export class CreateCategoryDto extends createZodDto(CreateCategorySchema) {}
export class UpdateCategoryDto extends createZodDto(UpdateCategorySchema) {}
export class ProductIdParamDto extends createZodDto(ProductIdParamSchema) {}
export class CategoryIdParamDto extends createZodDto(CategoryIdParamSchema) {}
