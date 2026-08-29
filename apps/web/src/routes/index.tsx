import { createFileRoute, Link } from '@tanstack/react-router';
import AddIcon from '@mui/icons-material/Add';
import ArticleIcon from '@mui/icons-material/Article';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { Box, Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SearchIcon from '@mui/icons-material/Search';
import { PrimaryAction } from '../components/page-header';
import { HumanFallback, SupportCenterBand } from '../components/support-center';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
    <Stack spacing={{ xs: 4, md: 6 }} sx={{ py: { xs: 3, md: 6 } }}>
      <Box sx={{ maxWidth: 820 }}>
        <Typography sx={{ maxWidth: '18ch' }} variant="h1">
          Find your answer. Get back to work.
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: '52ch', mt: 2 }}>
          Search trusted guidance or start a conversation with the support team. Everything you
          need, in one calm place.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 3.5 }}>
          <PrimaryAction component={Link} startIcon={<AddIcon />} to="/new-ticket">
            New ticket
          </PrimaryAction>
          <Button
            component={Link}
            endIcon={<ArrowForwardIcon />}
            startIcon={<ArticleIcon />}
            to="/knowledgebase"
            variant="outlined"
          >
            Browse answers
          </Button>
        </Stack>
      </Box>
      <SupportCenterBand
        action={
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button
              component={Link}
              startIcon={<SearchIcon />}
              to="/knowledgebase"
              variant="contained"
              sx={{ alignSelf: { xs: 'stretch', md: 'auto' } }}
            >
              Search articles
            </Button>
            <Button
              component={Link}
              startIcon={<AutoAwesomeRoundedIcon />}
              to="/assistant"
              variant="outlined"
              sx={{ alignSelf: { xs: 'stretch', md: 'auto' } }}
            >
              Ask the guide
            </Button>
          </Stack>
        }
        title="What can we help you solve?"
      >
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Start with automated guidance from the support center. If you still need help, a human can
          take over.
        </Typography>
      </SupportCenterBand>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Typography sx={{ mb: 2 }} variant="h2">
                Popular starting points
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                {['Billing & invoices', 'Account access', 'Workspace setup'].map((topic) => (
                  <Button
                    component={Link}
                    endIcon={<ArrowForwardIcon fontSize="small" />}
                    key={topic}
                    to="/knowledgebase"
                    variant="outlined"
                    sx={{ justifyContent: 'space-between' }}
                  >
                    {topic}
                  </Button>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <HumanFallback />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        {[
          ['Open tickets', '12', <ConfirmationNumberIcon key="tickets" />],
          ['Resolved this week', '38', <ConfirmationNumberIcon key="resolved" />],
          ['Knowledge entries', '124', <ArticleIcon key="articles" />],
        ].map(([label, value, icon]) => (
          <Grid key={label as string} size={{ xs: 12, md: 4 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                  {icon}
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      {label}
                    </Typography>
                    <Typography sx={{ mt: 0.25 }} variant="h4">
                      {value}
                    </Typography>
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
