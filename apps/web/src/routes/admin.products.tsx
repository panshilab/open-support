import { createFileRoute } from '@tanstack/react-router';
import { Button, Chip, Paper, Stack, TextField, Typography } from '@mui/material';

const products = ['Customer Portal', 'Billing Desk', 'Agent Console'];

export const Route = createFileRoute('/admin/products')({
  component: AdminProductsPage,
});

function AdminProductsPage() {
  return (
    <Paper sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h1">Products</Typography>
        <TextField label="Product name" value="Customer Portal" />
        <TextField label="Slug" value="customer-portal" />
        <Stack direction="row" spacing={1}>
          {products.map((product) => (
            <Chip key={product} label={product} />
          ))}
        </Stack>
        <Button variant="contained">Save product</Button>
      </Stack>
    </Paper>
  );
}
