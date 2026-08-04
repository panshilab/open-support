import { createFileRoute, Link } from '@tanstack/react-router';
import AddIcon from '@mui/icons-material/Add';
import ArticleIcon from '@mui/icons-material/Article';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { Box, Button, Card, CardContent, Chip, Grid, Stack, Typography } from '@mui/material';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
    <Stack spacing={4}>
      <Box>
        <Chip color="secondary" label="Phase 2" size="small" />
        <Typography sx={{ mt: 2, maxWidth: 760 }} variant="h1">
          Ticketing, knowledgebase search, and role-aware support workflows.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 3 }}>
          <Button component={Link} startIcon={<AddIcon />} to="/new-ticket" variant="contained">
            New ticket
          </Button>
          <Button
            component={Link}
            startIcon={<ArticleIcon />}
            to="/knowledgebase"
            variant="outlined"
          >
            Browse answers
          </Button>
        </Stack>
      </Box>
      <Grid container spacing={2}>
        {[
          ['Open tickets', '12', <ConfirmationNumberIcon key="tickets" />],
          ['Resolved this week', '38', <ConfirmationNumberIcon key="resolved" />],
          ['Knowledge entries', '124', <ArticleIcon key="articles" />],
        ].map(([label, value, icon]) => (
          <Grid key={label as string} size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                  {icon}
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      {label}
                    </Typography>
                    <Typography variant="h4">{value}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
