import { useState } from "react";
import { useNotify, useRefresh, useRecordContext } from "react-admin";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Box,
  Typography,
  Avatar,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import CheckIconModule from "@mui/icons-material/Check";
import CloseIconModule from "@mui/icons-material/Close";
import CheckCircleOutlineIconModule from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIconModule from "@mui/icons-material/CancelOutlined";
import WarningAmberIconModule from "@mui/icons-material/WarningAmber";
import {
  approveDeletionRequest,
  rejectDeletionRequest,
} from "../../adminActions";
import { normalizeMuiIcon } from "../../muiIcon";

const CheckIcon = normalizeMuiIcon(CheckIconModule);
const CloseIcon = normalizeMuiIcon(CloseIconModule);
const ApproveDialogIcon = normalizeMuiIcon(CheckCircleOutlineIconModule);
const RejectDialogIcon = normalizeMuiIcon(CancelOutlinedIconModule);
const WarningIcon = normalizeMuiIcon(WarningAmberIconModule);

interface DeletionRequestActionsProps {
  variant: "approve" | "reject";
}

export const DeletionRequestActions = ({
  variant,
}: DeletionRequestActionsProps) => {
  const record = useRecordContext();
  const notify = useNotify();
  const refresh = useRefresh();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  if (!record || record.status !== "pending") return null;

  const isApprove = variant === "approve";
  const DialogIcon = isApprove ? ApproveDialogIcon : RejectDialogIcon;
  const themeColor = isApprove ? "success" : "error";

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const id = String(record.id);
      if (isApprove) await approveDeletionRequest(id, note || undefined);
      else await rejectDeletionRequest(id, note || undefined);
      notify(
        isApprove ? "Demande approuvée." : "Demande rejetée.",
        { type: "success" }
      );
      setOpen(false);
      setNote("");
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

  return (
    <>
      <Button
        size="small"
        variant={isApprove ? "contained" : "outlined"}
        color={isApprove ? "success" : "error"}
        startIcon={isApprove ? <CheckIcon /> : <CloseIcon />}
        onClick={() => setOpen(true)}
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
        {isApprove ? "Approuver" : "Rejeter"}
      </Button>

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
                {isApprove
                  ? "Approuver la suppression"
                  : "Rejeter la demande"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {isApprove
                  ? "Le compte sera programmé pour suppression."
                  : "Le compte de l'utilisateur restera actif."}
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>

        <DialogContent>
          {/* Info utilisateur */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
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
            <Avatar
              src={record.userAvatarUrl || undefined}
              sx={{
                width: 40,
                height: 40,
                bgcolor: "primary.main",
                color: "primary.contrastText",
                fontWeight: 700,
                fontSize: 15,
              }}
            >
              {record.userName?.charAt(0).toUpperCase() ?? "?"}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                {record.userName}
              </Typography>
              <Typography
                sx={{ fontSize: 11.5, color: "text.secondary" }}
                noWrap
              >
                {record.userEmail}
              </Typography>
            </Box>
          </Box>

          {/* Alerte pour approbation */}
          {isApprove && (
            <Box
              sx={{
                p: 1.5,
                mb: 2.5,
                borderRadius: 1.5,
                backgroundColor: (theme) =>
                  alpha(theme.palette.warning.main, 0.06),
                border: "1px solid",
                borderColor: (theme) =>
                  alpha(theme.palette.warning.main, 0.2),
                display: "flex",
                gap: 1.25,
                alignItems: "flex-start",
              }}
            >
              <WarningIcon
                sx={{
                  fontSize: 18,
                  color: "warning.main",
                  flexShrink: 0,
                  mt: 0.15,
                }}
              />
              <Typography
                sx={{
                  fontSize: 12,
                  lineHeight: 1.5,
                  color: "warning.dark",
                  fontWeight: 600,
                }}
              >
                Action irréversible. Le compte sera anonymisé après la période
                de rétention légale.
              </Typography>
            </Box>
          )}

          <TextField
            label={
              isApprove
                ? "Note interne (optionnelle)"
                : "Motif du rejet (optionnel)"
            }
            fullWidth
            multiline
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={
              isApprove
                ? "Ex : Aucune commande en cours, suppression validée."
                : "Ex : Le client a encore une commande en cours."
            }
            helperText="Cette note sera visible par les autres administrateurs."
            size="small"
          />
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
            onClick={handleConfirm}
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
              : isApprove
                ? "Confirmer l'approbation"
                : "Confirmer le rejet"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};