import {
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import type { SitePageInput, SitePageSection } from "../adminActions";

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
  <Card sx={{ flex: 1, minWidth: 0, width: "100%" }}>
    <CardContent>
      <Stack spacing={2}>
        <TextField
          label="Adresse de la page"
          value={form.slug}
          onChange={(event) => onChange("slug", event.target.value)}
          helperText="Minuscules, chiffres et tirets. URL : /pages/slug"
          required
        />
        <TextField
          label="Titre"
          value={form.title}
          onChange={(event) => onChange("title", event.target.value)}
          required
        />
        <TextField
          label="Résumé"
          value={form.summary}
          onChange={(event) => onChange("summary", event.target.value)}
          multiline
          minRows={2}
        />
        <TextField
          label="Contenu"
          value={form.content}
          onChange={(event) => onChange("content", event.target.value)}
          multiline
          minRows={12}
          helperText="Texte brut : les paragraphes et retours à la ligne sont conservés."
        />
        <FormControlLabel
          control={
            <Switch
              checked={form.published}
              onChange={(event) => onChange("published", event.target.checked)}
            />
          }
          label="Page publiée"
        />
        <FormControlLabel
          control={
            <Switch
              checked={form.showInFooter}
              onChange={(event) =>
                onChange("showInFooter", event.target.checked)
              }
            />
          }
          label="Afficher dans le pied de page"
        />
        {form.showInFooter && (
          <FormControl size="small">
            <InputLabel id="footer-section-label">
              Colonne du pied de page
            </InputLabel>
            <Select
              labelId="footer-section-label"
              label="Colonne du pied de page"
              value={form.footerSection ?? ""}
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
        )}
        <Stack direction="row" spacing={1}>
          <Button variant="contained" disabled={saving} onClick={onSave}>
            {saving ? "Enregistrement..." : "Enregistrer"}
          </Button>
          {selected && (
            <Button color="error" disabled={saving} onClick={onDelete}>
              Supprimer
            </Button>
          )}
        </Stack>
      </Stack>
    </CardContent>
  </Card>
);
