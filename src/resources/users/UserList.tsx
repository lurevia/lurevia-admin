import { List, Datagrid, TextField, EmailField, DateField, NumberField, FunctionField, SearchInput, EditButton } from "react-admin";
import Chip from "@mui/material/Chip";

const filters = [
  <SearchInput key="search" source="search" alwaysOn placeholder="Nom, email, téléphone…" />,
];

export const UserList = () => (
  <List filters={filters} sort={{ field: "createdAt", order: "DESC" }} perPage={25}>
    <Datagrid rowClick="edit">
      <TextField source="fullName" label="Nom" />
      <EmailField source="email" label="Email" />
      <TextField source="phone" label="Téléphone" />
      <FunctionField
        label="Rôle"
        render={(record: { role: string }) => (
          <Chip
            label={record.role === "ADMIN" ? "Admin" : "Client"}
            color={record.role === "ADMIN" ? "primary" : "default"}
            size="small"
          />
        )}
      />
      <NumberField source="ordersCount" label="Commandes" />
      <DateField source="createdAt" label="Inscrit le" />
      <EditButton />
    </Datagrid>
  </List>
);
