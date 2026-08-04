import { createFileRoute, useNavigate } from '@tanstack/react-router';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Alert, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';

export const Route = createFileRoute('/verify')({
  validateSearch: (search: Record<string, unknown>) => ({
    email: typeof search.email === 'string' ? search.email : '',
  }),
  component: VerifyPage,
});

function VerifyPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const form = useFormik({
    initialValues: {
      email: search.email,
      otp: '',
    },
    onSubmit: async (values, helpers) => {
      helpers.setStatus(undefined);
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        helpers.setStatus('Invalid or expired code');
        return;
      }

      const result = (await response.json()) as { user: { mustChangePassword?: boolean } };
      await navigate({ to: result.user.mustChangePassword ? '/change-password' : '/tickets' });
    },
  });

  return (
    <Paper sx={{ maxWidth: 480, mx: 'auto', p: 3 }}>
      <Stack component="form" onSubmit={form.handleSubmit} spacing={2}>
        <Typography variant="h1">Verify OTP</Typography>
        {form.status ? <Alert severity="error">{form.status}</Alert> : null}
        <TextField
          label="Email"
          name="email"
          onBlur={form.handleBlur}
          onChange={form.handleChange}
          type="email"
          value={form.values.email}
        />
        <TextField
          label="Code"
          name="otp"
          onBlur={form.handleBlur}
          onChange={form.handleChange}
          slotProps={{ htmlInput: { maxLength: 6 } }}
          value={form.values.otp}
        />
        <Button startIcon={<CheckCircleIcon />} type="submit" variant="contained">
          Verify and continue
        </Button>
      </Stack>
    </Paper>
  );
}
