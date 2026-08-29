import { useCallback } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Alert, Button, Stack, TextField } from '@mui/material';
import { useAcceptInvitationMutation } from '@open-support/services';
import { AuthLayout } from '../components/auth-layout';
import { useFormik, type FormikHelpers } from 'formik';
import type { AcceptInvitationForm } from '@open-support/schemas/auth';

export const Route = createFileRoute('/accept-invitation')({
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === 'string' ? search.token : '',
  }),
  component: AcceptInvitationPage,
});

function AcceptInvitationPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const acceptInvitationMutation = useAcceptInvitationMutation();
  const handleSubmit = useCallback(
    async (values: AcceptInvitationForm, helpers: FormikHelpers<AcceptInvitationForm>) => {
      helpers.setStatus(undefined);

      try {
        await acceptInvitationMutation.mutateAsync(values);
        await navigate({ to: '/admin' });
      } catch {
        helpers.setStatus('Invitation could not be accepted');
      }
    },
    [acceptInvitationMutation, navigate],
  );
  const form = useFormik<AcceptInvitationForm>({
    initialValues: {
      token: search.token,
      name: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: handleSubmit,
  });

  return (
    <AuthLayout
      title="Accept your invitation"
      description="Set your name and a password to join the support workspace."
    >
      <Stack component="form" onSubmit={form.handleSubmit} spacing={2}>
        {form.status ? <Alert severity="error">{form.status}</Alert> : null}
        <TextField
          label="Name"
          name="name"
          onBlur={form.handleBlur}
          onChange={form.handleChange}
          value={form.values.name}
        />
        <TextField
          autoComplete="new-password"
          label="Password"
          name="password"
          onBlur={form.handleBlur}
          onChange={form.handleChange}
          type="password"
          value={form.values.password}
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
          Accept invitation
        </Button>
      </Stack>
    </AuthLayout>
  );
}
