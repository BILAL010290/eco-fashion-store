import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#D4AF37',
      light: '#F4E5B2',
      dark: '#B4912F',
      contrastText: '#000000',
    },
    secondary: {
      main: '#1A1A1A',
      light: '#333333',
      dark: '#000000',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#000000',
      paper: '#1A1A1A',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#E5E5E5',
    },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    h1: {
      fontFamily: "'Playfair Display', serif",
      fontSize: '3rem',
      fontWeight: 700,
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      color: '#D4AF37',
    },
    h2: {
      fontFamily: "'Playfair Display', serif",
      fontSize: '2.5rem',
      fontWeight: 600,
      letterSpacing: '0.05em',
      color: '#D4AF37',
    },
    h3: {
      fontFamily: "'Playfair Display', serif",
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '0.05em',
      color: '#D4AF37',
    },
    h4: {
      fontFamily: "'Playfair Display', serif",
      fontSize: '1.75rem',
      fontWeight: 600,
      letterSpacing: '0.05em',
      color: '#D4AF37',
    },
    h5: {
      fontFamily: "'Playfair Display', serif",
      fontSize: '1.5rem',
      fontWeight: 600,
      letterSpacing: '0.05em',
      color: '#D4AF37',
    },
    h6: {
      fontFamily: "'Playfair Display', serif",
      fontSize: '1.25rem',
      fontWeight: 600,
      letterSpacing: '0.05em',
      color: '#D4AF37',
    },
    body1: {
      fontSize: '1.1rem',
      letterSpacing: '0.03em',
      lineHeight: 1.6,
      color: '#D4AF37', // Or royal pour le texte body
    },
    button: {
      fontWeight: 500,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          padding: '12px 24px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #D4AF37 0%, #F4E5B2 100%)',
          color: '#000000',
          '&:hover': {
            background: '#D4AF37',
          },
        },
        outlined: {
          borderColor: '#D4AF37',
          color: '#D4AF37',
          '&:hover': {
            background: '#D4AF37',
            color: '#000000',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#D4AF37',
              borderRadius: 4,
            },
            '&:hover fieldset': {
              borderColor: '#F4E5B2',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#D4AF37',
              boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1A1A1A',
          border: '1px solid #D4AF37',
          borderRadius: 8,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000',
          borderBottom: '1px solid #D4AF37',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1A1A1A',
          borderRight: '1px solid #D4AF37',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#D4AF37',
        },
      },
    },
  },
});

export default theme;
