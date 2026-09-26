import { useEffect, useState } from "react";
import { useDataProvider, useNotify, Title } from "react-admin";
import {
  Alert,
  Autocomplete,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import SendIconModule from "@mui/icons-material/Send";
import AutoAwesomeIconModule from "@mui/icons-material/AutoAwesome";
import GroupIconModule from "@mui/icons-material/Group";
import PersonIconModule from "@mui/icons-material/Person";
import MailOutlineIconModule from "@mui/icons-material/MailOutline";
import SubjectIconModule from "@mui/icons-material/Subject";
import DescriptionIconModule from "@mui/icons-material/Description";
import CloseIconModule from "@mui/icons-material/Close";
import CheckCircleIconModule from "@mui/icons-material/CheckCircle";
import InfoOutlinedIconModule from "@mui/icons-material/InfoOutlined";
import VerifiedIconModule from "@mui/icons-material/Verified";
import LightbulbOutlinedIconModule from "@mui/icons-material/LightbulbOutlined";
import { normalizeMuiIcon } from "../../muiIcon";
import { sendAdminMessage } from "../../adminActions";

// ─── Icônes normalisées ───
const SendIcon = normalizeMuiIcon(SendIconModule);
const AutoAwesomeIcon = normalizeMuiIcon(AutoAwesomeIconModule);
const GroupIcon = normalizeMuiIcon(GroupIconModule);
const PersonIcon = normalizeMuiIcon(PersonIconModule);
const MailIcon = normalizeMuiIcon(MailOutlineIconModule);
const SubjectIcon = normalizeMuiIcon(SubjectIconModule);
const BodyIcon = normalizeMuiIcon(DescriptionIconModule);
const CloseIcon = normalizeMuiIcon(CloseIconModule);
const CheckIcon = normalizeMuiIcon(CheckCircleIconModule);
const InfoIcon = normalizeMuiIcon(InfoOutlinedIconModule);
const VerifiedIcon = normalizeMuiIcon(VerifiedIconModule);
const LightbulbIcon = normalizeMuiIcon(LightbulbOutlinedIconModule);


type Customer = {
  id: string;
  fullName?: string;
  email?: string;
  avatarUrl?: string;
  isVerified?: boolean;
  role?: string;
};


interface SubjectTemplate {
  label: string;
  subject: string;
  body: string;
  emoji: string;
}

const SUBJECT_TEMPLATES: SubjectTemplate[] = [
  {
    emoji: "📦",
    label: "Suivi de commande",
    subject: "Suivi de votre commande",
    body: `Bonjour,

Nous vous informons que votre commande est en cours de traitement.

Vous recevrez une notification dès qu'elle sera expédiée.

Merci pour votre confiance,
L'équipe Lurevia`,
  },
  {
    emoji: "🎉",
    label: "Promotion",
    subject: "Offre spéciale pour vous",
    body: `Bonjour,

Nous avons le plaisir de vous annoncer une offre exceptionnelle sur notre boutique.

Profitez de -20% sur tout le catalogue pendant les prochains jours.

À très bientôt,
L'équipe Lurevia`,
  },
  {
    emoji: "🛒",
    label: "Produit en stock",
    subject: "Un produit que vous attendiez est de retour",
    body: `Bonjour,

Bonne nouvelle ! Un produit de votre liste de favoris est de nouveau en stock.

Nous vous invitons à passer commande rapidement, les quantités sont limitées.

Cordialement,
L'équipe Lurevia`,
  },
  {
    emoji: "🙏",
    label: "Remerciement",
    subject: "Merci pour votre fidélité",
    body: `Bonjour,

Merci pour votre confiance et votre fidélité.

Nous sommes ravis de vous compter parmi nos clients et travaillons chaque jour pour vous offrir le meilleur.

À bientôt,
L'équipe Lurevia`,
  },
  {
    emoji: "🚚",
    label: "Information livraison",
    subject: "Information sur la livraison",
    body: `Bonjour,

Nous souhaitons vous informer d'un ajustement concernant les délais de livraison dans votre région.

Nous mettons tout en œuvre pour vous livrer dans les meilleurs délais.

Merci de votre compréhension,
L'équipe Lurevia`,
  },
  {
    emoji: "❓",
    label: "Demande d'avis",
    subject: "Votre avis nous intéresse",
    body: `Bonjour,

Nous espérons que votre commande vous a donné satisfaction.

N'hésitez pas à partager votre avis, cela nous aide énormément à améliorer nos services.

Merci d'avance,
L'équipe Lurevia`,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPOSANT CARTE UTILISATEUR (pour Autocomplete)
// ─────────────────────────────────────────────────────────────────────────────

const CustomerOption = ({ customer }: { customer: Customer }) => {
  const initial = customer.fullName?.charAt(0).toUpperCase() ?? "?";
  return (
    <Stack direction="row" spacing={1.25} alignItems="center" sx={{ width: "100%" }}>
      <Box sx={{ position: "relative", flexShrink: 0 }}>
        <Avatar
          src={customer.avatarUrl || undefined}
          alt={customer.fullName}
          sx={{
            width: 36,
            height: 36,
            fontSize: 14,
            fontWeight: 700,
            bgcolor: "primary.main",
            color: "primary.contrastText",
          }}
        >
          {initial}
        </Avatar>
        {customer.isVerified && (
          <Box
            sx={{
              position: "absolute",
              bottom: -2,
              right: -2,
              width: 14,
              height: 14,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#27C93F",
              border: "2px solid",
              borderColor: "background.paper",
            }}
          >
            <VerifiedIcon sx={{ fontSize: 8, color: "#FFFFFF" }} />
          </Box>
        )}
      </Box>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          sx={{ fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}
          noWrap
        >
          {customer.fullName || "Utilisateur"}
        </Typography>
        <Typography
          sx={{ fontSize: 11, color: "text.secondary", lineHeight: 1.3 }}
          noWrap
        >
          {customer.email || "—"}
        </Typography>
      </Box>
    </Stack>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DIALOG IA (pour générer sujet + corps)
// ─────────────────────────────────────────────────────────────────────────────

const AIMessageDialog = ({
  open,
  onClose,
  onApply,
}: {
  open: boolean;
  onClose: () => void;
  onApply: (result: { subject: string; body: string }) => void;
}) => {
  const [intent, setIntent] = useState("");
  const [tone, setTone] = useState("chaleureux");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<{ subject: string; body: string } | null>(
    null
  );
  const [error, setError] = useState("");

  const callAIBackend = async (payload: {
    intent: string;
    tone: string;
  }): Promise<{ subject: string; body: string }> => {
    // ⚠️ À BRANCHER sur ton backend :
    // const { json } = await httpClient(`${API_URL}/admin/ai/generate-message`, {
    //   method: "POST",
    //   body: JSON.stringify(payload),
    // });
    // return json.data;

    // ─── SIMULATION POUR LE DEV ───
    await new Promise((r) => setTimeout(r, 1500));
    return {
      subject: `À propos de votre demande — ${payload.intent.slice(0, 40)}`,
      body: `Bonjour,\n\nNous avons bien reçu votre message concernant "${payload.intent}".\n\nNotre équipe met tout en œuvre pour vous répondre dans les meilleurs délais et vous apporter une solution adaptée.\n\nSi vous avez d'autres questions, n'hésitez pas à nous contacter à nouveau.\n\nAvec toute notre attention,\nL'équipe Lurevia`,
    };
  };

  const handleGenerate = async () => {
    if (!intent.trim()) {
      setError("Décrivez l'intention du message pour continuer.");
      return;
    }
    setGenerating(true);
    setError("");
    setResult(null);
    try {
      const res = await callAIBackend({ intent: intent.trim(), tone });
      setResult(res);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Génération impossible."
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
    setIntent("");
    onClose();
  };

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 1300,
        backgroundColor: "rgba(10,27,61,0.5)",
        display: open ? "flex" : "none",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
      onClick={handleClose}
    >
      <Paper
        elevation={0}
        onClick={(e) => e.stopPropagation()}
        sx={{
          maxWidth: 620,
          width: "100%",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: 2.5,
          overflow: "hidden",
          boxShadow: "0 24px 60px -20px rgba(10,27,61,0.4)",
        }}
      >
        {/* Header */}
        <Stack
          direction="row"
          spacing={1.25}
          alignItems="center"
          sx={{ p: 2.5, pb: 2, borderBottom: "1px solid", borderColor: "divider" }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: (theme) =>
                alpha(theme.palette.primary.main, 0.12),
              color: "primary.main",
            }}
          >
            <AutoAwesomeIcon fontSize="small" />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: 800, fontSize: 16 }}>
              Générer le message avec l'IA
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Décrivez l'intention, l'IA rédige le sujet et le corps.
            </Typography>
          </Box>
          <IconButton size="small" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Box sx={{ p: 2.5, overflowY: "auto" }}>
          <Alert
            severity="info"
            icon={<LightbulbIcon fontSize="small" />}
            sx={{ mb: 2.5, py: 0.75, "& .MuiAlert-message": { fontSize: 12.5 } }}
          >
            Exemples : « Rappeler à un client que sa commande est en attente »,
            « Annoncer une promotion de fin d'année », « Remercier un client fidèle ».
          </Alert>

          <TextField
            label="Intention du message"
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
            placeholder="Ex : Informer d'un retard de livraison"
            fullWidth
            multiline
            rows={3}
            size="small"
            sx={{ mb: 2 }}
          />

          <TextField
            label="Ton du message"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            select
            fullWidth
            size="small"
            sx={{ mb: 2.5 }}
            SelectProps={{ native: true }}
          >
            <option value="chaleureux">Chaleureux</option>
            <option value="professionnel">Professionnel</option>
            <option value="amical">Amical</option>
            <option value="formel">Formel</option>
          </TextField>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Button
            variant="contained"
            onClick={handleGenerate}
            disabled={generating}
            startIcon={
              generating ? undefined : <AutoAwesomeIcon fontSize="small" />
            }
            fullWidth
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 1.5,
              py: 1,
              boxShadow: "none",
            }}
          >
            {generating ? "Génération en cours…" : "Générer"}
          </Button>

          {result && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography
                variant="overline"
                sx={{
                  fontWeight: 700,
                  color: "text.secondary",
                  letterSpacing: 1,
                  fontSize: 10.5,
                  mb: 1.5,
                  display: "block",
                }}
              >
                Résultat généré
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography sx={{ fontSize: 11.5, fontWeight: 700, mb: 0.5 }}>
                  Sujet
                </Typography>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 1.5,
                    backgroundColor: "action.hover",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  {result.subject}
                </Box>
              </Box>

              <Box>
                <Typography sx={{ fontSize: 11.5, fontWeight: 700, mb: 0.5 }}>
                  Corps du message
                </Typography>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 1.5,
                    backgroundColor: "action.hover",
                    fontSize: 13,
                    lineHeight: 1.6,
                    whiteSpace: "pre-wrap",
                    maxHeight: 240,
                    overflowY: "auto",
                  }}
                >
                  {result.body}
                </Box>
              </Box>
            </>
          )}
        </Box>

        <Stack
          direction="row"
          spacing={1.5}
          justifyContent="flex-end"
          sx={{ p: 2.5, borderTop: "1px solid", borderColor: "divider" }}
        >
          <Button
            onClick={handleClose}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Annuler
          </Button>
          <Button
            variant="contained"
            onClick={handleApply}
            disabled={!result}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 1.5,
              boxShadow: "none",
            }}
          >
            Appliquer au formulaire
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE PRINCIPALE
// ─────────────────────────────────────────────────────────────────────────────

export const AdminMessagePage = () => {
  const provider = useDataProvider();
  const notify = useNotify();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [allUsers, setAllUsers] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [aiDialogOpen, setAiDialogOpen] = useState(false);

  useEffect(() => {
    provider
      .getList("users", {
        pagination: { page: 1, perPage: 100 },
        sort: { field: "fullName", order: "ASC" },
        filter: {},
      })
      .then(({ data }) => {
        setCustomers(data as Customer[]);
      })
      .catch(() => {
        notify("Impossible de charger les clients.", { type: "error" });
      })
      .finally(() => {
        setLoadingCustomers(false);
      });
  }, [provider, notify]);

  const applyTemplate = (template: SubjectTemplate) => {
    setSubject(template.subject);
    setBody(template.body);
  };

  const handleAIGenerated = (result: { subject: string; body: string }) => {
    setSubject(result.subject);
    setBody(result.body);
    notify("Message généré. Vérifiez avant envoi.", { type: "success" });
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();

    if ((!allUsers && !selectedCustomer) || !subject.trim() || !body.trim()) {
      notify(
        "Sélectionnez un destinataire et renseignez le sujet et le message.",
        { type: "warning" }
      );
      return;
    }

    setSending(true);
    try {
      await sendAdminMessage({
        subject: subject.trim(),
        body: body.trim(),
        ...(allUsers
          ? { allUsers: true }
          : { userId: selectedCustomer!.id }),
      });
      notify(
        allUsers
          ? "Message envoyé à tous les clients."
          : `Message envoyé à ${selectedCustomer?.fullName ?? "l'utilisateur"}.`,
        { type: "success" }
      );
      setSubject("");
      setBody("");
      setSelectedCustomer(null);
      setAllUsers(false);
    } catch (e) {
      notify(
        e instanceof Error ? e.message : "Échec de l'envoi.",
        { type: "error" }
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: { xs: 2, md: 3 } }}>
      <Title title="Nouveau message client" />

      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.25 }}>
          Nouveau message client
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Envoyez un message personnalisé à un client ou à l'ensemble de vos clients.
        </Typography>
      </Box>

      <Stack direction="column" spacing={3}>
        {/* ─── Formulaire principal ─── */}
        <Paper
          component="form"
          onSubmit={submit}
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 3 },
            borderRadius: 2.5,
            border: "1px solid",
            borderColor: "divider",
            backgroundColor: "background.paper",
          }}
        >
          {/* Destinataire */}
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: (theme) =>
                  alpha(theme.palette.primary.main, 0.1),
                color: "primary.main",
              }}
            >
              <PersonIcon sx={{ fontSize: 18 }} />
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
              Destinataire
            </Typography>
          </Stack>

          <FormControlLabel
            control={
              <Checkbox
                checked={allUsers}
                onChange={(e) => {
                  setAllUsers(e.target.checked);
                  if (e.target.checked) setSelectedCustomer(null);
                }}
                size="small"
              />
            }
            label={
              <Stack direction="row" spacing={1} alignItems="center">
                <GroupIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                <Typography sx={{ fontSize: 13.5, fontWeight: 600 }}>
                  Envoyer à tous les clients
                </Typography>
              </Stack>
            }
            sx={{ mb: 2 }}
          />

          {!allUsers && (
            <Autocomplete
              value={selectedCustomer}
              onChange={(_, newValue) => setSelectedCustomer(newValue)}
              options={customers}
              getOptionLabel={(option) =>
                option.fullName || option.email || "Utilisateur"
              }
              isOptionEqualToValue={(option, value) => option.id === value.id}
              loading={loadingCustomers}
              noOptionsText="Aucun client trouvé"
              size="small"
              sx={{ mb: 3 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Rechercher un client par nom ou email…"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <InputAdornment position="start">
                          <PersonIcon
                            sx={{ fontSize: 18, color: "text.secondary" }}
                          />
                        </InputAdornment>
                        {params.InputProps.startAdornment}
                      </>
                    ),
                  }}
                />
              )}
              renderOption={(props, option) => (
                <Box
                  component="li"
                  {...props}
                  sx={{
                    display: "flex !important",
                    alignItems: "center",
                    gap: 1.25,
                    px: 1.5,
                    py: 0.75,
                    "&:hover": { backgroundColor: "action.hover" },
                  }}
                >
                  <CustomerOption customer={option} />
                </Box>
              )}
            />
          )}

          {allUsers && (
            <Box
              sx={{
                mb: 3,
                p: 2,
                borderRadius: 1.5,
                backgroundColor: (theme) =>
                  alpha(theme.palette.warning.main, 0.06),
                border: "1px solid",
                borderColor: (theme) =>
                  alpha(theme.palette.warning.main, 0.2),
                display: "flex",
                gap: 1.5,
                alignItems: "flex-start",
              }}
            >
              <InfoIcon
                sx={{
                  fontSize: 18,
                  color: "warning.main",
                  flexShrink: 0,
                  mt: 0.15,
                }}
              />
              <Typography
                sx={{
                  fontSize: 12.5,
                  lineHeight: 1.5,
                  color: "warning.dark",
                  fontWeight: 600,
                }}
              >
                Le message sera envoyé à <strong>{customers.length}</strong> client
                {customers.length > 1 ? "s" : ""}. Cette action ne peut pas être
                annulée.
              </Typography>
            </Box>
          )}

          <Divider sx={{ mb: 3 }} />

          {/* Sujets prédéfinis */}
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: (theme) =>
                  alpha(theme.palette.info.main, 0.1),
                color: "info.main",
              }}
            >
              <LightbulbIcon sx={{ fontSize: 18 }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
                Modèles rapides
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Cliquez pour pré-remplir le sujet et le message.
              </Typography>
            </Box>
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            useFlexGap
            sx={{ mb: 3 }}
          >
            {SUBJECT_TEMPLATES.map((template) => (
              <Chip
                key={template.label}
                label={`${template.emoji}  ${template.label}`}
                onClick={() => applyTemplate(template)}
                clickable
                size="small"
                sx={{
                  height: 30,
                  fontSize: 12,
                  fontWeight: 600,
                  px: 0.5,
                  border: "1px solid",
                  borderColor: "divider",
                  "&:hover": {
                    backgroundColor: (theme) =>
                      alpha(theme.palette.primary.main, 0.08),
                    borderColor: "primary.main",
                    color: "primary.main",
                  },
                }}
              />
            ))}
          </Stack>

          <Divider sx={{ mb: 3 }} />

          {/* Sujet avec bouton IA */}
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: (theme) =>
                  alpha(theme.palette.primary.main, 0.1),
                color: "primary.main",
              }}
            >
              <SubjectIcon sx={{ fontSize: 18 }} />
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
              Contenu du message
            </Typography>
            <Box sx={{ flex: 1 }} />
            <Tooltip title="Générer avec l'IA" arrow>
              <Button
                size="small"
                variant="outlined"
                startIcon={<AutoAwesomeIcon sx={{ fontSize: 15 }} />}
                onClick={() => setAiDialogOpen(true)}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: 11.5,
                  borderRadius: 1.5,
                  py: 0.5,
                  borderColor: "primary.main",
                  color: "primary.main",
                  "&:hover": {
                    backgroundColor: (theme) =>
                      alpha(theme.palette.primary.main, 0.08),
                    borderColor: "primary.main",
                  },
                }}
              >
                Générer avec l'IA
              </Button>
            </Tooltip>
          </Stack>

          <TextField
            required
            label="Sujet"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            fullWidth
            size="small"
            placeholder="Ex : Suivi de votre commande"
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SubjectIcon
                    sx={{ fontSize: 16, color: "text.secondary" }}
                  />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            required
            label="Message"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            multiline
            minRows={8}
            fullWidth
            size="small"
            placeholder="Écrivez votre message ici…"
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment
                  position="start"
                  sx={{ alignSelf: "flex-start", mt: 1.5 }}
                >
                  <BodyIcon
                    sx={{ fontSize: 16, color: "text.secondary" }}
                  />
                </InputAdornment>
              ),
            }}
          />

          {/* Bouton envoyer */}
          <Stack direction="row" spacing={1.5} justifyContent="flex-end">
            <Button
              type="submit"
              variant="contained"
              disabled={sending}
              startIcon={<SendIcon fontSize="small" />}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                borderRadius: 1.5,
                boxShadow: "none",
                px: 3,
                py: 1,
              }}
            >
              {sending ? "Envoi en cours…" : "Envoyer le message"}
            </Button>
          </Stack>
        </Paper>

        {/* ─── Résumé final ─── */}
        {(subject || body) && (
          <Card
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2.5,
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 1.5 }}
              >
                <CheckIcon sx={{ fontSize: 16, color: "primary.main" }} />
                <Typography sx={{ fontWeight: 700, fontSize: 13 }}>
                  Aperçu avant envoi
                </Typography>
              </Stack>

              <Box
                sx={{
                  p: 2,
                  borderRadius: 1.5,
                  backgroundColor: (theme) =>
                    alpha(theme.palette.primary.main, 0.03),
                  border: "1px solid",
                  borderColor: (theme) =>
                    alpha(theme.palette.primary.main, 0.1),
                }}
              >
                <Typography
                  sx={{ fontSize: 12, fontWeight: 700, mb: 0.5 }}
                  noWrap
                >
                  {subject || "Sans sujet"}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 12.5,
                    color: "text.secondary",
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.6,
                    maxHeight: 200,
                    overflowY: "auto",
                  }}
                >
                  {body || "Aucun message."}
                </Typography>
              </Box>

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mt: 1.5, color: "text.secondary" }}
              >
                <MailIcon sx={{ fontSize: 14 }} />
                <Typography sx={{ fontSize: 11.5 }}>
                  Destinataire :{" "}
                  <strong>
                    {allUsers
                      ? `Tous les clients (${customers.length})`
                      : selectedCustomer?.fullName ||
                      selectedCustomer?.email ||
                      "Non sélectionné"}
                  </strong>
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        )}
      </Stack>

      <AIMessageDialog
        open={aiDialogOpen}
        onClose={() => setAiDialogOpen(false)}
        onApply={handleAIGenerated}
      />
    </Box>
  );
};