import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { SvgIconComponent } from "@mui/icons-material";

interface StatCardProps {
  icon: SvgIconComponent;
  label: string;
  value: string | number;
  hint?: string;
  accent?: string;
}

export const StatCard = ({ icon: Icon, label, value, hint, accent = "#2F7BF6" }: StatCardProps) => (
  <Card sx={{ p: 2.5, display: "flex", alignItems: "center", gap: 2, minHeight: 96 }}>
    <Box
      sx={{
        width: 48,
        height: 48,
        borderRadius: "14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(to bottom right, ${accent}, ${accent}CC)`,
        color: "#fff",
        flexShrink: 0,
      }}
    >
      <Icon />
    </Box>
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      {hint && (
        <Typography variant="caption" color="text.secondary">
          {hint}
        </Typography>
      )}
    </Box>
  </Card>
);
