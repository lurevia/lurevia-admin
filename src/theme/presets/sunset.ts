import type { ThemePreset } from "../type";

export const sunset: ThemePreset = {
  id: "sunset",
  name: "Sunset",
  description: "Orange chaleureux, énergique et accueillant.",
  preview: {
    primary: "#EA580C",
    background: "#FFF7ED",
    surface: "#FFFFFF",
  },
  config: {
    mode: "light",
    primary: "#EA580C",
    secondary: "#9A3412",
    background: "#FFF7ED",
    surface: "#FFFFFF",
    textPrimary: "#7C2D12",
    textSecondary: "#78716C",
    border: "#FED7AA",
    sidebarStyle: "accent",
    density: "comfortable",
    borderRadius: 12,
    fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif",
  },
};