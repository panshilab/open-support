import { createFileRoute } from '@tanstack/react-router';
import { Checkbox, FormControlLabel, Paper, Stack, TextField, Typography } from '@mui/material';

export const Route = createFileRoute('/admin/settings')({
  component: AdminSettingsPage,
});

function AdminSettingsPage() {
  return (
    <Paper sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h1">Settings</Typography>
        <TextField label="SMTP from email" value="support@example.com" />
        <TextField label="Google client ID" />
        <FormControlLabel control={<Checkbox defaultChecked />} label="Redis cache enabled" />
      </Stack>
    </Paper>
  );
}
