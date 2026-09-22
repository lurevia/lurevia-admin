import {
  Edit,
  SimpleForm,
  SelectInput,
  TextField,
  NumberField,
  DateField,
  ArrayField,
  Datagrid,
  useRecordContext,
} from "react-admin";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const STATUS_CHOICES = [
  { id: "pending", name: "En attente" },
  { id: "paid", name: "Payée" },
  { id: "shipped", name: "Expédiée" },
  { id: "delivered", name: "Livrée" },
  { id: "cancelled", name: "Annulée" },
];

const ShippingSummary = () => {
  const record = useRecordContext();
  if (!record) return null;
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2">Livraison</Typography>
      <Typography variant="body2">
        {record.shipping.fullName} — {record.shipping.phone} — {record.shipping.email}
      </Typography>
      <Typography variant="body2">
        {record.shipping.address}, {record.shipping.city} ({record.shipping.region})
      </Typography>
    </Box>
  );
};

export const OrderEdit = () => (
  <Edit title="Commande" mutationMode="pessimistic">
    <SimpleForm>
      <ShippingSummary />

      <Typography variant="subtitle2" sx={{ mt: 1 }}>
        Articles
      </Typography>
      <ArrayField source="items">
        <Datagrid bulkActionButtons={false}>
          <TextField source="title" label="Produit" />
          <NumberField source="price" label="Prix (Ar)" locales="fr-FR" />
          <NumberField source="quantity" label="Qté" />
        </Datagrid>
      </ArrayField>

      <Box sx={{ display: "flex", gap: 4, mt: 2, mb: 2 }}>
        <NumberField source="subtotal" label="Sous-total (Ar)" locales="fr-FR" />
        <NumberField source="shippingCost" label="Livraison (Ar)" locales="fr-FR" />
        <NumberField source="total" label="Total (Ar)" locales="fr-FR" />
      </Box>

      <DateField source="createdAt" label="Passée le" showTime />

      <SelectInput source="status" label="Statut de la commande" choices={STATUS_CHOICES} sx={{ mt: 2 }} />
    </SimpleForm>
  </Edit>
);
