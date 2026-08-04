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
import { useFormik } from 'formik';

export const Route = createFileRoute('/admin/knowledgebase/new')({
  component: NewKnowledgebaseEntryPage,
});

function NewKnowledgebaseEntryPage() {
  const form = useFormik({
    initialValues: {
      type: 'article',
      productName: 'Customer Portal',
      categoryPath: 'Billing / Invoices',
      title: '',
      question: '',
      contentHtml: '',
    },
    onSubmit: () => undefined,
  });

  return (
    <Paper sx={{ p: 3 }}>
      <Stack component="form" onSubmit={form.handleSubmit} spacing={2}>
        <Typography variant="h1">New article</Typography>
        <FormControl>
          <InputLabel id="article-type-label">Type</InputLabel>
          <Select
            label="Type"
            labelId="article-type-label"
            name="type"
            onChange={form.handleChange}
            value={form.values.type}
          >
            <MenuItem value="article">Article</MenuItem>
            <MenuItem value="faq">FAQ</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Product"
          name="productName"
          onBlur={form.handleBlur}
          onChange={form.handleChange}
          value={form.values.productName}
        />
        <TextField
          label="Category"
          name="categoryPath"
          onBlur={form.handleBlur}
          onChange={form.handleChange}
          value={form.values.categoryPath}
        />
        <TextField
          label="Title"
          name="title"
          onBlur={form.handleBlur}
          onChange={form.handleChange}
          value={form.values.title}
        />
        <TextField
          label="FAQ question"
          name="question"
          onBlur={form.handleBlur}
          onChange={form.handleChange}
          value={form.values.question}
        />
        <TextField
          label="Article content or FAQ answer"
          minRows={10}
          multiline
          name="contentHtml"
          onBlur={form.handleBlur}
          onChange={form.handleChange}
          value={form.values.contentHtml}
        />
        <Button type="submit" variant="contained">
          Save article
        </Button>
      </Stack>
    </Paper>
  );
}
