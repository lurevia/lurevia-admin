import {
  List,
  Datagrid,
  TextField,
  NumberField,
  BooleanField,
  ImageField,
  EditButton,
  DeleteButton,
  SearchInput,
  TextInput,
} from "react-admin";

const filters = [
  <SearchInput key="search" source="search" alwaysOn placeholder="Rechercher un produit…" />,
  <TextInput key="sku" source="sku" label="SKU" />,
];

export const ProductList = () => (
  <List filters={filters} sort={{ field: "createdAt", order: "DESC" }} perPage={25}>
    <Datagrid rowClick="edit">
      <ImageField source="imageUrl" label="" sortable={false} />
      <TextField source="title" label="Titre" />
      <TextField source="sku" label="SKU" />
      <NumberField source="price" label="Prix (Ar)" locales="fr-FR" />
      <NumberField source="stock" label="Stock" />
      <BooleanField source="isNew" label="Nouveau" />
      <NumberField source="rating" label="Note" />
      <EditButton />
      <DeleteButton mutationMode="pessimistic" />
    </Datagrid>
  </List>
);
