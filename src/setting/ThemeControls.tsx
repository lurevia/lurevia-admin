import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import RestartAltIconModule from "@mui/icons-material/RestartAlt";
import { normalizeMuiIcon } from "../muiIcon";
import { useThemeCustomizer } from "../theme/ThemeCustomizerContext";
import type { Density, SidebarStyle, ThemeMode } from "../theme/type";

const ResetIcon = normalizeMuiIcon(RestartAltIconModule);

const COLOR_FIELDS = [
  { key: "primary", label: "Principale" },
  { key: "secondary", label: "Secondaire" },
  { key: "background", label: "Fond" },
  { key: "surface", label: "Surface" },
  { key: "textPrimary", label: "Texte principal" },
  { key: "textSecondary", label: "Texte secondaire" },
  { key: "border", label: "Bordure" },
] as const;

const FONT_OPTIONS = [
  "system-ui, 'Segoe UI', Roboto, sans-serif",
  "Georgia, 'Times New Roman', serif",
  "ui-monospace, SFMono-Regular, Menlo, monospace",
];

export const ThemeControls = () => {
  const { config, updateConfig, reset } = useThemeCustomizer();

  return (
    <Stack spacing={3}>
      <Box>
        <Typography sx={{ fontSize: 14, fontWeight: 800, mb: 1.5 }}>
          Personnalisation
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", lg: "repeat(3, minmax(0, 1fr))" },
            gap: 1.5,
          }}
        >
          {COLOR_FIELDS.map(({ key, label }) => (
            <TextField
              key={key}
              type="color"
              label={label}
              value={config[key]}
              onChange={(event) => updateConfig({ [key]: event.target.value })}
              InputLabelProps={{ shrink: true }}
              inputProps={{ "aria-label": `Couleur ${label.toLowerCase()}` }}
            />
          ))}
        </Box>
      </Box>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.75 }}>
            Mode
          </Typography>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={config.mode}
            aria-label="Mode du thème"
            onChange={(_, value: ThemeMode | null) => value && updateConfig({ mode: value })}
          >
            <ToggleButton value="light">Clair</ToggleButton>
            <ToggleButton value="dark">Sombre</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <FormControl size="small" sx={{ flex: 1 }}>
          <InputLabel id="theme-density-label">Densité</InputLabel>
          <Select
            labelId="theme-density-label"
            label="Densité"
            value={config.density}
            onChange={(event) => updateConfig({ density: event.target.value as Density })}
          >
            <MenuItem value="compact">Compacte</MenuItem>
            <MenuItem value="comfortable">Confortable</MenuItem>
            <MenuItem value="spacious">Aérée</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ flex: 1 }}>
          <InputLabel id="theme-sidebar-label">Barre latérale</InputLabel>
          <Select
            labelId="theme-sidebar-label"
            label="Barre latérale"
            value={config.sidebarStyle}
            onChange={(event) => updateConfig({ sidebarStyle: event.target.value as SidebarStyle })}
          >
            <MenuItem value="light">Claire</MenuItem>
            <MenuItem value="dark">Sombre</MenuItem>
            <MenuItem value="accent">Principale</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }}>
        <Box sx={{ flex: 1, minWidth: 180 }}>
          <Typography variant="caption" color="text.secondary">
            Arrondis : {config.borderRadius}px
          </Typography>
          <Slider
            min={0}
            max={16}
            step={1}
            value={config.borderRadius}
            aria-label="Arrondis"
            onChange={(_, value) => updateConfig({ borderRadius: value as number })}
          />
        </Box>

        <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 250 } }}>
          <InputLabel id="theme-font-label">Police</InputLabel>
          <Select
            labelId="theme-font-label"
            label="Police"
            value={config.fontFamily}
            onChange={(event) => updateConfig({ fontFamily: event.target.value })}
          >
            {FONT_OPTIONS.map((font) => (
              <MenuItem key={font} value={font} sx={{ fontFamily: font }}>
                {font.split(",")[0].replace(/'/g, "")}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button startIcon={<ResetIcon />} onClick={reset} sx={{ flexShrink: 0 }}>
          Réinitialiser
        </Button>
      </Stack>
    </Stack>
  );
};