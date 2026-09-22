import { useEffect, useState } from "react";
import { useDataProvider, useNotify } from "react-admin";
import { Box, Button, Checkbox, FormControlLabel, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import { sendAdminMessage } from "../../adminActions";

type Customer = { id: string; fullName?: string; email?: string };
export const AdminMessagePage = () => {
  const provider = useDataProvider(); const notify = useNotify();
  const [customers, setCustomers] = useState<Customer[]>([]); const [allUsers, setAllUsers] = useState(false);
  const [userId, setUserId] = useState(""); const [subject, setSubject] = useState(""); const [body, setBody] = useState(""); const [sending, setSending] = useState(false);
  useEffect(() => { provider.getList("users", { pagination: { page: 1, perPage: 100 }, sort: { field: "fullName", order: "ASC" }, filter: {} }).then(({ data }) => setCustomers(data as Customer[])).catch(() => notify("Impossible de charger les clients.", { type: "error" })); }, [provider, notify]);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); if ((!allUsers && !userId) || !subject.trim() || !body.trim()) { notify("Sélectionnez un destinataire et renseignez le sujet et le message.", { type: "warning" }); return; }
    setSending(true); try { await sendAdminMessage({ subject: subject.trim(), body: body.trim(), ...(allUsers ? { allUsers: true } : { userId }) }); notify("Message envoyé.", { type: "success" }); setSubject(""); setBody(""); setUserId(""); } catch (e) { notify(e instanceof Error ? e.message : "Échec de l'envoi.", { type: "error" }); } finally { setSending(false); }
  };
  return <Box maxWidth="md"><Typography variant="h5" sx={{ mb: 2 }}>Nouveau message client</Typography><Paper component="form" onSubmit={submit} sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
    <FormControlLabel control={<Checkbox checked={allUsers} onChange={(e) => setAllUsers(e.target.checked)} />} label="Envoyer à tous les clients" />
    {!allUsers && <Select value={userId} onChange={(e) => setUserId(e.target.value)} displayEmpty><MenuItem value="">Sélectionner un client</MenuItem>{customers.map((c) => <MenuItem key={c.id} value={c.id}>{c.fullName || c.email} {c.fullName && c.email ? `(${c.email})` : ""}</MenuItem>)}</Select>}
    <TextField required label="Sujet" value={subject} onChange={(e) => setSubject(e.target.value)} /><TextField required label="Message" multiline minRows={7} value={body} onChange={(e) => setBody(e.target.value)} />
    <Button type="submit" variant="contained" disabled={sending}>Envoyer</Button>
  </Paper></Box>;
};
