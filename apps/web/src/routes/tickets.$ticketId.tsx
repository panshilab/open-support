import { createFileRoute } from '@tanstack/react-router';
import { Chip, Divider, Paper, Stack, TextField, Button, Typography } from '@mui/material';

export const Route = createFileRoute('/tickets/$ticketId')({
  component: TicketDetailPage,
});

function TicketDetailPage() {
  const { ticketId } = Route.useParams();

  return (
    <Stack spacing={2}>
      <Paper sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between' }}>
          <div>
            <Typography variant="h1">Ticket {ticketId}</Typography>
            <Typography color="text.secondary">Billing / Invoices</Typography>
          </div>
          <Chip color="warning" label="open" />
        </Stack>
      </Paper>
      <Paper sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Typography variant="h2">Conversation</Typography>
          <Divider />
          <Typography>Customer: I cannot upload an invoice PDF.</Typography>
          <Typography>Agent: We are checking the attachment service.</Typography>
          <TextField label="Reply" minRows={4} multiline />
          <Button variant="contained">Send reply</Button>
        </Stack>
      </Paper>
    </Stack>
  );
}
