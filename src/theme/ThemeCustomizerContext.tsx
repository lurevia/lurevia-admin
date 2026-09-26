import {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
  type ReactNode,
} from "react";
import type { ThemeConfig, ThemePreset } from "./type";
import { presets, defaultPreset } from "./presets";

const STORAGE_KEY = "lurevia-admin-theme";

interface ThemeContextValue {
  config: ThemeConfig;
  presets: ThemePreset[];
  applyPreset: (presetId: string) => void;
  updateConfig: (patch: Partial<ThemeConfig>) => void;
  reset: () => void;
}

const ThemeCustomizerContext = createContext<ThemeContextValue | null>(null);

function presetToConfig(preset: ThemePreset): ThemeConfig {
  return {
    ...preset.config,
    presetId: preset.id,
    name: preset.name,
    isCustom: false,
  };
}

function loadFromStorage(): ThemeConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return presetToConfig(defaultPreset);
    const parsed = JSON.parse(raw) as ThemeConfig;
    if (!parsed.presetId || !parsed.primary) return presetToConfig(defaultPreset);
    return parsed;
  } catch {
    return presetToConfig(defaultPreset);
  }
}

export function ThemeCustomizerProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ThemeConfig>(loadFromStorage);

  // Persistance automatique à chaque changement
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
      // Quota dépassé ou mode privé : on ignore silencieusement
    }
  }, [config]);

  const applyPreset = useCallback((presetId: string) => {
    const preset = presets.find((p) => p.id === presetId);
    if (preset) setConfig(presetToConfig(preset));
  }, []);

  const updateConfig = useCallback((patch: Partial<ThemeConfig>) => {
    setConfig((prev) => ({
      ...prev,
      ...patch,
      presetId: patch.presetId ?? "custom",
      name: patch.name ?? "Personnalisé",
      isCustom: true,
    }));
  }, []);

  const reset = useCallback(() => {
    setConfig(presetToConfig(defaultPreset));
  }, []);

  const value = useMemo(
    () => ({ config, presets, applyPreset, updateConfig, reset }),
    [config, applyPreset, updateConfig, reset]
  );

  return (
    <ThemeCustomizerContext.Provider value={value}>
      {children}
    </ThemeCustomizerContext.Provider>
  );
}

export function useThemeCustomizer(): ThemeContextValue {
  const ctx = useContext(ThemeCustomizerContext);
  if (!ctx) {
    throw new Error(
      "useThemeCustomizer doit être utilisé dans <ThemeCustomizerProvider>."
    );
  }
  return ctx;
}