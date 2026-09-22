import {
  List,
  Datagrid,
  TextField,
  NumberField,
  DateField,
  FunctionField,
  SelectInput,
  SearchInput,
  EditButton,
} from "react-admin";
import Chip from "@mui/material/Chip";

const STATUS_COLOR: Record<string, "default" | "warning" | "success" | "info" | "error"> = {
  pending: "warning",
  paid: "info",
  shipped: "info",
  delivered: "success",
  cancelled: "error",
};

const STATUS_LABEL: Record<string, string> = {
  pending: "En attente",
  paid: "Payée",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

const filters = [
  <SearchInput key="search" source="search" alwaysOn placeholder="Client, email, n° commande…" />,
  <SelectInput
    key="status"
    source="status"
    label="Statut"
    choices={Object.entries(STATUS_LABEL).map(([id, name]) => ({ id, name }))}
  />,
];

export const OrderList = () => (
  <List filters={filters} sort={{ field: "createdAt", order: "DESC" }} perPage={25}>
    <Datagrid rowClick="edit">
      <TextField source="id" label="N°" />
      <TextField source="shipping.fullName" label="Client" sortable={false} />
      <DateField source="createdAt" label="Date" showTime />
      <NumberField source="total" label="Total (Ar)" locales="fr-FR" />
      <FunctionField
        label="Statut"
        render={(record: { status: string }) => (
          <Chip label={STATUS_LABEL[record.status] ?? record.status} color={STATUS_COLOR[record.status]} size="small" />
        )}
      />
      <TextField source="paymentMethod" label="Paiement" sortable={false} />
      <EditButton label="Gérer" />
    </Datagrid>
  </List>
);
