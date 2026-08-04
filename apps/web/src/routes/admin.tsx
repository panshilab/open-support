import { createFileRoute, Link } from '@tanstack/react-router';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CategoryIcon from '@mui/icons-material/Category';
import GroupsIcon from '@mui/icons-material/Groups';
import HistoryIcon from '@mui/icons-material/History';
import InventoryIcon from '@mui/icons-material/Inventory';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import SettingsIcon from '@mui/icons-material/Settings';
import StorageIcon from '@mui/icons-material/Storage';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import type { UserRole } from '@open-support/schemas/user';

const stats = [
  ['Open tickets', '14'],
  ['Resolved tickets', '82'],
  ['Customer replies', '4'],
  ['Articles', '36'],
  ['Media assets', '19'],
  ['Online staff', '3'],
] as const;

const recentTickets = [
  ['TS-1048', 'Invoice upload fails', 'customer_reply'],
  ['TS-1047', 'Account invite expired', 'open'],
  ['TS-1042', 'Billing email needs update', 'replied'],
];

const adminCards = [
  ['Products', '/admin/products', <InventoryIcon key="products" />],
  ['Knowledgebase', '/admin/knowledgebase', <StorageIcon key="kb" />],
  ['Categories', '/admin/categories', <CategoryIcon key="categories" />],
  ['Ticket queue', '/admin/tickets', <SupportAgentIcon key="tickets" />],
  ['Media', '/admin/media', <PhotoLibraryIcon key="media" />],
  ['Staff', '/admin/staff', <GroupsIcon key="staff" />],
  ['Settings', '/admin/settings', <SettingsIcon key="settings" />],
  ['Audit logs', '/admin/audit-logs', <HistoryIcon key="audit" />],
] as const;

export const Route = createFileRoute('/admin')({
  component: AdminPage,
});

function AdminPage() {
  const allowedRoles: UserRole[] = ['admin', 'support_agent'];

  return (
    <Stack spacing={3}>
      <Box>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <AssessmentIcon color="primary" />
          <Typography variant="h1">Dashboard</Typography>
        </Stack>
        <Typography color="text.secondary">Allowed roles: {allowedRoles.join(', ')}</Typography>
      </Box>
      <Grid container spacing={2}>
        {stats.map(([label, value]) => (
          <Grid key={label} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent>
                <Typography color="text.secondary">{label}</Typography>
                <Typography variant="h4">{value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 2 }}>
            <Typography sx={{ mb: 2 }} variant="h2">
              Recent tickets
            </Typography>
            <Stack spacing={1}>
              {recentTickets.map(([id, title, status]) => (
                <Paper key={id} sx={{ p: 1.5 }} variant="outlined">
                  <Stack
                    direction="row"
                    sx={{ alignItems: 'center', justifyContent: 'space-between' }}
                  >
                    <Box>
                      <Typography>{title}</Typography>
                      <Typography color="text.secondary" variant="body2">
                        {id}
                      </Typography>
                    </Box>
                    <Chip label={status} size="small" />
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 2 }}>
            <Typography sx={{ mb: 2 }} variant="h2">
              Operations
            </Typography>
            <Grid container spacing={1.5}>
              {adminCards.map(([label, to, icon]) => (
                <Grid key={to} size={{ xs: 12, sm: 6 }}>
                  <Card variant="outlined">
                    <CardActionArea component={Link} sx={{ height: '100%' }} to={to}>
                      <CardContent>
                        <Stack spacing={1}>
                          {icon}
                          <Typography>{label}</Typography>
                        </Stack>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
}
