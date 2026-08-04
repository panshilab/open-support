import { createFileRoute, Link } from '@tanstack/react-router';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { Button, Chip, Paper, Stack, Typography } from '@mui/material';

const entries = ['Upload invoice attachments', 'Reset account access', 'Change billing contact'];

export const Route = createFileRoute('/admin/knowledgebase')({
  component: AdminKnowledgebasePage,
});

function AdminKnowledgebasePage() {
  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h1">Knowledgebase</Typography>
        <Button
          component={Link}
          startIcon={<AddIcon />}
          to="/admin/knowledgebase/new"
          variant="contained"
        >
          New entry
        </Button>
      </Stack>
      {entries.map((entry) => (
        <Paper key={entry} sx={{ p: 2 }}>
          <Stack
            direction="row"
            spacing={2}
            sx={{ alignItems: 'center', justifyContent: 'space-between' }}
          >
            <div>
              <Typography>{entry}</Typography>
              <Chip label="vector indexed" size="small" sx={{ mt: 1 }} />
            </div>
            <Button component={Link} startIcon={<EditIcon />} to="/admin/knowledgebase/edit">
              Edit
            </Button>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}
