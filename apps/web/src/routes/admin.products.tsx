import { createFileRoute } from '@tanstack/react-router';
import { Button, Chip, Paper, Stack, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';

const products = ['Customer Portal', 'Billing Desk', 'Agent Console'];

export const Route = createFileRoute('/admin/products')({
  component: AdminProductsPage,
});

function AdminProductsPage() {
  const form = useFormik({
    initialValues: {
      name: 'Customer Portal',
      slug: 'customer-portal',
    },
    onSubmit: () => undefined,
  });

  return (
    <Paper sx={{ p: 3 }}>
      <Stack component="form" onSubmit={form.handleSubmit} spacing={2}>
        <Typography variant="h1">Products</Typography>
        <TextField
          label="Product name"
          name="name"
          onBlur={form.handleBlur}
          onChange={form.handleChange}
          value={form.values.name}
        />
        <TextField
          label="Slug"
          name="slug"
          onBlur={form.handleBlur}
          onChange={form.handleChange}
          value={form.values.slug}
        />
        <Stack direction="row" spacing={1}>
          {products.map((product) => (
            <Chip key={product} label={product} />
          ))}
        </Stack>
        <Button type="submit" variant="contained">
          Save product
        </Button>
      </Stack>
    </Paper>
  );
}
