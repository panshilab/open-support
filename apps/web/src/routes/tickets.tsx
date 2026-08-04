import { useCallback, useMemo, useState } from 'react';
import { createFileRoute, Link, Outlet, useRouterState } from '@tanstack/react-router';
import AddIcon from '@mui/icons-material/Add';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  Chip,
  Container,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import type { ChangeEvent } from 'react';
import { EmptyState } from '../components/empty-state';
import { TICKET_STATUS_META } from '../components/ticket-status';
import { primaryAlpha } from '../theme';

const tickets = [
  ['TS-1042', 'Cannot upload invoice attachment', 'Billing / Invoices', 'open'],
  ['TS-1041', 'Billing email needs to be changed', 'Billing / Contacts', 'customer_reply'],
  ['TS-1038', 'Workspace invite failed', 'Account / Access', 'resolved'],
] as const;

export const Route = createFileRoute('/tickets')({
  component: TicketsPage,
});

function TicketsPage() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  if (pathname !== '/tickets') {
    return <Outlet />;
  }

  return <TicketsIndexPage />;
}

function TicketsIndexPage() {
  const [query, setQuery] = useState('');
  const trimmedQuery = query.trim().toLowerCase();

  const filteredTickets = useMemo(() => {
    if (!trimmedQuery) {
      return tickets;
    }

    return tickets.filter(
      ([id, title, categoryPath]) =>
        id.toLowerCase().includes(trimmedQuery) ||
        title.toLowerCase().includes(trimmedQuery) ||
        categoryPath.toLowerCase().includes(trimmedQuery),
    );
  }, [trimmedQuery]);

  const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ pb: 4, pt: 3 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ alignItems: { sm: 'flex-end' }, justifyContent: 'space-between', mb: 3 }}
      >
        <Box>
          <Typography variant="h1">Tickets</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Track and follow up on your support requests.
          </Typography>
        </Box>
        <Button
          component={Link}
          size="large"
          startIcon={<AddIcon />}
          to="/new-ticket"
          variant="contained"
        >
          New ticket
        </Button>
      </Stack>

      <TextField
        fullWidth
        onChange={handleSearchChange}
        placeholder="Search by ticket, subject, or category"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
        sx={{ mb: 2.5 }}
        value={query}
      />

      {filteredTickets.length === 0 ? (
        <EmptyState
          message="Try a different search term, or open a new ticket."
          title="No tickets found"
        />
      ) : (
        <Paper sx={{ overflow: 'hidden' }}>
          <Stack divider={<Box sx={{ borderBottom: 1, borderColor: 'divider' }} />}>
            {filteredTickets.map(([id, title, categoryPath, status]) => {
              const statusMeta = TICKET_STATUS_META[status];

              return (
                <Link
                  key={id}
                  params={{ ticketId: id }}
                  style={{ color: 'inherit', display: 'block', textDecoration: 'none' }}
                  to="/tickets/$ticketId"
                >
                  <Box
                    sx={{
                      alignItems: 'center',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 2,
                      justifyContent: 'space-between',
                      px: { xs: 2, md: 3 },
                      py: 2,
                      transition: 'background-color 120ms ease',
                      '&:hover': { bgcolor: primaryAlpha[4] },
                      '&:hover .ticket-row-arrow': { transform: 'translateX(2px)' },
                    }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography noWrap sx={{ fontWeight: 650 }}>
                        {title}
                      </Typography>
                      <Typography color="text.secondary" variant="body2">
                        {id} · {categoryPath}
                      </Typography>
                    </Box>
                    <Stack
                      direction="row"
                      spacing={1.5}
                      sx={{ alignItems: 'center', flexShrink: 0 }}
                    >
                      <Chip
                        label={statusMeta.label}
                        size="small"
                        sx={{
                          bgcolor: statusMeta.bg,
                          color: statusMeta.fg,
                          fontWeight: 650,
                        }}
                      />
                      <ChevronRightIcon
                        className="ticket-row-arrow"
                        sx={{ color: 'text.secondary', transition: 'transform 120ms ease' }}
                      />
                    </Stack>
                  </Box>
                </Link>
              );
            })}
          </Stack>
        </Paper>
      )}
    </Container>
  );
}
