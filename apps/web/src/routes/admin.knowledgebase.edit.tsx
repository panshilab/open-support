import { createFileRoute } from '@tanstack/react-router';
import { Button, Chip, Paper, Stack, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';

export const Route = createFileRoute('/admin/knowledgebase/edit')({
  component: EditKnowledgebaseEntryPage,
});

function EditKnowledgebaseEntryPage() {
  const form = useFormik({
    initialValues: {
      productName: 'Customer Portal',
      categoryPath: 'Billing / Invoices',
      title: 'Upload invoice attachments',
      contentHtml: 'Supported files include PDF and PNG.',
    },
    onSubmit: () => undefined,
  });

  return (
    <Paper sx={{ p: 3 }}>
      <Stack component="form" onSubmit={form.handleSubmit} spacing={2}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Typography variant="h1">Edit article</Typography>
          <Chip label="article" />
          <Chip color="secondary" label="vector ready" />
        </Stack>
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
          label="Article content"
          minRows={10}
          multiline
          name="contentHtml"
          onBlur={form.handleBlur}
          onChange={form.handleChange}
          value={form.values.contentHtml}
        />
        <Button type="submit" variant="contained">
          Update article
        </Button>
      </Stack>
    </Paper>
  );
}
