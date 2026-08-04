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

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
});

function ProfilePage() {
  const form = useFormik({
    initialValues: {
      name: 'Support User',
      email: 'user@example.com',
      receiveEmailNotifications: true,
      receiveNewTicketEmails: true,
    },
    onSubmit: () => undefined,
  });

  return (
    <Paper sx={{ p: 3 }}>
      <Stack component="form" onSubmit={form.handleSubmit} spacing={2}>
        <Typography variant="h1">Profile</Typography>
        <TextField
          label="Name"
          name="name"
          onBlur={form.handleBlur}
          onChange={form.handleChange}
          value={form.values.name}
        />
        <TextField
          label="Email"
          name="email"
          onBlur={form.handleBlur}
          onChange={form.handleChange}
          value={form.values.email}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={form.values.receiveEmailNotifications}
              name="receiveEmailNotifications"
              onChange={form.handleChange}
            />
          }
          label="Email notifications"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={form.values.receiveNewTicketEmails}
              name="receiveNewTicketEmails"
              onChange={form.handleChange}
            />
          }
          label="New ticket emails"
        />
        <Button startIcon={<SaveIcon />} type="submit" variant="contained">
          Save profile
        </Button>
      </Stack>
    </Paper>
  );
}
