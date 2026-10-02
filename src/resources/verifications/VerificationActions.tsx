import { useState } from "react";
import { useRecordContext } from "react-admin";
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
import InfoOutlinedIconModule from "@mui/icons-material/InfoOutlined";
import { normalizeMuiIcon } from "../../muiIcon";
import { approveVerification, rejectVerification } from "../../adminActions";
import { useAdminAction } from "../../hooks/useAdminAction";

// ─── Icônes normalisées ───
const CheckIcon = normalizeMuiIcon(CheckIconModule);
const CloseIcon = normalizeMuiIcon(CloseIconModule);
const ApproveDialogIcon = normalizeMuiIcon(CheckCircleOutlineIconModule);
const RejectDialogIcon = normalizeMuiIcon(CancelOutlinedIconModule);
const WarningIcon = normalizeMuiIcon(WarningAmberIconModule);
const InfoIcon = normalizeMuiIcon(InfoOutlinedIconModule);

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface VerificationActionsProps {
  /** Affiche un bouton unique (approve ou reject) ou les deux. */
  variant?: "approve" | "reject";
  showBoth?: boolean;
  record?: any;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────────────────────

export const VerificationActions = ({
  variant,
  showBoth = true,
  record: recordProp,
}: VerificationActionsProps) => {
  const contextRecord = useRecordContext<any>();
  const record = recordProp ?? contextRecord;
  const { execute, loading } = useAdminAction();

  const [open, setOpen] = useState(false);
  const [approved, setApproved] = useState(true);
  const [reason, setReason] = useState("");

  if (!record || record.status !== "PENDING") return null;

  const openApprove = () => {
    setApproved(true);
    setReason("");
    setOpen(true);
  };

  const openReject = () => {
    setApproved(false);
    setReason("");
    setOpen(true);
  };

  const handleClose = () => {
    if (loading) return;
    setOpen(false);
    setReason("");
  };

  const submit = async () => {
    const succeeded = await execute(
      () => approved
        ? approveVerification(record.id)
        : rejectVerification(record.id, reason || undefined),
      approved
        ? "Compte approuvé et fonctionnalités activées."
        : "Demande de vérification rejetée."
    );
    if (!succeeded) return;
    setOpen(false);
    setReason("");
  };

  const user = record.user ?? {};
  const initial = (user.fullName ?? "?").charAt(0).toUpperCase();
  const themeColor = approved ? "success" : "error";
  const DialogIcon = approved ? ApproveDialogIcon : RejectDialogIcon;

  return (
    <>
      {/* ═══════ BOUTONS ═══════ */}
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

      {/* ═══════ MODALE ═══════ */}
      <Dialog
        open={open}
        onClose={handleClose}
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
                {approved
                  ? "Approuver la vérification"
                  : "Rejeter la demande"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                  {approved
                    ? "Le compte sera activé immédiatement et l'utilisateur recevra une notification."
                    : "L'utilisateur ne pourra pas finaliser sa vérification."}
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>

        <DialogContent>
          {/* Utilisateur */}
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
              src={user.avatarUrl || undefined}
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
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                {user.fullName ?? "Utilisateur"}
              </Typography>
              <Typography
                sx={{ fontSize: 11.5, color: "text.secondary" }}
                noWrap
              >
                {user.email ?? "—"}
              </Typography>
            </Box>
          </Box>

          {/* Info si approbation */}
          {approved && (
            <Alert
              severity="info"
              icon={<InfoIcon fontSize="small" />}
              sx={{
                mb: 2.5,
                py: 0.75,
                "& .MuiAlert-message": { fontSize: 12.5, lineHeight: 1.5 },
              }}
            >
              En approuvant, toutes les fonctionnalités du compte seront activées
              immédiatement et une notification sera envoyée à l'utilisateur.
            </Alert>
          )}

          {/* Alerte si rejet */}
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
              Indiquez brièvement la raison du rejet — l'utilisateur verra
              cette note.
            </Alert>
          )}

          {!approved && (
            <TextField
              label="Motif du rejet"
              fullWidth
              multiline
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex : Numéro CIN invalide ou informations incohérentes."
              helperText="Cette note sera visible par l'utilisateur."
              required
              size="small"
            />
          )}
        </DialogContent>

        {/* ═══════ BOUTON VALIDER ═══════ */}
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
            onClick={handleClose}
            disabled={loading}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Annuler
          </Button>
          <Button
            onClick={submit}
            disabled={loading || (!approved && !reason.trim())}
            variant="contained"
            color={themeColor}
            startIcon={!loading && (approved ? <CheckIcon /> : <CloseIcon />)}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 1.5,
              boxShadow: "none",
              px: 3,
              py: 0.9,
              "&:hover": { boxShadow: "none" },
            }}
          >
            {loading
              ? "Validation en cours…"
              : approved
                ? "Valider l'approbation"
                : "Valider le rejet"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};