import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadIcon from '@mui/icons-material/Upload';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';

const assets = [
  {
    id: 'asset-1',
    filename: 'invoice-upload.png',
    mimeType: 'image/png',
    size: '84 KB',
    url: 'http://localhost:7001/uploads/media/invoice-upload.png',
  },
  {
    id: 'asset-2',
    filename: 'billing-guide.pdf',
    mimeType: 'application/pdf',
    size: '220 KB',
    url: 'http://localhost:7001/uploads/media/billing-guide.pdf',
  },
];

export interface MediaPickerDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect?: (url: string) => void;
}

export function MediaPickerDialog({ open, onClose, onSelect }: MediaPickerDialogProps) {
  const form = useFormik({
    initialValues: {
      file: null as File | null,
      altText: '',
      caption: '',
    },
    onSubmit: () => undefined,
  });

  return (
    <Dialog fullWidth maxWidth="md" onClose={onClose} open={open}>
      <DialogTitle>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h2">Media library</Typography>
          <IconButton aria-label="Close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          <Paper sx={{ p: 2 }} variant="outlined">
            <Stack component="form" onSubmit={form.handleSubmit} spacing={2}>
              <Button component="label" startIcon={<UploadIcon />} variant="outlined">
                Select file
                <input
                  hidden
                  name="file"
                  onChange={(event) => {
                    form.setFieldValue('file', event.currentTarget.files?.[0] ?? null);
                  }}
                  type="file"
                />
              </Button>
              <TextField
                label="Alt text"
                name="altText"
                onChange={form.handleChange}
                value={form.values.altText}
              />
              <TextField
                label="Caption"
                name="caption"
                onChange={form.handleChange}
                value={form.values.caption}
              />
              <Button type="submit" variant="contained">
                Upload
              </Button>
            </Stack>
          </Paper>
          <Grid container spacing={2}>
            {assets.map((asset) => (
              <Grid key={asset.id} size={{ xs: 12, sm: 6 }}>
                <Paper sx={{ p: 2 }} variant="outlined">
                  <Stack spacing={1.5}>
                    <Box>
                      <Typography>{asset.filename}</Typography>
                      <Typography color="text.secondary" variant="body2">
                        {asset.mimeType} · {asset.size}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1}>
                      <Chip label="local" size="small" />
                      <Chip label="ready" size="small" variant="outlined" />
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      <Button
                        onClick={() => onSelect?.(asset.url)}
                        size="small"
                        variant="contained"
                      >
                        Insert
                      </Button>
                      <Button color="error" size="small" startIcon={<DeleteIcon />}>
                        Delete
                      </Button>
                    </Stack>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
