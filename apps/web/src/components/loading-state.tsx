import { Box, Skeleton, Stack, Typography } from '@mui/material';

/**
 * Loading state. Default: a quiet mono label + a thin progress rule. Pass
 * `lines` to render text-shaped skeletons instead (for content areas where a
 * shape preview reads better than a label).
 */
export function LoadingState({
  label = 'Loading',
  lines,
}: Readonly<{ label?: string; lines?: number }>) {
  if (lines && lines > 0) {
    return (
      <Stack spacing={1.5} sx={{ py: 1 }}>
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            height={18}
            variant="rectangular"
            width={i === lines - 1 ? '55%' : '100%'}
            sx={{ borderRadius: '2px' }}
          />
        ))}
      </Stack>
    );
  }

  return (
    <Box sx={{ py: 1 }}>
      <Typography color="text.secondary" sx={{ mb: 1 }} variant="overline">
        {label}
      </Typography>
      <Box
        sx={{
          bgcolor: 'background.accentWash',
          height: 2,
          overflow: 'hidden',
          position: 'relative',
          '&::after': {
            animation: 'os-load 1.1s ease-in-out infinite',
            bgcolor: 'primary.main',
            content: '""',
            inset: 0,
            position: 'absolute',
            transformOrigin: 'left',
          },
          '@keyframes os-load': {
            '0%': { transform: 'scaleX(0)' },
            '50%': { transform: 'scaleX(0.7)' },
            '100%': { transform: 'scaleX(1)', opacity: 0.2 },
          },
        }}
      />
    </Box>
  );
}

/** Row skeletons for list/table loading — hairline-separated. */
export function ListSkeleton({ rows = 5 }: Readonly<{ rows?: number }>) {
  return (
    <Stack divider={<Box sx={{ borderBottom: '1px solid', borderColor: 'rule.main' }} />}>
      {Array.from({ length: rows }).map((_, i) => (
        <Box key={i} sx={{ py: 1.75 }}>
          <Skeleton height={16} sx={{ borderRadius: '2px', mb: 0.75 }} variant="rectangular" width="42%" />
          <Skeleton height={13} sx={{ borderRadius: '2px' }} variant="rectangular" width="72%" />
        </Box>
      ))}
    </Stack>
  );
}
