import { defaultPreset } from "./presets";
import { buildTheme } from "./buildTheme";
import type { ThemeConfig } from "./type";

export const loginThemeConfig: ThemeConfig = {
  ...defaultPreset.config,
  presetId: defaultPreset.id,
  name: defaultPreset.name,
  isCustom: false,
};

export const loginTheme = buildTheme(loginThemeConfig);