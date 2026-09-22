import { Edit, SimpleForm, TextField, EmailField, DateField, NumberField, SelectInput } from "react-admin";

export const UserEdit = () => (
  <Edit title="Utilisateur" mutationMode="pessimistic">
    <SimpleForm>
      <TextField source="fullName" label="Nom complet" />
      <EmailField source="email" label="Email" />
      <TextField source="phone" label="Téléphone" />
      <NumberField source="ordersCount" label="Nombre de commandes" />
      <DateField source="createdAt" label="Inscrit le" />
      <DateField source="lastLoginAt" label="Dernière connexion" showTime />

      <SelectInput
        source="role"
        label="Rôle"
        choices={[
          { id: "CUSTOMER", name: "Client" },
          { id: "ADMIN", name: "Administrateur" },
        ]}
        helperText="Seul le rôle peut être modifié depuis cet écran."
      />
    </SimpleForm>
  </Edit>
);
