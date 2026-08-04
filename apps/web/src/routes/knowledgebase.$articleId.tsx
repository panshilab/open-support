import { useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Alert, Box, Chip, Paper, Stack, Typography } from '@mui/material';
import { ErrorState } from '../components/error-state';
import { LoadingState } from '../components/loading-state';

interface KnowledgebaseArticleDetail {
  id: string;
  name: string;
  type: 'article' | 'faq';
  contentHtml: string | null;
  answerHtml: string | null;
  excerpt: string | null;
  question: string | null;
  categoryPath: string | null;
  updatedAt: string;
}

export const Route = createFileRoute('/knowledgebase/$articleId')({
  component: KnowledgebaseArticlePage,
});

function KnowledgebaseArticlePage() {
  const { articleId } = Route.useParams();
  const [article, setArticle] = useState<KnowledgebaseArticleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadArticle() {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/knowledgebase/articles/${articleId}`);

      if (!response.ok) {
        throw new Error('Unable to load article');
      }

      if (!cancelled) {
        setArticle((await response.json()) as KnowledgebaseArticleDetail);
        setLoading(false);
      }
    }

    loadArticle().catch(() => {
      if (!cancelled) {
        setError('Unable to load article');
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [articleId]);

  if (loading) {
    return <LoadingState label="Loading article" />;
  }

  if (error || !article) {
    return <ErrorState message={error ?? 'Article not found'} />;
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
