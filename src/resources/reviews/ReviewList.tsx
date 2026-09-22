import {
  List,
  Datagrid,
  TextField,
  NumberField,
  BooleanField,
  DateField,
  DeleteButton,
} from "react-admin";

export const ReviewList = () => (
  <List sort={{ field: "createdAt", order: "DESC" }} perPage={25} title="Avis produits — modération">
    <Datagrid bulkActionButtons={false}>
      <TextField source="productTitle" label="Produit" />
      <TextField source="userName" label="Client" />
      <NumberField source="rating" label="Note" />
      <TextField source="title" label="Titre" />
      <TextField source="comment" label="Commentaire" />
      <BooleanField source="isVerifiedPurchase" label="Achat vérifié" />
      <DateField source="createdAt" label="Publié le" />
      <DeleteButton label="Retirer" mutationMode="pessimistic" />
    </Datagrid>
  </List>
);
