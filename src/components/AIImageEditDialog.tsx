import { useState, type ChangeEvent } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import CloseIconModule from "@mui/icons-material/Close";
import AutoAwesomeIconModule from "@mui/icons-material/AutoAwesome";
import AutoFixHighIconModule from "@mui/icons-material/AutoFixHigh";
import WallpaperIconModule from "@mui/icons-material/Wallpaper";
import PhotoCameraIconModule from "@mui/icons-material/PhotoCamera";
import { normalizeMuiIcon } from "../muiIcon";

const CloseIcon = normalizeMuiIcon(CloseIconModule);
const AutoAwesomeIcon = normalizeMuiIcon(AutoAwesomeIconModule);
const AutoFixIcon = normalizeMuiIcon(AutoFixHighIconModule);
const WallpaperIcon = normalizeMuiIcon(WallpaperIconModule);
const PhotoCameraIcon = normalizeMuiIcon(PhotoCameraIconModule);

type AIAction = "background" | "enhance" | "restyle";

interface Props {
  open: boolean;
  onClose: () => void;
  /** URL actuelle de l'image à éditer. */
  imageUrl: string;
  /** Callback appelé quand une nouvelle image est générée/éditée. */
  onApply: (newImageUrl: string) => void;
}

/**
 * Modale d'édition d'image par IA.
 *
 * ⚠️ `callAIImageEdit` est un placeholder — à brancher sur ton backend
 * (par exemple POST /admin/ai/edit-image qui renvoie une URL S3 ou base64).
 */
export const AIImageEditDialog = ({
  open,
  onClose,
  imageUrl,
  onApply,
}: Props) => {
  const [prompt, setPrompt] = useState("");
  const [action, setAction] = useState<AIAction>("background");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);

  const callAIImageEdit = async (payload: {
    imageUrl: string;
    action: AIAction;
    prompt: string;
  }): Promise<string> => {
    // ⚠️ À BRANCHER sur ton backend :
    // const { json } = await httpClient(`${API_URL}/admin/ai/edit-image`, {
    //   method: "POST",
    //   body: JSON.stringify(payload),
    // });
    // return json.data.imageUrl;

    // ─── SIMULATION POUR LE DEV ───
    await new Promise((r) => setTimeout(r, 2000));
    // Retourne l'image d'origine pour le moment (aucun vrai traitement IA).
    return payload.imageUrl;
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setError("");
    setGeneratedUrl(null);

    try {
      const newUrl = await callAIImageEdit({ imageUrl, action, prompt });
      setGeneratedUrl(newUrl);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "L'IA n'a pas pu traiter l'image."
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleApply = () => {
    if (generatedUrl) {
      onApply(generatedUrl);
      handleClose();
    }
  };

  const handleClose = () => {
    setGeneratedUrl(null);
    setError("");
    setPrompt("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pr: 6 }}>
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.12),
              color: "primary.main",
            }}
          >
            <AutoFixIcon fontSize="small" />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 16 }}>
              Éditer l'image avec l'IA
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Améliorez, détourez ou restylez votre image automatiquement.
            </Typography>
          </Box>
        </Stack>

        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", right: 12, top: 12 }}
          aria-label="Fermer"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          {/* Comparaison avant / après */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
            }}
          >
            {/* Image d'origine */}
            <Box>
              <Typography sx={{ fontSize: 11.5, fontWeight: 700, mb: 0.75, color: "text.secondary" }}>
                ORIGINAL
              </Typography>
              <Box
                sx={{
                  aspectRatio: "1 / 1",
                  borderRadius: 2,
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: "divider",
                  backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.04),
                }}
              >
                {imageUrl ? (
                  <Box
                    component="img"
                    src={imageUrl}
                    alt="Original"
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "text.secondary",
                    }}
                  >
                    <PhotoCameraIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                  </Box>
                )}
              </Box>
            </Box>

            {/* Image générée */}
            <Box>
              <Typography sx={{ fontSize: 11.5, fontWeight: 700, mb: 0.75, color: "text.secondary" }}>
                RÉSULTAT IA
              </Typography>
              <Box
                sx={{
                  aspectRatio: "1 / 1",
                  borderRadius: 2,
                  overflow: "hidden",
                  border: "2px dashed",
                  borderColor: generatedUrl ? "primary.main" : "divider",
                  backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.04),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                {generating ? (
                  <Stack alignItems="center" spacing={1.5}>
                    <CircularProgress size={32} />
                    <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                      Traitement en cours…
                    </Typography>
                  </Stack>
                ) : generatedUrl ? (
                  <Box
                    component="img"
                    src={generatedUrl}
                    alt="Résultat IA"
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <Stack alignItems="center" spacing={1}>
                    <WallpaperIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                    <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                      Le résultat apparaîtra ici
                    </Typography>
                  </Stack>
                )}
              </Box>
            </Box>
          </Box>

          <Divider />

          {/* Choix de l'action IA */}
          <Box>
            <Typography sx={{ fontSize: 12.5, fontWeight: 700, mb: 1 }}>
              Que doit faire l'IA ?
            </Typography>
            <ToggleButtonGroup
              value={action}
              exclusive
              onChange={(_, v) => v && setAction(v)}
              fullWidth
              size="small"
            >
              <ToggleButton value="background">
                <WallpaperIcon sx={{ fontSize: 15, mr: 0.5 }} />
                Détourer
              </ToggleButton>
              <ToggleButton value="enhance">
                <AutoFixIcon sx={{ fontSize: 15, mr: 0.5 }} />
                Améliorer
              </ToggleButton>
              <ToggleButton value="restyle">
                <AutoAwesomeIcon sx={{ fontSize: 15, mr: 0.5 }} />
                Restyler
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Prompt libre */}
          <TextField
            label="Instructions (optionnel)"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ex : fond blanc uni, éclairage naturel, angle 3/4"
            fullWidth
            multiline
            rows={2}
            helperText="Décrivez ce que vous voulez obtenir pour un meilleur résultat."
          />

          {error && <Alert severity="error">{error}</Alert>}

          <Button
            variant="contained"
            onClick={handleGenerate}
            disabled={generating || !imageUrl}
            startIcon={
              generating ? (
                <CircularProgress size={16} sx={{ color: "inherit" }} />
              ) : (
                <AutoAwesomeIcon fontSize="small" />
              )
            }
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 1.5,
              py: 1,
            }}
          >
            {generating ? "Traitement…" : "Générer une nouvelle version"}
          </Button>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid", borderColor: "divider" }}>
        <Button onClick={handleClose} sx={{ textTransform: "none", fontWeight: 600 }}>
          Annuler
        </Button>
        <Button
          variant="contained"
          onClick={handleApply}
          disabled={!generatedUrl}
          sx={{ textTransform: "none", fontWeight: 700, borderRadius: 1.5 }}
        >
          Utiliser cette image
        </Button>
      </DialogActions>
    </Dialog>
  );
};