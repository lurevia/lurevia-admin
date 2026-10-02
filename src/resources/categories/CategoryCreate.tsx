import { Alert } from "@mui/material";
import { Create, useGetIdentity } from "react-admin";
import { CategoryForm } from "./CategoryForm";

export const CategoryCreate = () => {
  const { data: identity } = useGetIdentity();
  if (identity?.isPrimaryAdmin !== true) {
    return <Alert severity="error">Seul l’administrateur principal peut créer une catégorie.</Alert>;
  }

  return (
    <Create title="Nouvelle catégorie">
      <CategoryForm />
    </Create>
  );
};
