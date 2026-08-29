import { Box, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

/**
 * Empty state as a margin note, not a centered card with an icon: a hairline
 * rule on the left, a plain serif line, the reason beneath it.
 */
export function EmptyState({
  action,
  title,
  message,
}: Readonly<{ action?: ReactNode; title: string; message: string }>) {
  return (
    <Box
      sx={{
        borderLeft: '1px solid',
        borderColor: 'rule.strong',
        pl: 2.5,
        py: 1,
      }}
    >
      <Stack spacing={1} sx={{ alignItems: 'flex-start' }}>
        <Typography variant="h4">{title}</Typography>
        <Typography color="text.secondary" sx={{ maxWidth: '48ch' }}>
          {message}
        </Typography>
        {action ? <Box sx={{ pt: 0.5 }}>{action}</Box> : null}
      </Stack>
    </Box>
  );
}
