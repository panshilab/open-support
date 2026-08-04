import type { z } from 'zod';
import { BaseCategorySchema, BaseProductSchema } from './base.js';

export const CreateProductFormSchema = BaseProductSchema.pick({
  name: true,
  slug: true,
  order: true,
});
export type CreateProductForm = z.infer<typeof CreateProductFormSchema>;

export const CreateCategoryFormSchema = BaseCategorySchema.pick({
  productId: true,
  parentId: true,
  name: true,
  slug: true,
  order: true,
  isActive: true,
});
export type CreateCategoryForm = z.infer<typeof CreateCategoryFormSchema>;

export const UpdateCategoryFormSchema = CreateCategoryFormSchema.partial().extend({
  productId: CreateCategoryFormSchema.shape.productId,
});
export type UpdateCategoryForm = z.infer<typeof UpdateCategoryFormSchema>;
