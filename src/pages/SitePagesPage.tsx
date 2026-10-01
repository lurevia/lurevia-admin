import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { Title, useNotify } from "react-admin";
import {
  createSitePage,
  deleteSitePage,
  fetchSitePages,
  updateSitePage,
  type SitePageInput,
  type SitePageRecord,
} from "../adminActions";
import { SitePageEditor } from "./SitePageEditor";

const EMPTY_PAGE: SitePageInput = {
  slug: "",
  title: "",
  summary: "",
  content: "",
  published: false,
  showInFooter: false,
  footerSection: "INFORMATION",
};

export const SitePagesPage = () => {
  const notify = useNotify();
  const [pages, setPages] = useState<SitePageRecord[]>([]);
  const [form, setForm] = useState<SitePageInput>(EMPTY_PAGE);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setPages(await fetchSitePages());
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Impossible de charger les pages."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPages();
  }, [loadPages]);

  const editPage = (page: SitePageRecord) => {
    setSelectedId(page.id);
    setForm({
      slug: page.slug,
      title: page.title,
      summary: page.summary,
      content: page.content,
      published: page.published,
      showInFooter: page.showInFooter,
      footerSection: page.footerSection,
    });
  };

  const savePage = async () => {
    setSaving(true);
    setError(null);
    try {
      const page = selectedId
        ? await updateSitePage(selectedId, form)
        : await createSitePage(form);
      setPages((current) => [
        page,
        ...current.filter((item) => item.id !== page.id),
      ]);
      setSelectedId(page.id);
      setForm({
        slug: page.slug,
        title: page.title,
        summary: page.summary,
        content: page.content,
        published: page.published,
        showInFooter: page.showInFooter,
        footerSection: page.footerSection,
      });
      notify("Page enregistrée.", { type: "success" });
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Impossible d'enregistrer la page."
      );
    } finally {
      setSaving(false);
    }
  };

  const removePage = async () => {
    if (!selectedId || !window.confirm("Supprimer cette page ?")) return;
    setSaving(true);
    setError(null);
    try {
      await deleteSitePage(selectedId);
      setPages((current) => current.filter((page) => page.id !== selectedId));
      setSelectedId(null);
      setForm(EMPTY_PAGE);
      notify("Page supprimée.", { type: "success" });
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Impossible de supprimer la page."
      );
    } finally {
      setSaving(false);
    }
  };

  const updateField = <K extends keyof SitePageInput>(
    key: K,
    value: SitePageInput[K]
  ) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <Box sx={{ p: 3 }}>
      <Title title="Pages du site" />
      <Stack spacing={2}>
        <Typography variant="h5" fontWeight={700}>
          Pages et contenus publics
        </Typography>
        <Typography color="text.secondary">
          Publiez le contenu éditorial et choisissez les pages visibles dans le pied de page.
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="flex-start">
          <Card sx={{ width: { xs: "100%", md: 300 }, flexShrink: 0 }}>
            <CardContent>
              <Stack spacing={1}>
                <Button
                  variant="contained"
                  onClick={() => {
                    setSelectedId(null);
                    setForm(EMPTY_PAGE);
                  }}
                >
                  Créer une page
                </Button>
                {loading ? (
                  <CircularProgress size={24} sx={{ alignSelf: "center", m: 2 }} />
                ) : (
                  pages.map((page) => (
                    <Button
                      key={page.id}
                      variant={selectedId === page.id ? "outlined" : "text"}
                      onClick={() => editPage(page)}
                      sx={{ justifyContent: "flex-start", textAlign: "left" }}
                    >
                      {page.title}
                      {!page.published && " (brouillon)"}
                    </Button>
                  ))
                )}
              </Stack>
            </CardContent>
          </Card>
          <SitePageEditor
            form={form}
            saving={saving}
            selected={Boolean(selectedId)}
            onChange={updateField}
            onSave={savePage}
            onDelete={removePage}
          />
        </Stack>
      </Stack>
    </Box>
  );
};
