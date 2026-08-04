import type { Product } from '@open-support/schemas/category';
import { useQuery } from '@tanstack/react-query';
import axios from '../../axios';

export type TGetKnowledgeBaseProductsResponse = Product[];

export const useGetKnowledgeBaseProductsQueryKey = () => ['knowledgebase', 'products'];

export async function getKnowledgeBaseProducts() {
  const res = await axios.get<TGetKnowledgeBaseProductsResponse>('/knowledgebase/products');
  return res.data;
}

export const useGetKnowledgeBaseProducts = () => {
  return useQuery<TGetKnowledgeBaseProductsResponse, Error>({
    queryKey: useGetKnowledgeBaseProductsQueryKey(),
    queryFn: getKnowledgeBaseProducts,
    staleTime: 2 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
