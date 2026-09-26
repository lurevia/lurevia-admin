import {
  Edit,
  SimpleForm,
  SelectInput,
  useRecordContext,
} from "react-admin";
import {
  Avatar,
  Box,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import MailOutlineIconModule from "@mui/icons-material/MailOutline";
import PhoneIconModule from "@mui/icons-material/Phone";
import CalendarTodayIconModule from "@mui/icons-material/CalendarToday";
import LoginIconModule from "@mui/icons-material/Login";
import ShoppingBagIconModule from "@mui/icons-material/ShoppingBag";
import VerifiedIconModule from "@mui/icons-material/Verified";
import WarningAmberIconModule from "@mui/icons-material/WarningAmber";
import ShieldOutlinedIconModule from "@mui/icons-material/ShieldOutlined";
import StorefrontIconModule from "@mui/icons-material/Storefront";
import PersonOutlineIconModule from "@mui/icons-material/PersonOutline";
import { normalizeMuiIcon } from "../../muiIcon";

// ─── Icônes normalisées ───
const MailIcon = normalizeMuiIcon(MailOutlineIconModule);
const PhoneIcon = normalizeMuiIcon(PhoneIconModule);
const CalendarIcon = normalizeMuiIcon(CalendarTodayIconModule);
const LoginIcon = normalizeMuiIcon(LoginIconModule);
const OrdersIcon = normalizeMuiIcon(ShoppingBagIconModule);
const VerifiedIcon = normalizeMuiIcon(VerifiedIconModule);
const WarningIcon = normalizeMuiIcon(WarningAmberIconModule);
const ShieldIcon = normalizeMuiIcon(ShieldOutlinedIconModule);
const SellerIcon = normalizeMuiIcon(StorefrontIconModule);
const CustomerIcon = normalizeMuiIcon(PersonOutlineIconModule);

const formatDate = (date: string | null | undefined) => {
  if (!date) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
};

const formatDateTime = (date: string | null | undefined) => {
  if (!date) return "Jamais";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

const getRoleConfig = (role: string) => {
  switch (role) {
    case "ADMIN":
      return { label: "Administrateur", color: "error" as const, icon: ShieldIcon };
    case "SELLER":
      return { label: "Vendeur", color: "warning" as const, icon: SellerIcon };
    default:
      return { label: "Client", color: "default" as const, icon: CustomerIcon };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// APERÇU UTILISATEUR
// ─────────────────────────────────────────────────────────────────────────────

const UserPreview = ({ record }: { record: any }) => {
  if (!record) return null;

  const roleConfig = getRoleConfig(record.role);
  const RoleIcon = roleConfig.icon;
  const initial = record.fullName?.charAt(0).toUpperCase() ?? "?";
  const isVerified = record.isVerified === true;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2.5,
        backgroundColor: "background.paper",
      }}
    >
      <Typography
        variant="overline"
        sx={{
          fontWeight: 700,
          color: "text.secondary",
          letterSpacing: 1,
          mb: 2,
          display: "block",
        }}
      >
        Aperçu du compte
      </Typography>

      {/* En-tête */}
      <Stack alignItems="center" spacing={1.5} sx={{ mb: 2.5 }}>
        <Box sx={{ position: "relative" }}>
          <Avatar
            src={record.avatarUrl || undefined}
            alt={record.fullName}
            sx={{
              width: 80,
              height: 80,
              fontSize: 30,
              fontWeight: 800,
              bgcolor: "primary.main",
              color: "primary.contrastText",
              border: "3px solid",
              borderColor: "background.paper",
              boxShadow: (theme) =>
                `0 8px 20px -8px ${alpha(theme.palette.primary.main, 0.4)}`,
            }}
          >
            {initial}
          </Avatar>
          {isVerified && (
            <Box
              sx={{
                position: "absolute",
                bottom: 2,
                right: 2,
                width: 24,
                height: 24,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#27C93F",
                border: "3px solid",
                borderColor: "background.paper",
              }}
            >
              <VerifiedIcon sx={{ fontSize: 12, color: "#FFFFFF" }} />
            </Box>
          )}
        </Box>

        <Box sx={{ textAlign: "center" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 0.5 }}>
            {record.fullName}
          </Typography>
          <Chip
            icon={<RoleIcon sx={{ fontSize: 13 }} />}
            label={roleConfig.label}
            color={roleConfig.color}
            size="small"
            sx={{
              height: 22,
              fontWeight: 700,
              fontSize: 11,
              "& .MuiChip-icon": { color: "inherit" },
            }}
          />
        </Box>
      </Stack>

      <Divider sx={{ my: 2 }} />

      {/* Infos */}
      <Stack spacing={1.5}>
        <Stack direction="row" spacing={1.25} alignItems="center">
          <MailIcon sx={{ fontSize: 16, color: "text.secondary" }} />
          <Typography
            sx={{ fontSize: 12, color: "text.secondary", wordBreak: "break-all" }}
          >
            {record.email || "—"}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1.25} alignItems="center">
          <PhoneIcon sx={{ fontSize: 16, color: "text.secondary" }} />
          <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
            {record.phone || "—"}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1.25} alignItems="center">
          <OrdersIcon sx={{ fontSize: 16, color: "text.secondary" }} />
          <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
            <strong>{record.ordersCount ?? 0}</strong> commande
            {(record.ordersCount ?? 0) > 1 ? "s" : ""}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1.25} alignItems="center">
          <CalendarIcon sx={{ fontSize: 16, color: "text.secondary" }} />
          <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
            Inscrit le {formatDate(record.createdAt)}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1.25} alignItems="center">
          <LoginIcon sx={{ fontSize: 16, color: "text.secondary" }} />
          <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
            Dernière connexion : {formatDateTime(record.lastLoginAt)}
          </Typography>
        </Stack>
      </Stack>

      {/* Note d'info */}
      {!isVerified && (
        <Box
          sx={{
            mt: 2.5,
            p: 1.5,
            borderRadius: 1.5,
            backgroundColor: (theme) => alpha(theme.palette.warning.main, 0.08),
            border: "1px solid",
            borderColor: (theme) => alpha(theme.palette.warning.main, 0.2),
            display: "flex",
            alignItems: "flex-start",
            gap: 1.25,
          }}
        >
          <WarningIcon sx={{ fontSize: 16, color: "warning.main", flexShrink: 0, mt: 0.15 }} />
          <Typography sx={{ fontSize: 11.5, color: "warning.dark", lineHeight: 1.5, fontWeight: 600 }}>
            Compte non vérifié. L'utilisateur ne peut pas encore passer commande.
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CONTENU DU FORMULAIRE
// ─────────────────────────────────────────────────────────────────────────────

const UserFormContent = () => {
  const record = useRecordContext();

  return (
    <Box sx={{ width: "100%", pt: 2 }}>
      {/* Intro */}
      <Box sx={{ mb: 3, maxWidth: 1100, mx: "auto" }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
          Modifier l'utilisateur
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Seul le rôle peut être modifié depuis cet écran. Les autres informations
          sont en lecture seule.
        </Typography>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Layout 2 colonnes */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 340px" },
          gap: 4,
          maxWidth: 1100,
          mx: "auto",
        }}
      >
        {/* ═══ COLONNE GAUCHE : Informations + Rôle ═══ */}
        <Box>
          <Typography
            variant="overline"
            sx={{
              fontWeight: 700,
              color: "text.secondary",
              letterSpacing: 1,
              mb: 1.5,
              display: "block",
            }}
          >
            Informations (lecture seule)
          </Typography>

          {/* Nom */}
          <Box
            sx={{
              p: 1.75,
              mb: 1.5,
              borderRadius: 1.5,
              backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.04),
              border: "1px solid",
              borderColor: (theme) => alpha(theme.palette.primary.main, 0.12),
            }}
          >
            <Typography
              sx={{ fontSize: 10.5, color: "text.secondary", fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", mb: 0.5 }}
            >
              Nom complet
            </Typography>
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
              {record?.fullName ?? "—"}
            </Typography>
          </Box>

          {/* Email */}
          <Box
            sx={{
              p: 1.75,
              mb: 1.5,
              borderRadius: 1.5,
              backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.04),
              border: "1px solid",
              borderColor: (theme) => alpha(theme.palette.primary.main, 0.12),
            }}
          >
            <Typography
              sx={{ fontSize: 10.5, color: "text.secondary", fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", mb: 0.5 }}
            >
              Adresse e-mail
            </Typography>
            <Typography sx={{ fontSize: 14, fontWeight: 600, wordBreak: "break-all" }}>
              {record?.email ?? "—"}
            </Typography>
          </Box>

          {/* Téléphone */}
          <Box
            sx={{
              p: 1.75,
              mb: 1.5,
              borderRadius: 1.5,
              backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.04),
              border: "1px solid",
              borderColor: (theme) => alpha(theme.palette.primary.main, 0.12),
            }}
          >
            <Typography
              sx={{ fontSize: 10.5, color: "text.secondary", fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", mb: 0.5 }}
            >
              Téléphone
            </Typography>
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
              {record?.phone ?? "—"}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* ═══ Section rôle (éditable) ═══ */}
          <Typography
            variant="overline"
            sx={{
              fontWeight: 700,
              color: "text.secondary",
              letterSpacing: 1,
              mb: 1.5,
              display: "block",
            }}
          >
            Permissions
          </Typography>

          <Box
            sx={{
              p: 2,
              borderRadius: 1.5,
              backgroundColor: (theme) => alpha(theme.palette.warning.main, 0.04),
              border: "1px solid",
              borderColor: (theme) => alpha(theme.palette.warning.main, 0.2),
            }}
          >
            <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ mb: 1.5 }}>
              <WarningIcon sx={{ fontSize: 16, color: "warning.main", flexShrink: 0, mt: 0.15 }} />
              <Typography sx={{ fontSize: 12, color: "warning.dark", lineHeight: 1.5, fontWeight: 600 }}>
                Attention : modifier le rôle change immédiatement les permissions
                de l'utilisateur.
              </Typography>
            </Stack>

            <SelectInput
              source="role"
              label="Rôle"
              choices={[
                { id: "CUSTOMER", name: "Client — accès boutique uniquement" },
                { id: "SELLER", name: "Vendeur — peut publier ses produits" },
                { id: "ADMIN", name: "Administrateur — accès complet" },
              ]}
              fullWidth
              helperText="Seul le rôle peut être modifié depuis cet écran."
            />
          </Box>

          <Box sx={{ height: 24 }} />
        </Box>

        {/* ═══ COLONNE DROITE : Aperçu ═══ */}
        <Box>
          <Box sx={{ position: "sticky", top: 24 }}>
            <UserPreview record={record} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export const UserEdit = () => (
  <Edit title="Utilisateur" mutationMode="pessimistic" redirect="list">
    <SimpleForm
      sx={{
        "& .RaSimpleForm-toolbar": {
          px: 3,
          py: 2,
          borderTop: "1px solid",
          borderColor: "divider",
        },
      }}
    >
      <UserFormContent />
    </SimpleForm>
  </Edit>
);