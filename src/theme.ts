import { defaultTheme } from "react-admin";
import type { RaThemeOptions } from "react-admin";

/**
 * Thème repensé pour ressembler à la boutique : clair, bleu, simple.
 * On abandonne le thème sombre + glassmorphism (trop chargé, radius
 * trop élevé) pour quelque chose de plat et net — cartes blanches à
 * bord fin, coins peu arrondis, pas de flou.
 */
export const lureviaAdminTheme: RaThemeOptions = {
  ...defaultTheme,
  palette: {
    mode: "light",
    primary: { main: "#2F7BF6", light: "#5A93F9", dark: "#1749B0" },
    secondary: { main: "#0A1B3D" },
    background: { default: "#F4F7FC", paper: "#FFFFFF" },
    text: { primary: "#0A1B3D", secondary: "#5B6B84" },
  },
  typography: {
    fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif",
    h6: { fontWeight: 700 },
  },
  shape: { borderRadius: 8 },
  components: {
    ...defaultTheme.components,
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: "#F4F7FC" },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          border: "1px solid #E4EAF4",
          boxShadow: "0 1px 2px rgba(10, 27, 61, 0.04)",
          backgroundImage: "none",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 10 },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          color: "#0A1B3D",
          borderBottom: "1px solid #E4EAF4",
          boxShadow: "none",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#FFFFFF",
          borderRight: "1px solid #E4EAF4",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, textTransform: "none", fontWeight: 600 },
        containedPrimary: {
          backgroundColor: "#2F7BF6",
          boxShadow: "none",
          "&:hover": { backgroundColor: "#1749B0", boxShadow: "none" },
        },
      },
      defaultProps: { disableElevation: true },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: 6, fontWeight: 600 } },
    },
    MuiTextField: {
      defaultProps: { size: "small" },
    },
    RaDatagrid: {
      styleOverrides: {
        root: {
          "& .RaDatagrid-headerCell": {
            backgroundColor: "#F4F7FC",
            fontWeight: 700,
            color: "#0A1B3D",
          },
          "& .RaDatagrid-row:hover": { backgroundColor: "#F4F7FC" },
        },
      },
    },
    RaMenuItemLink: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          "&.RaMenuItemLink-active": {
            backgroundColor: "#EFF5FF",
            color: "#1749B0",
            fontWeight: 700,
          },
        },
      },
    },
  },
};
