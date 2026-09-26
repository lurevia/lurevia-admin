import type { ThemePreset } from "../type";

export const graphite: ThemePreset = {
  id: "graphite",
  name: "Graphite",
  description: "Gris neutre, sobre et intemporel.",
  preview: {
    primary: "#475569",
    background: "#F8FAFC",
    surface: "#FFFFFF",
  },
  config: {
    mode: "light",
    primary: "#475569",
    secondary: "#1E293B",
    background: "#F8FAFC",
    surface: "#FFFFFF",
    textPrimary: "#0F172A",
    textSecondary: "#64748B",
    border: "#E2E8F0",
    sidebarStyle: "dark",
    density: "compact",
    borderRadius: 6,
    fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif",
  },
};