import { useCallback, useEffect, useState } from 'react';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  useSendChatMessageMutation,
  useStartChatMutation,
  useVisitorChatQuery,
} from '@open-support/services';

const STORAGE_KEY = 'open-support-chat';

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [draft, setDraft] = useState('');
  const [chatRef, setChatRef] = useState<{ chatId: string; token: string } | null>(null);
  const startMutation = useStartChatMutation();
  const chatQuery = useVisitorChatQuery(chatRef?.chatId ?? null, chatRef?.token ?? null);
  const sendMutation = useSendChatMessageMutation(chatRef?.chatId ?? null, chatRef?.token ?? null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setChatRef(JSON.parse(stored) as { chatId: string; token: string });
    } catch {
      /* Ignore malformed local state. */
    }
  }, []);

  const beginChat = useCallback(() => {
    startMutation.mutate(
      {
        visitorName: name,
        visitorEmail: email,
        message: draft,
        meta: { currentPage: window.location.href, language: navigator.language },
      },
      {
        onSuccess: (result) => {
          const next = { chatId: result.chat.id, token: result.token };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          setChatRef(next);
          setDraft('');
        },
      },
    );
  }, [draft, email, name, startMutation]);

  const sendMessage = useCallback(() => {
    if (!draft.trim()) return;
    sendMutation.mutate({ content: draft }, { onSuccess: () => setDraft('') });
  }, [draft, sendMutation]);

  return (
    <>
      <IconButton
        aria-label="Open live chat"
        onClick={() => setOpen(true)}
        sx={{
          bgcolor: 'primary.main',
          bottom: 24,
          color: 'primary.contrastText',
          position: 'fixed',
          right: 24,
          '&:hover': { bgcolor: 'primary.dark' },
          zIndex: 1200,
        }}
      >
        <ChatIcon />
      </IconButton>
      <Dialog fullWidth maxWidth="sm" onClose={() => setOpen(false)} open={open}>
        <DialogTitle>Chat with support</DialogTitle>
        <DialogContent>
          {!chatRef ? (
            <Stack spacing={2} sx={{ pt: 1 }}>
              <Typography color="text.secondary" variant="body2">
                Send a message and a support agent will join when available.
              </Typography>
              <TextField
                label="Your name"
                onChange={(event) => setName(event.target.value)}
                value={name}
              />
              <TextField
                label="Email"
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                value={email}
              />
              <TextField
                label="How can we help?"
                multiline
                minRows={3}
                onChange={(event) => setDraft(event.target.value)}
                value={draft}
              />
              {startMutation.error ? <Alert severity="error">Unable to start chat.</Alert> : null}
            </Stack>
          ) : (
            <Stack spacing={1.5} sx={{ pt: 1 }}>
              <Box sx={{ maxHeight: 360, overflowY: 'auto' }}>
                {(chatQuery.data?.messages ?? []).map((message) => (
                  <Box
                    key={message.id}
                    sx={{ mb: 1.5, textAlign: message.sender === 'visitor' ? 'right' : 'left' }}
                  >
                    <Typography
                      component="span"
                      sx={{
                        bgcolor: message.sender === 'visitor' ? 'primary.light' : 'action.hover',
                        borderRadius: 1,
                        display: 'inline-block',
                        px: 1.5,
                        py: 1,
                      }}
                      variant="body2"
                    >
                      {message.content}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <TextField
                label="Reply"
                multiline
                maxRows={4}
                onChange={(event) => setDraft(event.target.value)}
                value={draft}
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          {!chatRef ? (
            <Button
              disabled={!name || !email || !draft || startMutation.isPending}
              onClick={beginChat}
              variant="contained"
            >
              Start chat
            </Button>
          ) : (
            <Button
              disabled={!draft || sendMutation.isPending}
              endIcon={<SendIcon />}
              onClick={sendMessage}
              variant="contained"
            >
              Send
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
