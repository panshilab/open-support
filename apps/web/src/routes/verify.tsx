import { createFileRoute, Link } from '@tanstack/react-router';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Button, Paper, Stack, TextField, Typography } from '@mui/material';

export const Route = createFileRoute('/verify')({
  component: VerifyPage,
});

function VerifyPage() {
  return (
    <Paper sx={{ maxWidth: 480, mx: 'auto', p: 3 }}>
      <Stack component="form" spacing={2}>
        <Typography variant="h1">Verify OTP</Typography>
        <TextField label="Email" name="email" type="email" />
        <TextField label="Code" name="otp" slotProps={{ htmlInput: { maxLength: 6 } }} />
        <Button component={Link} startIcon={<CheckCircleIcon />} to="/tickets" variant="contained">
          Verify and continue
        </Button>
      </Stack>
    </Paper>
  );
}
