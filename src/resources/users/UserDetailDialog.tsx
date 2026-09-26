import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Typography,
  Stack,
  Chip,
  Button,
  Divider,
  Avatar,
  Tooltip,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import CloseIconModule from "@mui/icons-material/Close";
import EditOutlinedIconModule from "@mui/icons-material/EditOutlined";
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

const CloseIcon = normalizeMuiIcon(CloseIconModule);
const EditIcon = normalizeMuiIcon(EditOutlinedIconModule);
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

interface Props {
  open: boolean;
  onClose: () => void;
  record: any | null;
  onEdit: () => void;
}

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
      return {
        label: "Administrateur",
        color: "error" as const,
        icon: ShieldIcon,
      };
    case "SELLER":
      return {
        label: "Vendeur",
        color: "warning" as const,
        icon: SellerIcon,
      };
    default:
      return {
        label: "Client",
        color: "default" as const,
        icon: CustomerIcon,
      };
  }
};

export const UserDetailDialog = ({ open, onClose, record, onEdit }: Props) => {
  if (!record) return null;

  const roleConfig = getRoleConfig(record.role);
  const RoleIcon = roleConfig.icon;
  const initial = record.fullName?.charAt(0).toUpperCase() ?? "?";
  const isVerified = record.isVerified === true;
  const isActive = record.isActive !== false;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2.5, overflow: "hidden" } }}
    >
      <DialogTitle sx={{ pr: 6, pb: 0, position: "relative" }}>
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 12, top: 12 }}
          aria-label="Fermer"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1, pb: 3 }}>
        {/* ─── En-tête : Avatar + Nom + Rôle ─── */}
        <Stack alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
          <Box sx={{ position: "relative", display: "inline-block" }}>
            <Avatar
              src={record.avatarUrl || undefined}
              alt={record.fullName}
              sx={{
                width: 88,
                height: 88,
                fontSize: 34,
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
              <Tooltip title="Compte vérifié" arrow>
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
                    borderColor: "background.paper",
                  }}
                >
                  <VerifiedIcon sx={{ fontSize: 14, color: "#FFFFFF" }} />
                </Box>
              </Tooltip>
            )}
          </Box>

          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
              {record.fullName}
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              justifyContent="center"
              alignItems="center"
              flexWrap="wrap"
            >
              <Chip
                icon={<RoleIcon sx={{ fontSize: 14 }} />}
                label={roleConfig.label}
                color={roleConfig.color}
                size="small"
                sx={{
                  height: 24,
                  fontWeight: 700,
                  fontSize: 11,
                  "& .MuiChip-icon": { color: "inherit" },
                }}
              />
              {!isActive && (
                <Chip
                  label="Désactivé"
                  size="small"
                  sx={{
                    height: 24,
                    fontWeight: 700,
                    fontSize: 11,
                    backgroundColor: "error.light",
                    color: "error.dark",
                  }}
                />
              )}
            </Stack>
          </Box>
        </Stack>

        <Divider sx={{ my: 2.5 }} />

        {/* ─── Infos ─── */}
        <Stack spacing={1.75}>
          {/* Email */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: (theme) =>
                  alpha(theme.palette.primary.main, 0.1),
                color: "primary.main",
                flexShrink: 0,
              }}
            >
              <MailIcon sx={{ fontSize: 18 }} />
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700 }}
              >
                Adresse e-mail
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, wordBreak: "break-all" }}
              >
                {record.email || "—"}
              </Typography>
            </Box>
          </Stack>

          {/* Téléphone */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: (theme) =>
                  alpha(theme.palette.primary.main, 0.1),
                color: "primary.main",
                flexShrink: 0,
              }}
            >
              <PhoneIcon sx={{ fontSize: 18 }} />
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700 }}
              >
                Téléphone
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {record.phone || "—"}
              </Typography>
            </Box>
          </Stack>

          {/* Commandes */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: (theme) =>
                  alpha(theme.palette.success.main, 0.1),
                color: "success.main",
                flexShrink: 0,
              }}
            >
              <OrdersIcon sx={{ fontSize: 18 }} />
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700 }}
              >
                Nombre de commandes
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, fontSize: 16 }}>
                {record.ordersCount ?? 0}
              </Typography>
            </Box>
          </Stack>

          {/* Inscrit le */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: (theme) =>
                  alpha(theme.palette.info.main, 0.1),
                color: "info.main",
                flexShrink: 0,
              }}
            >
              <CalendarIcon sx={{ fontSize: 18 }} />
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700 }}
              >
                Inscrit le
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {formatDate(record.createdAt)}
              </Typography>
            </Box>
          </Stack>

          {/* Dernière connexion */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: (theme) =>
                  alpha(theme.palette.warning.main, 0.1),
                color: "warning.main",
                flexShrink: 0,
              }}
            >
              <LoginIcon sx={{ fontSize: 18 }} />
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700 }}
              >
                Dernière connexion
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {formatDateTime(record.lastLoginAt)}
              </Typography>
            </Box>
          </Stack>
        </Stack>

        {/* ─── Bandeau état vérification ─── */}
        {!isVerified && (
          <Box
            sx={{
              mt: 3,
              p: 1.5,
              borderRadius: 1.5,
              backgroundColor: (theme) => alpha(theme.palette.warning.main, 0.08),
              border: "1px solid",
              borderColor: (theme) => alpha(theme.palette.warning.main, 0.2),
              display: "flex",
              alignItems: "center",
              gap: 1.25,
            }}
          >
            <WarningIcon sx={{ fontSize: 18, color: "warning.main", flexShrink: 0 }} />
            <Typography sx={{ fontSize: 12, color: "warning.dark", fontWeight: 600 }}>
              Ce compte n'a pas encore été vérifié.
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{ px: 3, py: 2, borderTop: "1px solid", borderColor: "divider" }}
      >
        <Button
          onClick={onClose}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          Fermer
        </Button>
        <Button
          variant="contained"
          startIcon={<EditIcon fontSize="small" />}
          onClick={onEdit}
          sx={{
            textTransform: "none",
            fontWeight: 700,
            borderRadius: 1.5,
            boxShadow: "none",
          }}
        >
          Modifier
        </Button>
      </DialogActions>
    </Dialog>
  );
};