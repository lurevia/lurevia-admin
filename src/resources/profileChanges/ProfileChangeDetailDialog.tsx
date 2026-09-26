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
import BadgeIconModule from "@mui/icons-material/Badge";
import CalendarTodayIconModule from "@mui/icons-material/CalendarToday";
import ScheduleIconModule from "@mui/icons-material/Schedule";
import HourglassEmptyIconModule from "@mui/icons-material/HourglassEmpty";
import CheckCircleIconModule from "@mui/icons-material/CheckCircle";
import CancelIconModule from "@mui/icons-material/Cancel";
import AdminPanelSettingsIconModule from "@mui/icons-material/AdminPanelSettings";
import ArrowRightAltIconModule from "@mui/icons-material/ArrowRightAlt";
import { normalizeMuiIcon } from "../../muiIcon";
import { ProfileChangeActions } from "./ProfileChangeActions";

const CloseIcon = normalizeMuiIcon(CloseIconModule);
const MailIcon = normalizeMuiIcon(MailOutlineIconModule);
const PhoneIcon = normalizeMuiIcon(PhoneIconModule);
const BadgeIcon = normalizeMuiIcon(BadgeIconModule);
const CalendarIcon = normalizeMuiIcon(CalendarTodayIconModule);
const ScheduleIcon = normalizeMuiIcon(ScheduleIconModule);
const PendingIcon = normalizeMuiIcon(HourglassEmptyIconModule);
const ApprovedIcon = normalizeMuiIcon(CheckCircleIconModule);
const RejectedIcon = normalizeMuiIcon(CancelIconModule);
const AdminIcon = normalizeMuiIcon(AdminPanelSettingsIconModule);
const ArrowIcon = normalizeMuiIcon(ArrowRightAltIconModule);

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

// ─────────────────────────────────────────────────────────────────────────────
// LIGNE DE COMPARAISON AVANT / APRÈS
// ─────────────────────────────────────────────────────────────────────────────

const ChangeComparison = ({
  icon: Icon,
  label,
  currentValue,
  newValue,
}: {
  icon: any;
  label: string;
  currentValue: string | null | undefined;
  newValue: string | null | undefined;
}) => {
  if (!newValue) return null;

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 1.5,
        backgroundColor: (theme) =>
          alpha(theme.palette.primary.main, 0.04),
        border: "1px solid",
        borderColor: (theme) =>
          alpha(theme.palette.primary.main, 0.12),
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.25 }}>
        <Box
          sx={{
            width: 26,
            height: 26,
            borderRadius: 0.75,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: (theme) =>
              alpha(theme.palette.primary.main, 0.12),
            color: "primary.main",
          }}
        >
          <Icon sx={{ fontSize: 14 }} />
        </Box>
        <Typography
          sx={{
            fontSize: 11,
            color: "text.secondary",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          {label}
        </Typography>
      </Stack>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        alignItems={{ xs: "stretch", sm: "center" }}
      >
        {/* Ancienne valeur */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            p: 1.25,
            borderRadius: 1,
            backgroundColor: (theme) =>
              alpha(theme.palette.error.main, 0.04),
            border: "1px solid",
            borderColor: (theme) =>
              alpha(theme.palette.error.main, 0.15),
          }}
        >
          <Typography
            sx={{
              fontSize: 9.5,
              color: "error.main",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 0.5,
              mb: 0.25,
            }}
          >
            Actuel
          </Typography>
          <Typography
            sx={{
              fontSize: 12.5,
              fontWeight: 600,
              color: "text.secondary",
              wordBreak: "break-all",
            }}
          >
            {currentValue || "Non renseigné"}
          </Typography>
        </Box>

        <ArrowIcon
          sx={{ fontSize: 20, color: "text.secondary", flexShrink: 0 }}
        />

        {/* Nouvelle valeur */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            p: 1.25,
            borderRadius: 1,
            backgroundColor: (theme) =>
              alpha(theme.palette.success.main, 0.06),
            border: "1px solid",
            borderColor: (theme) =>
              alpha(theme.palette.success.main, 0.25),
          }}
        >
          <Typography
            sx={{
              fontSize: 9.5,
              color: "success.main",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 0.5,
              mb: 0.25,
            }}
          >
            Demandé
          </Typography>
          <Typography
            sx={{
              fontSize: 12.5,
              fontWeight: 700,
              color: "text.primary",
              wordBreak: "break-all",
            }}
          >
            {newValue}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MODALE
// ─────────────────────────────────────────────────────────────────────────────

export const ProfileChangeDetailDialog = ({ open, onClose, record }: Props) => {
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
        : "warning";

  const hasChanges =
    record.requestedFullName ||
    record.requestedEmail ||
    record.requestedPhone;

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
              Modification de profil
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

        {/* Changements demandés */}
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
          Changements demandés
        </Typography>

        {hasChanges ? (
          <Stack spacing={2} sx={{ mb: 3 }}>
            <ChangeComparison
              icon={BadgeIcon}
              label="Nom complet"
              currentValue={user.fullName}
              newValue={record.requestedFullName}
            />
            <ChangeComparison
              icon={MailIcon}
              label="Email"
              currentValue={user.email}
              newValue={record.requestedEmail}
            />
            <ChangeComparison
              icon={PhoneIcon}
              label="Téléphone"
              currentValue={user.phone}
              newValue={record.requestedPhone}
            />
          </Stack>
        ) : (
          <Box
            sx={{
              p: 2,
              borderRadius: 1.5,
              backgroundColor: (theme) =>
                alpha(theme.palette.warning.main, 0.06),
              border: "1px solid",
              borderColor: (theme) =>
                alpha(theme.palette.warning.main, 0.2),
              mb: 3,
            }}
          >
            <Typography sx={{ fontSize: 12.5, color: "warning.dark" }}>
              Aucun changement spécifié dans cette demande.
            </Typography>
          </Box>
        )}

        {/* Note admin si traitée */}
        {!isPending && record.adminNote && (
          <>
            <Divider sx={{ mb: 3 }} />
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
              Note administrateur
            </Typography>
            <Box
              sx={{
                p: 2,
                borderRadius: 1.5,
                backgroundColor: (theme) =>
                  alpha(theme.palette.primary.main, 0.04),
                border: "1px solid",
                borderColor: (theme) =>
                  alpha(theme.palette.primary.main, 0.15),
                display: "flex",
                gap: 1.5,
                alignItems: "flex-start",
                mb: 3,
              }}
            >
              <AdminIcon
                sx={{
                  fontSize: 18,
                  color: "primary.main",
                  flexShrink: 0,
                  mt: 0.15,
                }}
              />
              <Typography sx={{ fontSize: 13, lineHeight: 1.6 }}>
                {record.adminNote}
              </Typography>
            </Box>
          </>
        )}

        {/* Timestamps */}
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ color: "text.secondary" }}
        >
          <ScheduleIcon sx={{ fontSize: 14 }} />
          <Typography sx={{ fontSize: 11 }}>
            Créée le {formatDateTime(record.createdAt)}
          </Typography>
        </Stack>
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

        {isPending && (
          <Stack direction="row" spacing={1}>
            <ProfileChangeActions />
          </Stack>
        )}
      </DialogActions>
    </Dialog>
  );
};