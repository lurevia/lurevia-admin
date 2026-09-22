import { List, Datagrid, TextField, DateField, FunctionField, SelectInput } from "react-admin";
import Chip from "@mui/material/Chip";
import { ProfileChangeActions } from "./ProfileChangeActions";

const labels: Record<string, string> = { PENDING: "En attente", APPROVED: "Approuvée", REJECTED: "Rejetée" };
const colors: Record<string, "warning" | "success" | "error"> = { PENDING: "warning", APPROVED: "success", REJECTED: "error" };
const filters = [
  <SelectInput key="status" source="status" label="Statut" alwaysOn choices={Object.entries(labels).map(([id, name]) => ({ id, name }))} />,
];

export const ProfileChangeList = () => (
  <List filters={filters} filterDefaultValues={{ status: "PENDING" }} sort={{ field: "createdAt", order: "DESC" }} title="Modifications de profil">
    <Datagrid bulkActionButtons={false}>
      <TextField source="user.fullName" label="Client" />
      <TextField source="user.email" label="Email" />
      <TextField source="requestedFullName" label="Nouveau nom" />
      <TextField source="requestedEmail" label="Nouvel email" />
      <TextField source="requestedPhone" label="Nouveau téléphone" />
      <DateField source="createdAt" label="Demandée le" />
      <FunctionField label="Statut" render={(record: { status: string }) => <Chip label={labels[record.status] ?? record.status} color={colors[record.status] ?? "default"} size="small" />} />
      <ProfileChangeActions />
    </Datagrid>
  </List>
);
