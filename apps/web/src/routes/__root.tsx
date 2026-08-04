import { useEffect, useState, type ReactNode } from 'react';
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
  redirect,
} from '@tanstack/react-router';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ArticleIcon from '@mui/icons-material/Article';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import LoginIcon from '@mui/icons-material/Login';
import PersonIcon from '@mui/icons-material/Person';
import {
  AppBar,
  Box,
  Button,
  Container,
  CssBaseline,
  LinearProgress,
  Stack,
  ThemeProvider,
  Toolbar,
  Typography,
} from '@mui/material';
import { getCurrentSession } from '@open-support/services';
import { AppProviders } from '../providers/app-providers';
import { brand, theme } from '../theme';
import '../styles.css';

export const Route = createRootRoute({
  beforeLoad: async ({ location }) => {
    if (typeof window === 'undefined' || isPublicPath(location.pathname)) {
      return;
    }

    try {
      await getCurrentSession();
    } catch {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Open Support',
      },
      {
        name: 'description',
        content: 'Customer support portal with tickets, knowledge base, and live chat.',
      },
      {
        name: 'theme-color',
        content: brand.primary.main,
      },
    ],
    links: [{ rel: 'manifest', href: '/manifest.webmanifest' }],
  }),
  component: RootComponent,
});

function isPublicPath(pathname: string) {
  return (
    pathname === '/knowledgebase' ||
    pathname.startsWith('/knowledgebase/') ||
    pathname === '/login' ||
    pathname === '/verify' ||
    pathname === '/accept-invitation' ||
    pathname === '/change-password'
  );
}

function RootComponent() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js');
    }
  }, []);

  return (
    <RootDocument>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppProviders>
          <Shell />
        </AppProviders>
      </ThemeProvider>
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function Shell() {
  const [navigating, setNavigating] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      const session = await getCurrentSession().catch(() => null);

      if (!cancelled) {
        setAuthenticated(Boolean(session));
      }
    }

    void checkSession();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {navigating ? (
        <LinearProgress sx={{ left: 0, position: 'fixed', right: 0, top: 0, zIndex: 2000 }} />
      ) : null}
      <AppBar color="inherit" position="sticky" sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar
          onClickCapture={() => {
            setNavigating(true);
            window.setTimeout(() => setNavigating(false), 350);
          }}
          sx={{ gap: 2, flexWrap: 'wrap', py: 1 }}
        >
          <Typography
            component={Link}
            sx={{ color: 'primary.main', fontWeight: 800, textDecoration: 'none' }}
            to="/"
            variant="h6"
          >
            Open Support
          </Typography>
          <Stack
            aria-label="Main navigation"
            component="nav"
            direction="row"
            spacing={1}
            sx={{ flex: 1, flexWrap: 'wrap' }}
          >
            <Button component={Link} startIcon={<ArticleIcon />} to="/knowledgebase">
              Knowledgebase
            </Button>
            <Button component={Link} startIcon={<ConfirmationNumberIcon />} to="/tickets">
              Tickets
            </Button>
            <Button component={Link} startIcon={<AdminPanelSettingsIcon />} to="/admin">
              Admin
            </Button>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Button component={Link} startIcon={<PersonIcon />} to="/profile">
              Profile
            </Button>
            {!authenticated ? (
              <Button component={Link} startIcon={<LoginIcon />} to="/login" variant="contained">
                Login
              </Button>
            ) : null}
          </Stack>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth={false} sx={{ pb: 4, pt: 0 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
