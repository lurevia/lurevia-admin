import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useNotify, Title } from "react-admin";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import BadgeIconModule from "@mui/icons-material/Badge";
import MailOutlineIconModule from "@mui/icons-material/MailOutline";
import PhoneIconModule from "@mui/icons-material/Phone";
import LockOutlinedIconModule from "@mui/icons-material/LockOutlined";
import PersonAddAltIconModule from "@mui/icons-material/PersonAddAlt";
import ShieldOutlinedIconModule from "@mui/icons-material/ShieldOutlined";
import VerifiedIconModule from "@mui/icons-material/Verified";
import AdminPanelSettingsIconModule from "@mui/icons-material/AdminPanelSettings";
import PhotoCameraIconModule from "@mui/icons-material/PhotoCamera";
import CloseIconModule from "@mui/icons-material/Close";
import InfoOutlinedIconModule from "@mui/icons-material/InfoOutlined";
import { API_URL, httpClient } from "../../httpClient";
import { normalizeMuiIcon } from "../../muiIcon";

// ─── Icônes normalisées ───
const BadgeIcon = normalizeMuiIcon(BadgeIconModule);
const MailOutlineIcon = normalizeMuiIcon(MailOutlineIconModule);
const PhoneIcon = normalizeMuiIcon(PhoneIconModule);
const LockOutlinedIcon = normalizeMuiIcon(LockOutlinedIconModule);
const PersonAddAltIcon = normalizeMuiIcon(PersonAddAltIconModule);
const ShieldOutlinedIcon = normalizeMuiIcon(ShieldOutlinedIconModule);
const VerifiedIcon = normalizeMuiIcon(VerifiedIconModule);
const AdminPanelSettingsIcon = normalizeMuiIcon(AdminPanelSettingsIconModule);
const PhotoCameraIcon = normalizeMuiIcon(PhotoCameraIconModule);
const CloseIcon = normalizeMuiIcon(CloseIconModule);
const InfoOutlinedIcon = normalizeMuiIcon(InfoOutlinedIconModule);

// ─── Types ───
type FormValues = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  avatarUrl: string;
};

const initialValues: FormValues = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  avatarUrl: "",
};

// ─── Composant ───
export const AdminCreate = () => {
  const notify = useNotify();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<FormValues>>({});
  const [avatarError, setAvatarError] = useState("");
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update =
    (field: keyof FormValues) => (event: ChangeEvent<HTMLInputElement>) => {
      setValues((current) => ({ ...current, [field]: event.target.value }));
      setErrors((current) => ({ ...current, [field]: undefined }));
      setServerError("");
    };

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setAvatarError("Le fichier doit être une image (JPG, PNG, WebP).");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setAvatarError("L'image doit faire moins de 2 Mo.");
      return;
    }

    setAvatarError("");
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string") {
        setValues((prev) => ({ ...prev, avatarUrl: result }));
      }
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAvatarRemove = () => {
    setValues((prev) => ({ ...prev, avatarUrl: "" }));
    setAvatarError("");
  };

  const validate = () => {
    const next: Partial<FormValues> = {};
    if (values.fullName.trim().length < 2)
      next.fullName = "Nom complet requis (2 caractères minimum).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
      next.email = "Email invalide.";
    if (!/^(\+261|0)[0-9]{9}$/.test(values.phone.trim()))
      next.phone = "Numéro malgache invalide.";
    if (
      values.password.length < 8 ||
      !/[a-z]/.test(values.password) ||
      !/[A-Z]/.test(values.password) ||
      !/[0-9]/.test(values.password)
    ) {
      next.password =
        "8 caractères minimum, avec minuscule, majuscule et chiffre.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError("");

    try {
      const payload: Record<string, string> = {
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        password: values.password,
      };
      if (values.avatarUrl) {
        payload.avatarUrl = values.avatarUrl;
      }

      await httpClient(`${API_URL}/admin/admins`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setValues(initialValues);
      notify("Compte administrateur créé avec succès.", { type: "success" });
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Impossible de créer le compte."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const previewName = values.fullName.trim() || "Nom complet";
  const previewEmail = values.email.trim() || "email@lurevia.mg";
  const previewInitial = values.fullName.trim().charAt(0).toUpperCase() || "A";

  return (
    <Box sx={{ maxWidth: 1080, mx: "auto", mt: 1, px: { xs: 1.5, md: 2 } }}>
      <Title title="Créer un administrateur" />

      <Card
        elevation={0}
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "320px 1fr" },
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2.5,
        }}
      >
        {/* ═══════ COLONNE GAUCHE : APERÇU ═══════ */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "space-between",
            p: 3,
            position: "relative",
            color: "primary.contrastText",
            background: (theme) =>
              `linear-gradient(160deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -50,
              right: -50,
              width: 160,
              height: 160,
              borderRadius: "50%",
              backgroundColor: (theme) => alpha(theme.palette.common.white, 0.08),
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: -60,
              left: -60,
              width: 200,
              height: 200,
              borderRadius: "50%",
              backgroundColor: (theme) => alpha(theme.palette.common.white, 0.06),
            }}
          />

          {/* Header */}
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                px: 1.25,
                py: 0.5,
                borderRadius: 1.5,
                backgroundColor: (theme) => alpha(theme.palette.common.white, 0.14),
              }}
            >
              <AdminPanelSettingsIcon sx={{ fontSize: 15 }} />
              <Typography sx={{ fontWeight: 700, fontSize: 10, letterSpacing: 0.6 }}>
                APERÇU DU COMPTE
              </Typography>
            </Box>
          </Box>

          {/* Carte aperçu */}
          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              my: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Box sx={{ position: "relative", display: "inline-block", mb: 1.5 }}>
              <Avatar
                src={values.avatarUrl || undefined}
                alt={previewName}
                sx={{
                  width: 88,
                  height: 88,
                  fontSize: 34,
                  fontWeight: 800,
                  backgroundColor: (theme) => alpha(theme.palette.common.white, 0.2),
                  color: "primary.contrastText",
                  border: "3px solid",
                  borderColor: (theme) => alpha(theme.palette.common.white, 0.35),
                  boxShadow: "0 10px 24px -8px rgba(0,0,0,0.4)",
                }}
              >
                {previewInitial}
              </Avatar>

              <Tooltip title="Compte vérifié automatiquement" arrow>
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 2,
                    right: 2,
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#27C93F",
                    border: "3px solid",
                    borderColor: (theme) =>
                      theme.palette.mode === "dark"
                        ? theme.palette.background.paper
                        : theme.palette.primary.dark,
                  }}
                >
                  <VerifiedIcon sx={{ fontSize: 14, color: "#FFFFFF" }} />
                </Box>
              </Tooltip>
            </Box>

            <Typography
              sx={{
                fontSize: "1.1rem",
                fontWeight: 800,
                letterSpacing: "-0.3px",
                mb: 0.25,
                wordBreak: "break-word",
                maxWidth: "100%",
              }}
            >
              {previewName}
            </Typography>

            <Typography
              sx={{
                fontSize: 12,
                opacity: 0.85,
                wordBreak: "break-all",
                maxWidth: "100%",
              }}
            >
              {previewEmail}
            </Typography>

            <Chip
              icon={<ShieldOutlinedIcon sx={{ fontSize: 12 }} />}
              label="ADMINISTRATEUR"
              size="small"
              sx={{
                mt: 1.5,
                height: 22,
                fontWeight: 700,
                fontSize: 9.5,
                letterSpacing: 0.6,
                backgroundColor: (theme) => alpha(theme.palette.common.white, 0.2),
                color: "primary.contrastText",
                border: "1px solid",
                borderColor: (theme) => alpha(theme.palette.common.white, 0.3),
                "& .MuiChip-icon": { color: "inherit" },
              }}
            />
          </Box>

          {/* Note */}
          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              alignItems: "flex-start",
              gap: 1,
              p: 1.25,
              borderRadius: 1.5,
              backgroundColor: (theme) => alpha(theme.palette.common.white, 0.1),
            }}
          >
            <InfoOutlinedIcon sx={{ fontSize: 15, flexShrink: 0, mt: 0.15, opacity: 0.9 }} />
            <Typography sx={{ fontSize: 11, opacity: 0.9, lineHeight: 1.4 }}>
              Ce rendu reflète la fiche telle qu'elle apparaîtra dans
              l'interface d'administration.
            </Typography>
          </Box>
        </Box>

        {/* ═══════ COLONNE DROITE : FORMULAIRE ═══════ */}
        <CardContent sx={{ p: { xs: 2.5, sm: 3, md: 3.5 } }}>
          {/* Header */}
          <Stack direction="row" spacing={1.25} alignItems="center" mb={1.5}>
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
              }}
            >
              <PersonAddAltIcon fontSize="small" />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: "1.1rem", lineHeight: 1.2 }}>
                Nouvel administrateur
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Remplissez les informations du compte.
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ mb: 2.5 }} />

          {serverError && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setServerError("")}>
              {serverError}
            </Alert>
          )}

          <Box component="form" onSubmit={submit} noValidate>
            <Stack spacing={2}>
              {/* ═══ Upload avatar ═══ */}
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ position: "relative" }}>
                  <Avatar
                    src={values.avatarUrl || undefined}
                    alt="Photo de profil"
                    onClick={handleAvatarClick}
                    sx={{
                      width: 56,
                      height: 56,
                      fontSize: 22,
                      fontWeight: 700,
                      backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.12),
                      color: "primary.main",
                      cursor: "pointer",
                      border: "2px dashed",
                      borderColor: "divider",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        borderColor: "primary.main",
                        backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.18),
                      },
                    }}
                  >
                    {values.avatarUrl
                      ? null
                      : values.fullName.trim().charAt(0).toUpperCase() || (
                          <PhotoCameraIcon fontSize="small" />
                        )}
                  </Avatar>

                  {values.avatarUrl && (
                    <IconButton
                      size="small"
                      onClick={handleAvatarRemove}
                      sx={{
                        position: "absolute",
                        top: -5,
                        right: -5,
                        width: 20,
                        height: 20,
                        backgroundColor: "error.main",
                        color: "#FFFFFF",
                        "&:hover": { backgroundColor: "error.dark" },
                      }}
                      aria-label="Retirer l'image"
                    >
                      <CloseIcon sx={{ fontSize: 12 }} />
                    </IconButton>
                  )}
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<PhotoCameraIcon fontSize="small" />}
                    onClick={handleAvatarClick}
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: 12.5,
                      py: 0.5,
                      mb: 0.25,
                    }}
                  >
                    {values.avatarUrl ? "Changer" : "Importer une image"}
                  </Button>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", fontSize: 10.5, lineHeight: 1.3 }}
                  >
                    JPG, PNG ou WebP. Max 2 Mo. Optionnel.
                  </Typography>
                  {avatarError && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ display: "block", mt: 0.25, fontSize: 10.5 }}
                    >
                      {avatarError}
                    </Typography>
                  )}
                </Box>
              </Stack>

              {/* ═══ Champs (grille 2 colonnes) ═══ */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 2,
                }}
              >
                <TextField
                  label="Nom complet"
                  value={values.fullName}
                  onChange={update("fullName")}
                  error={Boolean(errors.fullName)}
                  helperText={errors.fullName}
                  required
                  fullWidth
                  autoFocus
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeIcon fontSize="small" sx={{ color: "text.secondary", fontSize: 18 }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Téléphone"
                  value={values.phone}
                  onChange={update("phone")}
                  error={Boolean(errors.phone)}
                  helperText={errors.phone ?? "0341234567 ou +261341234567"}
                  required
                  fullWidth
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon fontSize="small" sx={{ color: "text.secondary", fontSize: 18 }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Adresse e-mail"
                  type="email"
                  value={values.email}
                  onChange={update("email")}
                  error={Boolean(errors.email)}
                  helperText={errors.email}
                  required
                  fullWidth
                  size="small"
                  sx={{ gridColumn: { sm: "span 2" } }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MailOutlineIcon fontSize="small" sx={{ color: "text.secondary", fontSize: 18 }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Mot de passe temporaire"
                  type="password"
                  value={values.password}
                  onChange={update("password")}
                  error={Boolean(errors.password)}
                  helperText={
                    errors.password ??
                    "8 caractères minimum, avec majuscule, minuscule et chiffre."
                  }
                  required
                  fullWidth
                  size="small"
                  sx={{ gridColumn: { sm: "span 2" } }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon fontSize="small" sx={{ color: "text.secondary", fontSize: 18 }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* ═══ Info ═══ */}
              <Alert
                severity="info"
                icon={<ShieldOutlinedIcon fontSize="small" />}
                sx={{
                  py: 0.5,
                  "& .MuiAlert-message": { fontSize: 12, lineHeight: 1.4 },
                }}
              >
                Le mot de passe doit être transmis par un canal sécurisé.
                L'administrateur devra le changer à sa première connexion.
              </Alert>

              {/* ═══ Submit ═══ */}
              <Button
                type="submit"
                variant="contained"
                size="medium"
                disabled={submitting}
                sx={{
                  py: 1,
                  fontWeight: 700,
                  borderRadius: 1,
                  textTransform: "none",
                  fontSize: 14,
                }}
              >
                {submitting ? "Création en cours…" : "Créer le compte administrateur"}
              </Button>
            </Stack>
          </Box>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleAvatarChange}
          />
        </CardContent>
      </Card>
    </Box>
  );
};