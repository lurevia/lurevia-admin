import { useState } from "react";
import { useNotify, useRefresh, useRecordContext } from "react-admin";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { approveDeletionRequest, rejectDeletionRequest } from "../../adminActions";

interface DeletionRequestActionsProps {
  variant: "approve" | "reject";
}

/**
 * Approuver/rejeter ne sont pas des actions CRUD standard côté API
 * (POST .../approve, .../reject), donc pas gérées par le dataProvider —
 * on les déclenche directement ici, avec une note admin optionnelle
 * pour tracer la décision.
 */
export const DeletionRequestActions = ({ variant }: DeletionRequestActionsProps) => {
  const record = useRecordContext();
  const notify = useNotify();
  const refresh = useRefresh();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  if (!record || record.status !== "pending") return null;

  const isApprove = variant === "approve";

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const id = String(record.id);
      if (isApprove) await approveDeletionRequest(id, note || undefined);
      else await rejectDeletionRequest(id, note || undefined);
      notify(isApprove ? "Demande approuvée." : "Demande rejetée.", { type: "success" });
      setOpen(false);
      setNote("");
      refresh();
    } catch (err) {
      notify(err instanceof Error ? err.message : "Une erreur est survenue.", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        size="small"
        color={isApprove ? "success" : "error"}
        startIcon={isApprove ? <CheckIcon /> : <CloseIcon />}
        onClick={() => setOpen(true)}
      >
        {isApprove ? "Approuver" : "Rejeter"}
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{isApprove ? "Approuver la demande" : "Rejeter la demande"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Note interne (optionnelle)"
            fullWidth
            multiline
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Annuler</Button>
          <Button onClick={handleConfirm} disabled={loading} variant="contained" color={isApprove ? "success" : "error"}>
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
