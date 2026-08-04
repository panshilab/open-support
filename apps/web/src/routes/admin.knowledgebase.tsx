import { createFileRoute, Link } from '@tanstack/react-router';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { Button, Chip, Paper, Stack, Typography } from '@mui/material';

const entries = [
  ['Upload invoice attachments', 'article', 'Customer Portal', 'Billing / Invoices', 'ready'],
  ['How do I reset account access?', 'faq', 'Customer Portal', 'Account / Access', 'ready'],
  ['Change billing contact', 'article', 'Billing Desk', 'Billing / Contacts', 'text search'],
];

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
      {entries.map(([entry, type, product, category, embeddingStatus]) => (
        <Paper key={entry} sx={{ p: 2 }}>
          <Stack
            direction="row"
            spacing={2}
            sx={{ alignItems: 'center', justifyContent: 'space-between' }}
          >
            <div>
              <Typography>{entry}</Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Chip label={type} size="small" />
                <Chip label={product} size="small" variant="outlined" />
                <Chip label={category} size="small" variant="outlined" />
                <Chip color="secondary" label={embeddingStatus} size="small" />
              </Stack>
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
