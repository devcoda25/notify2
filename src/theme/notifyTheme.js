// /src/theme/notifyTheme.js
import { createTheme, alpha } from "@mui/material/styles";

// Optional: a more compact theme for the dialer bits
export const notifyTheme = createTheme({
  palette: {
    primary: {
      main: "#6f3cff",
      light: "#b19aff",
      dark: "#4421a1",
      contrastText: "#ffffff",
    },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: "none" } } },
  },
});

const brand = {
  main: "#7c3aed", // Tailwind purple-600
  light: "#a78bfa",
  dark: "#5b21b6",
  contrastText: "#ffffff",
};

const gray = {
  50: "#f8fafc",
  100: "#f1f5f9",
  200: "#e2e8f0",
  300: "#cbd5e1",
  400: "#94a3b8",
  500: "#64748b",
  600: "#475569",
  700: "#334155",
  800: "#1f2937",
  900: "#0f172a",
};

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { ...brand },
    secondary: { main: "#9333ea", light: "#c084fc", dark: "#6b21a8", contrastText: "#fff" },
    info: { main: "#6d28d9", light: "#8b5cf6", dark: "#5b21b6", contrastText: "#fff" }, // kill default blue
    success: { main: "#16a34a" },
    warning: { main: "#f59e0b" },
    error: { main: "#ef4444" },
    divider: alpha(gray[500], 0.16),
    text: { primary: gray[800], secondary: gray[600] },
    background: { default: "#fcfcff", paper: "#ffffff" },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily:
      '"Inter", system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji"',
    h5: { fontWeight: 700 },
  },
  components: {
    MuiCssBaseline: {
      // ✅ use params object and destructure theme
      styleOverrides: ({ theme }) => ({
        "::selection": { backgroundColor: alpha(theme.palette.primary.main, 0.25) },
        body: { color: theme.palette.text.primary, backgroundColor: theme.palette.background.default },
      }),
    },
    // default accents to purple
    MuiButton: { defaultProps: { color: "primary" } },
    MuiIconButton: { defaultProps: { color: "primary" } },
    MuiCheckbox: { defaultProps: { color: "primary" } },
    MuiRadio: { defaultProps: { color: "primary" } },
    MuiSwitch: { defaultProps: { color: "primary" } },

    MuiChip: {
      defaultProps: { color: "primary", variant: "outlined" },
      styleOverrides: {
        // keep this override functional and themed
        filled: ({ theme }) => ({
          backgroundColor: alpha(theme.palette.primary.main, 0.12),
          color: theme.palette.primary.dark,
        }),
      },
    },

    // Tabs & indicator
    MuiTabs: {
      styleOverrides: {
        indicator: ({ theme }) => ({
          backgroundColor: theme.palette.primary.main,
          height: 3,
          borderRadius: 1,
        }),
      },
    },
    MuiTab: {
      styleOverrides: {
        root: ({ theme }) => ({
          "&.Mui-selected": { color: theme.palette.primary.main, fontWeight: 600 },
        }),
      },
    },

    // Pagination selected item
    MuiPaginationItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          "&.Mui-selected": {
            backgroundColor: alpha(theme.palette.primary.main, 0.14),
            color: theme.palette.primary.main,
            fontWeight: 600,
            "&:hover": { backgroundColor: alpha(theme.palette.primary.main, 0.22) },
          },
        }),
      },
    },

    // Table header tint + selected row
    MuiTableCell: {
      styleOverrides: {
        head: ({ theme }) => ({
          fontWeight: 700,
          backgroundColor: alpha(theme.palette.primary.main, 0.04),
        }),
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: ({ theme }) => ({
          "&.Mui-selected": {
            backgroundColor: `${alpha(theme.palette.primary.main, 0.1)} !important`,
            "&:hover": { backgroundColor: `${alpha(theme.palette.primary.main, 0.14)} !important` },
          },
        }),
      },
    },

    MuiLink: { styleOverrides: { root: { color: "inherit" } } },

    MuiTooltip: {
      styleOverrides: {
        tooltip: ({ theme }) => ({ backgroundColor: theme.palette.primary.dark }),
      },
    },
  },
});

export default theme;
