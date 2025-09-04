import { createTheme } from '@mui/material/styles';

export const dialerTheme = createTheme({
  palette: {
    primary: {
      main: '#6f3cff',
      light: '#b19aff',
      dark:  '#4421a1',
      contrastText: '#ffffff',
    },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: 'none' } } },
  },
});
