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
  createTheme,
} from '@mui/material';
import { AppProviders } from '../providers/app-providers';
import '../styles.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#14532d',
      light: '#2f7a4d',
      dark: '#0f3d22',
    },
    secondary: {
      main: '#0f766e',
      light: '#4aa399',
      dark: '#0d5f59',
    },
    background: {
      default: '#f4f8f1',
      paper: '#ffffff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.9)',
      secondary: 'rgba(0, 0, 0, 0.62)',
    },
    divider: 'rgba(20, 83, 45, 0.14)',
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 760,
      lineHeight: 1.12,
    },
    h2: {
      fontSize: '1.25rem',
      fontWeight: 740,
      lineHeight: 1.2,
    },
  },
  components: {
    MuiAutocomplete: {
      styleOverrides: {
        option: {
          '&[aria-selected="true"]': {
            backgroundColor: 'rgba(20, 83, 45, 0.1)',
          },
          '&[aria-selected="true"].Mui-focused': {
            backgroundColor: 'rgba(20, 83, 45, 0.14)',
          },
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(12px)',
          boxShadow: 'none',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(20, 83, 45, 0.12)',
          boxShadow: '0 16px 40px rgba(15, 61, 34, 0.08)',
        },
      },
    },
    MuiCardActionArea: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(20, 83, 45, 0.04)',
          },
          '&:focus-visible': {
            outline: '3px solid rgba(20, 83, 45, 0.24)',
            outlineOffset: 2,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(20, 83, 45, 0.08)',
          color: 'rgba(0, 0, 0, 0.78)',
          fontWeight: 650,
        },
        outlined: {
          backgroundColor: 'rgba(15, 118, 110, 0.06)',
          borderColor: 'rgba(15, 118, 110, 0.22)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: 'rgba(20, 83, 45, 0.1)',
          },
          '&.Mui-selected:hover': {
            backgroundColor: 'rgba(20, 83, 45, 0.14)',
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: 'rgba(20, 83, 45, 0.1)',
          },
          '&.Mui-selected:hover': {
            backgroundColor: 'rgba(20, 83, 45, 0.14)',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          '& fieldset': {
            borderColor: 'rgba(20, 83, 45, 0.18)',
          },
          '&:hover fieldset': {
            borderColor: 'rgba(20, 83, 45, 0.34)',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#14532d',
            borderWidth: 1,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export const Route = createRootRoute({
  beforeLoad: async ({ location }) => {
    if (typeof window === 'undefined' || isPublicPath(location.pathname)) {
      return;
    }

    const response = await fetch('/api/auth/me', {
      credentials: 'include',
    });

    if (!response.ok) {
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
        content: '#14532d',
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
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      }).catch(() => null);

      if (!cancelled) {
        setAuthenticated(Boolean(response?.ok));
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
