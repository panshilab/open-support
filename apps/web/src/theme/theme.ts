import { createTheme } from '@mui/material';
import {
  feedback,
  fontFamily,
  green,
  ink,
  layout,
  motion,
  paper,
  radius,
} from './tokens';

/**
 * "The Field Manual" theme.
 *
 * CSS-variable theme with light + dark colour schemes. Every colour resolves
 * from a token in `tokens.ts`. Distinction between surfaces is carried by
 * hairline rules and whitespace, never by elevation — so shadows are off and
 * `MuiPaper` / `MuiCard` render flat with a 1px rule.
 */

declare module '@mui/material/styles' {
  interface TypeBackground {
    ground: string;
    accentWash: string;
    accentWashStrong: string;
  }
  interface Palette {
    rule: { main: string; strong: string };
    ink: { strong: string; body: string; muted: string; faint: string };
    feedback: {
      infoFg: string;
      infoBg: string;
      warnFg: string;
      warnBg: string;
      successFg: string;
      successBg: string;
      dangerFg: string;
      dangerBg: string;
    };
  }
  interface PaletteOptions {
    rule?: { main: string; strong: string };
    ink?: { strong: string; body: string; muted: string; faint: string };
    feedback?: Palette['feedback'];
  }
}

const sharedTypography = {
  fontFamily: fontFamily.sans,
  // Display voice: Source Serif 4. Set text sizes, tight but not cramped.
  h1: {
    fontFamily: fontFamily.serif,
    fontSize: 'clamp(2rem, 1.4rem + 2.6vw, 3rem)',
    fontWeight: 500,
    letterSpacing: '-0.02em',
    lineHeight: 1.08,
  },
  h2: {
    fontFamily: fontFamily.serif,
    fontSize: 'clamp(1.5rem, 1.2rem + 1.2vw, 1.9rem)',
    fontWeight: 500,
    letterSpacing: '-0.015em',
    lineHeight: 1.15,
  },
  h3: {
    fontFamily: fontFamily.serif,
    fontSize: '1.25rem',
    fontWeight: 500,
    letterSpacing: '-0.01em',
    lineHeight: 1.25,
  },
  // Below h3, hand back to the sans for UI headings.
  h4: {
    fontFamily: fontFamily.sans,
    fontSize: '1.0625rem',
    fontWeight: 650,
    letterSpacing: '-0.005em',
    lineHeight: 1.3,
  },
  h5: {
    fontFamily: fontFamily.sans,
    fontSize: '0.9375rem',
    fontWeight: 650,
    lineHeight: 1.35,
  },
  h6: {
    fontFamily: fontFamily.sans,
    fontSize: '0.8125rem',
    fontWeight: 650,
    letterSpacing: '0.01em',
    lineHeight: 1.4,
  },
  subtitle1: { fontSize: '1rem', fontWeight: 500, lineHeight: 1.5 },
  subtitle2: { fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.45 },
  body1: { fontSize: '1rem', lineHeight: 1.65 },
  body2: { fontSize: '0.9375rem', lineHeight: 1.55 },
  button: {
    fontFamily: fontFamily.sans,
    fontWeight: 600,
    letterSpacing: '0.005em',
    textTransform: 'none' as const,
  },
  caption: {
    fontFamily: fontFamily.mono,
    fontSize: '0.75rem',
    letterSpacing: '0.01em',
    lineHeight: 1.4,
  },
  // Small label / running head — the manual's quiet page furniture. Sans, not
  // uppercase, not mono (mono is reserved for data: use `caption`).
  overline: {
    fontFamily: fontFamily.sans,
    fontSize: '0.8125rem',
    fontWeight: 600,
    letterSpacing: '0.005em',
    lineHeight: 1.4,
    textTransform: 'none' as const,
  },
};

function schemePalette(mode: 'light' | 'dark') {
  const g = green[mode];
  const i = ink[mode];
  const p = paper[mode];
  const f = feedback[mode];

  return {
    primary: { main: g.main, dark: g.hover, contrastText: g.contrastText },
    secondary: { main: g.main, dark: g.hover, contrastText: g.contrastText },
    text: { primary: i.strong, secondary: i.muted, disabled: i.faint },
    background: {
      default: p.ground,
      paper: p.surface,
      ground: p.ground,
      accentWash: p.accentWash,
      accentWashStrong: p.accentWashStrong,
    },
    divider: i.rule,
    rule: { main: i.rule, strong: i.ruleStrong },
    ink: { strong: i.strong, body: i.body, muted: i.muted, faint: i.faint },
    feedback: f,
    info: { main: f.infoFg },
    warning: { main: f.warnFg },
    success: { main: f.successFg },
    error: { main: f.dangerFg },
  };
}

export const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data',
    cssVarPrefix: 'os',
  },
  colorSchemes: {
    light: { palette: schemePalette('light') },
    dark: { palette: schemePalette('dark') },
  },
  shape: { borderRadius: radius.md },
  typography: sharedTypography,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ':root': {
          '--os-appbar-height': `${layout.appBarHeight}px`,
        },
        body: {
          backgroundColor: 'var(--os-palette-background-ground)',
        },
        '::selection': {
          background: 'var(--os-palette-background-accentWashStrong)',
        },
        // Prose measure helper for article bodies / rich text.
        '.os-measure': { maxWidth: layout.measure },
      },
    },

    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: radius.md,
        },
        outlined: {
          borderColor: 'var(--os-palette-rule-main)',
        },
      },
    },

    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: '1px solid var(--os-palette-rule-main)',
          borderRadius: radius.md,
          boxShadow: 'none',
        },
      },
    },

    MuiAppBar: {
      defaultProps: { elevation: 0, color: 'inherit' },
      styleOverrides: {
        root: {
          backgroundColor: 'var(--os-palette-background-ground)',
          backgroundImage: 'none',
          borderBottom: '1px solid var(--os-palette-rule-main)',
          boxShadow: 'none',
        },
      },
    },

    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: radius.sm,
          minHeight: 40,
          paddingInline: 14,
          '&:focus-visible': {
            outline: '2px solid var(--os-palette-primary-main)',
            outlineOffset: 2,
          },
        },
        contained: {
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
        outlined: {
          borderColor: 'var(--os-palette-rule-strong)',
          '&:hover': {
            borderColor: 'var(--os-palette-primary-main)',
            backgroundColor: 'var(--os-palette-background-accentWash)',
          },
        },
        text: {
          '&:hover': {
            backgroundColor: 'var(--os-palette-background-accentWash)',
          },
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: 'var(--os-palette-background-paper)',
          borderRadius: radius.field,
          '& fieldset': {
            borderColor: 'var(--os-palette-rule-strong)',
          },
          '&:hover fieldset': {
            borderColor: 'var(--os-palette-ink-muted)',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'var(--os-palette-primary-main)',
            borderWidth: 2,
          },
          '&.Mui-focused': {
            backgroundColor: 'var(--os-palette-background-accentWash)',
          },
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: { fontWeight: 500 },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: radius.sm,
          fontFamily: fontFamily.mono,
          fontSize: '0.75rem',
          fontWeight: 500,
          letterSpacing: '0.01em',
        },
        filled: {
          backgroundColor: 'var(--os-palette-background-accentWash)',
          color: 'var(--os-palette-ink-body)',
        },
        outlined: {
          borderColor: 'var(--os-palette-rule-main)',
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: { borderColor: 'var(--os-palette-rule-main)' },
      },
    },

    MuiAlert: {
      variants: [
        {
          props: { severity: 'info' },
          style: {
            color: 'var(--os-palette-feedback-infoFg)',
            backgroundColor: 'var(--os-palette-feedback-infoBg)',
          },
        },
        {
          props: { severity: 'warning' },
          style: {
            color: 'var(--os-palette-feedback-warnFg)',
            backgroundColor: 'var(--os-palette-feedback-warnBg)',
          },
        },
        {
          props: { severity: 'success' },
          style: {
            color: 'var(--os-palette-feedback-successFg)',
            backgroundColor: 'var(--os-palette-feedback-successBg)',
          },
        },
        {
          props: { severity: 'error' },
          style: {
            color: 'var(--os-palette-feedback-dangerFg)',
            backgroundColor: 'var(--os-palette-feedback-dangerBg)',
          },
        },
      ],
      styleOverrides: {
        root: {
          border: '1px solid var(--os-palette-rule-main)',
          borderRadius: radius.md,
          boxShadow: 'none',
        },
        icon: { alignItems: 'center' },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          border: '1px solid var(--os-palette-rule-strong)',
          borderRadius: radius.md,
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.24)',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontFamily: fontFamily.serif,
          fontSize: '1.25rem',
          fontWeight: 500,
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottomColor: 'var(--os-palette-rule-main)',
          paddingBlock: 10,
        },
        head: {
          fontFamily: fontFamily.mono,
          fontSize: '0.6875rem',
          fontWeight: 500,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--os-palette-ink-muted)',
        },
      },
    },

    MuiTabs: {
      styleOverrides: {
        root: { minHeight: 40 },
        indicator: { backgroundColor: 'var(--os-palette-primary-main)' },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          minHeight: 40,
          textTransform: 'none',
          '&.Mui-selected': { color: 'var(--os-palette-primary-main)' },
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'var(--os-palette-ink-strong)',
          borderRadius: radius.sm,
          fontFamily: fontFamily.mono,
          fontSize: '0.75rem',
        },
      },
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: 'var(--os-palette-background-accentWash)',
        },
        bar: { backgroundColor: 'var(--os-palette-primary-main)' },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: radius.sm,
          '&.Mui-selected': {
            backgroundColor: 'var(--os-palette-background-accentWash)',
          },
          '&.Mui-selected:hover': {
            backgroundColor: 'var(--os-palette-background-accentWashStrong)',
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: 'var(--os-palette-background-accentWash)',
          },
        },
      },
    },

    MuiAutocomplete: {
      styleOverrides: {
        option: {
          '&[aria-selected="true"]': {
            backgroundColor: 'var(--os-palette-background-accentWash)',
          },
        },
      },
    },

    MuiLink: {
      defaultProps: { underline: 'hover' },
      styleOverrides: {
        root: {
          color: 'var(--os-palette-primary-main)',
          textUnderlineOffset: '0.15em',
        },
      },
    },
  },
});

export const transitions = motion;
