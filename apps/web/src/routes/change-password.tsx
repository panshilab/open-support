import { useCallback } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import SaveIcon from '@mui/icons-material/SaveOutlined';
import { Alert, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { useChangePasswordMutation } from '@open-support/services';
import { useFormik, type FormikHelpers } from 'formik';
import type { ChangePasswordForm } from '@open-support/schemas/auth';

export const Route = createFileRoute('/change-password')({
  component: ChangePasswordPage,
});

function ChangePasswordPage() {
  const navigate = useNavigate();
  const changePasswordMutation = useChangePasswordMutation();
  const handleSubmit = useCallback(
    async (values: ChangePasswordForm, helpers: FormikHelpers<ChangePasswordForm>) => {
      helpers.setStatus(undefined);

      try {
        await changePasswordMutation.mutateAsync(values);
        await navigate({ to: '/admin' });
      } catch {
        helpers.setStatus('Unable to change password');
      }
    },
    [changePasswordMutation, navigate],
  );
  const form = useFormik<ChangePasswordForm>({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    onSubmit: handleSubmit,
  });

  return (
    <Paper sx={{ maxWidth: 520, mx: 'auto', p: 3 }}>
      <Stack component="form" onSubmit={form.handleSubmit} spacing={2}>
        <Typography variant="h1">Change password</Typography>
        <Alert severity="info">Set a new password before using the admin portal.</Alert>
        {form.status ? <Alert severity="error">{form.status}</Alert> : null}
        <TextField
          autoComplete="current-password"
          label="Current password"
          name="currentPassword"
          onBlur={form.handleBlur}
          onChange={form.handleChange}
          type="password"
          value={form.values.currentPassword}
        />
        <TextField
          autoComplete="new-password"
          label="New password"
          name="newPassword"
          onBlur={form.handleBlur}
          onChange={form.handleChange}
          type="password"
          value={form.values.newPassword}
        />
        <TextField
          autoComplete="new-password"
          label="Confirm password"
          name="confirmPassword"
          onBlur={form.handleBlur}
          onChange={form.handleChange}
          type="password"
          value={form.values.confirmPassword}
        />
        <Button startIcon={<SaveIcon />} type="submit" variant="contained">
          Save password
        </Button>
      </Stack>
    </Paper>
  );
}
