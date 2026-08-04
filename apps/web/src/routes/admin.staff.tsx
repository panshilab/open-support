import { createFileRoute } from '@tanstack/react-router';
import { MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';

export const Route = createFileRoute('/admin/staff')({
  component: AdminStaffPage,
});

function AdminStaffPage() {
  const form = useFormik({
    initialValues: {
      email: 'agent@example.com',
      role: 'support_agent',
    },
    onSubmit: () => undefined,
  });

  return (
    <Paper sx={{ p: 3 }}>
      <Stack component="form" onSubmit={form.handleSubmit} spacing={2}>
        <Typography variant="h1">Staff</Typography>
        <TextField
          label="User email"
          name="email"
          onBlur={form.handleBlur}
          onChange={form.handleChange}
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
          <MenuItem value="user">User</MenuItem>
        </TextField>
      </Stack>
    </Paper>
  );
}
