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
import StarIconModule from "@mui/icons-material/Star";
import VerifiedIconModule from "@mui/icons-material/Verified";
import WarningAmberIconModule from "@mui/icons-material/WarningAmber";
import ShoppingBagIconModule from "@mui/icons-material/ShoppingBag";
import ScheduleIconModule from "@mui/icons-material/Schedule";
import HourglassEmptyIconModule from "@mui/icons-material/HourglassEmpty";
import CheckCircleIconModule from "@mui/icons-material/CheckCircle";
import CancelIconModule from "@mui/icons-material/Cancel";
import { normalizeMuiIcon } from "../../muiIcon";
import { ReviewActions } from "./ReviewActions";

const CloseIcon = normalizeMuiIcon(CloseIconModule);
const StarIcon = normalizeMuiIcon(StarIconModule);
const VerifiedIcon = normalizeMuiIcon(VerifiedIconModule);
const WarningIcon = normalizeMuiIcon(WarningAmberIconModule);
const BagIcon = normalizeMuiIcon(ShoppingBagIconModule);
const ScheduleIcon = normalizeMuiIcon(ScheduleIconModule);
const PendingIcon = normalizeMuiIcon(HourglassEmptyIconModule);
const ApprovedIcon = normalizeMuiIcon(CheckCircleIconModule);
const RejectedIcon = normalizeMuiIcon(CancelIconModule);

interface Props {
  open: boolean;
  onClose: () => void;
  record: any | null;
}

const getStatusConfig = (record: any) => {
  if (record?.isApproved === true)
    return { label: "Publié", color: "success" as const, icon: ApprovedIcon };
  if (record?.rejectedAt || record?.rejectionReason)
    return { label: "Rejeté", color: "error" as const, icon: RejectedIcon };
  return {
    label: "En attente",
    color: "warning" as const,
    icon: PendingIcon,
  };
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

const StarRating = ({ value }: { value: number }) => (
  <Stack direction="row" spacing={0.25} alignItems="center">
    {Array.from({ length: 5 }).map((_, i) => (
      <StarIcon
        key={i}
        sx={{
          fontSize: 18,
          color: i < value ? "#FDB022" : "action.disabled",
        }}
      />
    ))}
    <Typography
      sx={{ fontSize: 13, fontWeight: 700, ml: 1, color: "text.primary" }}
    >
      {value}/5
    </Typography>
  </Stack>
);

export const ReviewDetailDialog = ({ open, onClose, record }: Props) => {
  if (!record) return null;

  const statusConfig = getStatusConfig(record);
  const StatusIconCmp = statusConfig.icon;
  const initial = (record.userName ?? "?").charAt(0).toUpperCase();
  const isPending = !record.isApproved && !record.rejectedAt;

  const themeColorKey =
    statusConfig.color === "success"
      ? "success"
      : statusConfig.color === "error"
        ? "error"
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
              Avis client
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Soumis le {formatDateTime(record.createdAt)}
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
            Statut
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
          Auteur
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Avatar
            sx={{
              width: 52,
              height: 52,
              fontSize: 20,
              fontWeight: 800,
              bgcolor: "primary.main",
              color: "primary.contrastText",
            }}
          >
            {initial}
          </Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 0.5 }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {record.userName ?? "Client"}
              </Typography>
              {record.isVerifiedPurchase && (
                <Chip
                  icon={<VerifiedIcon sx={{ fontSize: 12 }} />}
                  label="Achat vérifié"
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: 10,
                    fontWeight: 700,
                    backgroundColor: (theme) =>
                      alpha(theme.palette.success.main, 0.12),
                    color: "success.dark",
                    "& .MuiChip-icon": { color: "inherit" },
                  }}
                />
              )}
            </Stack>
            {record.userEmail && (
              <Typography
                sx={{ fontSize: 11.5, color: "text.secondary" }}
                noWrap
              >
                {record.userEmail}
              </Typography>
            )}
          </Box>
        </Stack>

        <Divider sx={{ mb: 3 }} />

        {/* Produit */}
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
          Produit concerné
        </Typography>

        <Box
          sx={{
            p: 2,
            borderRadius: 1.5,
            backgroundColor: (theme) =>
              alpha(theme.palette.primary.main, 0.04),
            border: "1px solid",
            borderColor: (theme) =>
              alpha(theme.palette.primary.main, 0.12),
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mb: 3,
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: (theme) =>
                alpha(theme.palette.primary.main, 0.12),
              color: "primary.main",
              flexShrink: 0,
            }}
          >
            <BagIcon sx={{ fontSize: 18 }} />
          </Box>
          <Typography sx={{ fontSize: 13, fontWeight: 600, flex: 1 }} noWrap>
            {record.productTitle ?? "Produit inconnu"}
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Note */}
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
          Note attribuée
        </Typography>

        <Box sx={{ mb: 3 }}>
          <StarRating value={record.rating ?? 0} />
        </Box>

        {/* Titre + Commentaire */}
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
          Contenu de l'avis
        </Typography>

        {record.title && (
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 700,
              mb: 1.5,
              color: "text.primary",
            }}
          >
            {record.title}
          </Typography>
        )}

        <Box
          sx={{
            p: 2,
            borderRadius: 1.5,
            backgroundColor: (theme) =>
              alpha(theme.palette.info.main, 0.06),
            border: "1px solid",
            borderColor: (theme) => alpha(theme.palette.info.main, 0.15),
            mb: 3,
          }}
        >
          <Typography
            sx={{
              fontSize: 13,
              lineHeight: 1.7,
              whiteSpace: "pre-wrap",
              color: "text.primary",
            }}
          >
            {record.comment || "Aucun commentaire."}
          </Typography>
        </Box>

        {/* Motif de rejet si présent */}
        {record.rejectionReason && (
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
                mb: 3,
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
                {record.rejectionReason}
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
            Publié le {formatDateTime(record.createdAt)}
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

        {isPending && <ReviewActions record={record} />}
      </DialogActions>
    </Dialog>
  );
};