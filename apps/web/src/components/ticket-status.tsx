import { Box } from '@mui/material';
import { TICKET_STATUS_TONE } from '../theme';

type Tone = 'info' | 'warn' | 'success' | 'neutral';

export interface TicketStatusMeta {
  label: string;
  tone: Tone;
}

export const TICKET_STATUS_META: Record<string, TicketStatusMeta> = {
  open: { label: 'Open', tone: TICKET_STATUS_TONE.open },
  customer_reply: { label: 'Customer reply', tone: TICKET_STATUS_TONE.customer_reply },
  replied: { label: 'Replied', tone: TICKET_STATUS_TONE.replied },
  resolved: { label: 'Resolved', tone: TICKET_STATUS_TONE.resolved },
};

const TONE_VARS: Record<Tone, { fg: string; bg: string }> = {
  info: { fg: 'var(--os-palette-feedback-infoFg)', bg: 'var(--os-palette-feedback-infoBg)' },
  warn: { fg: 'var(--os-palette-feedback-warnFg)', bg: 'var(--os-palette-feedback-warnBg)' },
  success: {
    fg: 'var(--os-palette-feedback-successFg)',
    bg: 'var(--os-palette-feedback-successBg)',
  },
  neutral: { fg: 'var(--os-palette-ink-muted)', bg: 'transparent' },
};

/**
 * Ticket status as a small mono tag inside a hairline box — a manual's margin
 * annotation, not a filled pill. Tone drives the ink; the box is always a
 * hairline rule.
 */
export function TicketStatus({ status }: Readonly<{ status: string }>) {
  const meta = TICKET_STATUS_META[status] ?? TICKET_STATUS_META.open;
  const tone = TONE_VARS[meta.tone];

  return (
    <Box
      component="span"
      sx={{
        alignItems: 'center',
        bgcolor: tone.bg,
        border: '1px solid',
        borderColor: 'rule.main',
        borderRadius: '2px',
        color: tone.fg,
        display: 'inline-flex',
        fontFamily: (t) => t.typography.caption.fontFamily,
        fontSize: '0.6875rem',
        fontWeight: 500,
        letterSpacing: '0.06em',
        lineHeight: 1,
        px: 0.75,
        py: '3px',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}
    >
      {meta.label}
    </Box>
  );
}
