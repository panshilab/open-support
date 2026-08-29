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
import { useAdminSettingsQuery, upsertAdminSetting } from '@open-support/services';
import { useMutation } from '@tanstack/react-query';

export const Route = createFileRoute('/admin/settings')({
  component: AdminSettingsPage,
});

function AdminSettingsPage() {
  const settingsQuery = useAdminSettingsQuery();
  const saveSettingsMutation = useMutation({
    mutationFn: upsertAdminSetting,
    meta: { successMessage: 'Settings saved' },
  });
  const saved = settingsQuery.data?.find((setting) => setting.key === 'portal')?.value;
  const form = useFormik({
    enableReinitialize: true,
    initialValues: {
      smtpFromEmail: String(saved?.smtpFromEmail ?? ''),
      googleClientId: String(saved?.googleClientId ?? ''),
      redisEnabled: saved?.redisEnabled !== false,
      pwaEnabled: saved?.pwaEnabled !== false,
      offlinePageEnabled: saved?.offlinePageEnabled !== false,
    },
    onSubmit: (values) => saveSettingsMutation.mutate({ key: 'portal', value: values }),
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
        <Button
          disabled={saveSettingsMutation.isPending}
          startIcon={<SaveIcon />}
          type="submit"
          variant="contained"
        >
          Save settings
        </Button>
      </Stack>
    </Paper>
  );
}
