import { createFileRoute } from '@tanstack/react-router';
import SearchIcon from '@mui/icons-material/Search';
import { Card, CardContent, InputAdornment, Stack, TextField, Typography } from '@mui/material';

const articles = [
  'Reset account access',
  'Upload invoice attachments',
  'Change billing contact',
  'Configure notification preferences',
];

export const Route = createFileRoute('/knowledgebase')({
  component: KnowledgebasePage,
});

function KnowledgebasePage() {
  return (
    <Stack spacing={2}>
      <Typography variant="h1">Knowledgebase</Typography>
      <TextField
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
        label="Search articles"
      />
      {articles.map((article) => (
        <Card key={article}>
          <CardContent>
            <Typography variant="h2">{article}</Typography>
            <Typography color="text.secondary">
              Vector search will match this entry against ticket context and customer queries.
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
