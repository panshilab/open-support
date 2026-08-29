import { createFileRoute, Link, Outlet, redirect, useRouterState } from '@tanstack/react-router';
import { Box, Stack, Typography } from '@mui/material';
import {
  getCurrentSession,
  useDashboardStatsQuery,
  useRecentTicketsQuery,
} from '@open-support/services';
import type { UserRole } from '@open-support/schemas/user';
import { EmptyState } from '../components/empty-state';
import { TicketStatus } from '../components/ticket-status';
import { PageHeader } from '../components/page-header';

const ALLOWED_ROLES: UserRole[] = ['admin', 'support_agent'];

const ADMIN_SECTIONS: { label: string; to: string; exact?: boolean }[] = [
  { label: 'Overview', to: '/admin', exact: true },
  { label: 'Ticket queue', to: '/admin/tickets' },
  { label: 'Knowledgebase', to: '/admin/knowledgebase' },
  { label: 'Products', to: '/admin/products' },
  { label: 'Categories', to: '/admin/categories' },
  { label: 'Media', to: '/admin/media' },
  { label: 'Staff', to: '/admin/staff' },
  { label: 'Settings', to: '/admin/settings' },
  { label: 'Audit logs', to: '/admin/audit-logs' },
];

export const Route = createFileRoute('/admin')({
  beforeLoad: async ({ context, location }) => {
    if (typeof window === 'undefined') {
      return;
    }

    const session =
      (context as { session?: { user: { role: UserRole } } | null }).session ??
      (await getCurrentSession().catch(() => null));

    if (!session) {
      throw redirect({ to: '/login', search: { redirect: location.href } });
    }

    if (!ALLOWED_ROLES.includes(session.user.role)) {
      throw redirect({ to: '/' });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isOverview = pathname === '/admin';

  return (
    <Box
      sx={{
        display: { md: 'grid' },
        gap: { md: 4 },
        gridTemplateColumns: { md: '200px minmax(0, 1fr)' },
        maxWidth: 1180,
        mx: 'auto',
        pt: 3,
      }}
    >
      <Box
        component="nav"
        aria-label="Admin sections"
        sx={{
          alignSelf: 'start',
          borderBottom: { xs: '1px solid', md: 'none' },
          borderColor: 'rule.main',
          display: 'flex',
          flexDirection: { xs: 'row', md: 'column' },
          gap: { xs: 0, md: 0.25 },
          mb: { xs: 3, md: 0 },
          overflowX: { xs: 'auto', md: 'visible' },
          position: { md: 'sticky' },
          top: { md: 'calc(var(--os-appbar-height) + 24px)' },
        }}
      >
        <Typography
          sx={{ color: 'ink.muted', display: { xs: 'none', md: 'block' }, mb: 1, px: 1.5 }}
          variant="overline"
        >
          Administration
        </Typography>
        {ADMIN_SECTIONS.map((section) => {
          const active = section.exact ? pathname === section.to : pathname.startsWith(section.to);
          return (
            <Typography
              key={section.to}
              component={Link}
              to={section.to}
              sx={{
                borderBottom: { xs: '2px solid', md: 'none' },
                borderBottomColor: active ? 'primary.main' : 'transparent',
                borderLeft: { md: '2px solid' },
                borderLeftColor: { md: active ? 'primary.main' : 'transparent' },
                color: active ? 'ink.strong' : 'ink.muted',
                fontSize: '0.875rem',
                fontWeight: active ? 600 : 500,
                px: 1.5,
                py: 1,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                '&:hover': { color: 'ink.strong' },
              }}
            >
              {section.label}
            </Typography>
          );
        })}
      </Box>

      <Box sx={{ minWidth: 0, pb: 6 }}>{isOverview ? <AdminOverview /> : <Outlet />}</Box>
    </Box>
  );
}

function AdminOverview() {
  const statsQuery = useDashboardStatsQuery();
  const ticketsQuery = useRecentTicketsQuery();
  const stats = statsQuery.data;
  const overviewStats = stats
    ? ([
        ['Open tickets', stats.openTickets],
        ['Resolved tickets', stats.resolvedTickets],
        ['Awaiting reply', stats.customerReplies],
        ['Published articles', stats.articles],
      ] as const)
    : [];
  const recentTickets = ticketsQuery.data ?? [];

  return (
    <Stack spacing={4}>
      <PageHeader title="Overview" />

      <Box
        sx={{
          borderTop: '1px solid',
          borderColor: 'rule.main',
        }}
      >
        {overviewStats.map(([label, value]) => (
          <Stack
            key={label}
            direction="row"
            sx={{
              alignItems: 'baseline',
              borderBottom: '1px solid',
              borderColor: 'rule.main',
              justifyContent: 'space-between',
              py: 1.5,
            }}
          >
            <Typography color="text.secondary" variant="body2">
              {label}
            </Typography>
            <Typography
              sx={{ fontFamily: (t) => t.typography.caption.fontFamily, fontSize: '1.25rem' }}
            >
              {value}
            </Typography>
          </Stack>
        ))}
      </Box>

      <Box>
        <Typography sx={{ mb: 1.5 }} variant="h4">
          Recent tickets
        </Typography>
        {recentTickets.length === 0 ? (
          <EmptyState message="New tickets will show here." title="Queue is clear" />
        ) : (
          <Stack sx={{ borderTop: '1px solid', borderColor: 'rule.main' }}>
            {recentTickets.map((ticket) => (
              <Stack
                key={ticket.id}
                component={Link}
                to="/admin/tickets"
                direction="row"
                sx={{
                  alignItems: 'center',
                  borderBottom: '1px solid',
                  borderColor: 'rule.main',
                  color: 'inherit',
                  justifyContent: 'space-between',
                  py: 1.5,
                  textDecoration: 'none',
                  '&:hover': { bgcolor: 'background.accentWash' },
                }}
              >
                <Box>
                  <Typography variant="body2">{ticket.title}</Typography>
                  <Typography color="text.secondary" variant="caption">
                    {ticket.id}
                  </Typography>
                </Box>
                <TicketStatus status={ticket.status} />
              </Stack>
            ))}
          </Stack>
        )}
      </Box>
    </Stack>
  );
}
