import { createFileRoute, Link } from '@tanstack/react-router';
import GoogleIcon from '@mui/icons-material/Google';
import MailOutlineIcon from '@mui/icons-material/MailOutlineOutlined';
import { Button, Paper, Stack, TextField, Typography } from '@mui/material';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  return (
    <Paper sx={{ maxWidth: 480, mx: 'auto', p: 3 }}>
      <Stack component="form" spacing={2}>
        <Typography variant="h1">Login</Typography>
        <TextField autoComplete="email" label="Email" name="email" type="email" />
        <Button component={Link} startIcon={<MailOutlineIcon />} to="/verify" variant="contained">
          Send OTP
        </Button>
        <Button startIcon={<GoogleIcon />} variant="outlined">
          Continue with Google
        </Button>
      </Stack>
    </Paper>
  );
}
