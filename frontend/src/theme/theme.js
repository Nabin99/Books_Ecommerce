import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#2563eb", // Modern blue
      light: "#3b82f6",
      dark: "#1d4ed8",
      contrastText: "#ffffff",
      customBlack: "#1f2937"
    },
    secondary: {
      main: "#f59e0b", // Amber accent
      light: "#fbbf24",
      dark: "#d97706",
      contrastText: "#ffffff"
    },
    success: {
      main: "#10b981", // Emerald green
      light: "#34d399",
      dark: "#059669"
    },
    error: {
      main: "#ef4444", // Red
      light: "#f87171",
      dark: "#dc2626"
    },
    warning: {
      main: "#f59e0b",
      light: "#fbbf24",
      dark: "#d97706"
    },
    info: {
      main: "#3b82f6",
      light: "#60a5fa",
      dark: "#2563eb"
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff"
    },
    text: {
      primary: "#1f2937",
      secondary: "#6b7280",
      disabled: "#9ca3af"
    },
    divider: "#e5e7eb"
  },

  shape: {
    borderRadius: 12
  },

  shadows: [
    "none",
    "0px 1px 2px rgba(0, 0, 0, 0.05)",
    "0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)",
    "0px 4px 6px rgba(0, 0, 0, 0.07), 0px 2px 4px rgba(0, 0, 0, 0.06)",
    "0px 10px 15px rgba(0, 0, 0, 0.1), 0px 4px 6px rgba(0, 0, 0, 0.05)",
    "0px 20px 25px rgba(0, 0, 0, 0.1), 0px 10px 10px rgba(0, 0, 0, 0.04)",
    "0px 25px 50px rgba(0, 0, 0, 0.15)",
    "0px 25px 50px rgba(0, 0, 0, 0.15)",
    "0px 25px 50px rgba(0, 0, 0, 0.15)",
    "0px 25px 50px rgba(0, 0, 0, 0.15)",
    "0px 25px 50px rgba(0, 0, 0, 0.15)",
    "0px 25px 50px rgba(0, 0, 0, 0.15)",
    "0px 25px 50px rgba(0, 0, 0, 0.15)",
    "0px 25px 50px rgba(0, 0, 0, 0.15)",
    "0px 25px 50px rgba(0, 0, 0, 0.15)",
    "0px 25px 50px rgba(0, 0, 0, 0.15)",
    "0px 25px 50px rgba(0, 0, 0, 0.15)",
    "0px 25px 50px rgba(0, 0, 0, 0.15)",
    "0px 25px 50px rgba(0, 0, 0, 0.15)",
    "0px 25px 50px rgba(0, 0, 0, 0.15)",
    "0px 25px 50px rgba(0, 0, 0, 0.15)",
    "0px 25px 50px rgba(0, 0, 0, 0.15)",
    "0px 25px 50px rgba(0, 0, 0, 0.15)",
    "0px 25px 50px rgba(0, 0, 0, 0.15)",
    "0px 25px 50px rgba(0, 0, 0, 0.15)"
  ],

  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },

  typography: {
    fontFamily: "'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,

    h1: {
      fontSize: "3.5rem",
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
      "@media (max-width:960px)": {
        fontSize: "2.5rem",
      },
      "@media (max-width:600px)": {
        fontSize: "2rem",
      },
      "@media (max-width:414px)": {
        fontSize: "1.75rem",
      },
    },
    h2: {
      fontSize: "2.5rem",
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: "-0.01em",
      "@media (max-width:960px)": {
        fontSize: "2rem",
      },
      "@media (max-width:662px)": {
        fontSize: "1.75rem",
      },
      "@media (max-width:414px)": {
        fontSize: "1.5rem",
      },
    },
    h3: {
      fontSize: "2rem",
      fontWeight: 600,
      lineHeight: 1.4,
      "@media (max-width:960px)": {
        fontSize: "1.75rem",
      },
      "@media (max-width:662px)": {
        fontSize: "1.5rem",
      },
      "@media (max-width:414px)": {
        fontSize: "1.25rem",
      },
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.4,
      "@media (max-width:960px)": {
        fontSize: "1.25rem",
      },
      "@media (max-width:600px)": {
        fontSize: "1.125rem",
      },
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 500,
      lineHeight: 1.5,
      "@media (max-width:960px)": {
        fontSize: "1.125rem",
      },
      "@media (max-width:600px)": {
        fontSize: "1rem",
      },
    },
    h6: {
      fontSize: "1.125rem",
      fontWeight: 500,
      lineHeight: 1.5,
      "@media (max-width:960px)": {
        fontSize: "1rem",
      },
      "@media (max-width:600px)": {
        fontSize: "0.875rem",
      },
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: 1.6,
      "@media (max-width:960px)": {
        fontSize: "0.9375rem",
      },
      "@media (max-width:600px)": {
        fontSize: "0.875rem",
      },
    },
    body2: {
      fontSize: "0.875rem",
      fontWeight: 400,
      lineHeight: 1.6,
      "@media (max-width:960px)": {
        fontSize: "0.8125rem",
      },
      "@media (max-width:600px)": {
        fontSize: "0.75rem",
      },
    },
    button: {
      fontSize: "0.875rem",
      fontWeight: 500,
      textTransform: "none",
      letterSpacing: "0.025em"
    },
    caption: {
      fontSize: "0.75rem",
      fontWeight: 400,
      lineHeight: 1.5
    },
    overline: {
      fontSize: "0.75rem",
      fontWeight: 500,
      textTransform: "uppercase",
      letterSpacing: "0.1em"
    }
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)',
          '&:hover': {
            boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
  },
});

export default theme;