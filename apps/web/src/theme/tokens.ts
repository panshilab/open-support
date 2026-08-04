export const brand = {
  primary: {
    main: '#14532d',
    light: '#2f7a4d',
    dark: '#0f3d22',
  },
  secondary: {
    main: '#0f766e',
    light: '#4aa399',
    dark: '#0d5f59',
  },
  background: {
    default: '#f4f8f1',
    paper: '#ffffff',
  },
  text: {
    primary: 'rgba(0, 0, 0, 0.9)',
    secondary: 'rgba(0, 0, 0, 0.62)',
  },
} as const;

function alpha(hex: string, opacity: number) {
  const value = hex.replace('#', '');
  const r = Number.parseInt(value.substring(0, 2), 16);
  const g = Number.parseInt(value.substring(2, 4), 16);
  const b = Number.parseInt(value.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export const primaryAlpha = {
  4: alpha(brand.primary.main, 0.04),
  5: alpha(brand.primary.main, 0.05),
  8: alpha(brand.primary.main, 0.08),
  10: alpha(brand.primary.main, 0.1),
  12: alpha(brand.primary.main, 0.12),
  14: alpha(brand.primary.main, 0.14),
  18: alpha(brand.primary.main, 0.18),
  24: alpha(brand.primary.main, 0.24),
  34: alpha(brand.primary.main, 0.34),
};

export const secondaryAlpha = {
  6: alpha(brand.secondary.main, 0.06),
  22: alpha(brand.secondary.main, 0.22),
};

export const divider = primaryAlpha[14];

export const shape = {
  borderRadius: 10,
};

export const fontFamily =
  'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

export const STATUS_COLORS: Record<string, { bg: string; fg: string }> = {
  open: { bg: 'rgba(217, 119, 6, 0.14)', fg: '#92400e' },
  customer_reply: { bg: 'rgba(37, 99, 235, 0.14)', fg: '#1e40af' },
  replied: { bg: 'rgba(15, 118, 110, 0.14)', fg: brand.secondary.dark },
  resolved: { bg: primaryAlpha[14], fg: brand.primary.main },
};
