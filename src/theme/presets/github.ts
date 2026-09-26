import type { ThemePreset } from "../type";

export const github: ThemePreset = {
  id: "github",
  name: "GitHub Dark",
  description: "Thème sombre inspiré de GitHub. Idéal pour les développeurs.",
  preview: {
    primary: "#58A6FF",
    background: "#0D1117",
    surface: "#161B22",
    accent: "#238636",
  },
  config: {
    mode: "dark",
    primary: "#58A6FF",
    secondary: "#238636",
    background: "#0D1117",
    surface: "#161B22",
    textPrimary: "#E6EDF3",
    textSecondary: "#8B949E",
    border: "#30363D",
    sidebarStyle: "dark",
    density: "compact",
    borderRadius: 6,
    fontFamily:
      "ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
};