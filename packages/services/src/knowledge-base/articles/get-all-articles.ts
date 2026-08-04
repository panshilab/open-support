import type { KnowledgeBaseEntry } from '@open-support/schemas/knowledge-base';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from '../../axios';
import { toQueryString } from '../../config';
import type { PageResponse } from '../../types';

export interface TGetKnowledgeBaseArticlesParams {
  page?: number;
  limit?: number;
  productId?: string;
  categoryId?: string;
  query?: string;
}

export interface KnowledgeBaseSearchResponse {
  mode: 'text' | 'vector';
  results: KnowledgeBaseEntry[];
}

export type TGetKnowledgeBaseArticlesResponse = PageResponse<KnowledgeBaseEntry> & {
  mode: 'text' | 'vector' | null;
};

export const useGetKnowledgeBaseArticlesQueryKey = (
  params: Omit<TGetKnowledgeBaseArticlesParams, 'page'>,
) => ['knowledgebase', 'articles', params];

export async function getKnowledgeBaseArticles(
  params: TGetKnowledgeBaseArticlesParams,
): Promise<TGetKnowledgeBaseArticlesResponse> {
  if (params.query?.trim()) {
    return searchKnowledgeBaseArticles(params);
  }

  const res = await axios.get<PageResponse<KnowledgeBaseEntry>>(
    `/knowledgebase/articles${toQueryString(params)}`,
  );
  return {
    ...res.data,
    mode: null,
  };
}

export const useGetKnowledgeBaseArticles = (
  params: Omit<TGetKnowledgeBaseArticlesParams, 'page'> = {},
) => {
  return useInfiniteQuery<TGetKnowledgeBaseArticlesResponse, Error>({
    queryKey: useGetKnowledgeBaseArticlesQueryKey(params),
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      getKnowledgeBaseArticles({
        ...params,
        page: Number(pageParam),
      }),
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
  });
};

async function searchKnowledgeBaseArticles(
  params: TGetKnowledgeBaseArticlesParams,
): Promise<TGetKnowledgeBaseArticlesResponse> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;
  const res = await axios.get<KnowledgeBaseSearchResponse>(
    `/knowledgebase/search${toQueryString(params)}`,
  );

  return {
    items: res.data.results,
    page,
    limit,
    total: page * limit + (res.data.results.length === limit ? 1 : 0),
    nextPage: res.data.results.length === limit ? page + 1 : null,
    mode: res.data.mode,
  };
}
