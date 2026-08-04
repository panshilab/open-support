import { BaseCategorySchema, BaseProductSchema } from './base.js';

export const CreateProductFormSchema = BaseProductSchema.pick({
  name: true,
  slug: true,
  order: true,
});

export const CreateCategoryFormSchema = BaseCategorySchema.pick({
  productId: true,
  parentId: true,
  name: true,
  slug: true,
  order: true,
  isActive: true,
});

export const UpdateCategoryFormSchema = CreateCategoryFormSchema.partial().extend({
  productId: CreateCategoryFormSchema.shape.productId,
});
