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
import { normalizeMuiIcon } from "../../muiIcon";
import { reviewProfileChange } from "../../adminActions";

const CheckIcon = normalizeMuiIcon(CheckIconModule);
const CloseIcon = normalizeMuiIcon(CloseIconModule);
const ApproveDialogIcon = normalizeMuiIcon(CheckCircleOutlineIconModule);
const RejectDialogIcon = normalizeMuiIcon(CancelOutlinedIconModule);
const WarningIcon = normalizeMuiIcon(WarningAmberIconModule);

type RecordType = {
  id: string;
  status: string;
  user?: {
    fullName?: string;
    email?: string;
    avatarUrl?: string;
  };
  requestedFullName?: string;
  requestedEmail?: string;
  requestedPhone?: string;
};

export const ProfileChangeActions = () => {
  const record = useRecordContext<RecordType>();
  const notify = useNotify();
  const refresh = useRefresh();
  const [open, setOpen] = useState(false);
  const [approved, setApproved] = useState(true);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  if (!record || record.status !== "PENDING") return null;

  const user = record.user ?? {};
  const initial = (user.fullName ?? "?").charAt(0).toUpperCase();
  const themeColor = approved ? "success" : "error";
  const DialogIcon = approved ? ApproveDialogIcon : RejectDialogIcon;

  const changesCount = [
    record.requestedFullName,
    record.requestedEmail,
    record.requestedPhone,
  ].filter(Boolean).length;

  const submit = async () => {
    setLoading(true);
    try {
      await reviewProfileChange(record.id, approved, note || undefined);
      notify(
        approved ? "Modification approuvée." : "Modification rejetée.",
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
      <Stack direction="row" spacing={0.5}>
        <Button
          size="small"
          variant="contained"
          color="success"
          startIcon={<CheckIcon />}
          onClick={() => {
            setApproved(true);
            setOpen(true);
          }}
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
        <Button
          size="small"
          variant="outlined"
          color="error"
          startIcon={<CloseIcon />}
          onClick={() => {
            setApproved(false);
            setOpen(true);
          }}
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
                {approved
                  ? "Approuver la modification"
                  : "Rejeter la demande"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {approved
                  ? "Les changements seront appliqués au profil."
                  : "Le profil de l'utilisateur restera inchangé."}
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

          {/* Résumé des changements */}
          {changesCount > 0 && (
            <Box
              sx={{
                p: 1.5,
                mb: 2.5,
                borderRadius: 1.5,
                backgroundColor: (theme) =>
                  alpha(theme.palette.info.main, 0.06),
                border: "1px solid",
                borderColor: (theme) =>
                  alpha(theme.palette.info.main, 0.2),
              }}
            >
              <Typography
                sx={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "info.dark",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  mb: 0.5,
                }}
              >
                {changesCount} changement{changesCount > 1 ? "s" : ""} à traiter
              </Typography>
              <Stack spacing={0.25}>
                {record.requestedFullName && (
                  <Typography sx={{ fontSize: 12, color: "text.primary" }}>
                    • Nom : <strong>{record.requestedFullName}</strong>
                  </Typography>
                )}
                {record.requestedEmail && (
                  <Typography sx={{ fontSize: 12, color: "text.primary" }}>
                    • Email : <strong>{record.requestedEmail}</strong>
                  </Typography>
                )}
                {record.requestedPhone && (
                  <Typography sx={{ fontSize: 12, color: "text.primary" }}>
                    • Téléphone : <strong>{record.requestedPhone}</strong>
                  </Typography>
                )}
              </Stack>
            </Box>
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
              Expliquez brièvement la raison du rejet — l'utilisateur verra
              cette note.
            </Alert>
          )}

          <TextField
            label={
              approved
                ? "Note interne (optionnelle)"
                : "Motif du rejet (optionnel)"
            }
            fullWidth
            multiline
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={
              approved
                ? "Ex : Vérifications effectuées, modification validée."
                : "Ex : Informations insuffisantes pour valider."
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