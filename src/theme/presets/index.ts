import { lureviaLight } from "./lureviaLight";
import { midnight } from "./midnight";
import { ocean } from "./ocean";
import { forest } from "./forest";
import { sunset } from "./sunset";
import { graphite } from "./graphite";
import { notion } from "./notion";
import { github } from "./github";
import { custom } from "./custom";
import type { ThemePreset } from "../type";

export const presets: ThemePreset[] = [
  lureviaLight,
  midnight,
  ocean,
  forest,
  sunset,
  graphite,
  notion,
  github,
  custom
];

export const defaultPreset = lureviaLight;