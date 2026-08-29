import { Box } from '@mui/material';
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';

type SurfaceProps<C extends ElementType> = {
  component?: C;
  children?: ReactNode;
  sx?: SxProps<Theme>;
} & Omit<ComponentPropsWithoutRef<C>, 'component' | 'children' | 'sx'>;

/**
 * The standard content container: a hairline-ruled block, no elevation, one
 * padding rhythm. Use instead of raw <Paper sx={{ p: N }}>. Pass `component`
 * to render as a form or section.
 */
export function Surface<C extends ElementType = 'div'>({
  children,
  component,
  sx,
  ...props
}: SurfaceProps<C>) {
  return (
    <Box
      component={component as ElementType}
      {...props}
      sx={[
        {
          border: '1px solid',
          borderColor: 'rule.main',
          borderRadius: '3px',
          p: { xs: 2, md: 3 },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Box>
  );
}
