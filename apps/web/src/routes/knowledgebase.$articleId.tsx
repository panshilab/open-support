import { createFileRoute, Link } from '@tanstack/react-router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Stack, Typography } from '@mui/material';
import { ErrorState } from '../components/error-state';
import { LoadingState } from '../components/loading-state';
import { useGetKnowledgeBaseArticle } from '@open-support/services';
import { HumanFallback } from '../components/support-center';

export const Route = createFileRoute('/knowledgebase/$articleId')({
  component: KnowledgebaseArticlePage,
});

const ARTICLE_TYPE_LABEL: Record<string, string> = {
  article: 'Article',
  faq: 'FAQ',
};

function KnowledgebaseArticlePage() {
  const { articleId } = Route.useParams();
  const articleQuery = useGetKnowledgeBaseArticle(articleId);
  const article = articleQuery.data;

  if (articleQuery.isLoading) {
    return (
      <Box sx={{ maxWidth: 760, mx: 'auto', pt: 4 }}>
        <LoadingState label="Loading article" lines={6} />
      </Box>
    );
  }

  if (articleQuery.error || !article) {
    return (
      <Box sx={{ maxWidth: 760, mx: 'auto', pt: 4 }}>
        <ErrorState message={articleQuery.error?.message ?? 'Article not found'} />
      </Box>
    );
  }

  const html = article.type === 'faq' ? article.answerHtml : article.contentHtml;
  const typeLabel = ARTICLE_TYPE_LABEL[article.type] ?? article.type;
  const updatedAt = formatUpdatedAt(article.updatedAt);
  const heading =
    article.type === 'faq' && article.question ? article.question : article.name;

  return (
    <Box sx={{ maxWidth: 760, mx: 'auto', pb: 8, pt: 3 }}>
      <Typography
        component={Link}
        to="/knowledgebase"
        sx={{
          alignItems: 'center',
          color: 'ink.muted',
          display: 'inline-flex',
          gap: 0.5,
          mb: 3,
          textDecoration: 'none',
          '&:hover': { color: 'primary.main' },
        }}
        variant="overline"
      >
        <ArrowBackIcon sx={{ fontSize: 13 }} />
        Knowledgebase
      </Typography>

      <Typography component="h1" sx={{ mb: 1.5 }} variant="h1">
        {heading}
      </Typography>

      <Typography
        component="p"
        sx={{ color: 'ink.muted', mb: 4 }}
        variant="overline"
      >
        {[typeLabel, article.categoryPath, updatedAt ? `Updated ${updatedAt}` : null]
          .filter(Boolean)
          .join('  ·  ')}
      </Typography>

      {article.type === 'faq' && article.question ? (
        <Typography color="text.secondary" sx={{ mb: 3 }} variant="body2">
          Filed as: {article.name}
        </Typography>
      ) : null}

      {article.excerpt ? (
        <Typography
          sx={{
            borderLeft: '2px solid',
            borderColor: 'primary.main',
            color: 'ink.body',
            fontFamily: (t) => t.typography.h3.fontFamily,
            fontSize: '1.125rem',
            lineHeight: 1.5,
            mb: 4,
            pl: 2,
          }}
        >
          {article.excerpt}
        </Typography>
      ) : null}

      <Box
        className="os-measure"
        dangerouslySetInnerHTML={{
          __html: html ?? '<p>No content has been added yet.</p>',
        }}
        sx={{
          color: 'ink.body',
          fontSize: '1.0625rem',
          '& p': { lineHeight: 1.75, mb: 2.5 },
          '& p:first-of-type': { mt: 0 },
          '& p:last-child': { mb: 0 },
          '& h1, & h2, & h3': {
            fontFamily: (t) => t.typography.h3.fontFamily,
            fontWeight: 500,
            lineHeight: 1.3,
            mb: 1.5,
            mt: 4,
          },
          '& h1:first-of-type, & h2:first-of-type, & h3:first-of-type': { mt: 0 },
          '& ul, & ol': { lineHeight: 1.75, mb: 2.5, pl: 3 },
          '& li': { mb: 0.5 },
          '& a': { color: 'primary.main', textDecoration: 'underline', textUnderlineOffset: '0.15em' },
          '& img': { borderRadius: '2px', maxWidth: '100%' },
          '& code': {
            bgcolor: 'background.accentWash',
            borderRadius: '2px',
            fontFamily: (t) => t.typography.caption.fontFamily,
            fontSize: '0.9em',
            px: 0.5,
            py: 0.25,
          },
          '& pre': {
            bgcolor: 'background.accentWash',
            borderRadius: '2px',
            fontFamily: (t) => t.typography.caption.fontFamily,
            overflowX: 'auto',
            p: 1.5,
          },
          '& blockquote': {
            borderLeft: '2px solid',
            borderColor: 'rule.strong',
            color: 'ink.muted',
            fontStyle: 'italic',
            ml: 0,
            pl: 2,
          },
        }}
      />

      <Box
        sx={{
          borderTop: '1px solid',
          borderColor: 'rule.main',
          display: 'flex',
          flexWrap: 'wrap',
          gap: { xs: 3, sm: 6 },
          mt: 6,
          pt: 3,
        }}
      >
        <MetaItem label="Type" value={typeLabel} />
        {article.categoryPath ? (
          <MetaItem label="Category" value={article.categoryPath} />
        ) : null}
        {updatedAt ? <MetaItem label="Last updated" value={updatedAt} /> : null}
      </Box>

      <Box sx={{ mt: 4 }}>
        <HumanFallback />
      </Box>
    </Box>
  );
}

function MetaItem({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <Box>
      <Typography component="p" sx={{ color: 'ink.faint' }} variant="overline">
        {label}
      </Typography>
      <Typography sx={{ mt: 0.25 }} variant="body2">
        {value}
      </Typography>
    </Box>
  );
}

function formatUpdatedAt(value: string | undefined) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
