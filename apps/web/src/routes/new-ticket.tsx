import { createFileRoute } from '@tanstack/react-router';
import { Alert, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { RichTextEditor } from '../components/rich-text-editor';
import { PageHeader, PrimaryAction } from '../components/page-header';
import { Surface } from '../components/surface';

export const Route = createFileRoute('/new-ticket')({
  component: NewTicketPage,
});

function NewTicketPage() {
  const form = useFormik({
    initialValues: {
      productId: 'customer-portal',
      categoryId: 'billing-invoices',
      title: 'Cannot upload invoice attachment',
      descriptionHtml: '',
    },
    onSubmit: () => undefined,
  });

  return (
    <Surface sx={{ maxWidth: 780, mx: 'auto', my: { xs: 3, md: 6 } }}>
      <Stack component="form" onSubmit={form.handleSubmit} spacing={2}>
        <PageHeader
          description="Tell us what happened and our team will pick it up from there."
          title="Start a conversation"
        />
        <Alert severity="info">
          Include the product, what you expected, and what happened instead. We’ll use your message
          to route the right support guidance and team.
        </Alert>
        <FormControl>
          <InputLabel id="product-label">Product</InputLabel>
          <Select
            label="Product"
            labelId="product-label"
            name="productId"
            onChange={form.handleChange}
            value={form.values.productId}
          >
            <MenuItem value="customer-portal">Customer Portal</MenuItem>
            <MenuItem value="billing-desk">Billing Desk</MenuItem>
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            label="Category"
            labelId="category-label"
            name="categoryId"
            onChange={form.handleChange}
            value={form.values.categoryId}
          >
            <MenuItem value="billing-invoices">Billing / Invoices</MenuItem>
            <MenuItem value="billing-contacts">Billing / Contacts</MenuItem>
            <MenuItem value="account-access">Account / Access</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Subject"
          name="title"
          onBlur={form.handleBlur}
          onChange={form.handleChange}
          value={form.values.title}
        />
        <RichTextEditor
          label="Message"
          onBlur={() => form.setFieldTouched('descriptionHtml', true)}
          onChange={(value) => form.setFieldValue('descriptionHtml', value)}
          placeholder="Describe the issue..."
          value={form.values.descriptionHtml}
        />
        <PrimaryAction type="submit" sx={{ alignSelf: 'flex-start', mt: 1 }}>
          Create ticket
        </PrimaryAction>
      </Stack>
    </Surface>
  );
}
