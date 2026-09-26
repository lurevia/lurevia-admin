import  type { ThemePreset } from "../type";

export const ocean: ThemePreset = {
  id: "ocean",
  name: "Ocean",
  description: "Bleu ciel apaisant, propre et professionnel.",
  preview: {
    primary: "#0EA5E9",
    background: "#F0F9FF",
    surface: "#FFFFFF",
  },
  config: {
    mode: "light",
    primary: "#0EA5E9",
    secondary: "#075985",
    background: "#F0F9FF",
    surface: "#FFFFFF",
    textPrimary: "#0C4A6E",
    textSecondary: "#64748B",
    border: "#E0F2FE",
    sidebarStyle: "accent",
    density: "comfortable",
    borderRadius: 10,
    fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif",
  },
};