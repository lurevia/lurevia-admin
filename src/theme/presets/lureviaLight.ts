import type { ThemePreset } from "../type";


export const lureviaLight: ThemePreset = {
  id: "lurevia-light",
  name: "Lurevia Light",
  description: "Le thème signature : bleu clair et épuré.",
  preview: {
    primary: "#2F7BF6",
    background: "#F4F7FC",
    surface: "#FFFFFF",
  },
  config: {
    mode: "light",
    primary: "#2F7BF6",
    secondary: "#0A1B3D",
    background: "#F4F7FC",
    surface: "#FFFFFF",
    textPrimary: "#0A1B3D",
    textSecondary: "#5B6B84",
    border: "#E4EAF4",
    sidebarStyle: "light",
    density: "comfortable",
    borderRadius: 8,
    fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif",
  },
};