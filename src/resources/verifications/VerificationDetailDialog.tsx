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
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import CloseIconModule from "@mui/icons-material/Close";
import MailOutlineIconModule from "@mui/icons-material/MailOutline";
import PhoneIconModule from "@mui/icons-material/Phone";
import CalendarTodayIconModule from "@mui/icons-material/CalendarToday";
import ScheduleIconModule from "@mui/icons-material/Schedule";
import HourglassEmptyIconModule from "@mui/icons-material/HourglassEmpty";
import CheckCircleIconModule from "@mui/icons-material/CheckCircle";
import CancelIconModule from "@mui/icons-material/Cancel";
import DoneAllIconModule from "@mui/icons-material/DoneAll";
import TimerOffIconModule from "@mui/icons-material/TimerOff";
import WarningAmberIconModule from "@mui/icons-material/WarningAmber";
import AdminPanelSettingsIconModule from "@mui/icons-material/AdminPanelSettings";
import { normalizeMuiIcon } from "../../muiIcon";
import { VerificationActions } from "./VerificationActions";

const CloseIcon = normalizeMuiIcon(CloseIconModule);
const MailIcon = normalizeMuiIcon(MailOutlineIconModule);
const PhoneIcon = normalizeMuiIcon(PhoneIconModule);
const CalendarIcon = normalizeMuiIcon(CalendarTodayIconModule);
const ScheduleIcon = normalizeMuiIcon(ScheduleIconModule);
const PendingIcon = normalizeMuiIcon(HourglassEmptyIconModule);
const ApprovedIcon = normalizeMuiIcon(CheckCircleIconModule);
const RejectedIcon = normalizeMuiIcon(CancelIconModule);
const UsedIcon = normalizeMuiIcon(DoneAllIconModule);
const ExpiredIcon = normalizeMuiIcon(TimerOffIconModule);
const WarningIcon = normalizeMuiIcon(WarningAmberIconModule);
const AdminIcon = normalizeMuiIcon(AdminPanelSettingsIconModule);

interface Props {
  open: boolean;
  onClose: () => void;
  record: any | null;
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case "APPROVED":
      return {
        label: "Approuvée",
        color: "success" as const,
        icon: ApprovedIcon,
      };
    case "REJECTED":
      return {
        label: "Rejetée",
        color: "error" as const,
        icon: RejectedIcon,
      };
    case "USED":
      return {
        label: "Utilisée",
        color: "info" as const,
        icon: UsedIcon,
      };
    case "EXPIRED":
      return {
        label: "Expirée",
        color: "default" as const,
        icon: ExpiredIcon,
      };
    default:
      return {
        label: "En attente",
        color: "warning" as const,
        icon: PendingIcon,
      };
  }
};

const formatDateTime = (date: string | null | undefined) => {
  if (!date) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

export const VerificationDetailDialog = ({ open, onClose, record }: Props) => {
  if (!record) return null;

  const statusConfig = getStatusConfig(record.status);
  const StatusIconCmp = statusConfig.icon;
  const user = record.user ?? {};
  const initial = (user.fullName ?? "?").charAt(0).toUpperCase();
  const isPending = record.status === "PENDING";

  const themeColorKey =
    statusConfig.color === "success"
      ? "success"
      : statusConfig.color === "error"
        ? "error"
        : statusConfig.color === "info"
          ? "info"
          : "warning";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2.5, overflow: "hidden" } }}
    >
      <DialogTitle sx={{ pr: 6, pb: 1.5, position: "relative" }}>
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: (theme) =>
                alpha(theme.palette[themeColorKey].main, 0.12),
              color: `${themeColorKey}.main`,
            }}
          >
            <StatusIconCmp sx={{ fontSize: 18 }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 16 }}>
              Vérification de compte
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Créée le {formatDateTime(record.createdAt)}
            </Typography>
          </Box>
        </Stack>

        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 12, top: 12 }}
          aria-label="Fermer"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        {/* Statut */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Typography
            variant="overline"
            sx={{
              fontWeight: 700,
              color: "text.secondary",
              letterSpacing: 1,
              fontSize: 10.5,
            }}
          >
            Statut actuel
          </Typography>
          <Chip
            icon={<StatusIconCmp sx={{ fontSize: 14 }} />}
            label={statusConfig.label}
            color={statusConfig.color}
            size="small"
            sx={{
              height: 24,
              fontSize: 11,
              fontWeight: 700,
              "& .MuiChip-icon": { color: "inherit" },
            }}
          />
        </Stack>

        <Divider sx={{ mb: 3 }} />

        {/* Utilisateur */}
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
          Utilisateur
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Avatar
            src={user.avatarUrl || undefined}
            alt={user.fullName}
            sx={{
              width: 56,
              height: 56,
              fontSize: 22,
              fontWeight: 800,
              bgcolor: "primary.main",
              color: "primary.contrastText",
            }}
          >
            {initial}
          </Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.25 }}>
              {user.fullName || "Utilisateur inconnu"}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontFamily: "monospace", fontSize: 10.5 }}
            >
              ID : {String(user.id ?? record.userId).slice(0, 12)}…
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ mb: 3 }} />

        {/* Coordonnées */}
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
          Coordonnées
        </Typography>

        <Stack spacing={1.75} sx={{ mb: 3 }}>
          <InfoRow
            icon={MailIcon}
            label="Email"
            value={user.email ?? "—"}
          />
          <InfoRow
            icon={PhoneIcon}
            label="Téléphone"
            value={user.phone ?? "—"}
          />
        </Stack>

        <Divider sx={{ mb: 3 }} />

        {/* Infos vérification */}
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
          Informations
        </Typography>

        <Stack spacing={1.75}>
          <InfoRow
            icon={CalendarIcon}
            label="Demandée le"
            value={formatDateTime(record.createdAt)}
          />
          {record.approvedAt && (
            <InfoRow
              icon={ApprovedIcon}
              label="Approuvée le"
              value={formatDateTime(record.approvedAt)}
            />
          )}
          {record.expiresAt && (
            <InfoRow
              icon={ExpiredIcon}
              label="Expire le"
              value={formatDateTime(record.expiresAt)}
            />
          )}
          {record.usedAt && (
            <InfoRow
              icon={UsedIcon}
              label="Utilisée le"
              value={formatDateTime(record.usedAt)}
            />
          )}
        </Stack>

        {/* Motif de rejet */}
        {record.reason && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography
              variant="overline"
              sx={{
                fontWeight: 700,
                color: "text.secondary",
                letterSpacing: 1,
                fontSize: 10.5,
                mb: 1,
                display: "block",
              }}
            >
              Motif du rejet
            </Typography>
            <Box
              sx={{
                p: 2,
                borderRadius: 1.5,
                backgroundColor: (theme) =>
                  alpha(theme.palette.error.main, 0.06),
                border: "1px solid",
                borderColor: (theme) =>
                  alpha(theme.palette.error.main, 0.2),
                display: "flex",
                gap: 1.5,
                alignItems: "flex-start",
              }}
            >
              <WarningIcon
                sx={{
                  fontSize: 18,
                  color: "error.main",
                  flexShrink: 0,
                  mt: 0.15,
                }}
              />
              <Typography
                sx={{ fontSize: 13, lineHeight: 1.6, color: "error.dark" }}
              >
                {record.reason}
              </Typography>
            </Box>
          </>
        )}

        {/* Encart info si en attente */}
        {isPending && (
          <Box
            sx={{
              mt: 3,
              p: 2,
              borderRadius: 1.5,
              backgroundColor: (theme) =>
                alpha(theme.palette.info.main, 0.06),
              border: "1px solid",
              borderColor: (theme) => alpha(theme.palette.info.main, 0.2),
              display: "flex",
              gap: 1.5,
              alignItems: "flex-start",
            }}
          >
            <AdminIcon
              sx={{
                fontSize: 18,
                color: "info.main",
                flexShrink: 0,
                mt: 0.15,
              }}
            />
            <Typography
              sx={{ fontSize: 12.5, lineHeight: 1.6, color: "info.dark" }}
            >
              Approuvez cette demande pour que l'utilisateur puisse passer
              commande sur la boutique.
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: "1px solid",
          borderColor: "divider",
          justifyContent: "space-between",
        }}
      >
        <Button
          onClick={onClose}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          Fermer
        </Button>

          {isPending && <VerificationActions record={record} />}
      </DialogActions>
    </Dialog>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SOUS-COMPOSANT
// ─────────────────────────────────────────────────────────────────────────────

const InfoRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) => (
  <Stack direction="row" spacing={1.5} alignItems="center">
    <Box
      sx={{
        width: 32,
        height: 32,
        borderRadius: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: (theme) =>
          alpha(theme.palette.primary.main, 0.08),
        color: "primary.main",
        flexShrink: 0,
      }}
    >
      <Icon sx={{ fontSize: 16 }} />
    </Box>
    <Box sx={{ minWidth: 0, flex: 1 }}>
      <Typography
        sx={{
          fontSize: 10.5,
          color: "text.secondary",
          textTransform: "uppercase",
          letterSpacing: 0.5,
          fontWeight: 700,
        }}
      >
        {label}
      </Typography>
      <Typography sx={{ fontSize: 13, fontWeight: 600 }} noWrap title={value}>
        {value}
      </Typography>
    </Box>
  </Stack>
);