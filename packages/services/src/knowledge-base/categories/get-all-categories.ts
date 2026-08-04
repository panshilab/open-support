import type { CategoryTreeNode } from '@open-support/schemas/category';
import { useQuery } from '@tanstack/react-query';
import axios from '../../axios';
import { toQueryString } from '../../config';

export type TGetKnowledgeBaseCategoriesResponse = CategoryTreeNode[];

export interface TGetKnowledgeBaseCategoriesParams {
  productId?: string;
}

export const useGetKnowledgeBaseCategoriesQueryKey = (
  params: TGetKnowledgeBaseCategoriesParams,
) => ['knowledgebase', 'categories', params];

export async function getKnowledgeBaseCategories(params: TGetKnowledgeBaseCategoriesParams = {}) {
  const res = await axios.get<TGetKnowledgeBaseCategoriesResponse>(
    `/knowledgebase/categories${toQueryString(params)}`,
  );
  return res.data;
}

export const useGetKnowledgeBaseCategories = (params: TGetKnowledgeBaseCategoriesParams = {}) => {
  return useQuery<TGetKnowledgeBaseCategoriesResponse, Error>({
    queryKey: useGetKnowledgeBaseCategoriesQueryKey(params),
    queryFn: () => getKnowledgeBaseCategories(params),
    staleTime: 2 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
