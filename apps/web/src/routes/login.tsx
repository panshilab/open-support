import { createFileRoute, Link } from '@tanstack/react-router';
import GoogleIcon from '@mui/icons-material/Google';
import MailOutlineIcon from '@mui/icons-material/MailOutlineOutlined';
import { Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  const form = useFormik({
    initialValues: {
      email: '',
    },
    onSubmit: () => undefined,
  });

  return (
    <Paper sx={{ maxWidth: 480, mx: 'auto', p: 3 }}>
      <Stack component="form" onSubmit={form.handleSubmit} spacing={2}>
        <Typography variant="h1">Login</Typography>
        <TextField
          autoComplete="email"
          label="Email"
          name="email"
          onBlur={form.handleBlur}
          onChange={form.handleChange}
          type="email"
          value={form.values.email}
        />
        <Button
          component={Link}
          startIcon={<MailOutlineIcon />}
          to="/verify"
          type="submit"
          variant="contained"
        >
          Send OTP
        </Button>
        <Button startIcon={<GoogleIcon />} variant="outlined">
          Continue with Google
        </Button>
      </Stack>
    </Paper>
  );
}
