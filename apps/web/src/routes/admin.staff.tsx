import { createFileRoute } from '@tanstack/react-router';
import { MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';

export const Route = createFileRoute('/admin/staff')({
  component: AdminStaffPage,
});

function AdminStaffPage() {
  return (
    <Paper sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h1">Staff</Typography>
        <TextField label="User email" value="agent@example.com" />
        <TextField label="Role" select value="support_agent">
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="support_agent">Support agent</MenuItem>
          <MenuItem value="user">User</MenuItem>
        </TextField>
      </Stack>
    </Paper>
  );
}
