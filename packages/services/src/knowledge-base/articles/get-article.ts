import type { KnowledgeBaseEntry } from '@open-support/schemas/knowledge-base';
import { useQuery } from '@tanstack/react-query';
import axios from '../../axios';

export type TGetKnowledgeBaseArticleResponse = KnowledgeBaseEntry;

export const getKnowledgeBaseArticleQueryKey = (articleId: string) => [
  'knowledgebase',
  'article',
  articleId,
];

export async function getKnowledgeBaseArticle(articleId: string) {
  const res = await axios.get<TGetKnowledgeBaseArticleResponse>(
    `/knowledgebase/articles/${articleId}`,
  );
  return res.data;
}

export const useGetKnowledgeBaseArticle = (articleId: string, options?: { enabled?: boolean }) => {
  return useQuery<TGetKnowledgeBaseArticleResponse, Error>({
    queryKey: getKnowledgeBaseArticleQueryKey(articleId),
    queryFn: () => getKnowledgeBaseArticle(articleId),
    enabled: options?.enabled ?? !!articleId,
    staleTime: 2 * 60 * 1000,
  });
};
