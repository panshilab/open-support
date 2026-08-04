import { createFileRoute } from '@tanstack/react-router';
import {
  Button,
  Chip,
  Divider,
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

export const Route = createFileRoute('/tickets/$ticketId')({
  component: TicketDetailPage,
});

function TicketDetailPage() {
  const { ticketId } = Route.useParams();
  const statusForm = useFormik({
    initialValues: {
      status: 'open',
    },
    onSubmit: () => undefined,
  });
  const replyForm = useFormik({
    initialValues: {
      contentHtml: '',
    },
    onSubmit: () => undefined,
  });

  return (
    <Stack spacing={2}>
      <Paper sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between' }}>
          <div>
            <Typography variant="h1">Ticket {ticketId}</Typography>
            <Typography color="text.secondary">
              Customer Portal · Billing / Invoices · customer seen, staff unseen
            </Typography>
          </div>
          <Chip color="warning" label="open" />
        </Stack>
      </Paper>
      <Paper sx={{ p: 3 }}>
        <Stack
          component="form"
          direction={{ xs: 'column', md: 'row' }}
          onSubmit={statusForm.handleSubmit}
          spacing={2}
        >
          <FormControl fullWidth>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              label="Status"
              labelId="status-label"
              name="status"
              onChange={statusForm.handleChange}
              value={statusForm.values.status}
            >
              <MenuItem value="open">Open</MenuItem>
              <MenuItem value="customer_reply">Customer reply</MenuItem>
              <MenuItem value="replied">Replied</MenuItem>
              <MenuItem value="resolved">Resolved</MenuItem>
            </Select>
          </FormControl>
          <Button type="submit" variant="outlined">
            Update status
          </Button>
          <Button variant="outlined">Mark seen</Button>
        </Stack>
      </Paper>
      <Paper sx={{ p: 3 }}>
        <Stack component="form" onSubmit={replyForm.handleSubmit} spacing={2}>
          <Typography variant="h2">Conversation</Typography>
          <Divider />
          <Typography>
            Customer: I cannot upload an invoice PDF from the billing dashboard.
          </Typography>
          <Typography>Agent: We are checking the attachment service and file limits.</Typography>
          <TextField
            label="Reply"
            minRows={4}
            multiline
            name="contentHtml"
            onBlur={replyForm.handleBlur}
            onChange={replyForm.handleChange}
            value={replyForm.values.contentHtml}
          />
          <Button type="submit" variant="contained">
            Send reply
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
}
