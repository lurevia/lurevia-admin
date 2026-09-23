import type { SvgIconComponent } from "@mui/icons-material";

export const normalizeMuiIcon = (
  icon: SvgIconComponent | { default: SvgIconComponent }
): SvgIconComponent => ("default" in icon ? icon.default : icon);
