import { useCallback, useMemo, useState } from 'react';
import { Link, Outlet, createFileRoute, useRouterState } from '@tanstack/react-router';
import SearchIcon from '@mui/icons-material/Search';
import {
  Alert,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Container,
  CircularProgress,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  AutocompleteDropdown,
  type AutocompleteDropdownOption,
} from '../components/autocomplete-dropdown';
import { EmptyState } from '../components/empty-state';
import { ErrorState } from '../components/error-state';
import { LoadingState } from '../components/loading-state';
import type { CategoryTreeNode, Product } from '@open-support/schemas/category';
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

  const categoryParams = useMemo(
    () => ({
      productId,
    }),
    [productId],
  );
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
    () =>
      products.map((product) => ({
        label: product.name,
        value: product.id,
      })),
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
  const loading = productsQuery.isLoading || categoriesQuery.isLoading || articlesQuery.isLoading;
  const error =
    productsQuery.error?.message ??
    categoriesQuery.error?.message ??
    articlesQuery.error?.message ??
    null;

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
    <>
      <Box
        sx={{
          bgcolor: 'rgba(244, 248, 241, 0.92)',
          borderBottom: 1,
          borderColor: 'divider',
          mx: 'calc(50% - 50vw)',
          position: 'sticky',
          top: { xs: 88, sm: 65 },
          zIndex: 10,
          marginBottom: 2,
        }}
      >
        <Box sx={{ px: 3, py: 2 }}>
          <Grid container spacing={1.5} sx={{ alignItems: 'center', pt: 0 }}>
            <Grid size={{ xs: 12, md: 3 }}>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="h1">Knowledgebase</Typography>
                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                  Browse ecommerce help articles and FAQs.
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Search articles and FAQs"
                onChange={handleSearchChange}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  },
                }}
                value={query}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <AutocompleteDropdown
                allLabel="All products"
                label="Product"
                onChange={handleProductChange}
                options={productOptions}
                value={productId}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <AutocompleteDropdown
                allLabel="All categories"
                grouped
                label="Category"
                onChange={handleCategoryChange}
                options={categoryOptions}
                value={categoryId}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>

      {searchMode ? (
        <Alert severity="info">Search mode: {searchMode === 'vector' ? 'vector' : 'text'}</Alert>
      ) : null}
      <Container maxWidth={false}>
        {loading ? <LoadingState label="Loading articles" /> : null}
        {error ? <ErrorState message={error} /> : null}
        {!loading && !error && articles.length === 0 ? (
          <EmptyState
            message="Try another product, category, or search term."
            title="No knowledgebase entries found"
          />
        ) : null}
        <Grid container spacing={2}>
          {articles.map((article) => (
            <Grid key={article.id} size={{ xs: 12, md: 6, lg: 4 }}>
              <Link
                params={{ articleId: article.id }}
                style={{
                  color: 'inherit',
                  display: 'block',
                  height: '100%',
                  textDecoration: 'none',
                }}
                to="/knowledgebase/$articleId"
              >
                <Card sx={{ height: '100%' }}>
                  <CardActionArea sx={{ height: '100%' }}>
                    <CardContent sx={{ minHeight: 188 }}>
                      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                        <Chip label={article.type} size="small" />
                        {article.categoryPath ? (
                          <Chip label={article.categoryPath} size="small" variant="outlined" />
                        ) : null}
                      </Stack>
                      <Typography variant="h2">{article.name}</Typography>
                      <Typography color="text.secondary" sx={{ mt: 1 }}>
                        {article.excerpt ?? 'Open this entry to read the full answer.'}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
        <Box
          ref={setLoadMoreNode}
          sx={{
            alignItems: 'center',
            color: 'text.secondary',
            display: 'flex',
            gap: 1,
            justifyContent: 'center',
            minHeight: 48,
            py: 2,
          }}
        >
          {articlesQuery.isFetchingNextPage ? (
            <>
              <CircularProgress color="primary" size={18} thickness={5} />
              <Typography variant="body2">Loading more articles</Typography>
            </>
          ) : null}
        </Box>
      </Container>
    </>
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
