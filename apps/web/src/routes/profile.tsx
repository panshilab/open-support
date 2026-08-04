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

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <Paper sx={{ p: 3 }}>
      <Stack component="form" spacing={2}>
        <Typography variant="h1">Profile</Typography>
        <TextField label="Name" value="Support User" />
        <TextField label="Email" value="user@example.com" />
        <FormControlLabel control={<Checkbox defaultChecked />} label="Email notifications" />
        <FormControlLabel control={<Checkbox defaultChecked />} label="New ticket emails" />
        <Button startIcon={<SaveIcon />} variant="contained">
          Save profile
        </Button>
      </Stack>
    </Paper>
  );
}
