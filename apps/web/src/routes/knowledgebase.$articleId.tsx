import { createFileRoute, Link } from '@tanstack/react-router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EventIcon from '@mui/icons-material/Event';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import {
  Box,
  Breadcrumbs,
  Chip,
  Container,
  Divider,
  Grid,
  Link as MuiLink,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { ErrorState } from '../components/error-state';
import { LoadingState } from '../components/loading-state';
import { primaryAlpha } from '../theme';
import { useGetKnowledgeBaseArticle } from '@open-support/services';

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
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <LoadingState label="Loading article" />
      </Container>
    );
  }

  if (articleQuery.error || !article) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <ErrorState message={articleQuery.error?.message ?? 'Article not found'} />
      </Container>
    );
  }

  const html = article.type === 'faq' ? article.answerHtml : article.contentHtml;
  const typeLabel = ARTICLE_TYPE_LABEL[article.type] ?? article.type;
  const updatedAt = formatUpdatedAt(article.updatedAt);
  const categorySegments = article.categoryPath ? article.categoryPath.split(' / ') : [];

  return (
    <Container maxWidth="lg" sx={{ pb: 6, pt: 3 }}>
      <Breadcrumbs
        aria-label="Breadcrumb"
        sx={{
          '& .MuiBreadcrumbs-separator': { color: 'text.secondary' },
          mb: 2,
        }}
      >
        <MuiLink
          component={Link}
          sx={{
            alignItems: 'center',
            color: 'text.secondary',
            display: 'inline-flex',
            gap: 0.5,
            textDecoration: 'none',
            '&:hover': { color: 'primary.main', textDecoration: 'underline' },
          }}
          to="/knowledgebase"
        >
          <ArrowBackIcon sx={{ fontSize: 16 }} />
          Knowledgebase
        </MuiLink>
        {categorySegments.map((segment) => (
          <Typography color="text.secondary" key={segment} variant="body2">
            {segment}
          </Typography>
        ))}
      </Breadcrumbs>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={1.5} sx={{ mb: 3 }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Chip
                icon={
                  article.type === 'faq' ? (
                    <QuestionAnswerIcon sx={{ fontSize: '14px !important' }} />
                  ) : undefined
                }
                label={typeLabel}
                size="small"
              />
              {article.categoryPath ? (
                <Chip label={article.categoryPath} size="small" variant="outlined" />
              ) : null}
            </Stack>
            <Typography sx={{ lineHeight: 1.15 }} variant="h1">
              {article.type === 'faq' && article.question ? article.question : article.name}
            </Typography>
            {article.type === 'faq' && article.question ? (
              <Typography color="text.secondary" variant="body2">
                {article.name}
              </Typography>
            ) : null}
            {updatedAt ? (
              <Stack
                direction="row"
                spacing={0.5}
                sx={{ alignItems: 'center', color: 'text.secondary' }}
              >
                <EventIcon sx={{ fontSize: 16 }} />
                <Typography variant="body2">Last updated {updatedAt}</Typography>
              </Stack>
            ) : null}
          </Stack>

          <Paper sx={{ p: { xs: 2.5, md: 4 } }}>
            {article.excerpt ? (
              <Typography
                color="text.secondary"
                sx={{
                  bgcolor: primaryAlpha[5],
                  borderRadius: 1.5,
                  fontSize: '1.05rem',
                  lineHeight: 1.6,
                  mb: 3,
                  p: 2,
                }}
              >
                {article.excerpt}
              </Typography>
            ) : null}
            <Box
              dangerouslySetInnerHTML={{
                __html: html ?? '<p>No content has been added yet.</p>',
              }}
              sx={{
                color: 'text.primary',
                fontSize: '1rem',
                maxWidth: '72ch',
                '& p': { lineHeight: 1.75, mb: 2 },
                '& p:first-of-type': { mt: 0 },
                '& p:last-child': { mb: 0 },
                '& h1, & h2, & h3': { fontWeight: 700, lineHeight: 1.3, mb: 1.5, mt: 3 },
                '& h1:first-of-type, & h2:first-of-type, & h3:first-of-type': { mt: 0 },
                '& ul, & ol': { lineHeight: 1.75, mb: 2, pl: 3 },
                '& li': { mb: 0.5 },
                '& a': { color: 'secondary.main', fontWeight: 600 },
                '& img': { borderRadius: 1.5, maxWidth: '100%' },
                '& code': {
                  bgcolor: primaryAlpha[8],
                  borderRadius: 0.5,
                  fontSize: '0.9em',
                  px: 0.5,
                  py: 0.25,
                },
                '& blockquote': {
                  bgcolor: 'rgba(0, 0, 0, 0.03)',
                  borderRadius: 1,
                  color: 'text.secondary',
                  fontStyle: 'italic',
                  ml: 0,
                  p: 1.5,
                },
              }}
            />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2.5, position: { md: 'sticky' }, top: { md: 96 } }}>
            <Typography sx={{ mb: 1.5 }} variant="h2">
              About this entry
            </Typography>
            <Stack divider={<Divider />} spacing={1.5}>
              <InfoRow label="Type" value={typeLabel} />
              {article.categoryPath ? (
                <InfoRow label="Category" value={article.categoryPath} />
              ) : null}
              {updatedAt ? <InfoRow label="Last updated" value={updatedAt} /> : null}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

function InfoRow({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <Stack spacing={0.25}>
      <Typography color="text.secondary" variant="caption">
        {label}
      </Typography>
      <Typography variant="body2">{value}</Typography>
    </Stack>
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
