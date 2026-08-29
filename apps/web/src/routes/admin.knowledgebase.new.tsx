import { createFileRoute } from '@tanstack/react-router';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { useFormik } from 'formik';
import { RichTextEditor } from '../components/rich-text-editor';
import { PageHeader } from '../components/page-header';
import { Surface } from '../components/surface';

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
    <Stack spacing={4}>
      <PageHeader title="New article" />
      <Surface component="form" onSubmit={form.handleSubmit}>
        <Stack spacing={2}>
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
        <RichTextEditor
          label="Article content or FAQ answer"
          minHeight={280}
          onBlur={() => form.setFieldTouched('contentHtml', true)}
          onChange={(value) => form.setFieldValue('contentHtml', value)}
          placeholder="Write the article body or FAQ answer..."
          value={form.values.contentHtml}
        />
        <Button type="submit" variant="contained">
          Save article
        </Button>
        </Stack>
      </Surface>
    </Stack>
  );
}
