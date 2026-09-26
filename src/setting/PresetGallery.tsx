import { Box, Stack, Typography, Chip } from "@mui/material";
import { alpha } from "@mui/material/styles";
import CheckIconModule from "@mui/icons-material/Check";
import { normalizeMuiIcon } from "../muiIcon";
import { useThemeCustomizer } from "../theme/ThemeCustomizerContext";
import type { ThemePreset } from "../theme/type";

const CheckIcon = normalizeMuiIcon(CheckIconModule);

export const PresetGallery = () => {
  const { presets, config, applyPreset } = useThemeCustomizer();

  return (
    <Box>
      <Typography sx={{ fontWeight: 800, fontSize: 14, mb: 1.5 }}>
        Bibliothèque de thèmes
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 1.5,
        }}
      >
        {presets.map((preset: ThemePreset) => {
          const isActive = config.presetId === preset.id;
          return (
            <Box
              key={preset.id}
              onClick={() => applyPreset(preset.id)}
              sx={{
                p: 1.5,
                borderRadius: 2,
                border: "2px solid",
                borderColor: isActive ? "primary.main" : "divider",
                backgroundColor: isActive
                  ? (theme) => alpha(theme.palette.primary.main, 0.04)
                  : "background.paper",
                cursor: "pointer",
                transition: "all 0.15s ease",
                position: "relative",
                "&:hover": {
                  borderColor: "primary.main",
                  transform: "translateY(-2px)",
                  boxShadow: (theme) =>
                    `0 6px 16px -8px ${alpha(theme.palette.primary.main, 0.3)}`,
                },
              }}
            >
              {isActive && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    backgroundColor: "primary.main",
                    color: "primary.contrastText",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CheckIcon sx={{ fontSize: 12 }} />
                </Box>
              )}

              {/* Aperçu */}
              <Box
                sx={{
                  height: 56,
                  borderRadius: 1.5,
                  backgroundColor: preset.preview.background,
                  border: `1px solid ${preset.config.border}`,
                  display: "flex",
                  alignItems: "center",
                  px: 1.25,
                  gap: 0.75,
                  mb: 1.5,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    backgroundColor: preset.preview.primary,
                    flexShrink: 0,
                  }}
                />
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 0.5 }}>
                  <Box
                    sx={{
                      height: 5,
                      borderRadius: 1,
                      backgroundColor: preset.preview.primary,
                      width: "60%",
                      opacity: 0.8,
                    }}
                  />
                  <Box
                    sx={{
                      height: 4,
                      borderRadius: 1,
                      backgroundColor: preset.config.textSecondary,
                      width: "90%",
                      opacity: 0.4,
                    }}
                  />
                </Box>
              </Box>

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography sx={{ fontSize: 12.5, fontWeight: 700 }}>
                  {preset.name}
                </Typography>
                <Chip
                  label={preset.config.mode === "light" ? "Clair" : "Sombre"}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: 9,
                    fontWeight: 700,
                    "& .MuiChip-label": { px: 0.75 },
                  }}
                />
              </Stack>
              <Typography
                sx={{
                  fontSize: 10.5,
                  color: "text.secondary",
                  mt: 0.25,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  lineHeight: 1.3,
                }}
              >
                {preset.description}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};