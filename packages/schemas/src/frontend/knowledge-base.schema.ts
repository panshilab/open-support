import { z } from 'zod';
import {
  BaseKnowledgeBaseEntrySchema,
  KnowledgeBaseEntryTypeSchema,
} from '../base/knowledge-base.schema.js';

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
  type: KnowledgeBaseEntryTypeSchema,
});

export const KnowledgeBaseEntryFormSchema = KnowledgeBaseEntryFieldsSchema.superRefine((value, ctx) => {
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
});

export const KnowledgeBaseSearchFormSchema = z.object({
  query: z.string().trim().min(1).max(300),
  productId: BaseKnowledgeBaseEntrySchema.shape.productId.optional(),
  categoryId: BaseKnowledgeBaseEntrySchema.shape.categoryId.optional(),
});
