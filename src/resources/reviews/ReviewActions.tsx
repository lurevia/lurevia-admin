import { useState } from "react";
import { useNotify, useRecordContext, useRefresh } from "react-admin";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import CheckIconModule from "@mui/icons-material/Check";
import CloseIconModule from "@mui/icons-material/Close";
import CheckCircleOutlineIconModule from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIconModule from "@mui/icons-material/CancelOutlined";
import WarningAmberIconModule from "@mui/icons-material/WarningAmber";
import StarIconModule from "@mui/icons-material/Star";
import { normalizeMuiIcon } from "../../muiIcon";
import { approveReview, rejectReview } from "../../adminActions";

const CheckIcon = normalizeMuiIcon(CheckIconModule);
const CloseIcon = normalizeMuiIcon(CloseIconModule);
const ApproveDialogIcon = normalizeMuiIcon(CheckCircleOutlineIconModule);
const RejectDialogIcon = normalizeMuiIcon(CancelOutlinedIconModule);
const WarningIcon = normalizeMuiIcon(WarningAmberIconModule);
const StarIcon = normalizeMuiIcon(StarIconModule);

interface ReviewActionsProps {
  variant?: "approve" | "reject";
  /** Mode : afficher les deux boutons (default) ou un seul. */
  showBoth?: boolean;
  record?: any;
}

export const ReviewActions = ({
  variant,
  showBoth = true,
  record: recordProp,
}: ReviewActionsProps) => {
  const contextRecord = useRecordContext<any>();
  const record = recordProp ?? contextRecord;
  const notify = useNotify();
  const refresh = useRefresh();

  const [open, setOpen] = useState(false);
  const [approved, setApproved] = useState(true);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  if (!record || record.isApproved === true) return null;

  const openApprove = () => {
    setApproved(true);
    setOpen(true);
  };
  const openReject = () => {
    setApproved(false);
    setOpen(true);
  };

  const submit = async () => {
    setLoading(true);
    try {
      if (approved) {
        await approveReview(record.id);
        notify("Avis approuvé et publié.", { type: "success" });
      } else {
        await rejectReview(record.id, reason || undefined);
        notify("Avis rejeté.", { type: "success" });
      }
      setOpen(false);
      setReason("");
      refresh();
    } catch (err) {
      notify(
        err instanceof Error ? err.message : "Une erreur est survenue.",
        { type: "error" }
      );
    } finally {
      setLoading(false);
    }
  };

  const themeColor = approved ? "success" : "error";
  const DialogIcon = approved ? ApproveDialogIcon : RejectDialogIcon;
  const initial = (record.userName ?? "?").charAt(0).toUpperCase();

  return (
    <>
      <Stack direction="row" spacing={0.5}>
        {(showBoth || variant === "approve") && (
          <Button
            size="small"
            variant="contained"
            color="success"
            startIcon={<CheckIcon />}
            onClick={openApprove}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              fontSize: 11.5,
              borderRadius: 1.5,
              py: 0.5,
              px: 1.25,
              minWidth: "auto",
              boxShadow: "none",
              "&:hover": { boxShadow: "none" },
            }}
          >
            Approuver
          </Button>
        )}
        {(showBoth || variant === "reject") && (
          <Button
            size="small"
            variant="outlined"
            color="error"
            startIcon={<CloseIcon />}
            onClick={openReject}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              fontSize: 11.5,
              borderRadius: 1.5,
              py: 0.5,
              px: 1.25,
              minWidth: "auto",
            }}
          >
            Rejeter
          </Button>
        )}
      </Stack>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 2.5 } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
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
                  alpha(theme.palette[themeColor].main, 0.12),
                color: `${themeColor}.main`,
              }}
            >
              <DialogIcon sx={{ fontSize: 18 }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: 16 }}>
                {approved ? "Approuver l'avis" : "Rejeter l'avis"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {approved
                  ? "L'avis sera visible publiquement sur la fiche produit."
                  : "L'avis restera masqué et ne sera pas publié."}
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>

        <DialogContent>
          {/* Utilisateur + note */}
          <Box
            sx={{
              p: 1.5,
              mb: 2.5,
              borderRadius: 1.5,
              backgroundColor: (theme) =>
                alpha(theme.palette.primary.main, 0.04),
              border: "1px solid",
              borderColor: (theme) =>
                alpha(theme.palette.primary.main, 0.12),
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  fontWeight: 700,
                  fontSize: 15,
                }}
              >
                {initial}
              </Avatar>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                  {record.userName ?? "Client"}
                </Typography>
                <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
                  {record.productTitle ?? "Produit"}
                </Typography>
              </Box>
            </Stack>

            {/* Note en étoiles */}
            <Stack direction="row" spacing={0.25} alignItems="center">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon
                  key={i}
                  sx={{
                    fontSize: 14,
                    color: i < record.rating ? "#FDB022" : "action.disabled",
                  }}
                />
              ))}
              <Typography
                sx={{
                  fontSize: 11.5,
                  color: "text.secondary",
                  ml: 0.75,
                  fontWeight: 600,
                }}
              >
                {record.rating}/5
              </Typography>
            </Stack>
          </Box>

          {/* Aperçu du commentaire */}
          {record.comment && (
            <Box
              sx={{
                p: 1.5,
                mb: 2.5,
                borderRadius: 1.5,
                backgroundColor: "action.hover",
                fontSize: 12.5,
                lineHeight: 1.6,
                color: "text.primary",
                fontStyle: "italic",
              }}
            >
              "{record.comment}"
            </Box>
          )}

          {/* Alerte rejet */}
          {!approved && (
            <Alert
              severity="warning"
              icon={<WarningIcon fontSize="small" />}
              sx={{
                mb: 2.5,
                py: 0.75,
                "& .MuiAlert-message": { fontSize: 12.5, lineHeight: 1.5 },
              }}
            >
              Indiquez brièvement la raison du rejet (contenu inapproprié,
              spam, etc.).
            </Alert>
          )}

          {!approved && (
            <TextField
              label="Raison du rejet (optionnel)"
              fullWidth
              multiline
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex : Contenu inapproprié ou hors sujet."
              helperText="Cette note sera visible par les autres administrateurs."
              size="small"
            />
          )}
        </DialogContent>

        <DialogActions
          sx={{ px: 3, py: 2, borderTop: "1px solid", borderColor: "divider" }}
        >
          <Button
            onClick={() => setOpen(false)}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Annuler
          </Button>
          <Button
            onClick={submit}
            disabled={loading}
            variant="contained"
            color={themeColor}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 1.5,
              boxShadow: "none",
            }}
          >
            {loading
              ? "Traitement…"
              : approved
                ? "Confirmer l'approbation"
                : "Confirmer le rejet"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};