import { defaultTheme } from "react-admin";
import type { RaThemeOptions } from "react-admin";

export const lureviaAdminTheme: RaThemeOptions = {
  ...defaultTheme,
  palette: {
    mode: "dark",
    primary: { main: "#4D8DFF", light: "#83B0FF", dark: "#2864D4" },
    secondary: { main: "#8B5CF6" },
    background: { default: "#07111F", paper: "#101D30" },
    text: { primary: "#F4F7FF", secondary: "#94A7C4" },
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
          backgroundColor: "#07111F",
          backgroundImage:
            "radial-gradient(44rem 28rem at 8% -10%, rgba(77, 141, 255, 0.24), transparent 60%)," +
            "radial-gradient(38rem 26rem at 105% 8%, rgba(139, 92, 246, 0.18), transparent 58%)," +
            "linear-gradient(180deg, #0A1728 0%, #07111F 100%)",
          backgroundAttachment: "fixed",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(16, 29, 48, 0.88)",
          border: "1px solid rgba(148, 167, 196, 0.14)",
          boxShadow: "0 18px 48px -24px rgba(0, 0, 0, 0.8)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(7, 17, 31, 0.86)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          boxShadow: "0 4px 24px -4px rgba(10, 27, 61, 0.35)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "rgba(9, 22, 38, 0.94)",
          borderRight: "1px solid rgba(148, 167, 196, 0.14)",
        },
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
            backgroundColor: "rgba(77, 141, 255, 0.1)",
            fontWeight: 700,
          },
        },
      },
    },
  },
};
