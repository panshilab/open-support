import { useEffect, useMemo, useState } from 'react';
import { Link, Outlet, createFileRoute, useRouterState } from '@tanstack/react-router';
import SearchIcon from '@mui/icons-material/Search';
import {
  Alert,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Grid,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { EmptyState } from '../components/empty-state';
import { ErrorState } from '../components/error-state';
import { LoadingState } from '../components/loading-state';

interface Product {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  path: string;
  children?: Category[];
}

interface KnowledgebaseArticle {
  id: string;
  name: string;
  type: 'article' | 'faq';
  excerpt: string | null;
  categoryPath: string | null;
  updatedAt: string;
}

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
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [articles, setArticles] = useState<KnowledgebaseArticle[]>([]);
  const [productId, setProductId] = useState<string | undefined>();
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [query, setQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'text' | 'vector' | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const flatCategories = useMemo(() => flattenCategories(categories), [categories]);

  useEffect(() => {
    let cancelled = false;

    async function loadFilters() {
      const [productsResponse, categoriesResponse] = await Promise.all([
        fetch('/api/knowledgebase/products'),
        fetch(
          productId
            ? `/api/knowledgebase/categories?productId=${productId}`
            : '/api/knowledgebase/categories',
        ),
      ]);

      if (!productsResponse.ok || !categoriesResponse.ok) {
        throw new Error('Unable to load knowledgebase filters');
      }

      if (!cancelled) {
        setProducts((await productsResponse.json()) as Product[]);
        setCategories((await categoriesResponse.json()) as Category[]);
      }
    }

    loadFilters().catch(() => {
      if (!cancelled) {
        setError('Unable to load knowledgebase filters');
      }
    });

    return () => {
      cancelled = true;
    };
  }, [productId]);

  useEffect(() => {
    let cancelled = false;

    async function loadArticles() {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();

      if (query.trim()) {
        params.set('query', query.trim());
      }

      if (productId) {
        params.set('productId', productId);
      }

      if (categoryId) {
        params.set('categoryId', categoryId);
      }

      const url = query.trim()
        ? `/api/knowledgebase/search?${params.toString()}`
        : '/api/knowledgebase/articles';
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Unable to load knowledgebase articles');
      }

      const payload = (await response.json()) as
        | KnowledgebaseArticle[]
        | { mode: 'text' | 'vector'; results: KnowledgebaseArticle[] };

      if (!cancelled) {
        setArticles(Array.isArray(payload) ? payload : payload.results);
        setSearchMode(Array.isArray(payload) ? null : payload.mode);
        setLoading(false);
      }
    }

    loadArticles().catch(() => {
      if (!cancelled) {
        setError('Unable to load knowledgebase articles');
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [categoryId, productId, query]);

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h1">Knowledgebase</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Browse ecommerce help articles and FAQs.
        </Typography>
      </Box>
      <TextField
        label="Search articles and FAQs"
        onChange={(event) => setQuery(event.target.value)}
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
      {searchMode ? (
        <Alert severity="info">Search mode: {searchMode === 'vector' ? 'vector' : 'text'}</Alert>
      ) : null}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h2">Products</Typography>
              <List dense>
                <ListItemButton
                  selected={!productId}
                  onClick={() => {
                    setProductId(undefined);
                    setCategoryId(undefined);
                  }}
                >
                  <ListItemText primary="All products" />
                </ListItemButton>
                {products.map((product) => (
                  <ListItemButton
                    key={product.id}
                    selected={productId === product.id}
                    onClick={() => {
                      setProductId(product.id);
                      setCategoryId(undefined);
                    }}
                  >
                    <ListItemText primary={product.name} />
                  </ListItemButton>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h2">Categories</Typography>
              <List dense>
                <ListItemButton selected={!categoryId} onClick={() => setCategoryId(undefined)}>
                  <ListItemText primary="All categories" />
                </ListItemButton>
                {flatCategories.map((category) => (
                  <ListItemButton
                    key={category.id}
                    selected={categoryId === category.id}
                    onClick={() => setCategoryId(category.id)}
                  >
                    <ListItemText primary={category.name} secondary={category.path} />
                  </ListItemButton>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {loading ? <LoadingState label="Loading articles" /> : null}
          {error ? <ErrorState message={error} /> : null}
          {!loading && !error && articles.length === 0 ? (
            <EmptyState
              message="Try another product, category, or search term."
              title="No knowledgebase entries found"
            />
          ) : null}
          <Stack spacing={2}>
            {articles.map((article) => (
              <Link
                key={article.id}
                params={{ articleId: article.id }}
                style={{ color: 'inherit', textDecoration: 'none' }}
                to="/knowledgebase/$articleId"
              >
                <Card>
                  <CardActionArea>
                    <CardContent>
                      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                        <Chip label={article.type} size="small" />
                        {article.categoryPath ? (
                          <Chip label={article.categoryPath} size="small" variant="outlined" />
                        ) : null}
                      </Stack>
                      <Typography variant="h2">{article.name}</Typography>
                      <Typography color="text.secondary">
                        {article.excerpt ?? 'Open this entry to read the full answer.'}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Link>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
}

function flattenCategories(categories: Category[]): Category[] {
  return categories.flatMap((category) => [
    category,
    ...flattenCategories(category.children ?? []),
  ]);
}
