import { useCallback } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  Alert,
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useCreateStaffInvitationMutation } from '@open-support/services';
import { useFormik, type FormikHelpers } from 'formik';
import type { InviteStaffInput } from '@open-support/schemas/dashboard';
import { PageHeader } from '../components/page-header';
import { Surface } from '../components/surface';

// Presence list — hardcoded sample data (not yet wired to services).
const STAFF: [string, string, string, string, string][] = [
  ['Asif Saho', 'asifsaho@example.com', 'admin', 'online', '18'],
  ['Support Agent', 'agent@example.com', 'support_agent', 'away', '42'],
  ['Billing Lead', 'billing@example.com', 'support_agent', 'offline', '27'],
];

export const Route = createFileRoute('/admin/staff')({
  component: AdminStaffPage,
});

function AdminStaffPage() {
  const createStaffInvitationMutation = useCreateStaffInvitationMutation();
  const handleSubmit = useCallback(
    async (values: InviteStaffInput, helpers: FormikHelpers<InviteStaffInput>) => {
      helpers.setStatus(undefined);

      try {
        await createStaffInvitationMutation.mutateAsync(values);
        helpers.resetForm();
        helpers.setStatus('Invitation sent');
      } catch {
        helpers.setStatus('Unable to send invitation');
      }
    },
    [createStaffInvitationMutation],
  );
  const form = useFormik<InviteStaffInput>({
    initialValues: { email: '', role: 'support_agent' },
    onSubmit: handleSubmit,
  });

  return (
    <Stack spacing={5}>
      <PageHeader title="Staff" />

      <Box
        sx={{
          display: { md: 'grid' },
          gap: { md: 5 },
          gridTemplateColumns: { md: 'minmax(0, 340px) minmax(0, 1fr)' },
        }}
      >
        <Box sx={{ mb: { xs: 4, md: 0 } }}>
          <Typography sx={{ mb: 1.5 }} variant="h4">
            Invite a teammate
          </Typography>
          <Surface>
            <Stack component="form" onSubmit={form.handleSubmit} spacing={2}>
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
              <Button type="submit" variant="contained">
                Send invitation
              </Button>
            </Stack>
          </Surface>
        </Box>

        <Box>
          <Typography sx={{ mb: 1.5 }} variant="h4">
            Presence &amp; replies
          </Typography>
          <Stack sx={{ borderTop: '1px solid', borderColor: 'rule.main' }}>
            {STAFF.map(([name, email, role, status, replies]) => (
              <Stack
                key={email}
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1}
                sx={{
                  borderBottom: '1px solid',
                  borderColor: 'rule.main',
                  justifyContent: 'space-between',
                  py: 1.75,
                }}
              >
                <Box>
                  <Typography variant="body2">{name}</Typography>
                  <Typography color="text.secondary" variant="caption">
                    {email} &middot; {role}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flexShrink: 0 }}>
                  <PresenceTag status={status} />
                  <Typography sx={{ color: 'ink.faint' }} variant="caption">
                    {replies} replies
                  </Typography>
                </Stack>
              </Stack>
            ))}
          </Stack>
        </Box>
      </Box>
    </Stack>
  );
}

function PresenceTag({ status }: Readonly<{ status: string }>) {
  const color =
    status === 'online'
      ? 'var(--os-palette-feedback-successFg)'
      : status === 'away'
        ? 'var(--os-palette-feedback-warnFg)'
        : 'var(--os-palette-ink-faint)';
  return (
    <Box
      component="span"
      sx={{
        alignItems: 'center',
        color: 'ink.muted',
        display: 'inline-flex',
        fontFamily: (t) => t.typography.caption.fontFamily,
        fontSize: '0.6875rem',
        gap: 0.75,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
      }}
    >
      <Box component="span" sx={{ bgcolor: color, borderRadius: '50%', height: 6, width: 6 }} />
      {status}
    </Box>
  );
}
