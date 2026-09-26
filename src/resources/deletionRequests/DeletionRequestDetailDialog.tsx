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
import DescriptionIconModule from "@mui/icons-material/Description";
import ScheduleIconModule from "@mui/icons-material/Schedule";
import HourglassEmptyIconModule from "@mui/icons-material/HourglassEmpty";
import CheckCircleIconModule from "@mui/icons-material/CheckCircle";
import CancelIconModule from "@mui/icons-material/Cancel";
import AdminPanelSettingsIconModule from "@mui/icons-material/AdminPanelSettings";
import { normalizeMuiIcon } from "../../muiIcon";
import { DeletionRequestActions } from "./DeletionRequestActions";

const CloseIcon = normalizeMuiIcon(CloseIconModule);
const MailIcon = normalizeMuiIcon(MailOutlineIconModule);
const PhoneIcon = normalizeMuiIcon(PhoneIconModule);
const CalendarIcon = normalizeMuiIcon(CalendarTodayIconModule);
const ReasonIcon = normalizeMuiIcon(DescriptionIconModule);
const ScheduleIcon = normalizeMuiIcon(ScheduleIconModule);
const PendingIcon = normalizeMuiIcon(HourglassEmptyIconModule);
const ApprovedIcon = normalizeMuiIcon(CheckCircleIconModule);
const RejectedIcon = normalizeMuiIcon(CancelIconModule);
const AdminIcon = normalizeMuiIcon(AdminPanelSettingsIconModule);

interface Props {
  open: boolean;
  onClose: () => void;
  record: any | null;
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case "approved":
      return { label: "Approuvée", color: "success" as const, icon: ApprovedIcon };
    case "rejected":
      return { label: "Rejetée", color: "error" as const, icon: RejectedIcon };
    default:
      return { label: "En attente", color: "warning" as const, icon: PendingIcon };
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

export const DeletionRequestDetailDialog = ({ open, onClose, record }: Props) => {
  if (!record) return null;

  const statusConfig = getStatusConfig(record.status);
  const StatusIconCmp = statusConfig.icon;
  const initial = record.userName?.charAt(0).toUpperCase() ?? "?";
  const isPending = record.status === "pending";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2.5, overflow: "hidden" } }}
    >
      <DialogTitle
        sx={{ pr: 6, pb: 1.5, position: "relative" }}
      >
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
                alpha(
                  theme.palette[
                    statusConfig.color === "success"
                      ? "success"
                      : statusConfig.color === "error"
                        ? "error"
                        : "warning"
                  ].main,
                  0.12
                ),
              color: `${statusConfig.color}.main`,
            }}
          >
            <StatusIconCmp sx={{ fontSize: 18 }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 16 }}>
              Demande de suppression
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
            src={record.userAvatarUrl || undefined}
            alt={record.userName}
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
              {record.userName || "Utilisateur inconnu"}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontFamily: "monospace", fontSize: 10.5 }}
            >
              ID : {String(record.userId ?? record.id).slice(0, 12)}…
            </Typography>
          </Box>
        </Stack>

        <Stack spacing={1.75} sx={{ mb: 3 }}>
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
              <MailIcon sx={{ fontSize: 16 }} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: 10.5,
                  color: "text.secondary",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  fontWeight: 700,
                }}
              >
                Email
              </Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 600, wordBreak: "break-all" }}>
                {record.userEmail || "—"}
              </Typography>
            </Box>
          </Stack>

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
              <PhoneIcon sx={{ fontSize: 16 }} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: 10.5,
                  color: "text.secondary",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  fontWeight: 700,
                }}
              >
                Téléphone
              </Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                {record.userPhone || "—"}
              </Typography>
            </Box>
          </Stack>
        </Stack>

        <Divider sx={{ mb: 3 }} />

        {/* Motif */}
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
          Motif de la demande
        </Typography>

        <Box
          sx={{
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
            mb: 3,
          }}
        >
          <ReasonIcon
            sx={{ fontSize: 18, color: "warning.main", flexShrink: 0, mt: 0.15 }}
          />
          <Typography sx={{ fontSize: 13, lineHeight: 1.6, color: "text.primary" }}>
            {record.reason || "Aucun motif fourni par l'utilisateur."}
          </Typography>
        </Box>

        {/* Note admin si traitement effectué */}
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
                sx={{ fontSize: 18, color: "primary.main", flexShrink: 0, mt: 0.15 }}
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
            <DeletionRequestActions variant="reject" />
            <DeletionRequestActions variant="approve" />
          </Stack>
        )}
      </DialogActions>
    </Dialog>
  );
};