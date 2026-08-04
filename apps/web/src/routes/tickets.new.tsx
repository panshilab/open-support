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

export const Route = createFileRoute('/tickets/new')({
  component: NewTicketPage,
});

function NewTicketPage() {
  return (
    <Paper sx={{ p: 3 }}>
      <Stack component="form" spacing={2}>
        <Typography variant="h1">New ticket</Typography>
        <FormControl>
          <InputLabel id="category-label">Category</InputLabel>
          <Select label="Category" labelId="category-label" value="billing-invoices">
            <MenuItem value="billing">Billing</MenuItem>
            <MenuItem value="billing-invoices">Billing / Invoices</MenuItem>
            <MenuItem value="account-access">Account / Access</MenuItem>
          </Select>
        </FormControl>
        <TextField label="Subject" />
        <TextField label="Message" minRows={6} multiline />
        <Button variant="contained">Create ticket</Button>
      </Stack>
    </Paper>
  );
}
