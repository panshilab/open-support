import InboxIcon from '@mui/icons-material/Inbox';
import { Paper, Stack, Typography } from '@mui/material';

export function EmptyState({ title, message }: Readonly<{ title: string; message: string }>) {
  return (
    <Paper sx={{ p: 3, textAlign: 'center' }} variant="outlined">
      <Stack spacing={1} sx={{ alignItems: 'center' }}>
        <InboxIcon color="disabled" />
        <Typography variant="h2">{title}</Typography>
        <Typography color="text.secondary">{message}</Typography>
      </Stack>
    </Paper>
  );
}
