import { createFileRoute, useNavigate } from '@tanstack/react-router';
import GoogleIcon from '@mui/icons-material/Google';
import MailOutlineIcon from '@mui/icons-material/MailOutlineOutlined';
import PasswordIcon from '@mui/icons-material/PasswordOutlined';
import { Alert, Button, Divider, Paper, Stack, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const otpForm = useFormik({
    initialValues: {
      email: '',
    },
    onSubmit: async (values, helpers) => {
      helpers.setStatus(undefined);
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        helpers.setStatus('Unable to send OTP');
        return;
      }

      await navigate({ to: '/verify', search: { email: values.email } });
    },
  });
  const passwordForm = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: async (values, helpers) => {
      helpers.setStatus(undefined);
      const response = await fetch('/api/auth/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        helpers.setStatus('Invalid email or password');
        return;
      }

      const result = (await response.json()) as { user: { mustChangePassword?: boolean } };
      await navigate({
        href: result.user.mustChangePassword ? '/change-password' : (search.redirect ?? '/admin'),
      });
    },
  });

  return (
    <Paper sx={{ maxWidth: 480, mx: 'auto', p: 3 }}>
      <Stack component="form" onSubmit={otpForm.handleSubmit} spacing={2}>
        <Typography variant="h1">Login</Typography>
        {otpForm.status ? <Alert severity="error">{otpForm.status}</Alert> : null}
        <TextField
          autoComplete="email"
          label="Email"
          name="email"
          onBlur={otpForm.handleBlur}
          onChange={otpForm.handleChange}
          type="email"
          value={otpForm.values.email}
        />
        <Button startIcon={<MailOutlineIcon />} type="submit" variant="contained">
          Send OTP
        </Button>
        <Button startIcon={<GoogleIcon />} variant="outlined">
          Continue with Google
        </Button>
      </Stack>
      <Divider sx={{ my: 3 }} />
      <Stack component="form" onSubmit={passwordForm.handleSubmit} spacing={2}>
        <Typography variant="h2">Password login</Typography>
        {passwordForm.status ? <Alert severity="error">{passwordForm.status}</Alert> : null}
        <TextField
          autoComplete="email"
          label="Email"
          name="email"
          onBlur={passwordForm.handleBlur}
          onChange={passwordForm.handleChange}
          type="email"
          value={passwordForm.values.email}
        />
        <TextField
          autoComplete="current-password"
          label="Password"
          name="password"
          onBlur={passwordForm.handleBlur}
          onChange={passwordForm.handleChange}
          type="password"
          value={passwordForm.values.password}
        />
        <Button startIcon={<PasswordIcon />} type="submit" variant="outlined">
          Login with password
        </Button>
      </Stack>
    </Paper>
  );
}
