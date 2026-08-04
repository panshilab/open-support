import { createFileRoute } from '@tanstack/react-router';
import { Button, Chip, Paper, Stack, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';

export const Route = createFileRoute('/admin/categories')({
  component: AdminCategoriesPage,
});

function AdminCategoriesPage() {
  const form = useFormik({
    initialValues: {
      productName: 'Customer Portal',
      parentName: 'Billing',
      name: 'Invoices',
    },
    onSubmit: () => undefined,
  });

  return (
    <Paper sx={{ p: 3 }}>
      <Stack component="form" onSubmit={form.handleSubmit} spacing={2}>
        <Typography variant="h1">Categories</Typography>
        <TextField
          label="Product"
          name="productName"
          onBlur={form.handleBlur}
          onChange={form.handleChange}
          value={form.values.productName}
        />
        <TextField
          label="Parent category"
          name="parentName"
          onBlur={form.handleBlur}
          onChange={form.handleChange}
          value={form.values.parentName}
        />
        <TextField
          label="Category name"
          name="name"
          onBlur={form.handleBlur}
          onChange={form.handleChange}
          value={form.values.name}
        />
        <Stack direction="row" spacing={1}>
          <Chip label="Billing" />
          <Chip label="Billing / Invoices" />
          <Chip label="Account / Access" />
        </Stack>
        <Button type="submit" variant="contained">
          Save category
        </Button>
      </Stack>
    </Paper>
  );
}
