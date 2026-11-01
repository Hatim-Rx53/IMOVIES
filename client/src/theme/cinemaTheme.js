import { createTheme } from '@mui/material/styles';

const cinemaTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#E50914', // Cinema Crimson
      light: '#FF3342',
      dark: '#B20710',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#FFB800', // Gold VIP accent
      light: '#FFC833',
      dark: '#CC9300',
      contrastText: '#000000'
    },
    background: {
      default: '#0B0E14',
      paper: '#141A23'
    },
    text: {
      primary: '#F0F3F8',
      secondary: '#94A3B8'
    },
    divider: 'rgba(255, 255, 255, 0.08)'
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 800 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 }
  },
  shape: {
    borderRadius: 10
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 18px'
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #E50914 0%, #B20710 100%)',
          boxShadow: '0 4px 14px rgba(229, 9, 20, 0.35)',
          '&:hover': {
            background: 'linear-gradient(135deg, #FF1E2A 0%, #C40812 100%)',
            boxShadow: '0 6px 20px rgba(229, 9, 20, 0.5)'
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#141A23',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: 12,
          transition: 'transform 0.25s ease, box-shadow 0.25s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.5)'
          }
        }
      }
    }
  }
});

export default cinemaTheme;
