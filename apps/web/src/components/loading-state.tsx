import { LinearProgress, Paper, Stack, Typography } from '@mui/material';

export function LoadingState({ label = 'Loading' }: Readonly<{ label?: string }>) {
  return (
    <Paper sx={{ p: 2 }} variant="outlined">
      <Stack spacing={1}>
        <Typography color="text.secondary">{label}</Typography>
        <LinearProgress />
      </Stack>
    </Paper>
  );
}
