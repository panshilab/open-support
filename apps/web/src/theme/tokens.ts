/**
 * Design tokens — "The Field Manual"
 *
 * Paper-white ground, near-black ink, forest-green as the ONE structural ink
 * (running heads, rules, active wayfinding, focus — never a fill). Hairline
 * rules divide; no elevation, no decorative card borders. Mono is reserved for
 * true metadata (IDs, counts, timestamps, keyboard hints), never a costume.
 *
 * Every colour is defined once here with a light and a dark value and consumed
 * through the MUI CSS-variable theme in `theme.ts`. Do not inline colour
 * literals in components — add a token.
 */

// --- Brand -----------------------------------------------------------------
// Forest green stays recognisable (PRODUCT.md brand commitment). One green.
// In dark mode it steps one notch brighter so it still reads as ink on the
// near-black ground.
export const green = {
  light: {
    main: '#14532d',
    hover: '#0f3d22',
    contrastText: '#ffffff',
  },
  dark: {
    main: '#5bbd7f',
    hover: '#6fca90',
    contrastText: '#0b130d',
  },
} as const;

// --- Ink & paper ----------------------------------------------------------
export const ink = {
  light: {
    // near-black, not pure black — warmer, reads as print
    strong: '#1a1c19',
    body: '#33372f',
    muted: '#5f6459',
    faint: '#8a8f82',
    // hairline rule — the only divider in the system
    rule: 'rgba(26, 28, 25, 0.14)',
    ruleStrong: 'rgba(26, 28, 25, 0.28)',
  },
  dark: {
    strong: '#eef0e9',
    body: '#d3d7ca',
    muted: '#9aa08d',
    faint: '#6b7162',
    rule: 'rgba(238, 240, 233, 0.16)',
    ruleStrong: 'rgba(238, 240, 233, 0.32)',
  },
} as const;

export const paper = {
  light: {
    // page ground — a hair warm/green off-white, like manual stock
    ground: '#f7f8f4',
    // raised surface = same as ground; distinction is by rule, not fill
    surface: '#ffffff',
    // the one tinted surface: inside the search field on focus, selection
    accentWash: 'rgba(20, 83, 45, 0.06)',
    accentWashStrong: 'rgba(20, 83, 45, 0.12)',
  },
  dark: {
    ground: '#14170f',
    surface: '#1b1f16',
    accentWash: 'rgba(91, 189, 127, 0.10)',
    accentWashStrong: 'rgba(91, 189, 127, 0.18)',
  },
} as const;

// --- Feedback hues -------------------------------------------------------
// Used only for genuine status/feedback, rendered as text + hairline box,
// never as a filled chip.
export const feedback = {
  light: {
    infoFg: '#1e3a8a',
    infoBg: 'rgba(37, 99, 235, 0.10)',
    warnFg: '#854d0e',
    warnBg: 'rgba(217, 119, 6, 0.10)',
    successFg: '#14532d',
    successBg: 'rgba(20, 83, 45, 0.10)',
    dangerFg: '#9f1d1d',
    dangerBg: 'rgba(190, 40, 40, 0.10)',
  },
  dark: {
    infoFg: '#93b4ff',
    infoBg: 'rgba(37, 99, 235, 0.18)',
    warnFg: '#e0b25f',
    warnBg: 'rgba(217, 119, 6, 0.18)',
    successFg: '#7fd39c',
    successBg: 'rgba(91, 189, 127, 0.16)',
    dangerFg: '#f0a3a3',
    dangerBg: 'rgba(220, 70, 70, 0.18)',
  },
} as const;

// --- Ticket status ------------------------------------------------------
// Keys match the ticket status enum. Consumed by <TicketStatus>; rendered as a
// small mono tag with a hairline box (tone drives fg + faint bg + border).
export const TICKET_STATUS_TONE: Record<
  string,
  'info' | 'warn' | 'success' | 'neutral'
> = {
  open: 'warn',
  customer_reply: 'info',
  replied: 'success',
  resolved: 'neutral',
};

// --- Shape / geometry --------------------------------------------------
// Near-square. A manual, not a rounded SaaS app. Replaces the old 10–16px radii.
export const radius = {
  none: 0,
  sm: 2,
  md: 3,
  field: 3,
} as const;

// --- Fonts -----------------------------------------------------------
// Self-hosted via @fontsource (imported in styles.css). Source Serif 4 carries
// the display voice (the manual's set text); Source Sans 3 carries dense UI;
// IBM Plex Mono carries metadata and code only.
export const fontFamily = {
  serif:
    '"Source Serif 4 Variable", "Source Serif 4", Georgia, "Times New Roman", serif',
  sans: '"Source Sans 3 Variable", "Source Sans 3", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
  mono: '"IBM Plex Mono", ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
} as const;

// --- Layout ----------------------------------------------------------
export const layout = {
  appBarHeight: 56,
  // prose measure — 65–75ch per the craft floor
  measure: '68ch',
  contentMaxWidth: 960,
  contentsIndexWidth: 216,
} as const;

// --- Motion --------------------------------------------------------
export const motion = {
  // results swap / disclosure — fast, exponential ease-out from visible
  quick: '160ms cubic-bezier(0.22, 1, 0.36, 1)',
  standard: '220ms cubic-bezier(0.22, 1, 0.36, 1)',
} as const;
