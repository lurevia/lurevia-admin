import { useState, type FormEvent } from "react";
import { useNotify, Title } from "react-admin";
import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";
import { API_URL, httpClient } from "../../httpClient";

type FormValues = { fullName: string; email: string; phone: string; password: string };
const initialValues: FormValues = { fullName: "", email: "", phone: "", password: "" };

export const AdminCreate = () => {
  const notify = useNotify();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<FormValues>>({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (field: keyof FormValues) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setServerError("");
  };

  const validate = () => {
    const next: Partial<FormValues> = {};
    if (values.fullName.trim().length < 2) next.fullName = "Nom complet requis (2 caractères minimum).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) next.email = "Email invalide.";
    if (!/^(\+261|0)[0-9]{9}$/.test(values.phone.trim())) next.phone = "Numéro malgache invalide.";
    if (values.password.length < 8 || !/[a-z]/.test(values.password) || !/[A-Z]/.test(values.password) || !/[0-9]/.test(values.password)) {
      next.password = "8 caractères minimum, avec minuscule, majuscule et chiffre.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setServerError("");
    try {
      await httpClient(`${API_URL}/admin/admins`, { method: "POST", body: JSON.stringify(values) });
      setValues(initialValues);
      notify("Compte administrateur créé avec succès.", { type: "success" });
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Impossible de créer le compte.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 620, mx: "auto", mt: 3 }}>
      <Title title="Créer un administrateur" />
      <Card>
        <CardContent>
          <Stack spacing={2} component="form" onSubmit={submit} noValidate>
            <Typography variant="h5">Nouvel administrateur</Typography>
            <Typography color="text.secondary">
              Le compte est activé et vérifié immédiatement. Ne partagez jamais le mot de passe via un canal non sécurisé.
            </Typography>
            {serverError && <Alert severity="error">{serverError}</Alert>}
            <TextField label="Nom complet" value={values.fullName} onChange={update("fullName")} error={Boolean(errors.fullName)} helperText={errors.fullName} required />
            <TextField label="Email" type="email" value={values.email} onChange={update("email")} error={Boolean(errors.email)} helperText={errors.email} required />
            <TextField label="Téléphone" value={values.phone} onChange={update("phone")} error={Boolean(errors.phone)} helperText={errors.phone ?? "Format : 0341234567 ou +261341234567"} required />
            <TextField label="Mot de passe temporaire" type="password" value={values.password} onChange={update("password")} error={Boolean(errors.password)} helperText={errors.password ?? "8 caractères, une majuscule, une minuscule et un chiffre"} required />
            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting ? "Création…" : "Créer le compte"}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};
