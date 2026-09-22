import { useEffect, useState } from "react";
import { Title } from "react-admin";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Chip from "@mui/material/Chip";
import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory2";
import ReceiptIcon from "@mui/icons-material/ReceiptLong";
import PaidIcon from "@mui/icons-material/Paid";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { StatCard } from "./StatCard";
import { fetchAdminNotifications, fetchStats, type AdminNotificationRecord } from "../adminActions";

const TYPE_LABEL: Record<AdminNotificationRecord["type"], string> = {
  NEW_ORDER: "Commande",
  NEW_REVIEW: "Avis",
  NEW_FEEDBACK: "Retour client",
  DELETION_REQUEST: "Suppression",
  LOW_STOCK: "Stock",
};

const formatAriary = (amount: number) => `${amount.toLocaleString("fr-FR")} Ar`;

export const Dashboard = () => {
  const [stats, setStats] = useState<Awaited<ReturnType<typeof fetchStats>> | null>(null);
  const [activity, setActivity] = useState<AdminNotificationRecord[]>([]);

  useEffect(() => {
    fetchStats().then(setStats).catch(() => undefined);
    fetchAdminNotifications(false, 12).then(setActivity).catch(() => undefined);
  }, []);

  return (
    <div>
      <Title title="Tableau de bord" />
      <Grid container spacing={2} sx={{ mt: 0.5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={PaidIcon}
            label="Revenu (30 jours)"
            value={stats ? formatAriary(stats.revenue30d) : "…"}
            hint={stats ? `${stats.orders30dCount} commande(s)` : undefined}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={ReceiptIcon}
            label="Commandes en attente"
            value={stats?.pendingOrders ?? "…"}
            accent="#F0A400"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={PeopleIcon}
            label="Clients"
            value={stats?.totalUsers ?? "…"}
            hint={stats ? `+${stats.newUsers7d} cette semaine` : undefined}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={InventoryIcon}
            label="Produits"
            value={stats?.totalProducts ?? "…"}
            hint={stats ? `${stats.lowStockProducts} en stock faible` : undefined}
            accent="#0A1B3D"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={WarningAmberIcon}
            label="Stock faible (≤ 5)"
            value={stats?.lowStockProducts ?? "…"}
            accent="#E8703A"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={PersonRemoveIcon}
            label="Suppressions en attente"
            value={stats?.pendingDeletionRequests ?? "…"}
            accent="#E8703A"
          />
        </Grid>
      </Grid>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Activité récente
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Chaque action cliente qui modifie le serveur (commande, avis, retour, demande de
            suppression) apparaît ici dès qu'elle a lieu.
          </Typography>
          <List dense>
            {activity.length === 0 && (
              <ListItem>
                <ListItemText primary="Aucune activité pour le moment" />
              </ListItem>
            )}
            {activity.map((n) => (
              <ListItem
                key={n.id}
                secondaryAction={<Chip label={TYPE_LABEL[n.type]} size="small" variant="outlined" />}
              >
                <ListItemText
                  primary={n.title}
                  secondary={`${n.message} — ${new Date(n.createdAt).toLocaleString("fr-FR")}`}
                  primaryTypographyProps={{ fontWeight: n.read ? 400 : 700 }}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </div>
  );
};
