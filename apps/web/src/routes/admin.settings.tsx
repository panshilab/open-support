import { createFileRoute } from '@tanstack/react-router';
import { Checkbox, FormControlLabel, Paper, Stack, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';

export const Route = createFileRoute('/admin/settings')({
  component: AdminSettingsPage,
});

function AdminSettingsPage() {
  const form = useFormik({
    initialValues: {
      smtpFromEmail: 'support@example.com',
      googleClientId: '',
      redisEnabled: true,
    },
    onSubmit: () => undefined,
  });

  return (
    <Paper sx={{ p: 3 }}>
      <Stack component="form" onSubmit={form.handleSubmit} spacing={2}>
        <Typography variant="h1">Settings</Typography>
        <TextField
          label="SMTP from email"
          name="smtpFromEmail"
          onBlur={form.handleBlur}
          onChange={form.handleChange}
          value={form.values.smtpFromEmail}
        />
        <TextField
          label="Google client ID"
          name="googleClientId"
          onBlur={form.handleBlur}
          onChange={form.handleChange}
          value={form.values.googleClientId}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={form.values.redisEnabled}
              name="redisEnabled"
              onChange={form.handleChange}
            />
          }
          label="Redis cache enabled"
        />
      </Stack>
    </Paper>
  );
}
