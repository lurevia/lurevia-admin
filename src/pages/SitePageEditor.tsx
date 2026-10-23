import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import SaveIconModule from "@mui/icons-material/Save";
import DeleteOutlineIconModule from "@mui/icons-material/DeleteOutline";
import ArticleOutlinedIconModule from "@mui/icons-material/ArticleOutlined";
import PublicIconModule from "@mui/icons-material/Public";
import { normalizeMuiIcon } from "../muiIcon";
import type { SitePageInput, SitePageSection } from "../adminActions";

const SaveIcon = normalizeMuiIcon(SaveIconModule);
const DeleteOutlineIcon = normalizeMuiIcon(DeleteOutlineIconModule);
const ArticleOutlinedIcon = normalizeMuiIcon(ArticleOutlinedIconModule);
const PublicIcon = normalizeMuiIcon(PublicIconModule);

const FOOTER_SECTIONS: { value: SitePageSection; label: string }[] = [
  { value: "NAVIGATION", label: "Navigation" },
  { value: "SERVICES", label: "Service client" },
  { value: "INFORMATION", label: "Informations" },
];

type SitePageEditorProps = {
  form: SitePageInput;
  saving: boolean;
  selected: boolean;
  onChange: <K extends keyof SitePageInput>(
    key: K,
    value: SitePageInput[K]
  ) => void;
  onSave: () => void;
  onDelete: () => void;
};

export const SitePageEditor = ({
  form,
  saving,
  selected,
  onChange,
  onSave,
  onDelete,
}: SitePageEditorProps) => (
  <Card sx={{ flex: 1, minWidth: 0, width: "100%", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
      <Stack spacing={3}>
        {/* En-tête de l'éditeur */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
          <Stack direction="row" spacing={1.25} alignItems="center">
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: (theme) =>
                  theme.palette.mode === "dark" ? "rgba(47, 123, 246, 0.15)" : "rgba(47, 123, 246, 0.1)",
                color: "primary.main",
              }}
            >
              <ArticleOutlinedIcon fontSize="small" />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                {selected ? "Modifier la page" : "Nouvelle page"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {selected
                  ? `Édition de « ${form.title || form.slug || "page"} »`
                  : "Renseignez les champs ci-dessous pour créer une nouvelle page"}
              </Typography>
            </Box>
          </Stack>

          {form.published && (
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                px: 1.25,
                py: 0.5,
                borderRadius: 1,
                bgcolor: "success.light",
                color: "success.dark",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              <PublicIcon sx={{ fontSize: 14 }} />
              Publiée en ligne
            </Box>
          )}
        </Box>

        <Divider />

        {/* Formulaire principal */}
        <Stack spacing={2.5}>
          <TextField
            label="Adresse de la page (slug)"
            value={form.slug}
            onChange={(event) => onChange("slug", event.target.value)}
            helperText="Minuscules, chiffres et tirets uniquement. URL d'accès : /pages/[slug]"
            placeholder="ex: mentions-legales"
            required
            fullWidth
            variant="outlined"
            size="small"
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Titre de la page"
            value={form.title}
            onChange={(event) => onChange("title", event.target.value)}
            placeholder="ex: Mentions Légales & Conditions Générales"
            required
            fullWidth
            variant="outlined"
            size="small"
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Résumé / Description succincte"
            value={form.summary}
            onChange={(event) => onChange("summary", event.target.value)}
            placeholder="Court texte de présentation ou meta-description (optionnel)..."
            multiline
            minRows={2}
            maxRows={4}
            fullWidth
            variant="outlined"
            size="small"
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Contenu principal de la page"
            value={form.content}
            onChange={(event) => onChange("content", event.target.value)}
            placeholder="Rédigez le contenu textuel de la page ici..."
            multiline
            minRows={10}
            helperText="Texte brut : les sauts de ligne et paragraphes sont automatiquement conservés à la lecture."
            fullWidth
            variant="outlined"
            size="small"
            InputLabelProps={{ shrink: true }}
          />
        </Stack>

        {/* Section Visibilité et Pied de page */}
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            borderRadius: 1.5,
            bgcolor: (theme) =>
              theme.palette.mode === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)",
          }}
        >
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
            Paramètres de visibilité & Navigation
          </Typography>

          <Stack spacing={1.5}>
            <FormControlLabel
              control={
                <Switch
                  checked={form.published}
                  onChange={(event) => onChange("published", event.target.checked)}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    Page publiée
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Rendre cette page immédiatement consultable par les visiteurs
                  </Typography>
                </Box>
              }
            />

            <FormControlLabel
              control={
                <Switch
                  checked={form.showInFooter}
                  onChange={(event) => onChange("showInFooter", event.target.checked)}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    Afficher dans le pied de page
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Ajouter automatiquement un lien direct vers cette page dans le footer
                  </Typography>
                </Box>
              }
            />

            {form.showInFooter && (
              <Box sx={{ pt: 1, pl: { sm: 4 } }}>
                <FormControl fullWidth size="small" variant="outlined">
                  <InputLabel id="footer-section-label" shrink>
                    Colonne du pied de page
                  </InputLabel>
                  <Select
                    labelId="footer-section-label"
                    label="Colonne du pied de page"
                    value={form.footerSection ?? ""}
                    notched
                    onChange={(event) =>
                      onChange(
                        "footerSection",
                        FOOTER_SECTIONS.find(
                          (section) => section.value === event.target.value
                        )?.value ?? null
                      )
                    }
                  >
                    {FOOTER_SECTIONS.map((section) => (
                      <MenuItem key={section.value} value={section.value}>
                        {section.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}
          </Stack>
        </Paper>

        <Divider />

        {/* Boutons d'action */}
        <Stack direction="row" spacing={1.5} justifyContent="flex-start" alignItems="center">
          <Button
            variant="contained"
            color="primary"
            disabled={saving}
            onClick={onSave}
            startIcon={<SaveIcon />}
            sx={{ px: 2.5, py: 0.85, fontWeight: 700 }}
          >
            {saving ? "Enregistrement..." : selected ? "Enregistrer les modifications" : "Créer la page"}
          </Button>

          {selected && (
            <Button
              color="error"
              variant="outlined"
              disabled={saving}
              onClick={onDelete}
              startIcon={<DeleteOutlineIcon />}
              sx={{ px: 2, py: 0.85 }}
            >
              Supprimer la page
            </Button>
          )}
        </Stack>
      </Stack>
    </CardContent>
  </Card>
);
