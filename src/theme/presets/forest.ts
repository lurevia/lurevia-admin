import type { ThemePreset } from "../type";

export const forest: ThemePreset = {
  id: "forest",
  name: "Forest",
  description: "Vert émeraude, naturel et rassurant.",
  preview: {
    primary: "#059669",
    background: "#F0FDF4",
    surface: "#FFFFFF",
  },
  config: {
    mode: "light",
    primary: "#059669",
    secondary: "#065F46",
    background: "#F0FDF4",
    surface: "#FFFFFF",
    textPrimary: "#064E3B",
    textSecondary: "#64748B",
    border: "#D1FAE5",
    sidebarStyle: "light",
    density: "comfortable",
    borderRadius: 8,
    fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif",
  },
};