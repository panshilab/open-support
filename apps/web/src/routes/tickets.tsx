import { createFileRoute, Link } from '@tanstack/react-router';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material';

const tickets = [
  ['TS-1042', 'Cannot upload invoice attachment', 'Billing / Invoices', 'open'],
  ['TS-1041', 'Billing email needs to be changed', 'Billing / Contacts', 'customer_reply'],
  ['TS-1038', 'Workspace invite failed', 'Account / Access', 'resolved'],
];

export const Route = createFileRoute('/tickets')({
  component: TicketsPage,
});

function TicketsPage() {
  return (
    <Stack spacing={2}>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h1">Tickets</Typography>
        <Button component={Link} startIcon={<AddIcon />} to="/tickets/new" variant="contained">
          New ticket
        </Button>
      </Stack>
      {tickets.map(([id, title, categoryPath, status]) => (
        <Paper key={id} sx={{ p: 2 }}>
          <Stack
            direction="row"
            spacing={2}
            sx={{ alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Box>
              <Typography
                component={Link}
                sx={{ color: 'primary.main' }}
                to={`/tickets/${id}` as '/tickets/$ticketId'}
              >
                {title}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {id} · {categoryPath}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Chip label={status} size="small" />
              <Button
                component={Link}
                size="small"
                startIcon={<VisibilityIcon />}
                to={`/tickets/${id}` as '/tickets/$ticketId'}
              >
                View
              </Button>
            </Stack>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}
