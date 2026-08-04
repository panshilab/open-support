import { createFileRoute } from '@tanstack/react-router';
import SaveIcon from '@mui/icons-material/Save';
import {
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
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
      pwaEnabled: true,
      offlinePageEnabled: true,
    },
    onSubmit: () => undefined,
  });

  return (
    <Paper sx={{ p: 3 }}>
      <Stack component="form" onSubmit={form.handleSubmit} spacing={3}>
        <Typography variant="h1">Settings</Typography>
        <Stack spacing={2}>
          <Typography variant="h2">Authentication and email</Typography>
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
        </Stack>
        <Stack spacing={1}>
          <Typography variant="h2">Infrastructure</Typography>
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
          <FormControlLabel
            control={
              <Checkbox
                checked={form.values.pwaEnabled}
                name="pwaEnabled"
                onChange={form.handleChange}
              />
            }
            label="PWA manifest enabled"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={form.values.offlinePageEnabled}
                name="offlinePageEnabled"
                onChange={form.handleChange}
              />
            }
            label="Offline page enabled"
          />
        </Stack>
        <Button startIcon={<SaveIcon />} type="submit" variant="contained">
          Save settings
        </Button>
      </Stack>
    </Paper>
  );
}
