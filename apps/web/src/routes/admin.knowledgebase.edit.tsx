import { createFileRoute } from '@tanstack/react-router';
import { Button, Paper, Stack, TextField, Typography } from '@mui/material';

export const Route = createFileRoute('/admin/knowledgebase/edit')({
  component: EditKnowledgebaseEntryPage,
});

function EditKnowledgebaseEntryPage() {
  return (
    <Paper sx={{ p: 3 }}>
      <Stack component="form" spacing={2}>
        <Typography variant="h1">Edit knowledge entry</Typography>
        <TextField label="Title" value="Upload invoice attachments" />
        <TextField label="Category" value="Billing / Invoices" />
        <TextField
          label="FAQ content"
          minRows={10}
          multiline
          value="Supported files include PDF and PNG."
        />
        <Button variant="contained">Update and re-index vector</Button>
      </Stack>
    </Paper>
  );
}
