import { List, Datagrid, TextField, ImageField, EditButton, DeleteButton } from "react-admin";

export const CategoryList = () => (
  <List perPage={50}>
    <Datagrid rowClick="edit">
      <ImageField source="imageUrl" label="" sortable={false} />
      <TextField source="name" label="Nom" />
      <TextField source="slug" label="Slug" />
      <TextField source="description" label="Description" />
      <EditButton />
      <DeleteButton mutationMode="pessimistic" />
    </Datagrid>
  </List>
);
