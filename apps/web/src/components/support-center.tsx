import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { Link } from '@tanstack/react-router';
import { Box, Button, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

/**
 * A section opener in the manual's voice: a hairline-ruled block, serif
 * heading, no gradient, no decoration. The one accent is the green top rule.
 */
export function SupportCenterBand({
  action,
  children,
  compact = false,
  title,
}: Readonly<{ action?: ReactNode; children?: ReactNode; compact?: boolean; title: string }>) {
  return (
    <Box
      sx={{
        borderTop: '2px solid',
        borderTopColor: 'primary.main',
        borderBottom: '1px solid',
        borderBottomColor: 'rule.main',
        py: compact ? 3 : 4,
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={3}
        sx={{ alignItems: { md: 'flex-end' }, justifyContent: 'space-between' }}
      >
        <Box sx={{ maxWidth: '34ch' }}>
          <Typography
            variant="h2"
            sx={{ fontSize: compact ? { xs: '1.5rem', md: '1.7rem' } : undefined }}
          >
            {title}
          </Typography>
          {children}
        </Box>
        {action}
      </Stack>
    </Box>
  );
}

export function HumanFallback({ compact = false }: Readonly<{ compact?: boolean }>) {
  return (
    <Box
      sx={{
        borderLeft: '1px solid',
        borderLeftColor: 'rule.strong',
        pl: 2,
        py: compact ? 0.5 : 1,
      }}
    >
      <Typography sx={{ fontWeight: 600 }} variant="body2">
        Need a human?
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 0.25 }} variant="body2">
        If self-service doesn&rsquo;t solve it, our support team can take over.
      </Typography>
      {!compact ? (
        <Button
          component={Link}
          endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />}
          size="small"
          sx={{ mt: 0.75, px: 0, '&:hover': { bgcolor: 'transparent' } }}
          to="/new-ticket"
        >
          Open a ticket
        </Button>
      ) : null}
    </Box>
  );
}
