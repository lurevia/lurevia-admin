import { useGetList, Title } from "react-admin";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PaidIcon from "@mui/icons-material/Paid";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { StatCard } from "../../dashboard/StatCard";

type Row = { id: string | number; amount?: number; netAmount?: number; commissionAmount?: number; status?: string };
const money = (value: number) => `${value.toLocaleString("fr-FR")} Ar`;

const sum = (rows: Row[], field: keyof Row) =>
  rows.reduce((total, row) => total + (Number(row[field]) || 0), 0);

const MiniBars = ({ values }: { values: number[] }) => {
  const max = Math.max(...values, 1);
  return (
    <Box sx={{ display: "flex", gap: 0.75, alignItems: "end", height: 110, mt: 2 }}>
      {values.map((value, index) => (
        <Box key={index} sx={{ flex: 1, bgcolor: "primary.main", height: `${Math.max((value / max) * 100, 5)}%`, borderRadius: "4px 4px 0 0" }} />
      ))}
    </Box>
  );
};

export const FinancialDashboard = () => {
  const sellers = useGetList<Row>("sellers", { pagination: { page: 1, perPage: 100 }, sort: { field: "createdAt", order: "DESC" }, filter: {} });
  const settlements = useGetList<Row>("settlements", { pagination: { page: 1, perPage: 100 }, sort: { field: "createdAt", order: "DESC" }, filter: {} });
  const commissions = useGetList<Row>("commissions", { pagination: { page: 1, perPage: 100 }, sort: { field: "createdAt", order: "DESC" }, filter: {} });
  const transfers = useGetList<Row>("transfers", { pagination: { page: 1, perPage: 100 }, sort: { field: "createdAt", order: "DESC" }, filter: {} });
  const rows = settlements.data ?? [];
  const chart = rows.slice(-8).map((row) => Number(row.netAmount ?? row.amount) || 0);
  const errors = [sellers.error, settlements.error, commissions.error, transfers.error].filter(Boolean);

  return (
    <Box sx={{ maxWidth: 1440, mx: "auto" }}>
      <Title title="Pilotage financier" />
      <Typography variant="overline" sx={{ color: "primary.light", letterSpacing: 2 }}>FINANCE · SOCLE</Typography>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 2.5 }}>Pilotage financier</Typography>
      {errors.length > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Certaines données financières ne sont pas disponibles. Vérifiez que les endpoints
          <code> /admin/sellers, /admin/settlements, /admin/commissions et /admin/transfers </code>
          sont activés côté API.
        </Alert>
      )}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}><StatCard icon={StorefrontIcon} label="Vendeurs" value={sellers.isLoading ? "…" : sellers.data?.length ?? 0} /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard icon={AccountBalanceIcon} label="Settlements nets" value={settlements.isLoading ? "…" : money(sum(rows, "netAmount"))} accent="#1749B0" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard icon={PaidIcon} label="Commissions" value={commissions.isLoading ? "…" : money(sum(commissions.data ?? [], "amount"))} accent="#0A8F63" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard icon={SwapHorizIcon} label="Transferts" value={transfers.isLoading ? "…" : transfers.data?.length ?? 0} accent="#E8703A" /></Grid>
        <Grid item xs={12} md={7}>
          <Card><CardContent><Typography variant="h6">Évolution des settlements</Typography><Typography variant="body2" color="text.secondary">Dernières lignes reçues de l’API</Typography><MiniBars values={chart.length ? chart : [0]} /></CardContent></Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Card><CardContent><Typography variant="h6">À surveiller</Typography>
            <Typography sx={{ mt: 2 }} color="text.secondary">Settlements en attente</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>{rows.filter((row) => row.status === "pending").length}</Typography>
            <Typography sx={{ mt: 2 }} color="text.secondary">Transferts en attente</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>{(transfers.data ?? []).filter((row) => row.status === "pending").length}</Typography>
          </CardContent></Card>
        </Grid>
      </Grid>
    </Box>
  );
};
