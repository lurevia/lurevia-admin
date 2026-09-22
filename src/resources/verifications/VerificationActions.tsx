import { useState } from "react";
import { useNotify, useRecordContext, useRefresh } from "react-admin";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { approveVerification, rejectVerification } from "../../adminActions";

export const VerificationActions = () => {
  const record = useRecordContext<{ id: string; status: string }>(); const notify = useNotify(); const refresh = useRefresh();
  const [open, setOpen] = useState(false); const [reason, setReason] = useState(""); const [loading, setLoading] = useState(false);
  if (!record || record.status !== "PENDING") return null;
  const submit = async (approved: boolean) => { setLoading(true); try { if (approved) await approveVerification(record.id); else await rejectVerification(record.id, reason || undefined); notify(approved ? "Compte approuvé." : "Compte rejeté.", { type: "success" }); setOpen(false); refresh(); } catch (e) { notify(e instanceof Error ? e.message : "Une erreur est survenue.", { type: "error" }); } finally { setLoading(false); } };
  return <><Button size="small" color="success" onClick={() => submit(true)} disabled={loading}>Approuver</Button><Button size="small" color="error" onClick={() => setOpen(true)}>Rejeter</Button><Dialog open={open} onClose={() => setOpen(false)} fullWidth><DialogTitle>Rejeter la vérification</DialogTitle><DialogContent><TextField label="Motif (optionnel)" fullWidth multiline rows={3} value={reason} onChange={(e) => setReason(e.target.value)} sx={{ mt: 1 }} /></DialogContent><DialogActions><Button onClick={() => setOpen(false)}>Annuler</Button><Button color="error" variant="contained" onClick={() => submit(false)} disabled={loading}>Confirmer</Button></DialogActions></Dialog></>;
};
