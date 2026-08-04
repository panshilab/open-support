import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import UploadIcon from '@mui/icons-material/Upload';
import { Button, Chip, Paper, Stack, Typography } from '@mui/material';
import { MediaPickerDialog } from '../components/media-picker-dialog';

const assets = [
  ['invoice-upload.png', 'image/png', 'local'],
  ['billing-guide.pdf', 'application/pdf', 'local'],
];

export const Route = createFileRoute('/admin/media')({
  component: AdminMediaPage,
});

function AdminMediaPage() {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <Stack spacing={2}>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h1">Media library</Typography>
        <Button onClick={() => setPickerOpen(true)} startIcon={<UploadIcon />} variant="contained">
          Upload media
        </Button>
      </Stack>
      {assets.map(([filename, mimeType, provider]) => (
        <Paper key={filename} sx={{ p: 2 }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            sx={{ justifyContent: 'space-between' }}
          >
            <div>
              <Typography>{filename}</Typography>
              <Typography color="text.secondary" variant="body2">
                {mimeType}
              </Typography>
            </div>
            <Stack direction="row" spacing={1}>
              <Chip label={provider} size="small" />
              <Chip label="ready" size="small" variant="outlined" />
            </Stack>
          </Stack>
        </Paper>
      ))}
      <MediaPickerDialog onClose={() => setPickerOpen(false)} open={pickerOpen} />
    </Stack>
  );
}
