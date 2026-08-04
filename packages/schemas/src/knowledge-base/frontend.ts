import { z } from 'zod';
import { BaseKnowledgeBaseEntrySchema, KnowledgeBaseEntryTypeSchema } from './base.js';

export const KnowledgeBaseEntryFieldsSchema = BaseKnowledgeBaseEntrySchema.pick({
  productId: true,
  categoryId: true,
  name: true,
  slug: true,
  type: true,
  contentHtml: true,
  excerpt: true,
  question: true,
  answerHtml: true,
  published: true,
  featured: true,
  order: true,
}).extend({
  productId: BaseKnowledgeBaseEntrySchema.shape.productId.unwrap(),
  categoryId: BaseKnowledgeBaseEntrySchema.shape.categoryId.unwrap(),
  type: KnowledgeBaseEntryTypeSchema,
});
export type KnowledgeBaseEntryFields = z.infer<typeof KnowledgeBaseEntryFieldsSchema>;

export const KnowledgeBaseEntryFormSchema = KnowledgeBaseEntryFieldsSchema.superRefine(
  (value, ctx) => {
    if (value.type === 'article' && !value.contentHtml) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['contentHtml'],
        message: 'Article content is required.',
      });
    }

    if (value.type === 'faq') {
      if (!value.question) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['question'],
          message: 'FAQ question is required.',
        });
      }

      if (!value.answerHtml) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['answerHtml'],
          message: 'FAQ answer is required.',
        });
      }
    }
  },
);
export type KnowledgeBaseEntryForm = z.infer<typeof KnowledgeBaseEntryFormSchema>;

export const KnowledgeBaseSearchFormSchema = z.object({
  query: z.string().trim().min(1).max(300),
  productId: BaseKnowledgeBaseEntrySchema.shape.productId.optional(),
  categoryId: BaseKnowledgeBaseEntrySchema.shape.categoryId.optional(),
});
export type KnowledgeBaseSearchForm = z.infer<typeof KnowledgeBaseSearchFormSchema>;
