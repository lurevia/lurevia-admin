type DateOptions = {
  month?: "short" | "long";
  emptyValue?: string;
};

export const formatAriary = (value: number | string | null | undefined) => {
  const amount = Number(value ?? 0);
  if (!Number.isFinite(amount)) return "—";
  return `${new Intl.NumberFormat("fr-MG").format(amount)} Ar`;
};

export const formatOptionalAriary = (
  value: number | string | null | undefined
) => {
  const amount = Number(value ?? 0);
  return amount > 0 ? formatAriary(amount) : "—";
};

export const formatFrenchDate = (
  value: string | null | undefined,
  { month = "short", emptyValue = "—" }: DateOptions = {}
) => {
  if (!value) return emptyValue;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month,
    year: "numeric",
  }).format(new Date(value));
};

export const formatFrenchLongDate = (
  value: string | null | undefined,
  emptyValue = "—"
) => formatFrenchDate(value, { month: "long", emptyValue });

export const formatFrenchDateTime = (
  value: string | null | undefined,
  { month = "short", emptyValue = "—" }: DateOptions = {}
) => {
  if (!value) return emptyValue;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month,
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

export const formatFrenchLongDateTime = (
  value: string | null | undefined,
  emptyValue = "—"
) => formatFrenchDateTime(value, { month: "long", emptyValue });