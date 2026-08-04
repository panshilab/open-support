import { createFileRoute, Link } from '@tanstack/react-router';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material';

const tickets = [
  ['TS-1042', 'Cannot upload invoice attachment', 'Customer Portal', 'Billing / Invoices', 'open'],
  [
    'TS-1041',
    'Billing email needs to be changed',
    'Billing Desk',
    'Billing / Contacts',
    'customer_reply',
  ],
  ['TS-1038', 'Workspace invite failed', 'Customer Portal', 'Account / Access', 'resolved'],
];

export const Route = createFileRoute('/admin/tickets')({
  component: AdminTicketsPage,
});

function AdminTicketsPage() {
  return (
    <Stack spacing={2}>
      <Typography variant="h1">Ticket queue</Typography>
      {tickets.map(([id, title, product, categoryPath, status]) => (
        <Paper key={id} sx={{ p: 2 }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            sx={{ justifyContent: 'space-between' }}
          >
            <Box>
              <Typography>{title}</Typography>
              <Typography color="text.secondary" variant="body2">
                {id} · {product} · {categoryPath}
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
                Open
              </Button>
            </Stack>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}
