import { createFileRoute } from '@tanstack/react-router';
import HistoryIcon from '@mui/icons-material/History';
import { Chip, Paper, Stack, Typography } from '@mui/material';
import { EmptyState } from '../components/empty-state';

const auditLogs: Array<readonly [string, string, string, string]> = [
  ['settings.updated', 'admin_setting', 'asifsaho@example.com', '2 minutes ago'],
  ['media.deleted', 'media_asset', 'asifsaho@example.com', '12 minutes ago'],
  ['user.role_updated', 'user', 'asifsaho@example.com', '1 hour ago'],
] as const;

export const Route = createFileRoute('/admin/audit-logs')({
  component: AdminAuditLogsPage,
});

function AdminAuditLogsPage() {
  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <HistoryIcon color="primary" />
        <Typography variant="h1">Audit logs</Typography>
      </Stack>
      {auditLogs.length === 0 ? (
        <EmptyState message="Config changes and deletes will appear here." title="No audit logs" />
      ) : (
        auditLogs.map(([action, targetType, actor, createdAt]) => (
          <Paper key={`${action}-${createdAt}`} sx={{ p: 2 }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1}
              sx={{ justifyContent: 'space-between' }}
            >
              <div>
                <Typography>{action}</Typography>
                <Typography color="text.secondary" variant="body2">
                  {targetType} · {actor}
                </Typography>
              </div>
              <Chip label={createdAt} size="small" />
            </Stack>
          </Paper>
        ))
      )}
    </Stack>
  );
}
