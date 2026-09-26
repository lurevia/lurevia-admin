import type { ThemePreset } from "../type";

export const notion: ThemePreset = {
  id: "notion",
  name: "Notion",
  description: "Minimaliste, concentré sur le contenu. Inspiré de Notion.",
  preview: {
    primary: "#2E2E2E",
    background: "#FFFFFF",
    surface: "#FFFFFF",
  },
  config: {
    mode: "light",
    primary: "#2E2E2E",
    secondary: "#57534E",
    background: "#FFFFFF",
    surface: "#FFFFFF",
    textPrimary: "#191919",
    textSecondary: "#787774",
    border: "#EBEBEB",
    sidebarStyle: "light",
    density: "comfortable",
    borderRadius: 4,
    fontFamily:
      "ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
};