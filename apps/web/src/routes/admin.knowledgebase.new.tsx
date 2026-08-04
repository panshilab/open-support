import { createFileRoute } from '@tanstack/react-router';
import { Button, Paper, Stack, TextField, Typography } from '@mui/material';

export const Route = createFileRoute('/admin/knowledgebase/new')({
  component: NewKnowledgebaseEntryPage,
});

function NewKnowledgebaseEntryPage() {
  return (
    <Paper sx={{ p: 3 }}>
      <Stack component="form" spacing={2}>
        <Typography variant="h1">New knowledge entry</Typography>
        <TextField label="Title" />
        <TextField label="Category" value="Billing / Invoices" />
        <TextField label="FAQ content" minRows={10} multiline />
        <Button variant="contained">Save and index vector</Button>
      </Stack>
    </Paper>
  );
}
