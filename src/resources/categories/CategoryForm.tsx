import { SimpleForm, TextInput, required } from "react-admin";

export const CategoryForm = () => (
  <SimpleForm>
    <TextInput source="name" label="Nom" validate={required()} fullWidth />
    <TextInput source="description" label="Description" multiline rows={3} fullWidth validate={required()} />
    <TextInput source="imageUrl" label="Image (URL)" fullWidth validate={required()} />
    <TextInput source="bannerUrl" label="Bannière (URL)" fullWidth validate={required()} />
    <TextInput source="iconName" label="Icône (nom lucide-react)" defaultValue="ShoppingBag" />
  </SimpleForm>
);
