import { createFileRoute } from '@tanstack/react-router';
import { Button, Chip, Paper, Stack, TextField, Typography } from '@mui/material';

export const Route = createFileRoute('/admin/categories')({
  component: AdminCategoriesPage,
});

function AdminCategoriesPage() {
  return (
    <Paper sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h1">Categories</Typography>
        <TextField label="Product" value="Customer Portal" />
        <TextField label="Parent category" value="Billing" />
        <TextField label="Category name" value="Invoices" />
        <Stack direction="row" spacing={1}>
          <Chip label="Billing" />
          <Chip label="Billing / Invoices" />
          <Chip label="Account / Access" />
        </Stack>
        <Button variant="contained">Save category</Button>
      </Stack>
    </Paper>
  );
}
