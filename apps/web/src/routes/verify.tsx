import { useCallback } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Alert, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { useVerifyOtpMutation } from '@open-support/services';
import { useFormik, type FormikHelpers } from 'formik';
import type { VerifyOtpForm } from '@open-support/schemas/auth';

export const Route = createFileRoute('/verify')({
  validateSearch: (search: Record<string, unknown>) => ({
    email: typeof search.email === 'string' ? search.email : '',
  }),
  component: VerifyPage,
});

function VerifyPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const verifyOtpMutation = useVerifyOtpMutation();
  const handleSubmit = useCallback(
    async (values: VerifyOtpForm, helpers: FormikHelpers<VerifyOtpForm>) => {
      helpers.setStatus(undefined);

      try {
        const result = await verifyOtpMutation.mutateAsync(values);
        await navigate({ to: result.user.mustChangePassword ? '/change-password' : '/tickets' });
      } catch {
        helpers.setStatus('Invalid or expired code');
      }
    },
    [navigate, verifyOtpMutation],
  );
  const form = useFormik<VerifyOtpForm>({
    initialValues: {
      email: search.email,
      otp: '',
    },
    onSubmit: handleSubmit,
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
