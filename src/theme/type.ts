export type ThemeMode = "light" | "dark";
export type Density = "compact" | "comfortable" | "spacious";
export type SidebarStyle = "light" | "dark" | "accent";


export interface ThemeConfig {
  presetId: string;
  name: string;
  mode: ThemeMode;
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  sidebarStyle: SidebarStyle;
  density: Density;
  borderRadius: number;
  fontFamily: string;
  isCustom: boolean;
}

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  preview: {
    primary: string;
    background: string;
    surface: string;
    accent?: string;
  };
  config: Omit<ThemeConfig, "presetId" | "isCustom" | "name">;
}