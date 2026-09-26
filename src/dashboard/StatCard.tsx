import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import type { SvgIconComponent } from "@mui/icons-material";

interface StatCardProps {
  icon: SvgIconComponent;
  label: string;
  value: string | number;
  hint?: string;
  /** Couleur du thème : primary, success, warning, error, info. */
  color?: "primary" | "success" | "warning" | "error" | "info";
  /** Delta par rapport à la période précédente (ex: +12 %). */
  trend?: { value: number; positive?: boolean };
}

export const StatCard = ({
  icon: Icon,
  label,
  value,
  hint,
  color = "primary",
  trend,
}: StatCardProps) => (
  <Card
    elevation={0}
    sx={{
      p: 2.5,
      display: "flex",
      alignItems: "flex-start",
      gap: 2,
      minHeight: 110,
      height: "100%",
      border: "1px solid",
      borderColor: "divider",
      borderRadius: 2.5,
      position: "relative",
      transition: "all 0.2s ease",
      "&:hover": {
        borderColor: `${color}.main`,
        boxShadow: (theme) =>
          `0 8px 24px -12px ${alpha(theme.palette[color].main, 0.3)}`,
        transform: "translateY(-2px)",
      },
    }}
  >
    <Box
      sx={{
        width: 48,
        height: 48,
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: (theme) =>
          `linear-gradient(135deg, ${theme.palette[color].main} 0%, ${theme.palette[color].dark} 100%)`,
        color: `${color}.contrastText`,
        flexShrink: 0,
      }}
    >
      <Icon sx={{ fontSize: 22 }} />
    </Box>
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography
        sx={{
          fontSize: 10.5,
          color: "text.secondary",
          textTransform: "uppercase",
          letterSpacing: 0.8,
          fontWeight: 700,
          mb: 0.5,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: 24,
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: "-0.5px",
          color: "text.primary",
          mb: 0.5,
        }}
      >
        {value}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, flexWrap: "wrap" }}>
        {trend && (
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 700,
              color: trend.positive !== false ? "success.main" : "error.main",
              display: "flex",
              alignItems: "center",
              gap: 0.25,
            }}
          >
            {trend.positive !== false ? "▲" : "▼"} {Math.abs(trend.value)} %
          </Typography>
        )}
        {hint && (
          <Typography
            sx={{ fontSize: 11, color: "text.secondary" }}
            noWrap
            title={hint}
          >
            {hint}
          </Typography>
        )}
      </Box>
    </Box>
  </Card>
);