import { createFileRoute } from '@tanstack/react-router';
import CircleIcon from '@mui/icons-material/Circle';
import SendIcon from '@mui/icons-material/SendOutlined';
import {
  Alert,
  Button,
  Chip,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';

const staff = [
  ['Asif Saho', 'asifsaho@example.com', 'admin', 'online', '18'],
  ['Support Agent', 'agent@example.com', 'support_agent', 'away', '42'],
  ['Billing Lead', 'billing@example.com', 'support_agent', 'offline', '27'],
] as const;

export const Route = createFileRoute('/admin/staff')({
  component: AdminStaffPage,
});

function AdminStaffPage() {
  const form = useFormik({
    initialValues: {
      email: '',
      role: 'support_agent',
    },
    onSubmit: async (values, helpers) => {
      helpers.setStatus(undefined);
      const response = await fetch('/api/admin/staff/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        helpers.setStatus('Unable to send invitation');
        return;
      }

      helpers.resetForm();
      helpers.setStatus('Invitation sent');
    },
  });

  return (
    <Stack spacing={2}>
      <Typography variant="h1">Staff</Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 3 }}>
            <Stack component="form" onSubmit={form.handleSubmit} spacing={2}>
              <Typography variant="h2">Invite staff</Typography>
              {form.status ? (
                <Alert severity={form.status === 'Invitation sent' ? 'success' : 'error'}>
                  {form.status}
                </Alert>
              ) : null}
              <TextField
                label="Email"
                name="email"
                onBlur={form.handleBlur}
                onChange={form.handleChange}
                type="email"
                value={form.values.email}
              />
              <TextField
                label="Role"
                name="role"
                onChange={form.handleChange}
                select
                value={form.values.role}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="support_agent">Support agent</MenuItem>
              </TextField>
              <Button startIcon={<SendIcon />} type="submit" variant="contained">
                Send invitation
              </Button>
            </Stack>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Typography variant="h2">Presence and replies</Typography>
              {staff.map(([name, email, role, status, replies]) => (
                <Paper key={email} sx={{ p: 1.5 }} variant="outlined">
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1}
                    sx={{ justifyContent: 'space-between' }}
                  >
                    <div>
                      <Typography>{name}</Typography>
                      <Typography color="text.secondary" variant="body2">
                        {email} · {role}
                      </Typography>
                    </div>
                    <Stack direction="row" spacing={1}>
                      <Chip
                        icon={<CircleIcon sx={{ fontSize: 10 }} />}
                        label={status}
                        size="small"
                      />
                      <Chip label={`${replies} replies`} size="small" variant="outlined" />
                    </Stack>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
}
