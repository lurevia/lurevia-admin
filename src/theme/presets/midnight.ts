import type { ThemePreset } from "../type";

export const midnight: ThemePreset = {
  id: "midnight",
  name: "Midnight",
  description: "Sombre et élégant, idéal pour de longues sessions.",
  preview: {
    primary: "#818CF8",
    background: "#0F172A",
    surface: "#1E293B",
    accent: "#6366F1",
  },
  config: {
    mode: "dark",
    primary: "#818CF8",
    secondary: "#6366F1",
    background: "#0F172A",
    surface: "#1E293B",
    textPrimary: "#E2E8F0",
    textSecondary: "#94A3B8",
    border: "#334155",
    sidebarStyle: "dark",
    density: "comfortable",
    borderRadius: 10,
    fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif",
  },
};