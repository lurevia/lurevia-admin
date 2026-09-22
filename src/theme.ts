import { defaultTheme } from "react-admin";
import type { RaThemeOptions } from "react-admin";

const glassPaper = {
  backgroundColor: "rgba(255, 255, 255, 0.72)",
  backdropFilter: "blur(18px) saturate(160%)",
  WebkitBackdropFilter: "blur(18px) saturate(160%)",
  border: "1px solid rgba(255, 255, 255, 0.6)",
};

export const lureviaAdminTheme: RaThemeOptions = {
  ...defaultTheme,
  palette: {
    mode: "light",
    primary: { main: "#2F7BF6", light: "#5A93F9", dark: "#1749B0" },
    secondary: { main: "#0A1B3D" },
    background: { default: "#EFF5FF", paper: "rgba(255, 255, 255, 0.72)" },
  },
  typography: {
    fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif",
    h6: { fontWeight: 700 },
  },
  shape: { borderRadius: 14 },
  components: {
    ...defaultTheme.components,
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#EFF5FF",
          backgroundImage:
            "radial-gradient(48rem 30rem at 8% -10%, rgba(47, 123, 246, 0.16), transparent 60%)," +
            "radial-gradient(40rem 26rem at 108% 10%, rgba(90, 147, 249, 0.14), transparent 55%)," +
            "linear-gradient(180deg, #F3F8FF 0%, #EAF2FF 100%)",
          backgroundAttachment: "fixed",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { ...glassPaper, boxShadow: "0 8px 32px -8px rgba(20, 60, 140, 0.16)" },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(10, 27, 61, 0.82)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          boxShadow: "0 4px 24px -4px rgba(10, 27, 61, 0.35)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { ...glassPaper, borderRight: "1px solid rgba(255,255,255,0.5)" },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundImage: "linear-gradient(to bottom, #5A93F9, #2F7BF6)",
          boxShadow: "0 8px 20px -6px rgba(47, 123, 246, 0.55)",
        },
      },
      defaultProps: { disableElevation: true },
    },
    RaDatagrid: {
      styleOverrides: {
        root: {
          "& .RaDatagrid-headerCell": {
            backgroundColor: "rgba(239, 245, 255, 0.7)",
            fontWeight: 700,
          },
        },
      },
    },
  },
};
