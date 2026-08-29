import { createFileRoute } from '@tanstack/react-router';
import { Box, Button, Stack, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { RichTextEditor } from '../components/rich-text-editor';
import { PageHeader } from '../components/page-header';
import { Surface } from '../components/surface';

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
    <Stack spacing={4}>
      <PageHeader title="Edit article" />
      <Stack direction="row" spacing={1} sx={{ mt: -2 }}>
        <Tag>article</Tag>
        <Tag>vector ready</Tag>
      </Stack>
      <Surface component="form" onSubmit={form.handleSubmit}>
        <Stack spacing={2}>
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
          <RichTextEditor
            label="Article content"
            minHeight={280}
            onBlur={() => form.setFieldTouched('contentHtml', true)}
            onChange={(value) => form.setFieldValue('contentHtml', value)}
            placeholder="Write the article content..."
            value={form.values.contentHtml}
          />
          <Button type="submit" variant="contained">
            Update article
          </Button>
        </Stack>
      </Surface>
    </Stack>
  );
}

function Tag({ children }: Readonly<{ children: string }>) {
  return (
    <Box
      component="span"
      sx={{
        border: '1px solid',
        borderColor: 'rule.main',
        borderRadius: '2px',
        color: 'ink.muted',
        fontFamily: (t) => t.typography.caption.fontFamily,
        fontSize: '0.6875rem',
        letterSpacing: '0.06em',
        px: 0.75,
        py: '3px',
        textTransform: 'uppercase',
      }}
    >
      {children}
    </Box>
  );
}
