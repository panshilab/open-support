import { Box, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

/**
 * Error state: a hairline box tinted with the danger wash, plain language, an
 * optional recovery action. No icon-and-card.
 */
export function ErrorState({
  action,
  message,
}: Readonly<{ action?: ReactNode; message: string }>) {
  return (
    <Box
      sx={{
        bgcolor: 'var(--os-palette-feedback-dangerBg)',
        border: '1px solid',
        borderColor: 'rule.main',
        borderLeftColor: 'var(--os-palette-feedback-dangerFg)',
        borderLeftWidth: 2,
        p: 2,
      }}
    >
      <Stack spacing={1} sx={{ alignItems: 'flex-start' }}>
        <Typography sx={{ color: 'var(--os-palette-feedback-dangerFg)' }} variant="body2">
          {message}
        </Typography>
        {action ? <Box>{action}</Box> : null}
      </Stack>
    </Box>
  );
}
