import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useNotify } from "react-admin";
import { API_URL, httpClient } from "../../httpClient";

export type AdminCreateValues = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  avatarUrl: string;
};

const initialValues: AdminCreateValues = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  avatarUrl: "",
};

const validateAdminValues = (values: AdminCreateValues) => {
  const errors: Partial<AdminCreateValues> = {};
  if (values.fullName.trim().length < 2) {
    errors.fullName = "Nom complet requis (2 caractères minimum).";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Email invalide.";
  }
  if (!/^(\+261|0)[0-9]{9}$/.test(values.phone.trim())) {
    errors.phone = "Numéro malgache invalide.";
  }
  if (
    values.password.length < 8 ||
    !/[a-z]/.test(values.password) ||
    !/[A-Z]/.test(values.password) ||
    !/[0-9]/.test(values.password)
  ) {
    errors.password = "8 caractères minimum, avec minuscule, majuscule et chiffre.";
  }
  return errors;
};

export const useAdminCreateForm = () => {
  const notify = useNotify();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<AdminCreateValues>>({});
  const [avatarError, setAvatarError] = useState("");
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (field: keyof AdminCreateValues) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setValues((current) => ({ ...current, [field]: event.target.value }));
      setErrors((current) => ({ ...current, [field]: undefined }));
      setServerError("");
    };

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setAvatarError("Le fichier doit être une image (JPG, PNG, WebP).");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setAvatarError("L'image doit faire moins de 2 Mo.");
      return;
    }

    setAvatarError("");
    const reader = new FileReader();
    reader.onload = (resultEvent) => {
      const result = resultEvent.target?.result;
      if (typeof result === "string") {
        setValues((current) => ({ ...current, avatarUrl: result }));
      }
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAvatarRemove = () => {
    setValues((current) => ({ ...current, avatarUrl: "" }));
    setAvatarError("");
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateAdminValues(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setServerError("");
    try {
      const payload: Record<string, string> = {
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        password: values.password,
      };
      if (values.avatarUrl) payload.avatarUrl = values.avatarUrl;
      await httpClient(`${API_URL}/admin/admins`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setValues(initialValues);
      notify("Compte administrateur créé avec succès.", { type: "success" });
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "Impossible de créer le compte."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return {
    values,
    errors,
    avatarError,
    serverError,
    setServerError,
    submitting,
    fileInputRef,
    update,
    handleAvatarClick,
    handleAvatarChange,
    handleAvatarRemove,
    submit,
  };
};