import { createFileRoute } from '@tanstack/react-router';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

export const Route = createFileRoute('/admin/knowledgebase/new')({
  component: NewKnowledgebaseEntryPage,
});

function NewKnowledgebaseEntryPage() {
  return (
    <Paper sx={{ p: 3 }}>
      <Stack component="form" spacing={2}>
        <Typography variant="h1">New article</Typography>
        <FormControl>
          <InputLabel id="article-type-label">Type</InputLabel>
          <Select label="Type" labelId="article-type-label" value="article">
            <MenuItem value="article">Article</MenuItem>
            <MenuItem value="faq">FAQ</MenuItem>
          </Select>
        </FormControl>
        <TextField label="Product" value="Customer Portal" />
        <TextField label="Category" value="Billing / Invoices" />
        <TextField label="Title" />
        <TextField label="FAQ question" />
        <TextField label="Article content or FAQ answer" minRows={10} multiline />
        <Button variant="contained">Save article</Button>
      </Stack>
    </Paper>
  );
}
