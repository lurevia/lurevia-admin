import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import CloseIconModule from "@mui/icons-material/Close";
import AutoAwesomeIconModule from "@mui/icons-material/AutoAwesome";
import LightbulbOutlinedIconModule from "@mui/icons-material/LightbulbOutlined";
import { normalizeMuiIcon } from "../muiIcon";

const CloseIcon = normalizeMuiIcon(CloseIconModule);
const AutoAwesomeIcon = normalizeMuiIcon(AutoAwesomeIconModule);
const LightbulbIcon = normalizeMuiIcon(LightbulbOutlinedIconModule);

export interface AIGeneratedProductDetails {
  description: string;
  longDescription: string;
  tags: string[];
  sizes: string[];
  metaTitle?: string;
  metaDescription?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  /** Contexte déjà présent dans le formulaire (titre, catégorie) pour aider l'IA. */
  initialContext?: {
    title?: string;
    categoryNames?: string[];
    keywords?: string;
  };
  /** Callback appelé quand l'utilisateur accepte les suggestions. */
  onApply: (details: AIGeneratedProductDetails) => void;
}

/**
 * Modale de génération de détails produit par IA.
 *
 * ⚠️ La fonction `callAIBackend` est un placeholder : le backend doit exposer
 * un endpoint du type POST /admin/ai/generate-product-details.
 * Voir plus bas pour la structure attendue.
 */
export const AIGenerateDialog = ({
  open,
  onClose,
  initialContext,
  onApply,
}: Props) => {
  const [title, setTitle] = useState(initialContext?.title ?? "");
  const [keywords, setKeywords] = useState(initialContext?.keywords ?? "");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AIGeneratedProductDetails | null>(null);

  // ─── Appel backend IA ───
  const callAIBackend = async (
    payload: { title: string; keywords: string; categoryNames: string[] }
  ): Promise<AIGeneratedProductDetails> => {
    // ⚠️ À brancher sur ton endpoint backend
    // Exemple :
    // const { json } = await httpClient(`${API_URL}/admin/ai/generate-product-details`, {
    //   method: "POST",
    //   body: JSON.stringify(payload),
    // });
    // return json.data;

    // ─── SIMULATION POUR LE DEV ───
    await new Promise((r) => setTimeout(r, 1500));
    return {
      description: `Découvrez "${payload.title || "ce produit"}" — une pièce artisanale unique, travaillée à la main par des artisans malgaches.`,
      longDescription: `Ce produit allie savoir-faire traditionnel et design contemporain.\n\nChaque pièce est unique et reflète la richesse du patrimoine malgache. Matériaux naturels, fabrication locale, finitions soignées.\n\nIdéal pour un usage quotidien ou comme cadeau original.`,
      tags: [payload.keywords, "artisanat", "fait main", "Madagascar", "local"]
        .filter(Boolean)
        .slice(0, 5),
      sizes: ["Taille unique"],
    };
  };

  const handleGenerate = async () => {
    if (!title.trim()) {
      setError("Le titre du produit est requis pour générer une description.");
      return;
    }

    setGenerating(true);
    setError("");
    setResult(null);

    try {
      const generated = await callAIBackend({
        title: title.trim(),
        keywords: keywords.trim(),
        categoryNames: initialContext?.categoryNames ?? [],
      });
      setResult(generated);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible de générer les détails du produit."
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleApply = () => {
    if (result) {
      onApply(result);
      handleClose();
    }
  };

  const handleClose = () => {
    setResult(null);
    setError("");
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
            <AutoAwesomeIcon fontSize="small" />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 16 }}>
              Générer les détails avec l'IA
            </Typography>
            <Typography variant="caption" color="text.secondary">
              L'IA rédige la description, les tags et les tailles suggérées.
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
          <Alert
            severity="info"
            icon={<LightbulbIcon fontSize="small" />}
            sx={{ py: 0.75, "& .MuiAlert-message": { fontSize: 12.5 } }}
          >
            Donnez un titre et quelques mots-clés, l'IA s'occupe du reste. Vous
            pourrez modifier le résultat avant de l'appliquer.
          </Alert>

          <TextField
            label="Titre du produit"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex : Sac en raphia naturel tressé main"
            fullWidth
            required
          />

          <TextField
            label="Mots-clés (séparés par des virgules)"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="Ex : raphia, naturel, artisanal, écologique"
            fullWidth
            helperText="Ces mots aident l'IA à générer un contenu ciblé."
          />

          {error && <Alert severity="error">{error}</Alert>}

          <Button
            variant="contained"
            onClick={handleGenerate}
            disabled={generating}
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
            {generating ? "Génération en cours…" : "Générer"}
          </Button>

          {result && (
            <>
              <Divider sx={{ my: 1 }} />
              <Typography
                variant="overline"
                sx={{ fontWeight: 700, color: "text.secondary", letterSpacing: 1 }}
              >
                Résultat
              </Typography>

              <Box>
                <Typography sx={{ fontSize: 12, fontWeight: 700, mb: 0.5 }}>
                  Description courte
                </Typography>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 1.5,
                    backgroundColor: "action.hover",
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: "text.primary",
                  }}
                >
                  {result.description}
                </Box>
              </Box>

              <Box>
                <Typography sx={{ fontSize: 12, fontWeight: 700, mb: 0.5 }}>
                  Description longue
                </Typography>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 1.5,
                    backgroundColor: "action.hover",
                    fontSize: 13,
                    lineHeight: 1.6,
                    whiteSpace: "pre-wrap",
                    color: "text.primary",
                  }}
                >
                  {result.longDescription}
                </Box>
              </Box>

              <Box>
                <Typography sx={{ fontSize: 12, fontWeight: 700, mb: 0.75 }}>
                  Tags suggérés
                </Typography>
                <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                  {result.tags.map((tag, i) => (
                    <Chip
                      key={i}
                      label={tag}
                      size="small"
                      sx={{ fontSize: 11, height: 22, fontWeight: 600 }}
                    />
                  ))}
                </Stack>
              </Box>

              <Box>
                <Typography sx={{ fontSize: 12, fontWeight: 700, mb: 0.75 }}>
                  Tailles suggérées
                </Typography>
                <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                  {result.sizes.map((size, i) => (
                    <Chip
                      key={i}
                      label={size}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: 11, height: 22, fontWeight: 600 }}
                    />
                  ))}
                </Stack>
              </Box>
            </>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid", borderColor: "divider" }}>
        <Button onClick={handleClose} sx={{ textTransform: "none", fontWeight: 600 }}>
          Annuler
        </Button>
        <Button
          variant="contained"
          onClick={handleApply}
          disabled={!result}
          sx={{ textTransform: "none", fontWeight: 700, borderRadius: 1.5 }}
        >
          Appliquer au formulaire
        </Button>
      </DialogActions>
    </Dialog>
  );
};