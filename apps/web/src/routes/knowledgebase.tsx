import { useCallback, useMemo, useState } from 'react';
import { Link, Outlet, createFileRoute, useRouterState } from '@tanstack/react-router';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import {
  Box,
  CircularProgress,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {
  AutocompleteDropdown,
  type AutocompleteDropdownOption,
} from '../components/autocomplete-dropdown';
import { EmptyState } from '../components/empty-state';
import { ErrorState } from '../components/error-state';
import { ListSkeleton } from '../components/loading-state';
import type { CategoryTreeNode, Product } from '@open-support/schemas/category';
import type { KnowledgeBaseEntry } from '@open-support/schemas/knowledge-base';
import type { ChangeEvent } from 'react';
import {
  useGetKnowledgeBaseArticles,
  useGetKnowledgeBaseCategories,
  useGetKnowledgeBaseProducts,
} from '@open-support/services';

const EMPTY_CATEGORY_TREE: CategoryTreeNode[] = [];
const EMPTY_PRODUCTS: Product[] = [];

export const Route = createFileRoute('/knowledgebase')({
  component: KnowledgebasePage,
});

function KnowledgebasePage() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  if (pathname !== '/knowledgebase') {
    return <Outlet />;
  }

  return <KnowledgebaseIndexPage />;
}

function KnowledgebaseIndexPage() {
  const [productId, setProductId] = useState<string | undefined>();
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [query, setQuery] = useState('');
  const trimmedQuery = query.trim();
  const hasQuery = trimmedQuery.length > 0;

  const categoryParams = useMemo(() => ({ productId }), [productId]);
  const articleParams = useMemo(
    () => ({
      limit: 18,
      productId,
      categoryId,
      query: trimmedQuery || undefined,
    }),
    [categoryId, productId, trimmedQuery],
  );

  const productsQuery = useGetKnowledgeBaseProducts();
  const categoriesQuery = useGetKnowledgeBaseCategories(categoryParams);
  const articlesQuery = useGetKnowledgeBaseArticles(articleParams);

  const products = productsQuery.data ?? EMPTY_PRODUCTS;
  const categories = categoriesQuery.data ?? EMPTY_CATEGORY_TREE;
  const articles = articlesQuery.data?.pages.flatMap((page) => page.items) ?? [];
  const searchMode = articlesQuery.data?.pages.find((page) => page.mode)?.mode ?? null;
  const flatCategories = useMemo(() => flattenCategories(categories), [categories]);

  const productOptions = useMemo<AutocompleteDropdownOption[]>(
    () => products.map((product) => ({ label: product.name, value: product.id })),
    [products],
  );
  const categoryOptions = useMemo<AutocompleteDropdownOption[]>(
    () =>
      flatCategories.map((category) => ({
        group: getCategoryParentPath(category),
        label: category.path,
        value: category.id,
      })),
    [flatCategories],
  );

  const activeCategoryName =
    flatCategories.find((c) => c.id === categoryId)?.path ?? 'All articles';
  const articlesLoading = articlesQuery.isLoading;
  const articlesError = articlesQuery.error?.message ?? null;

  const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  }, []);

  const handleProductChange = useCallback((value: string | undefined) => {
    setProductId(value);
    setCategoryId(undefined);
  }, []);

  const handleCategoryChange = useCallback((value: string | undefined) => {
    setCategoryId(value);
  }, []);

  const setLoadMoreNode = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node || !articlesQuery.hasNextPage || articlesQuery.isFetchingNextPage) {
        return;
      }
      const observer = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting) {
          void articlesQuery.fetchNextPage();
        }
      });
      observer.observe(node);
      return () => observer.disconnect();
    },
    [articlesQuery],
  );

  return (
    <Box
      sx={{
        display: { md: 'grid' },
        gap: { md: 5 },
        gridTemplateColumns: { md: '216px minmax(0, 1fr)' },
        maxWidth: 1120,
        mx: 'auto',
        pt: 3,
      }}
    >
      {/* Contents — the margin tabs */}
      <Box
        component="nav"
        aria-label="Knowledgebase contents"
        sx={{
          alignSelf: 'start',
          borderBottom: { xs: '1px solid', md: 'none' },
          borderColor: 'rule.main',
          mb: { xs: 3, md: 0 },
          position: { md: 'sticky' },
          top: { md: 'calc(var(--os-appbar-height) + 24px)' },
        }}
      >
        <Typography sx={{ color: 'ink.muted', mb: 1, px: 1.5 }} variant="overline">
          Contents
        </Typography>
        <Stack sx={{ mb: 2 }} role="list">
          <ContentsLink
            active={!categoryId}
            label="All articles"
            onClick={() => setCategoryId(undefined)}
          />
          {categories.map((category) => (
            <ContentsLink
              key={category.id}
              active={categoryId === category.id}
              label={category.name}
              onClick={() => setCategoryId(category.id)}
            />
          ))}
        </Stack>
        <Box
          sx={{
            borderTop: '1px solid',
            borderColor: 'rule.main',
            mx: 1.5,
            pt: 1.5,
          }}
        >
          <Typography
            component={Link}
            to="/new-ticket"
            sx={{
              color: 'ink.muted',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              fontSize: '0.8125rem',
              textDecoration: 'none',
              '&:hover': { color: 'primary.main' },
            }}
          >
            Need a human?
            <ArrowForwardRoundedIcon sx={{ fontSize: 14 }} />
          </Typography>
        </Box>
      </Box>

      {/* Search hero + results */}
      <Box sx={{ minWidth: 0, pb: 6 }}>
        <Typography
          component="p"
          sx={{ color: 'ink.muted', mb: 2 }}
          variant="overline"
        >
          Open Support / Knowledgebase
        </Typography>

        <Typography
          component="h1"
          variant="h1"
          sx={{ maxWidth: '18ch', mb: 3 }}
        >
          What do you need help with?
        </Typography>

        <TextField
          fullWidth
          aria-label="Search the knowledgebase"
          onChange={handleSearchChange}
          placeholder="Describe your problem&hellip;"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: 'ink.muted' }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{ maxWidth: 560 }}
          value={query}
        />

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          sx={{ maxWidth: 560, mt: 2 }}
        >
          <AutocompleteDropdown
            allLabel="All products"
            label="Product"
            onChange={handleProductChange}
            options={productOptions}
            value={productId}
          />
          <AutocompleteDropdown
            allLabel="All categories"
            grouped
            label="Category"
            onChange={handleCategoryChange}
            options={categoryOptions}
            value={categoryId}
          />
        </Stack>

        {searchMode && hasQuery ? (
          <Typography
            sx={{ color: 'ink.muted', mt: 2 }}
            variant="caption"
            component="p"
          >
            {searchMode === 'vector'
              ? 'Ranked by meaning and product context.'
              : 'Showing keyword matches — try rephrasing if nothing fits.'}
          </Typography>
        ) : null}

        {/* Section heading for the list */}
        <Box
          sx={{
            alignItems: 'baseline',
            borderBottom: '1px solid',
            borderColor: 'rule.strong',
            display: 'flex',
            justifyContent: 'space-between',
            mt: 5,
            pb: 1,
          }}
        >
          <Typography variant="h4">
            {hasQuery ? `Results for “${trimmedQuery}”` : activeCategoryName}
          </Typography>
          {!articlesLoading && !articlesError ? (
            <Typography sx={{ color: 'ink.muted' }} variant="caption">
              {articles.length} {articles.length === 1 ? 'article' : 'articles'}
            </Typography>
          ) : null}
        </Box>

        <Box sx={{ mt: 1 }}>
          {articlesLoading ? <ListSkeleton rows={5} /> : null}
          {articlesError ? <ErrorState message={articlesError} /> : null}
          {!articlesLoading && !articlesError && articles.length === 0 ? (
            <EmptyState
              message={
                hasQuery
                  ? 'Nothing matched. Try a different phrase, or open a support request.'
                  : 'No articles in this section yet.'
              }
              title="Nothing here"
            />
          ) : null}

          <Stack
            key={`${categoryId ?? 'all'}:${trimmedQuery}`}
            sx={{
              '@keyframes os-fade-in': {
                from: { opacity: 0, transform: 'translateY(2px)' },
                to: { opacity: 1, transform: 'none' },
              },
              animation: 'os-fade-in 160ms cubic-bezier(0.22, 1, 0.36, 1)',
              '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
            }}
          >
            {articles.map((article) => (
              <ArticleEntry key={article.id} article={article} />
            ))}
          </Stack>

          <Box
            ref={setLoadMoreNode}
            sx={{
              alignItems: 'center',
              color: 'ink.muted',
              display: 'flex',
              gap: 1,
              justifyContent: 'center',
              minHeight: 40,
              py: 2,
            }}
          >
            {articlesQuery.isFetchingNextPage ? (
              <>
                <CircularProgress color="primary" size={14} thickness={5} />
                <Typography variant="caption">Loading more</Typography>
              </>
            ) : null}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function ContentsLink({
  active,
  count,
  label,
  onClick,
}: Readonly<{ active: boolean; count?: number; label: string; onClick: () => void }>) {
  return (
    <Box
      component="button"
      onClick={onClick}
      aria-current={active ? 'true' : undefined}
      sx={{
        alignItems: 'baseline',
        background: 'none',
        border: 'none',
        borderLeft: '1px solid',
        borderLeftColor: active ? 'primary.main' : 'rule.main',
        color: active ? 'primary.main' : 'ink.muted',
        cursor: 'pointer',
        display: 'flex',
        font: 'inherit',
        fontWeight: active ? 600 : 500,
        gap: 1,
        justifyContent: 'space-between',
        px: 1.5,
        py: 0.75,
        textAlign: 'left',
        width: '100%',
        '&:hover': { color: 'ink.strong' },
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: 'primary.main',
          outlineOffset: '-2px',
        },
      }}
    >
      <Box component="span" sx={{ fontSize: (t) => t.typography.body2.fontSize }}>
        {label}
      </Box>
      {typeof count === 'number' ? (
        <Box
          component="span"
          sx={{ color: 'ink.faint', fontFamily: (t) => t.typography.caption.fontFamily, fontSize: '0.75rem' }}
        >
          {count}
        </Box>
      ) : null}
    </Box>
  );
}

function ArticleEntry({ article }: Readonly<{ article: KnowledgeBaseEntry }>) {
  return (
    <Link
      className="os-entry-link"
      params={{ articleId: article.id }}
      to="/knowledgebase/$articleId"
      style={{ color: 'inherit', display: 'block', textDecoration: 'none' }}
    >
      <Stack
        direction="row"
        spacing={2}
        sx={{
          alignItems: 'baseline',
          borderBottom: '1px solid',
          borderColor: 'rule.main',
          justifyContent: 'space-between',
          py: 2,
          transition: 'background-color 120ms',
          '&:hover': { bgcolor: 'background.accentWash' },
          '&:hover .os-arrow': { transform: 'translateX(3px)' },
        }}
      >
        <Box>
          {article.type ? (
            <Typography
              component="span"
              sx={{ color: 'ink.faint', mr: 1 }}
              variant="overline"
            >
              {article.type}
            </Typography>
          ) : null}
          <Typography component="span" sx={{ fontFamily: (t) => t.typography.h3.fontFamily, fontSize: '1.0625rem', fontWeight: 500 }}>
            {article.name}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }} variant="body2">
            {article.excerpt ?? 'Open this entry to read the full answer.'}
          </Typography>
          {article.categoryPath ? (
            <Typography sx={{ color: 'ink.faint', mt: 0.75 }} variant="caption" component="p">
              {article.categoryPath}
            </Typography>
          ) : null}
        </Box>
        <ArrowForwardRoundedIcon
          className="os-arrow"
          sx={{ color: 'ink.faint', fontSize: 16, flexShrink: 0, transition: 'transform 120ms' }}
        />
      </Stack>
    </Link>
  );
}

function flattenCategories(categories: CategoryTreeNode[]): CategoryTreeNode[] {
  return categories.flatMap((category) => [
    category,
    ...flattenCategories(category.children ?? []),
  ]);
}

function getCategoryParentPath(category: CategoryTreeNode) {
  const segments = category.path.split(' / ');

  if (segments.length <= 1) {
    return 'Top level';
  }

  return segments.slice(0, -1).join(' / ');
}
