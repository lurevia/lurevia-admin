import { useState } from "react";
import { useNotify, useRecordContext, useRefresh } from "react-admin";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { reviewProfileChange } from "../../adminActions";

export const ProfileChangeActions = () => {
  const record = useRecordContext<{ id: string; status: string }>();
  const notify = useNotify(); const refresh = useRefresh();
  const [open, setOpen] = useState(false); const [approved, setApproved] = useState(true);
  const [note, setNote] = useState(""); const [loading, setLoading] = useState(false);
  if (!record || record.status !== "PENDING") return null;
  const submit = async () => {
    setLoading(true);
    try { await reviewProfileChange(record.id, approved, note || undefined); notify(approved ? "Modification approuvée." : "Modification rejetée.", { type: "success" }); setOpen(false); setNote(""); refresh(); }
    catch (err) { notify(err instanceof Error ? err.message : "Une erreur est survenue.", { type: "error" }); }
    finally { setLoading(false); }
  };
  return <>
    <Button size="small" color="success" onClick={() => { setApproved(true); setOpen(true); }}>Approuver</Button>
    <Button size="small" color="error" onClick={() => { setApproved(false); setOpen(true); }}>Rejeter</Button>
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
      <DialogTitle>{approved ? "Approuver la modification" : "Rejeter la modification"}</DialogTitle>
      <DialogContent><TextField label="Note (optionnelle)" fullWidth multiline rows={3} value={note} onChange={(e) => setNote(e.target.value)} sx={{ mt: 1 }} /></DialogContent>
      <DialogActions><Button onClick={() => setOpen(false)}>Annuler</Button><Button variant="contained" color={approved ? "success" : "error"} disabled={loading} onClick={submit}>Confirmer</Button></DialogActions>
    </Dialog>
  </>;
};
