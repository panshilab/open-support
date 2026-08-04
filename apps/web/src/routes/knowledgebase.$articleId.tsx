import { useCallback } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { Alert, Box, Chip, Paper, Stack, Typography } from '@mui/material';
import { ErrorState } from '../components/error-state';
import { LoadingState } from '../components/loading-state';
import { knowledgebaseService } from '../services/knowledgebase.service';

export const Route = createFileRoute('/knowledgebase/$articleId')({
  component: KnowledgebaseArticlePage,
});

function KnowledgebaseArticlePage() {
  const { articleId } = Route.useParams();
  const getArticleQueryFn = useCallback(
    () => knowledgebaseService.getArticle(articleId),
    [articleId],
  );
  const articleQuery = useQuery({
    queryKey: ['knowledgebase', 'article', articleId],
    queryFn: getArticleQueryFn,
  });
  const article = articleQuery.data;

  if (articleQuery.isLoading) {
    return <LoadingState label="Loading article" />;
  }

  if (articleQuery.error || !article) {
    return <ErrorState message={articleQuery.error?.message ?? 'Article not found'} />;
  }

  const html = article.type === 'faq' ? article.answerHtml : article.contentHtml;

  return (
    <Stack spacing={2}>
      <Paper sx={{ p: 3 }}>
        <Stack spacing={1}>
          <Stack direction="row" spacing={1}>
            <Chip label={article.type} size="small" />
            {article.categoryPath ? (
              <Chip label={article.categoryPath} size="small" variant="outlined" />
            ) : null}
          </Stack>
          <Typography variant="h1">{article.name}</Typography>
          {article.question ? (
            <Typography color="text.secondary" variant="h2">
              {article.question}
            </Typography>
          ) : null}
          {article.excerpt ? <Alert severity="info">{article.excerpt}</Alert> : null}
        </Stack>
      </Paper>
      <Paper sx={{ p: 3 }}>
        <Box
          dangerouslySetInnerHTML={{ __html: html ?? '<p>No content has been added yet.</p>' }}
          sx={{
            '& p': { lineHeight: 1.7 },
            '& p:first-of-type': { mt: 0 },
            '& p:last-child': { mb: 0 },
          }}
        />
      </Paper>
    </Stack>
  );
}
