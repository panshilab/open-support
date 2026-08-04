import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { Paper, Stack, Typography } from '@mui/material';

export function ErrorState({ message }: Readonly<{ message: string }>) {
  return (
    <Paper sx={{ borderColor: 'error.light', p: 2 }} variant="outlined">
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <ErrorOutlineIcon color="error" />
        <Typography color="error.main">{message}</Typography>
      </Stack>
    </Paper>
  );
}
