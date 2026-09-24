import {
  Datagrid,
  DateField,
  FunctionField,
  List,
  NumberField,
  SearchInput,
  TextField,
} from "react-admin";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import type { ReactNode } from "react";

type Column = { source: string; label: string; numeric?: boolean; date?: boolean };

const columns: Record<string, Column[]> = {
  sellers: [
    { source: "name", label: "Vendeur" },
    { source: "email", label: "Email" },
    { source: "status", label: "Statut" },
    { source: "commissionRate", label: "Commission (%)", numeric: true },
    { source: "createdAt", label: "Créé le", date: true },
  ],
  contracts: [
    { source: "sellerName", label: "Vendeur" },
    { source: "status", label: "Statut" },
    { source: "commissionRate", label: "Commission (%)", numeric: true },
    { source: "startsAt", label: "Début", date: true },
    { source: "endsAt", label: "Fin", date: true },
  ],
  settlements: [
    { source: "sellerName", label: "Vendeur" },
    { source: "period", label: "Période" },
    { source: "grossAmount", label: "Brut", numeric: true },
    { source: "commissionAmount", label: "Commission", numeric: true },
    { source: "netAmount", label: "Net", numeric: true },
    { source: "status", label: "Statut" },
  ],
  commissions: [
    { source: "sellerName", label: "Vendeur" },
    { source: "orderId", label: "Commande" },
    { source: "rate", label: "Taux (%)", numeric: true },
    { source: "amount", label: "Montant", numeric: true },
    { source: "createdAt", label: "Date", date: true },
  ],
  transfers: [
    { source: "sellerName", label: "Vendeur" },
    { source: "amount", label: "Montant", numeric: true },
    { source: "status", label: "Statut" },
    { source: "reference", label: "Référence" },
    { source: "createdAt", label: "Date", date: true },
  ],
};

const labels: Record<string, string> = {
  sellers: "Vendeurs",
  contracts: "Contrats",
  settlements: "Settlements",
  commissions: "Commissions",
  transfers: "Transferts",
};

export const FinancialList = ({ resource }: { resource: keyof typeof columns }) => (
  <List
    title={labels[resource]}
    filters={[<SearchInput key="search" source="search" alwaysOn placeholder="Rechercher…" />]}
    sort={{ field: "createdAt", order: "DESC" }}
    perPage={25}
    empty={
      <Alert severity="info">
        Aucun élément à afficher. Les lignes apparaîtront lorsque le socle financier sera alimenté.
      </Alert>
    }
  >
    <Datagrid bulkActionButtons={false}>
      <TextField source="id" label="ID" />
      {columns[resource].map((column) =>
        column.date ? (
          <DateField key={column.source} source={column.source} label={column.label} />
        ) : column.numeric ? (
          <NumberField key={column.source} source={column.source} label={column.label} locales="fr-FR" />
        ) : (
          <TextField key={column.source} source={column.source} label={column.label} />
        )
      )}
      <FunctionField
        label="État"
        render={(record: { status?: string }) =>
          record.status ? <Chip size="small" label={record.status} variant="outlined" /> : null
        }
      />
    </Datagrid>
  </List>
);

export const UnsupportedFinanceNotice = ({ children }: { children?: ReactNode }) => (
  <Alert severity="warning" sx={{ mb: 2 }}>
    {children ?? "Les données financières ne sont pas encore disponibles côté API."}
  </Alert>
);
