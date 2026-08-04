import { createFileRoute } from '@tanstack/react-router';
import { Button, Paper, Stack, TextField, Typography } from '@mui/material';

export const Route = createFileRoute('/admin/categories')({
  component: AdminCategoriesPage,
});

function AdminCategoriesPage() {
  return (
    <Paper sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h1">Categories</Typography>
        <TextField label="Parent category" value="Billing" />
        <TextField label="Child category" value="Invoices" />
        <Button variant="contained">Save category</Button>
      </Stack>
    </Paper>
  );
}
