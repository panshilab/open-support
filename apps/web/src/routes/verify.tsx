import { createFileRoute, Link } from '@tanstack/react-router';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';

export const Route = createFileRoute('/verify')({
  component: VerifyPage,
});

function VerifyPage() {
  const form = useFormik({
    initialValues: {
      email: '',
      otp: '',
    },
    onSubmit: () => undefined,
  });

  return (
    <Paper sx={{ maxWidth: 480, mx: 'auto', p: 3 }}>
      <Stack component="form" onSubmit={form.handleSubmit} spacing={2}>
        <Typography variant="h1">Verify OTP</Typography>
        <TextField
          label="Email"
          name="email"
          onBlur={form.handleBlur}
          onChange={form.handleChange}
          type="email"
          value={form.values.email}
        />
        <TextField
          label="Code"
          name="otp"
          onBlur={form.handleBlur}
          onChange={form.handleChange}
          slotProps={{ htmlInput: { maxLength: 6 } }}
          value={form.values.otp}
        />
        <Button
          component={Link}
          startIcon={<CheckCircleIcon />}
          to="/tickets"
          type="submit"
          variant="contained"
        >
          Verify and continue
        </Button>
      </Stack>
    </Paper>
  );
}
