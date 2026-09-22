import { List, Datagrid, TextField, DateField, FunctionField, SelectInput } from "react-admin";
import Chip from "@mui/material/Chip";
import { VerificationActions } from "./VerificationActions";

const labels: Record<string, string> = { PENDING: "En attente", APPROVED: "Approuvée", REJECTED: "Rejetée", USED: "Utilisée", EXPIRED: "Expirée" };
const filters = [<SelectInput key="status" source="status" label="Statut" alwaysOn choices={Object.entries(labels).map(([id, name]) => ({ id, name }))} />];
export const VerificationList = () => (
  <List filters={filters} filterDefaultValues={{ status: "PENDING" }} sort={{ field: "createdAt", order: "DESC" }} title="Vérifications de compte">
    <Datagrid bulkActionButtons={false}>
      <TextField source="user.fullName" label="Client" /><TextField source="user.email" label="Email" />
      <TextField source="type" label="Type" /><DateField source="createdAt" label="Demandée le" />
      <FunctionField label="Statut" render={(r: { status: string }) => <Chip label={labels[r.status] ?? r.status} color={r.status === "PENDING" ? "warning" : r.status === "APPROVED" ? "success" : "default"} size="small" />} />
      <VerificationActions />
    </Datagrid>
  </List>
);
