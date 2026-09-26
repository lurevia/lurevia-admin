import { Edit } from "react-admin";
import { ProductForm } from "./ProductForm";

export const ProductEdit = () => (
  <Edit title="Modifier le produit" mutationMode="pessimistic" redirect="list">
    <ProductForm />
  </Edit>
);