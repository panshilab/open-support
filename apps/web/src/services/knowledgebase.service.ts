import type { CategoryTreeNode, Product } from '@open-support/schemas/category';
import type { KnowledgeBaseEntry } from '@open-support/schemas/knowledge-base';
import { apiRequest, toQueryString, type PageResponse } from './http';

export interface KnowledgeBaseArticleFilters {
  page?: number;
  limit?: number;
  productId?: string;
  categoryId?: string;
}

export interface KnowledgeBaseSearchFilters extends KnowledgeBaseArticleFilters {
  query: string;
}

export interface KnowledgeBaseSearchResponse {
  mode: 'text' | 'vector';
  results: KnowledgeBaseEntry[];
}

export type KnowledgeBaseArticlePage = PageResponse<KnowledgeBaseEntry> & {
  mode: 'text' | 'vector' | null;
};

export const knowledgebaseService = {
  listProducts() {
    return apiRequest<Product[]>('/api/knowledgebase/products');
  },

  listCategories(productId?: string) {
    return apiRequest<CategoryTreeNode[]>(
      `/api/knowledgebase/categories${toQueryString({ productId })}`,
    );
  },

  async listArticles(filters: KnowledgeBaseArticleFilters): Promise<KnowledgeBaseArticlePage> {
    const page = await apiRequest<PageResponse<KnowledgeBaseEntry>>(
      `/api/knowledgebase/articles${toQueryString(filters)}`,
    );
    return {
      ...page,
      mode: null,
    };
  },

  async searchArticles(filters: KnowledgeBaseSearchFilters): Promise<KnowledgeBaseArticlePage> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const response = await apiRequest<KnowledgeBaseSearchResponse>(
      `/api/knowledgebase/search${toQueryString(filters)}`,
    );
    return {
      items: response.results,
      page,
      limit,
      total: page * limit + (response.results.length === limit ? 1 : 0),
      nextPage: response.results.length === limit ? page + 1 : null,
      mode: response.mode,
    };
  },

  getArticle(articleId: string) {
    return apiRequest<KnowledgeBaseEntry>(`/api/knowledgebase/articles/${articleId}`);
  },
};
