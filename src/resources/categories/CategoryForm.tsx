import { SimpleForm, TextInput, required } from "react-admin";
import { ImageDropInput } from "../../components/ImageDropInput";

export const CategoryForm = () => (
  <SimpleForm>
    <TextInput source="name" label="Nom" validate={required()} fullWidth />
    <TextInput source="description" label="Description" multiline rows={3} fullWidth validate={required()} />
    <ImageDropInput source="imageUrl" label="Image de la catégorie" multiple={false} />
    <ImageDropInput source="bannerUrl" label="Bannière" multiple={false} />
    <TextInput source="iconName" label="Icône (nom lucide-react)" defaultValue="ShoppingBag" />
  </SimpleForm>
);
