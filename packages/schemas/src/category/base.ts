import { z } from 'zod';
import { IdSchema, IsoDateStringSchema, SlugSchema } from '../common.js';

export const BaseProductSchema = z.object({
  id: IdSchema,
  name: z.string().trim().min(1).max(120),
  slug: SlugSchema,
  order: z.number().int().min(0).default(0),
  createdAt: IsoDateStringSchema,
  updatedAt: IsoDateStringSchema,
});
export type Product = z.infer<typeof BaseProductSchema>;

export const BaseCategorySchema = z.object({
  id: IdSchema,
  productId: IdSchema,
  parentId: IdSchema.nullable(),
  name: z.string().trim().min(1).max(120),
  slug: SlugSchema,
  path: z.string().trim().min(1).max(500),
  level: z.number().int().min(0).max(10),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  createdAt: IsoDateStringSchema,
  updatedAt: IsoDateStringSchema,
});
export type Category = z.infer<typeof BaseCategorySchema>;

export type CategoryTreeNodeValue = z.infer<typeof BaseCategorySchema> & {
  children: CategoryTreeNodeValue[];
};

export const CategoryTreeNodeSchema: z.ZodType<CategoryTreeNodeValue> = BaseCategorySchema.extend({
  children: z.array(z.lazy(() => CategoryTreeNodeSchema)).default([]),
});
export type CategoryTreeNode = z.infer<typeof CategoryTreeNodeSchema>;
