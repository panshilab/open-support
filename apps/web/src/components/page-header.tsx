import { Box, Button, Stack, Typography } from '@mui/material';
import type { ButtonProps } from '@mui/material';
import type { ElementType, ReactNode } from 'react';

/**
 * Page title in the manual's voice: a serif heading over a hairline rule, with
 * an optional description beneath. No kicker/eyebrow — the heading carries its
 * own weight.
 */
export function PageHeader({
  action,
  description,
  size = 'page',
  title,
}: Readonly<{
  action?: ReactNode;
  description?: string;
  size?: 'page' | 'hero';
  title: string;
}>) {
  return (
    <Box
      sx={{
        borderBottom: '1px solid',
        borderColor: 'rule.main',
        mb: 4,
        pb: 2,
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ alignItems: { sm: 'flex-end' }, justifyContent: 'space-between' }}
      >
        <Box>
          <Typography variant={size === 'hero' ? 'h1' : 'h2'}>{title}</Typography>
          {description ? (
            <Typography color="text.secondary" sx={{ maxWidth: '52ch', mt: 1 }}>
              {description}
            </Typography>
          ) : null}
        </Box>
        {action ? <Box sx={{ flexShrink: 0 }}>{action}</Box> : null}
      </Stack>
    </Box>
  );
}

export function PrimaryAction({
  children,
  ...props
}: ButtonProps & { component?: ElementType; to?: string }) {
  return (
    <Button
      {...(props as ButtonProps)}
      size={props.size ?? 'medium'}
      variant={props.variant ?? 'contained'}
    >
      {children}
    </Button>
  );
}
