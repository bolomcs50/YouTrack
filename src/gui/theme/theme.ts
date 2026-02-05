import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#818cf8", // Indigo-400 (lighter for dark mode)
      light: "#a5b4fc", // Indigo-300
      dark: "#6366f1", // Indigo-500
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#a78bfa", // Purple-400 (lighter for dark mode)
      light: "#c4b5fd", // Purple-300
      dark: "#8b5cf6", // Purple-500
      contrastText: "#ffffff",
    },
    background: {
      default: "#0f172a", // Slate-900
      paper: "#1e293b", // Slate-800
    },
    text: {
      primary: "#f1f5f9", // Slate-100
      secondary: "#cbd5e1", // Slate-300
    },
    error: {
      main: "#f87171", // Red-400
    },
    warning: {
      main: "#fbbf24", // Amber-400
    },
    info: {
      main: "#60a5fa", // Blue-400
    },
    success: {
      main: "#34d399", // Emerald-400
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
    },
    h2: {
      fontWeight: 700,
      fontSize: "2rem",
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.75rem",
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.5rem",
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.25rem",
    },
    h6: {
      fontWeight: 600,
      fontSize: "1rem",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 8,
          padding: "8px 16px",
        },
        contained: {
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          "&:hover": {
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        },
        elevation1: {
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        },
        elevation2: {
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        },
        elevation3: {
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "2px 0 8px rgba(0, 0, 0, 0.3)",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: "4px 8px",
          "&:hover": {
            backgroundColor: "rgba(129, 140, 248, 0.12)",
          },
          "&.Mui-selected": {
            backgroundColor: "rgba(129, 140, 248, 0.2)",
            "&:hover": {
              backgroundColor: "rgba(129, 140, 248, 0.25)",
            },
            "& .MuiListItemIcon-root": {
              color: "#818cf8",
            },
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-head": {
            backgroundColor: "rgba(139, 92, 246)",
            fontWeight: 600,
            color: "#f1f5f9",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        },
      },
    },
  },
});
