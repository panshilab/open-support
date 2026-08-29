import { createFileRoute } from '@tanstack/react-router';
import HistoryIcon from '@mui/icons-material/History';
import { Chip, Paper, Stack, Typography } from '@mui/material';
import { useAuditLogsQuery } from '@open-support/services';
import { EmptyState } from '../components/empty-state';

export const Route = createFileRoute('/admin/audit-logs')({
  component: AdminAuditLogsPage,
});

function AdminAuditLogsPage() {
  const auditLogsQuery = useAuditLogsQuery({ limit: 50, page: 1 });
  const auditLogs = auditLogsQuery.data ?? [];

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <HistoryIcon color="primary" />
        <Typography variant="h1">Audit logs</Typography>
      </Stack>
      {auditLogs.length === 0 ? (
        <EmptyState message="Config changes and deletes will appear here." title="No audit logs" />
      ) : (
        auditLogs.map((log) => (
          <Paper key={log.id} sx={{ p: 2 }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1}
              sx={{ justifyContent: 'space-between' }}
            >
              <div>
                <Typography>{log.action}</Typography>
                <Typography color="text.secondary" variant="body2">
                  {log.targetType} · {log.actorEmail}
                </Typography>
              </div>
              <Chip label={new Date(log.createdAt).toLocaleString()} size="small" />
            </Stack>
          </Paper>
        ))
      )}
    </Stack>
  );
}
