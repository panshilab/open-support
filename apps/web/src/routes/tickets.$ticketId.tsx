import { createFileRoute, Link } from '@tanstack/react-router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import SendIcon from '@mui/icons-material/Send';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  Link as MuiLink,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import { RichTextEditor } from '../components/rich-text-editor';
import { TICKET_STATUS_META } from '../components/ticket-status';

export const Route = createFileRoute('/tickets/$ticketId')({
  component: TicketDetailPage,
});

const conversation = [
  {
    id: 'msg-1',
    author: 'Customer',
    isStaff: false,
    body: 'I cannot upload an invoice PDF from the billing dashboard.',
    time: 'Aug 2, 9:14 AM',
  },
  {
    id: 'msg-2',
    author: 'Support',
    isStaff: true,
    body: 'We are checking the attachment service and file limits.',
    time: 'Aug 2, 11:40 AM',
  },
] as const;

function TicketDetailPage() {
  const { ticketId } = Route.useParams();
  const statusForm = useFormik({
    initialValues: {
      status: 'open',
    },
    onSubmit: () => undefined,
  });
  const replyForm = useFormik({
    initialValues: {
      contentHtml: '',
    },
    onSubmit: () => undefined,
  });

  const statusMeta = TICKET_STATUS_META[statusForm.values.status];

  return (
    <Container maxWidth="lg" sx={{ pb: 4, pt: 3 }}>
      <MuiLink
        component={Link}
        sx={{
          alignItems: 'center',
          color: 'text.secondary',
          display: 'inline-flex',
          gap: 0.5,
          mb: 2,
          textDecoration: 'none',
          '&:hover': { color: 'primary.main', textDecoration: 'underline' },
        }}
        to="/tickets"
      >
        <ArrowBackIcon sx={{ fontSize: 16 }} />
        Tickets
      </MuiLink>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ alignItems: { sm: 'flex-start' }, justifyContent: 'space-between', mb: 3 }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
            <Typography color="text.secondary" variant="body2">
              {ticketId}
            </Typography>
            <Chip
              label={statusMeta.label}
              size="small"
              sx={{ bgcolor: statusMeta.bg, color: statusMeta.fg, fontWeight: 650 }}
            />
          </Stack>
          <Typography variant="h1">Cannot upload invoice attachment</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Customer Portal · Billing / Invoices
          </Typography>
        </Box>
      </Stack>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ overflow: 'hidden' }}>
            <Stack spacing={2.5} sx={{ p: { xs: 2.5, md: 3 } }}>
              <Typography variant="h2">Conversation</Typography>
              <Stack spacing={2.5}>
                {conversation.map((message) => (
                  <Stack direction="row" key={message.id} spacing={1.5}>
                    <Avatar
                      sx={{
                        bgcolor: message.isStaff ? 'primary.main' : 'grey.300',
                        color: message.isStaff ? '#fff' : 'text.secondary',
                        height: 36,
                        width: 36,
                      }}
                    >
                      {message.isStaff ? (
                        <SupportAgentIcon fontSize="small" />
                      ) : (
                        message.author.charAt(0)
                      )}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ alignItems: 'baseline', justifyContent: 'space-between' }}
                      >
                        <Typography sx={{ fontWeight: 650 }} variant="body2">
                          {message.author}
                        </Typography>
                        <Typography color="text.secondary" variant="caption">
                          {message.time}
                        </Typography>
                      </Stack>
                      <Paper
                        sx={{
                          bgcolor: message.isStaff ? 'rgba(20, 83, 45, 0.05)' : 'rgba(0,0,0,0.03)',
                          borderRadius: 2,
                          mt: 0.5,
                          p: 1.5,
                        }}
                        variant="outlined"
                      >
                        <Typography sx={{ lineHeight: 1.6 }} variant="body2">
                          {message.body}
                        </Typography>
                      </Paper>
                    </Box>
                  </Stack>
                ))}
              </Stack>

              <Divider />

              <Stack component="form" onSubmit={replyForm.handleSubmit} spacing={1.5}>
                <Typography variant="h2">Reply</Typography>
                <RichTextEditor
                  onBlur={() => replyForm.setFieldTouched('contentHtml', true)}
                  onChange={(value) => replyForm.setFieldValue('contentHtml', value)}
                  placeholder="Write a reply..."
                  value={replyForm.values.contentHtml}
                />
                <Box>
                  <Button endIcon={<SendIcon />} type="submit" variant="contained">
                    Send reply
                  </Button>
                </Box>
              </Stack>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={2} sx={{ position: { md: 'sticky' }, top: { md: 96 } }}>
            <Paper sx={{ p: 2.5 }}>
              <Typography sx={{ mb: 1.5 }} variant="h2">
                Status
              </Typography>
              <Stack component="form" onSubmit={statusForm.handleSubmit} spacing={1.5}>
                <FormControl fullWidth size="small">
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    label="Status"
                    labelId="status-label"
                    name="status"
                    onChange={statusForm.handleChange}
                    value={statusForm.values.status}
                  >
                    <MenuItem value="open">Open</MenuItem>
                    <MenuItem value="customer_reply">Customer reply</MenuItem>
                    <MenuItem value="replied">Replied</MenuItem>
                    <MenuItem value="resolved">Resolved</MenuItem>
                  </Select>
                </FormControl>
                <Button type="submit" variant="outlined">
                  Update status
                </Button>
              </Stack>
            </Paper>

            <Paper sx={{ p: 2.5 }}>
              <Typography sx={{ mb: 1.5 }} variant="h2">
                Visibility
              </Typography>
              <Stack spacing={1} sx={{ color: 'text.secondary', mb: 1.5 }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <DoneAllIcon fontSize="small" />
                  <Typography variant="body2">Customer has seen this ticket</Typography>
                </Stack>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <VisibilityOffIcon fontSize="small" />
                  <Typography variant="body2">Staff has not seen the latest reply</Typography>
                </Stack>
              </Stack>
              <Button fullWidth variant="outlined">
                Mark seen
              </Button>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}
