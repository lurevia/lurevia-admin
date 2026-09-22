import {
  SimpleForm,
  TextInput,
  NumberInput,
  BooleanInput,
  ArrayInput,
  SimpleFormIterator,
  ReferenceArrayInput,
  SelectArrayInput,
  required,
} from "react-admin";

export const ProductForm = () => (
  <SimpleForm>
    <TextInput source="title" label="Titre" validate={required()} fullWidth />
    <TextInput source="sku" label="SKU" validate={required()} />
    <TextInput source="description" label="Description courte" fullWidth />
    <TextInput source="longDescription" label="Description longue" multiline rows={4} fullWidth />

    <NumberInput source="price" label="Prix (Ar)" validate={required()} />
    <NumberInput source="originalPrice" label="Prix barré (Ar)" />
    <NumberInput source="stock" label="Stock" defaultValue={0} validate={required()} />
    <BooleanInput source="isNew" label="Marquer comme nouveau" />

    <ReferenceArrayInput source="categoryIds" reference="categories" label="Catégories">
      <SelectArrayInput optionText="name" validate={required()} />
    </ReferenceArrayInput>

    <ArrayInput source="images" label="Images (URLs)" defaultValue={[]}>
      <SimpleFormIterator inline>
        <TextInput source="" label="URL" />
      </SimpleFormIterator>
    </ArrayInput>

    <ArrayInput source="tags" label="Tags" defaultValue={[]}>
      <SimpleFormIterator inline>
        <TextInput source="" label="Tag" />
      </SimpleFormIterator>
    </ArrayInput>

    <ArrayInput source="sizes" label="Tailles / dimensions" defaultValue={[]}>
      <SimpleFormIterator inline>
        <TextInput source="" label="Valeur" />
      </SimpleFormIterator>
    </ArrayInput>

    <ArrayInput source="colors" label="Couleurs" defaultValue={[]}>
      <SimpleFormIterator inline>
        <TextInput source="label" label="Nom" />
        <TextInput source="hex" label="Code hex" placeholder="#2F7BF6" />
      </SimpleFormIterator>
    </ArrayInput>
  </SimpleForm>
);
