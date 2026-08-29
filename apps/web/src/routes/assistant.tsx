import { useCallback, useState, type ChangeEvent, type FormEvent } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import type { AssistantMessage } from '@open-support/schemas/assistant';
import { useAskAssistantMutation } from '@open-support/services';
import { ErrorState } from '../components/error-state';
import { HumanFallback } from '../components/support-center';
import { PageHeader } from '../components/page-header';

export const Route = createFileRoute('/assistant')({ component: AssistantPage });

function AssistantPage() {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<AssistantMessage[]>([]);
  const assistant = useAskAssistantMutation();

  const submit = useCallback(() => {
    const trimmed = message.trim();
    if (!trimmed || assistant.isPending) return;

    setHistory((current) => [...current, { content: trimmed, role: 'user' }]);
    setMessage('');
    assistant.reset();
    assistant.mutate(
      { history, message: trimmed },
      {
        onSuccess: (result) =>
          setHistory((current) => [...current, { content: result.answer, role: 'assistant' }]),
      },
    );
  }, [assistant, history, message]);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setMessage(event.target.value),
    [],
  );
  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      submit();
    },
    [submit],
  );

  return (
    <Box sx={{ maxWidth: 720, mx: 'auto', pt: 3 }}>
      <PageHeader
        title="What are you trying to solve?"
        description="The guide searches the published support center and answers with the articles behind it."
      />

      <Box sx={{ pb: 6 }}>
        {history.length === 0 ? (
          <Box
            sx={{
              borderLeft: '1px solid',
              borderColor: 'rule.strong',
              pl: 2,
              py: 0.5,
            }}
          >
            <Typography sx={{ fontWeight: 600 }} variant="body2">
              Ask in plain language
            </Typography>
            <Typography color="text.secondary" variant="body2">
              For example: &ldquo;Why can&rsquo;t I upload my invoice?&rdquo;
            </Typography>
          </Box>
        ) : (
          <Stack sx={{ borderTop: '1px solid', borderColor: 'rule.main' }}>
            {history.map((item, i) => (
              <TranscriptEntry item={item} key={`${item.role}-${i}`} />
            ))}
          </Stack>
        )}

        {assistant.data ? (
          <Box sx={{ mt: 2, pl: 2, borderLeft: '2px solid', borderColor: 'primary.main' }}>
            <Typography variant="overline" component="p" sx={{ color: 'ink.muted', mb: 1 }}>
              {assistant.data.confidence} confidence &middot; from published support content
            </Typography>
            <Stack spacing={0.25}>
              {assistant.data.sources.map((source) => (
                <Link
                  key={source.id}
                  params={{ articleId: source.id }}
                  style={{ textDecoration: 'none' }}
                  to="/knowledgebase/$articleId"
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'primary.main',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.5,
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    <ArrowForwardRoundedIcon sx={{ fontSize: 14 }} />
                    {source.title}
                  </Typography>
                </Link>
              ))}
            </Stack>
          </Box>
        ) : null}

        {assistant.error ? (
          <Box sx={{ mt: 2 }}>
            <ErrorState message={assistant.error.message} />
            <Box sx={{ mt: 2 }}>
              <HumanFallback />
            </Box>
          </Box>
        ) : null}
        {assistant.data?.shouldEscalate ? (
          <Box sx={{ mt: 2 }}>
            <HumanFallback />
          </Box>
        ) : null}

        <Stack
          component="form"
          direction="row"
          spacing={1}
          onSubmit={handleSubmit}
          sx={{ borderTop: '1px solid', borderColor: 'rule.strong', mt: 3, pt: 3 }}
        >
          <TextField
            aria-label="Describe your issue"
            disabled={assistant.isPending}
            fullWidth
            onChange={handleChange}
            placeholder="Describe your issue&hellip;"
            value={message}
          />
          <Button
            aria-label="Send message"
            disabled={!message.trim() || assistant.isPending}
            sx={{ minWidth: 44 }}
            type="submit"
            variant="contained"
          >
            <SendRoundedIcon fontSize="small" />
          </Button>
        </Stack>

        <Button
          component={Link}
          endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />}
          to="/knowledgebase"
          sx={{ mt: 3, px: 0, '&:hover': { bgcolor: 'transparent' } }}
        >
          Browse the full knowledgebase
        </Button>
      </Box>
    </Box>
  );
}

function TranscriptEntry({ item }: Readonly<{ item: AssistantMessage }>) {
  const isUser = item.role === 'user';
  return (
    <Box
      sx={{
        borderBottom: '1px solid',
        borderColor: 'rule.main',
        borderLeft: '2px solid',
        borderLeftColor: isUser ? 'rule.strong' : 'primary.main',
        pl: 2,
        py: 1.5,
      }}
    >
      <Typography variant="overline" component="p" sx={{ color: 'ink.muted', mb: 0.5 }}>
        {isUser ? 'You' : 'Guide'}
      </Typography>
      <Typography sx={{ whiteSpace: 'pre-wrap' }} variant="body2">
        {item.content}
      </Typography>
    </Box>
  );
}
