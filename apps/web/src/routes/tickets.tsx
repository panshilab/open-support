import { createFileRoute, Link } from '@tanstack/react-router';
import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material';

const tickets = [
  ['TS-1042', 'Cannot upload invoice attachment', 'open'],
  ['TS-1041', 'Billing email needs to be changed', 'pending'],
  ['TS-1038', 'Workspace invite failed', 'resolved'],
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
      {tickets.map(([id, title, status]) => (
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
                {id}
              </Typography>
            </Box>
            <Chip label={status} size="small" />
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}
