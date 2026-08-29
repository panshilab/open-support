import { useCallback } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Alert, Button, Stack, TextField } from '@mui/material';
import { useChangePasswordMutation } from '@open-support/services';
import { AuthLayout } from '../components/auth-layout';
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
    <AuthLayout
      title="Set a new password"
      description="Choose a new password before continuing to the workspace."
    >
      <Stack component="form" onSubmit={form.handleSubmit} spacing={2}>
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
        <Button type="submit" variant="contained">
          Save password
        </Button>
      </Stack>
    </AuthLayout>
  );
}
