import { createFileRoute } from '@tanstack/react-router';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Card,
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

const products = ['Customer Portal', 'Billing Desk'];
const categories = [
  ['Billing', 'Invoices'],
  ['Account', 'Access'],
  ['Settings', 'Notifications'],
];
const articles = [
  ['article', 'Upload invoice attachments', 'Billing / Invoices'],
  ['faq', 'How do I reset account access?', 'Account / Access'],
  ['article', 'Configure notification preferences', 'Settings / Notifications'],
];

export const Route = createFileRoute('/knowledgebase')({
  component: KnowledgebasePage,
});

function KnowledgebasePage() {
  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h1">Knowledgebase</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Search uses regular PostgreSQL text matching by default and upgrades to vector search when
          an OpenAI token is configured.
        </Typography>
      </Box>
      <TextField
        label="Search articles and FAQs"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
      />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h2">Products</Typography>
              <List dense>
                {products.map((product) => (
                  <ListItemButton key={product}>
                    <ListItemText primary={product} />
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
                {categories.map(([parent, child]) => (
                  <ListItemButton key={`${parent}-${child}`}>
                    <ListItemText primary={child} secondary={parent} />
                  </ListItemButton>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={2}>
            {articles.map(([type, article, categoryPath]) => (
              <Card key={article}>
                <CardContent>
                  <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                    <Chip label={type} size="small" />
                    <Chip label={categoryPath} size="small" variant="outlined" />
                  </Stack>
                  <Typography variant="h2">{article}</Typography>
                  <Typography color="text.secondary">
                    Public article detail will render the article or FAQ answer from the API.
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
}
