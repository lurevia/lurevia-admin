import { useEffect, useState } from "react";
import { Title, useNotify } from "react-admin";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  FormControlLabel,
  Skeleton,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
  Chip,
  InputAdornment,
  Avatar,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import SaveIconModule from "@mui/icons-material/Save";
import RefreshIconModule from "@mui/icons-material/Refresh";
import StorefrontIconModule from "@mui/icons-material/Storefront";
import PaletteIconModule from "@mui/icons-material/Palette";
import LockIconModule from "@mui/icons-material/Lock";
import LocalShippingIconModule from "@mui/icons-material/LocalShipping";
import PaymentIconModule from "@mui/icons-material/Payment";
import ShareIconModule from "@mui/icons-material/Share";
import SearchIconModule from "@mui/icons-material/Search";
import TuneIconModule from "@mui/icons-material/Tune";
import WarningAmberIconModule from "@mui/icons-material/WarningAmber";
import {
  fetchSettings,
  updateSettings,
  type PlatformSettings,
} from "../adminActions";
import { normalizeMuiIcon } from "../muiIcon";

const SaveIcon = normalizeMuiIcon(SaveIconModule);
const RefreshIcon = normalizeMuiIcon(RefreshIconModule);
const StoreIcon = normalizeMuiIcon(StorefrontIconModule);
const PaletteIcon = normalizeMuiIcon(PaletteIconModule);
const LockIcon = normalizeMuiIcon(LockIconModule);
const ShippingIcon = normalizeMuiIcon(LocalShippingIconModule);
const PaymentIcon = normalizeMuiIcon(PaymentIconModule);
const ShareIcon = normalizeMuiIcon(ShareIconModule);
const SearchIcon = normalizeMuiIcon(SearchIconModule);
const TuneIcon = normalizeMuiIcon(TuneIconModule);
const WarningIcon = normalizeMuiIcon(WarningAmberIconModule);

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

type TabKey =
  | "general"
  | "branding"
  | "privacy"
  | "shipping"
  | "payments"
  | "social"
  | "advanced";

interface TabConfig {
  key: TabKey;
  label: string;
  icon: any;
}

const TABS: TabConfig[] = [
  { key: "general", label: "Général", icon: StoreIcon },
  { key: "branding", label: "Marque", icon: PaletteIcon },
  { key: "privacy", label: "Confidentialité", icon: LockIcon },
  { key: "shipping", label: "Livraison", icon: ShippingIcon },
  { key: "payments", label: "Paiements", icon: PaymentIcon },
  { key: "social", label: "Réseaux", icon: ShareIcon },
  { key: "advanced", label: "Avancé", icon: TuneIcon },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS UI
// ─────────────────────────────────────────────────────────────────────────────

const SectionHeader = ({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description?: string;
  icon?: any;
}) => (
  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
    {Icon && (
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
          color: "primary.main",
          flexShrink: 0,
        }}
      >
        <Icon sx={{ fontSize: 18 }} />
      </Box>
    )}
    <Box>
      <Typography sx={{ fontWeight: 800, fontSize: 15, mb: 0.25 }}>
        {title}
      </Typography>
      {description && (
        <Typography variant="caption" color="text.secondary">
          {description}
        </Typography>
      )}
    </Box>
  </Stack>
);

const FieldGroup = ({ children }: { children: React.ReactNode }) => (
  <Stack spacing={2.5}>{children}</Stack>
);

// ─────────────────────────────────────────────────────────────────────────────
// PAGE PRINCIPALE
// ─────────────────────────────────────────────────────────────────────────────

export const SettingsPage = () => {
  const notify = useNotify();
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [draft, setDraft] = useState<Partial<PlatformSettings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<TabKey>("general");

  const loadSettings = () => {
    setLoading(true);
    fetchSettings()
      .then((data) => {
        setSettings(data);
        setDraft({});
      })
      .catch(() => notify("Impossible de charger les paramètres.", { type: "error" }))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getValue = <K extends keyof PlatformSettings>(key: K): PlatformSettings[K] => {
    if (key in draft) return draft[key] as PlatformSettings[K];
    return (settings?.[key] ?? "") as PlatformSettings[K];
  };

  const setValue = <K extends keyof PlatformSettings>(key: K, value: PlatformSettings[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const hasChanges = Object.keys(draft).length > 0;

  const handleSave = async () => {
    if (!hasChanges) return;
    setSaving(true);
    try {
      const updated = await updateSettings(draft);
      setSettings(updated);
      setDraft({});
      notify("Paramètres enregistrés.", { type: "success" });
    } catch (err) {
      notify(
        err instanceof Error ? err.message : "Erreur lors de l'enregistrement.",
        { type: "error" }
      );
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setDraft({});
    notify("Modifications annulées.", { type: "info" });
  };

  if (loading) {
    return (
      <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1100, mx: "auto" }}>
        <Title title="Paramètres" />
        <Skeleton variant="text" width={200} height={40} />
        <Skeleton variant="text" width={400} height={24} sx={{ mb: 3 }} />
        <Skeleton variant="rounded" height={60} sx={{ mb: 3 }} />
        <Skeleton variant="rounded" height={500} />
      </Box>
    );
  }

  if (!settings) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Impossible de charger les paramètres.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1100, mx: "auto" }}>
      <Title title="Paramètres" />

      {/* ═══ HEADER ═══ */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.25 }}>
            Paramètres de la plateforme
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ces paramètres affectent l'administration ET la boutique cliente.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5}>
          {hasChanges && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={handleReset}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Annuler
            </Button>
          )}
          <Button
            variant="contained"
            size="small"
            startIcon={saving ? <CircularProgress size={16} sx={{ color: "inherit" }} /> : <SaveIcon />}
            onClick={handleSave}
            disabled={!hasChanges || saving}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 1.5,
              boxShadow: "none",
            }}
          >
            {saving ? "Enregistrement…" : "Enregistrer"}
          </Button>
        </Stack>
      </Stack>

      {hasChanges && (
        <Alert severity="info" sx={{ mb: 2, borderRadius: 2, py: 0.75 }}>
          Vous avez des modifications non enregistrées.
        </Alert>
      )}

      {/* ═══ ONGLETS + CONTENU ═══ */}
      <Card
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2.5,
          overflow: "hidden",
        }}
      >
        <Box sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              minHeight: 56,
              px: 1,
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 700,
                fontSize: 12.5,
                minHeight: 56,
                px: 2,
              },
            }}
          >
            {TABS.map((t) => (
              <Tab
                key={t.key}
                value={t.key}
                icon={<t.icon sx={{ fontSize: 16 }} />}
                iconPosition="start"
                label={t.label}
              />
            ))}
          </Tabs>
        </Box>

        <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
          {/* ═══════ GÉNÉRAL ═══════ */}
          {tab === "general" && (
            <FieldGroup>
              <SectionHeader
                title="Informations générales"
                description="Les informations de base de votre boutique."
                icon={StoreIcon}
              />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5}>
                <TextField
                  label="Nom du site"
                  value={getValue("siteName")}
                  onChange={(e) => setValue("siteName", e.target.value)}
                  fullWidth
                  size="small"
                  required
                />
                <TextField
                  label="Slogan"
                  value={getValue("siteTagline")}
                  onChange={(e) => setValue("siteTagline", e.target.value)}
                  fullWidth
                  size="small"
                />
              </Stack>

              <TextField
                label="Description"
                value={getValue("siteDescription")}
                onChange={(e) => setValue("siteDescription", e.target.value)}
                fullWidth
                size="small"
                multiline
                rows={2}
                helperText="Apparaît dans les résultats de recherche Google."
              />

              <Divider />

              <SectionHeader
                title="Contact"
                description="Comment vos clients peuvent vous joindre."
              />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5}>
                <TextField
                  label="Email de contact"
                  type="email"
                  value={getValue("contactEmail")}
                  onChange={(e) => setValue("contactEmail", e.target.value)}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Téléphone"
                  value={getValue("contactPhone")}
                  onChange={(e) => setValue("contactPhone", e.target.value)}
                  fullWidth
                  size="small"
                />
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5}>
                <TextField
                  label="Adresse"
                  value={getValue("contactAddress")}
                  onChange={(e) => setValue("contactAddress", e.target.value)}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Devise par défaut"
                  value={getValue("defaultCurrency")}
                  onChange={(e) => setValue("defaultCurrency", e.target.value)}
                  size="small"
                  sx={{ minWidth: 180 }}
                  helperText="Code ISO (ex : MGA)"
                  inputProps={{ maxLength: 3 }}
                />
              </Stack>

              <Divider />

              <SectionHeader title="SEO" description="Apparence dans les moteurs de recherche." icon={SearchIcon} />

              <TextField
                label="Meta title"
                value={getValue("metaTitle") ?? ""}
                onChange={(e) => setValue("metaTitle", e.target.value)}
                fullWidth
                size="small"
                inputProps={{ maxLength: 100 }}
                helperText={`${(getValue("metaTitle") ?? "").length} / 100 caractères`}
              />
              <TextField
                label="Meta description"
                value={getValue("metaDescription") ?? ""}
                onChange={(e) => setValue("metaDescription", e.target.value)}
                fullWidth
                size="small"
                multiline
                rows={2}
                inputProps={{ maxLength: 200 }}
                helperText={`${(getValue("metaDescription") ?? "").length} / 200 caractères`}
              />
            </FieldGroup>
          )}

          {/* ═══════ MARQUE ═══════ */}
          {tab === "branding" && (
            <FieldGroup>
              <SectionHeader
                title="Identité visuelle"
                description="Logo, favicon et couleurs de votre marque."
                icon={PaletteIcon}
              />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems="flex-start">
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    src={getValue("logoUrl") || undefined}
                    variant="rounded"
                    sx={{
                      width: 80,
                      height: 80,
                      border: "1px solid",
                      borderColor: "divider",
                      backgroundColor: "action.hover",
                    }}
                  >
                    L
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontSize: 12.5, fontWeight: 700, mb: 0.5 }}>
                      Logo
                    </Typography>
                    <TextField
                      value={getValue("logoUrl") ?? ""}
                      onChange={(e) => setValue("logoUrl", e.target.value)}
                      size="small"
                      placeholder="https://..."
                      fullWidth
                      sx={{ minWidth: 280 }}
                    />
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    src={getValue("faviconUrl") || undefined}
                    variant="rounded"
                    sx={{
                      width: 40,
                      height: 40,
                      border: "1px solid",
                      borderColor: "divider",
                      backgroundColor: "action.hover",
                    }}
                  >
                    F
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontSize: 12.5, fontWeight: 700, mb: 0.5 }}>
                      Favicon
                    </Typography>
                    <TextField
                      value={getValue("faviconUrl") ?? ""}
                      onChange={(e) => setValue("faviconUrl", e.target.value)}
                      size="small"
                      placeholder="https://..."
                      sx={{ minWidth: 280 }}
                    />
                  </Box>
                </Box>
              </Stack>

              <Divider />

              <SectionHeader
                title="Couleurs"
                description="Ces couleurs seront utilisées par défaut sur la boutique cliente."
              />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5}>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: 12.5, fontWeight: 700, mb: 1 }}>
                    Couleur principale
                  </Typography>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <input
                      type="color"
                      value={getValue("primaryColor")}
                      onChange={(e) => setValue("primaryColor", e.target.value)}
                      style={{
                        width: 48,
                        height: 36,
                        padding: 0,
                        border: "none",
                        borderRadius: 8,
                        cursor: "pointer",
                        background: "none",
                      }}
                    />
                    <TextField
                      value={getValue("primaryColor")}
                      onChange={(e) => setValue("primaryColor", e.target.value)}
                      size="small"
                      fullWidth
                      inputProps={{ maxLength: 7 }}
                    />
                  </Stack>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: 12.5, fontWeight: 700, mb: 1 }}>
                    Couleur secondaire
                  </Typography>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <input
                      type="color"
                      value={getValue("secondaryColor")}
                      onChange={(e) => setValue("secondaryColor", e.target.value)}
                      style={{
                        width: 48,
                        height: 36,
                        padding: 0,
                        border: "none",
                        borderRadius: 8,
                        cursor: "pointer",
                        background: "none",
                      }}
                    />
                    <TextField
                      value={getValue("secondaryColor")}
                      onChange={(e) => setValue("secondaryColor", e.target.value)}
                      size="small"
                      fullWidth
                      inputProps={{ maxLength: 7 }}
                    />
                  </Stack>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: 12.5, fontWeight: 700, mb: 1 }}>
                    Couleur d'accent
                  </Typography>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <input
                      type="color"
                      value={getValue("accentColor")}
                      onChange={(e) => setValue("accentColor", e.target.value)}
                      style={{
                        width: 48,
                        height: 36,
                        padding: 0,
                        border: "none",
                        borderRadius: 8,
                        cursor: "pointer",
                        background: "none",
                      }}
                    />
                    <TextField
                      value={getValue("accentColor")}
                      onChange={(e) => setValue("accentColor", e.target.value)}
                      size="small"
                      fullWidth
                      inputProps={{ maxLength: 7 }}
                    />
                  </Stack>
                </Box>
              </Stack>

              <Alert severity="info" sx={{ borderRadius: 2 }}>
                💡 Pour personnaliser le thème <strong>de votre interface admin</strong>, utilisez
                le bouton 🎨 dans la barre supérieure.
              </Alert>
            </FieldGroup>
          )}

          {/* ═══════ CONFIDENTIALITÉ ═══════ */}
          {tab === "privacy" && (
            <FieldGroup>
              <SectionHeader
                title="Documents légaux"
                description="Ces contenus sont affichés sur le site client."
                icon={LockIcon}
              />

              <TextField
                label="Politique de confidentialité"
                value={getValue("privacyPolicy")}
                onChange={(e) => setValue("privacyPolicy", e.target.value)}
                fullWidth
                multiline
                rows={8}
                size="small"
                placeholder="Rédigez ici votre politique de confidentialité..."
                helperText="Markdown accepté. Conforme à la Loi 2014-038 sur la protection des données."
              />

              <TextField
                label="Conditions générales de vente"
                value={getValue("termsOfService")}
                onChange={(e) => setValue("termsOfService", e.target.value)}
                fullWidth
                multiline
                rows={8}
                size="small"
                placeholder="Rédigez ici vos CGV..."
                helperText="Markdown accepté."
              />

              <TextField
                label="Message de cookies"
                value={getValue("cookieMessage")}
                onChange={(e) => setValue("cookieMessage", e.target.value)}
                fullWidth
                size="small"
                multiline
                rows={2}
                placeholder="Nous utilisons des cookies pour améliorer votre expérience."
                helperText="Affiché dans la bannière cookies du site client."
              />

              <Divider />

              <SectionHeader title="Informations légales de l'entreprise" />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5}>
                <TextField
                  label="Raison sociale"
                  value={getValue("legalCompanyName")}
                  onChange={(e) => setValue("legalCompanyName", e.target.value)}
                  fullWidth
                  size="small"
                  placeholder="Ex : Lurevia SARL"
                />
                <TextField
                  label="Numéro d'immatriculation (NIF / STAT)"
                  value={getValue("legalRegistrationNumber") ?? ""}
                  onChange={(e) => setValue("legalRegistrationNumber", e.target.value)}
                  fullWidth
                  size="small"
                  placeholder="Ex : 123 456 789"
                />
              </Stack>
            </FieldGroup>
          )}

          {/* ═══════ LIVRAISON ═══════ */}
          {tab === "shipping" && (
            <FieldGroup>
              <SectionHeader
                title="Frais de livraison"
                description="Configuration par défaut des frais de port."
                icon={ShippingIcon}
              />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5}>
                <TextField
                  label="Seuil de livraison gratuite"
                  type="number"
                  value={getValue("freeShippingThreshold")}
                  onChange={(e) => setValue("freeShippingThreshold", Number(e.target.value))}
                  fullWidth
                  size="small"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">Ar</InputAdornment>,
                  }}
                  helperText="Commandes au-dessus de ce montant : livraison offerte."
                />
                <TextField
                  label="Frais de livraison par défaut"
                  type="number"
                  value={getValue("defaultShippingCost")}
                  onChange={(e) => setValue("defaultShippingCost", Number(e.target.value))}
                  fullWidth
                  size="small"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">Ar</InputAdornment>,
                  }}
                  helperText="Utilisé si aucune zone de livraison ne correspond."
                />
              </Stack>

              <Alert severity="info" sx={{ borderRadius: 2 }}>
                💡 Pour gérer les <strong>zones de livraison</strong> (Antananarivo, provinces...),
                utilisez la page dédiée dans <strong>Logistique → Zones</strong>.
              </Alert>
            </FieldGroup>
          )}

          {/* ═══════ PAIEMENTS ═══════ */}
          {tab === "payments" && (
            <FieldGroup>
              <SectionHeader
                title="Méthodes de paiement acceptées"
                description="Activez ou désactivez les moyens de paiement."
                icon={PaymentIcon}
              />

              <Stack spacing={1.5}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={getValue("enableMVola")}
                      onChange={(e) => setValue("enableMVola", e.target.checked)}
                    />
                  }
                  label={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography sx={{ fontSize: 13.5, fontWeight: 600 }}>
                        MVola (Telma)
                      </Typography>
                      <Chip
                        label="Recommandé"
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: 9.5,
                          fontWeight: 700,
                          backgroundColor: (theme) => alpha(theme.palette.success.main, 0.12),
                          color: "success.dark",
                        }}
                      />
                    </Stack>
                  }
                />

                {getValue("enableMVola") && (
                  <TextField
                    label="Numéro marchand MVola"
                    value={getValue("mvolaMerchantNumber") ?? ""}
                    onChange={(e) => setValue("mvolaMerchantNumber", e.target.value)}
                    size="small"
                    sx={{ ml: 5, maxWidth: 400 }}
                    placeholder="034 12 345 67"
                  />
                )}

                <FormControlLabel
                  control={
                    <Switch
                      checked={getValue("enableCOD")}
                      onChange={(e) => setValue("enableCOD", e.target.checked)}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: 13.5, fontWeight: 600 }}>
                      Paiement à la livraison (COD)
                    </Typography>
                  }
                />

                {getValue("enableCOD") && (
                  <TextField
                    label="Plafond COD (optionnel)"
                    type="number"
                    value={getValue("codMaxAmount") ?? ""}
                    onChange={(e) =>
                      setValue("codMaxAmount", e.target.value ? Number(e.target.value) : null)
                    }
                    size="small"
                    sx={{ ml: 5, maxWidth: 400 }}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">Ar</InputAdornment>,
                    }}
                    helperText="Au-dessus de ce montant, le COD n'est pas proposé."
                  />
                )}

                <FormControlLabel
                  control={
                    <Switch
                      checked={getValue("enableCard")}
                      onChange={(e) => setValue("enableCard", e.target.checked)}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: 13.5, fontWeight: 600 }}>
                      Carte bancaire (Visa / Mastercard)
                    </Typography>
                  }
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={getValue("enableBankTransfer")}
                      onChange={(e) => setValue("enableBankTransfer", e.target.checked)}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: 13.5, fontWeight: 600 }}>
                      Virement bancaire
                    </Typography>
                  }
                />
              </Stack>

              <Divider />

              <SectionHeader title="Notifications automatiques" />

              <Stack spacing={1.5}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={getValue("notifyOnNewOrder")}
                      onChange={(e) => setValue("notifyOnNewOrder", e.target.checked)}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: 13.5, fontWeight: 600 }}>
                      Me notifier à chaque nouvelle commande
                    </Typography>
                  }
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={getValue("notifyOnNewReview")}
                      onChange={(e) => setValue("notifyOnNewReview", e.target.checked)}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: 13.5, fontWeight: 600 }}>
                      Me notifier à chaque nouvel avis à modérer
                    </Typography>
                  }
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={getValue("notifyOnLowStock")}
                      onChange={(e) => setValue("notifyOnLowStock", e.target.checked)}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: 13.5, fontWeight: 600 }}>
                      M'alerter en cas de stock faible
                    </Typography>
                  }
                />
              </Stack>

              <TextField
                label="Seuil de stock faible"
                type="number"
                value={getValue("lowStockThreshold")}
                onChange={(e) => setValue("lowStockThreshold", Number(e.target.value))}
                size="small"
                sx={{ maxWidth: 300 }}
                helperText="Nombre minimum avant alerte."
              />

              <Divider />

              <SectionHeader title="Emails transactionnels" />

              <Stack spacing={1.5}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={getValue("sendOrderConfirmation")}
                      onChange={(e) => setValue("sendOrderConfirmation", e.target.checked)}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: 13.5, fontWeight: 600 }}>
                      Envoyer un email de confirmation de commande
                    </Typography>
                  }
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={getValue("sendShippingNotification")}
                      onChange={(e) => setValue("sendShippingNotification", e.target.checked)}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: 13.5, fontWeight: 600 }}>
                      Envoyer un email lors de l'expédition
                    </Typography>
                  }
                />
              </Stack>
            </FieldGroup>
          )}

          {/* ═══════ RÉSEAUX SOCIAUX ═══════ */}
          {tab === "social" && (
            <FieldGroup>
              <SectionHeader
                title="Réseaux sociaux"
                description="Ces liens apparaissent dans le footer du site client."
                icon={ShareIcon}
              />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5}>
                <TextField
                  label="Facebook"
                  value={getValue("facebookUrl") ?? ""}
                  onChange={(e) => setValue("facebookUrl", e.target.value)}
                  fullWidth
                  size="small"
                  placeholder="https://facebook.com/lurevia"
                />
                <TextField
                  label="Instagram"
                  value={getValue("instagramUrl") ?? ""}
                  onChange={(e) => setValue("instagramUrl", e.target.value)}
                  fullWidth
                  size="small"
                  placeholder="https://instagram.com/lurevia"
                />
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5}>
                <TextField
                  label="TikTok"
                  value={getValue("tiktokUrl") ?? ""}
                  onChange={(e) => setValue("tiktokUrl", e.target.value)}
                  fullWidth
                  size="small"
                  placeholder="https://tiktok.com/@lurevia"
                />
                <TextField
                  label="LinkedIn"
                  value={getValue("linkedinUrl") ?? ""}
                  onChange={(e) => setValue("linkedinUrl", e.target.value)}
                  fullWidth
                  size="small"
                  placeholder="https://linkedin.com/company/lurevia"
                />
              </Stack>

              <TextField
                label="Numéro WhatsApp Business"
                value={getValue("whatsappNumber") ?? ""}
                onChange={(e) => setValue("whatsappNumber", e.target.value)}
                size="small"
                sx={{ maxWidth: 400 }}
                placeholder="+261 34 12 345 67"
                helperText="Utilisé pour le bouton 'Commander via WhatsApp'."
              />
            </FieldGroup>
          )}

          {/* ═══════ AVANCÉ ═══════ */}
          {tab === "advanced" && (
            <FieldGroup>
              <SectionHeader
                title="Mode maintenance"
                description="Désactive temporairement la boutique cliente."
                icon={WarningIcon}
              />

              <Alert severity="warning" sx={{ borderRadius: 2 }}>
                ⚠️ En activant le mode maintenance, <strong>la boutique cliente sera inaccessible</strong> aux visiteurs.
                Vous (admin) pouvez toujours y accéder via l'interface d'administration.
              </Alert>

              <FormControlLabel
                control={
                  <Switch
                    checked={getValue("maintenanceMode")}
                    onChange={(e) => setValue("maintenanceMode", e.target.checked)}
                  />
                }
                label={
                  <Typography sx={{ fontSize: 13.5, fontWeight: 700 }}>
                    Activer le mode maintenance
                  </Typography>
                }
              />

              {getValue("maintenanceMode") && (
                <TextField
                  label="Message affiché aux visiteurs"
                  value={getValue("maintenanceMessage")}
                  onChange={(e) => setValue("maintenanceMessage", e.target.value)}
                  fullWidth
                  size="small"
                  multiline
                  rows={3}
                  placeholder="Nous revenons dans quelques minutes..."
                />
              )}
            </FieldGroup>
          )}
        </CardContent>
      </Card>

      {/* ═══ BARRE FLOTTANTE D'ENREGISTREMENT ═══ */}
      {hasChanges && (
        <Box
          sx={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1200,
            backgroundColor: "background.paper",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            boxShadow: "0 12px 32px -12px rgba(10,27,61,0.3)",
            px: 2.5,
            py: 1.5,
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
              {Object.keys(draft).length} modification(s)
            </Typography>
            <Button
              size="small"
              onClick={handleReset}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Annuler
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={handleSave}
              disabled={saving}
              startIcon={<SaveIcon />}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                borderRadius: 1.5,
                boxShadow: "none",
              }}
            >
              {saving ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  );
};