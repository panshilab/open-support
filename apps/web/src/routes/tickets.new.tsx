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

export const Route = createFileRoute('/tickets/new')({
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
    <Paper sx={{ p: 3 }}>
      <Stack component="form" onSubmit={form.handleSubmit} spacing={2}>
        <Typography variant="h1">New ticket</Typography>
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
        <TextField
          label="Message"
          minRows={6}
          multiline
          name="descriptionHtml"
          onBlur={form.handleBlur}
          onChange={form.handleChange}
          value={form.values.descriptionHtml}
        />
        <Button type="submit" variant="contained">
          Create ticket
        </Button>
      </Stack>
    </Paper>
  );
}
