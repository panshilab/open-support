import { createTheme } from '@mui/material';
import { brand, divider, fontFamily, primaryAlpha, secondaryAlpha, shape } from './tokens';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: brand.primary,
    secondary: brand.secondary,
    background: brand.background,
    text: brand.text,
    divider,
  },
  shape,
  typography: {
    fontFamily,
    h1: {
      fontSize: '2rem',
      fontWeight: 760,
      lineHeight: 1.12,
    },
    h2: {
      fontSize: '1.25rem',
      fontWeight: 740,
      lineHeight: 1.2,
    },
  },
  components: {
    MuiAutocomplete: {
      styleOverrides: {
        option: {
          '&[aria-selected="true"]': {
            backgroundColor: primaryAlpha[10],
          },
          '&[aria-selected="true"].Mui-focused': {
            backgroundColor: primaryAlpha[14],
          },
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(12px)',
          boxShadow: 'none',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: `1px solid ${primaryAlpha[12]}`,
          boxShadow: '0 16px 40px rgba(15, 61, 34, 0.08)',
        },
      },
    },
    MuiCardActionArea: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: primaryAlpha[4],
          },
          '&:focus-visible': {
            outline: `3px solid ${primaryAlpha[24]}`,
            outlineOffset: 2,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: primaryAlpha[8],
          color: 'rgba(0, 0, 0, 0.78)',
          fontWeight: 650,
        },
        outlined: {
          backgroundColor: secondaryAlpha[6],
          borderColor: secondaryAlpha[22],
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: primaryAlpha[10],
          },
          '&.Mui-selected:hover': {
            backgroundColor: primaryAlpha[14],
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: primaryAlpha[10],
          },
          '&.Mui-selected:hover': {
            backgroundColor: primaryAlpha[14],
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          '& fieldset': {
            borderColor: primaryAlpha[18],
          },
          '&:hover fieldset': {
            borderColor: primaryAlpha[34],
          },
          '&.Mui-focused fieldset': {
            borderColor: brand.primary.main,
            borderWidth: 1,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});
