import { createFileRoute, Link } from '@tanstack/react-router';
import CategoryIcon from '@mui/icons-material/Category';
import GroupsIcon from '@mui/icons-material/Groups';
import SettingsIcon from '@mui/icons-material/Settings';
import StorageIcon from '@mui/icons-material/Storage';
import { Card, CardActionArea, CardContent, Grid, Stack, Typography } from '@mui/material';
import type { UserRole } from '@open-support/schemas/user';

const adminCards = [
  ['Knowledgebase', '/admin/knowledgebase', <StorageIcon key="kb" />],
  ['Categories', '/admin/categories', <CategoryIcon key="categories" />],
  ['Staff', '/admin/staff', <GroupsIcon key="staff" />],
  ['Settings', '/admin/settings', <SettingsIcon key="settings" />],
] as const;

export const Route = createFileRoute('/admin')({
  component: AdminPage,
});

function AdminPage() {
  const allowedRoles: UserRole[] = ['admin', 'support_agent'];

  return (
    <Stack spacing={2}>
      <Typography variant="h1">Admin</Typography>
      <Typography color="text.secondary">Allowed roles: {allowedRoles.join(', ')}</Typography>
      <Grid container spacing={2}>
        {adminCards.map(([label, to, icon]) => (
          <Grid key={to} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardActionArea component={Link} sx={{ height: '100%' }} to={to}>
                <CardContent>
                  <Stack spacing={1}>
                    {icon}
                    <Typography variant="h2">{label}</Typography>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
