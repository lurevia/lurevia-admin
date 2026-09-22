import {
  List,
  Datagrid,
  TextField,
  DateField,
  FunctionField,
  SelectInput,
} from "react-admin";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import { DeletionRequestActions } from "./DeletionRequestActions";

const STATUS_LABEL: Record<string, string> = {
  pending: "En attente",
  approved: "Approuvée",
  rejected: "Rejetée",
};
const STATUS_COLOR: Record<string, "warning" | "success" | "error"> = {
  pending: "warning",
  approved: "success",
  rejected: "error",
};

const filters = [
  <SelectInput
    key="status"
    source="status"
    label="Statut"
    alwaysOn
    choices={Object.entries(STATUS_LABEL).map(([id, name]) => ({ id, name }))}
  />,
];

export const DeletionRequestList = () => (
  <List
    filters={filters}
    filterDefaultValues={{ status: "pending" }}
    sort={{ field: "createdAt", order: "DESC" }}
    perPage={25}
    title="Demandes de suppression de compte"
  >
    <Datagrid bulkActionButtons={false}>
      <TextField source="userName" label="Client" />
      <TextField source="userEmail" label="Email" />
      <TextField source="userPhone" label="Téléphone" />
      <TextField source="reason" label="Motif" />
      <DateField source="createdAt" label="Demandée le" />
      <FunctionField
        label="Statut"
        render={(record: { status: string }) => (
          <Chip label={STATUS_LABEL[record.status]} color={STATUS_COLOR[record.status]} size="small" />
        )}
      />
      <FunctionField
        label="Actions"
        render={() => (
          <Box sx={{ display: "flex", gap: 1 }}>
            <DeletionRequestActions variant="approve" />
            <DeletionRequestActions variant="reject" />
          </Box>
        )}
      />
    </Datagrid>
  </List>
);
