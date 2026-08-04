import { createFileRoute } from '@tanstack/react-router';
import { Button, Chip, Paper, Stack, TextField, Typography } from '@mui/material';

export const Route = createFileRoute('/admin/knowledgebase/edit')({
  component: EditKnowledgebaseEntryPage,
});

function EditKnowledgebaseEntryPage() {
  return (
    <Paper sx={{ p: 3 }}>
      <Stack component="form" spacing={2}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Typography variant="h1">Edit article</Typography>
          <Chip label="article" />
          <Chip color="secondary" label="vector ready" />
        </Stack>
        <TextField label="Product" value="Customer Portal" />
        <TextField label="Category" value="Billing / Invoices" />
        <TextField label="Title" value="Upload invoice attachments" />
        <TextField
          label="Article content"
          minRows={10}
          multiline
          value="Supported files include PDF and PNG."
        />
        <Button variant="contained">Update article</Button>
      </Stack>
    </Paper>
  );
}
