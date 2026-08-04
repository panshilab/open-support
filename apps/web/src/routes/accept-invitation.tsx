import { createFileRoute, useNavigate } from '@tanstack/react-router';
import CheckIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import { Alert, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';

export const Route = createFileRoute('/accept-invitation')({
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === 'string' ? search.token : '',
  }),
  component: AcceptInvitationPage,
});

function AcceptInvitationPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const form = useFormik({
    initialValues: {
      token: search.token,
      name: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: async (values, helpers) => {
      helpers.setStatus(undefined);
      const response = await fetch('/api/invitations/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        helpers.setStatus('Invitation could not be accepted');
        return;
      }

      await navigate({ to: '/admin' });
    },
  });

  return (
    <Paper sx={{ maxWidth: 520, mx: 'auto', p: 3 }}>
      <Stack component="form" onSubmit={form.handleSubmit} spacing={2}>
        <Typography variant="h1">Accept invitation</Typography>
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
        <Button startIcon={<CheckIcon />} type="submit" variant="contained">
          Accept invitation
        </Button>
      </Stack>
    </Paper>
  );
}
