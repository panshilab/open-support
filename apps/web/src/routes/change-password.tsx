import { createFileRoute, useNavigate } from '@tanstack/react-router';
import SaveIcon from '@mui/icons-material/SaveOutlined';
import { Alert, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';

export const Route = createFileRoute('/change-password')({
  component: ChangePasswordPage,
});

function ChangePasswordPage() {
  const navigate = useNavigate();
  const form = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    onSubmit: async (values, helpers) => {
      helpers.setStatus(undefined);
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        helpers.setStatus('Unable to change password');
        return;
      }

      await navigate({ to: '/admin' });
    },
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
