import { useEffect, useState, type ReactNode } from 'react';
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
  redirect,
  useRouterState,
} from '@tanstack/react-router';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { useColorScheme } from '@mui/material/styles';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import {
  AppBar,
  Box,
  Button,
  Container,
  CssBaseline,
  Drawer,
  IconButton,
  LinearProgress,
  Stack,
  ThemeProvider,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { getCurrentSession } from '@open-support/services';
import { AppProviders } from '../providers/app-providers';
import { green, theme } from '../theme';
import '../styles.css';

const NAV_ITEMS = [
  { label: 'Home', to: '/', match: (p: string) => p === '/' },
  {
    label: 'Knowledgebase',
    to: '/knowledgebase',
    match: (p: string) => p.startsWith('/knowledgebase'),
  },
  { label: 'Tickets', to: '/tickets', match: (p: string) => p.startsWith('/tickets') },
  { label: 'Guide', to: '/assistant', match: (p: string) => p.startsWith('/assistant') },
  { label: 'Admin', to: '/admin', match: (p: string) => p.startsWith('/admin') },
] as const;

export const Route = createRootRoute({
  beforeLoad: async ({ location }) => {
    if (typeof window === 'undefined') {
      return { session: null };
    }

    const session = await getCurrentSession().catch(() => null);

    if (!session && !isPublicPath(location.pathname)) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    }

    return { session };
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
        content: green.light.main,
      },
      // Direction contract marker — full contract in this file's <body> comment.
      // World: "The Field Manual"; seed key 29d44b6a (direction roll, mode operate).
      {
        name: 'x-impeccable-direction',
        content: 'the-field-manual:29d44b6a',
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
    pathname === '/assistant' ||
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
      <ThemeProvider theme={theme} defaultMode="light">
        <CssBaseline enableColorScheme />
        <AppProviders>
          <Shell />
        </AppProviders>
      </ThemeProvider>
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {/*
          THESIS: Open Support is a well-made technical manual you can search — the
          answer is already written down and indexed. Refuses the SaaS-dashboard grid
          of tinted cards floating on a tinted ground.
          OWN-WORLD: Paper-white ground, near-black ink, forest-green as the ONE
          structural ink (running heads, hairline rules, active wayfinding, focus —
          never a fill). Source Serif 4 sets the display voice; Source Sans 3 the UI;
          IBM Plex Mono only true metadata. Flat, no elevation, near-square corners,
          hairline rules divide.
          STORY: The visitor sees a manual's index, types or browses to the exact
          article, reads it like a manual page, and falls back to a tracked human
          thread only when self-service fails — the human path always visible, never
          loud.
          FIRST VIEWPORT (knowledgebase): sticky left "Contents" index (the margin
          tabs, green "you are here" rule) + right column with a large Source Serif
          question, one generous search field (the one tinted element), mono filter
          values, and article entries that swap in place.
          FORM: technical documentation print; #4 of the grounded list; seed key
          29d44b6a.
          FINISH: unreviewed and undocumented is unfinished; this build ends with the
          finish review, the verdict, and DESIGN.md.
        */}
        <InitColorSchemeScript attribute="data" defaultMode="light" />
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function ModeToggle() {
  const { mode, systemMode, setMode } = useColorScheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <Box sx={{ width: 36, height: 36 }} />;
  }

  const resolved = mode === 'system' ? systemMode : mode;
  const next = resolved === 'dark' ? 'light' : 'dark';

  return (
    <Tooltip title={`Switch to ${next} mode`}>
      <IconButton
        aria-label={`Switch to ${next} mode`}
        onClick={() => setMode(next)}
        size="small"
        sx={{ borderRadius: '2px', color: 'ink.muted' }}
      >
        {resolved === 'dark' ? (
          <LightModeOutlinedIcon fontSize="small" />
        ) : (
          <DarkModeOutlinedIcon fontSize="small" />
        )}
      </IconButton>
    </Tooltip>
  );
}

function Wordmark() {
  return (
    <Typography
      component={Link}
      to="/"
      sx={{
        color: 'ink.strong',
        flexShrink: 0,
        fontFamily: (t) => t.typography.caption.fontFamily,
        fontSize: '0.8125rem',
        fontWeight: 500,
        letterSpacing: '0.06em',
        textDecoration: 'none',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        '&::before': {
          content: '""',
          display: 'inline-block',
          width: 6,
          height: 6,
          mr: 1,
          mb: '1px',
          bgcolor: 'primary.main',
        },
      }}
    >
      Open Support
    </Typography>
  );
}

function NavLink({
  active,
  label,
  to,
  onNavigate,
  block = false,
}: Readonly<{
  active: boolean;
  label: string;
  to: string;
  onNavigate?: () => void;
  block?: boolean;
}>) {
  return (
    <Button
      component={Link}
      to={to}
      onClick={onNavigate}
      disableRipple
      sx={{
        borderRadius: 0,
        borderBottom: block ? 'none' : '2px solid',
        borderBottomColor: active ? 'primary.main' : 'transparent',
        borderLeft: block ? '2px solid' : 'none',
        borderLeftColor: block ? (active ? 'primary.main' : 'transparent') : undefined,
        color: active ? 'ink.strong' : 'ink.muted',
        fontWeight: active ? 600 : 500,
        justifyContent: block ? 'flex-start' : 'center',
        minHeight: block ? 44 : undefined,
        minWidth: block ? '100%' : 'max-content',
        px: block ? 2 : { xs: 1, md: 1.25 },
        '&:hover': { bgcolor: 'transparent', color: 'ink.strong' },
      }}
    >
      {label}
    </Button>
  );
}

function Shell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { session } = Route.useRouteContext();
  const authenticated = Boolean(session);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const navigating = useRouterState({ select: (state) => state.status === 'pending' });

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {navigating ? (
        <LinearProgress sx={{ left: 0, position: 'fixed', right: 0, top: 0, zIndex: 2000 }} />
      ) : null}
      <AppBar position="sticky">
        <Toolbar sx={{ gap: { xs: 1, md: 2.5 }, minHeight: 'var(--os-appbar-height)', py: 0.5 }}>
          <IconButton
            aria-label="Open menu"
            edge="start"
            onClick={() => setMenuOpen(true)}
            size="small"
            sx={{ borderRadius: '2px', color: 'ink.strong', display: { md: 'none' } }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>

          <Wordmark />

          <Box
            aria-label="Main navigation"
            component="nav"
            sx={{
              display: { xs: 'none', md: 'flex' },
              flex: 1,
              gap: 0.25,
              minWidth: 0,
              ml: 1,
            }}
          >
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                active={item.match(pathname)}
                label={item.label}
                to={item.to}
              />
            ))}
          </Box>

          <Box sx={{ flex: { xs: 1, md: 'unset' } }} />

          <Stack direction="row" spacing={0.25} sx={{ alignItems: 'center', flexShrink: 0 }}>
            <ModeToggle />
            <Tooltip title="Profile">
              <IconButton
                aria-label="Profile"
                component={Link}
                size="small"
                sx={{ borderRadius: '2px', color: 'ink.muted' }}
                to="/profile"
              >
                <PersonOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            {!authenticated ? (
              <Button
                component={Link}
                size="small"
                sx={{ ml: 0.5 }}
                to="/login"
                variant="contained"
              >
                Login
              </Button>
            ) : null}
          </Stack>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" onClose={() => setMenuOpen(false)} open={menuOpen}>
        <Box sx={{ width: 260 }}>
          <Stack
            direction="row"
            sx={{
              alignItems: 'center',
              borderBottom: '1px solid',
              borderColor: 'rule.main',
              height: 'var(--os-appbar-height)',
              justifyContent: 'space-between',
              px: 2,
            }}
          >
            <Wordmark />
            <IconButton
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              size="small"
              sx={{ borderRadius: '2px' }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>
          <Stack sx={{ py: 1 }}>
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                active={item.match(pathname)}
                block
                label={item.label}
                onNavigate={() => setMenuOpen(false)}
                to={item.to}
              />
            ))}
          </Stack>
        </Box>
      </Drawer>

      <Container component="main" maxWidth={false} sx={{ pb: 6, pt: 0, px: { xs: 2, sm: 3 } }}>
        <Outlet />
      </Container>
    </Box>
  );
}
