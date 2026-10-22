import type { SvgIconComponent } from "@mui/icons-material";

export const normalizeMuiIcon = (
  icon: any
): SvgIconComponent => {
  let curr = icon;
  while (curr && typeof curr === "object" && "default" in curr) {
    curr = curr.default;
  }
  return curr as SvgIconComponent;
};
