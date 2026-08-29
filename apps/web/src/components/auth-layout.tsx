import { Box, Typography } from '@mui/material';
import type { ReactNode } from 'react';

/**
 * Shared frame for the auth screens — the manual's title page. A serif heading,
 * an optional lead line, then the form on the measure. No card, no icons.
 */
export function AuthLayout({
  children,
  description,
  title,
}: Readonly<{ children: ReactNode; description?: string; title: string }>) {
  return (
    <Box sx={{ maxWidth: 460, mx: 'auto', pt: { xs: 5, md: 8 }, pb: 8 }}>
      <Typography variant="h1">{title}</Typography>
      {description ? (
        <Typography color="text.secondary" sx={{ mt: 2 }}>
          {description}
        </Typography>
      ) : null}
      <Box
        sx={{
          borderTop: '1px solid',
          borderColor: 'rule.main',
          mt: 4,
          pt: 4,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
