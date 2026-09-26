import { useEffect, useState } from "react";
import { Title } from "react-admin";
import {
  Alert,
  Avatar,
  Box,
  Card,
  Chip,
  Divider,
  IconButton,
  List,
  ListItem,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";

// ─── Icônes ───
import PaidIconModule from "@mui/icons-material/Paid";
import ReceiptIconModule from "@mui/icons-material/ReceiptLong";
import PeopleIconModule from "@mui/icons-material/People";
import InventoryIconModule from "@mui/icons-material/Inventory2";
import WarningAmberIconModule from "@mui/icons-material/WarningAmber";
import PersonRemoveIconModule from "@mui/icons-material/PersonRemove";
import StorefrontIconModule from "@mui/icons-material/Storefront";
import TrendingUpIconModule from "@mui/icons-material/TrendingUp";
import ScheduleIconModule from "@mui/icons-material/Schedule";
import ShowChartIconModule from "@mui/icons-material/ShowChart";
import PieChartIconModule from "@mui/icons-material/PieChart";
import BarChartIconModule from "@mui/icons-material/BarChart";
import StarIconModule from "@mui/icons-material/Star";
import RefreshIconModule from "@mui/icons-material/Refresh";
import { normalizeMuiIcon } from "../muiIcon";
import { StatCard } from "./StatCard";
import {
  fetchAdminNotifications,
  fetchStats,
  type AdminNotificationRecord,
} from "../adminActions";

// ─── Icônes normalisées ───
const PaidIcon = normalizeMuiIcon(PaidIconModule);
const ReceiptIcon = normalizeMuiIcon(ReceiptIconModule);
const PeopleIcon = normalizeMuiIcon(PeopleIconModule);
const InventoryIcon = normalizeMuiIcon(InventoryIconModule);
const WarningIcon = normalizeMuiIcon(WarningAmberIconModule);
const PersonRemoveIcon = normalizeMuiIcon(PersonRemoveIconModule);
const StorefrontIcon = normalizeMuiIcon(StorefrontIconModule);
const TrendingUpIcon = normalizeMuiIcon(TrendingUpIconModule);
const ScheduleIcon = normalizeMuiIcon(ScheduleIconModule);
const LineChartIcon = normalizeMuiIcon(ShowChartIconModule);
const PieIcon = normalizeMuiIcon(PieChartIconModule);
const BarIcon = normalizeMuiIcon(BarChartIconModule);
const StarIcon = normalizeMuiIcon(StarIconModule);
const RefreshIcon = normalizeMuiIcon(RefreshIconModule);

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────────────────────────────────────

const CHART_COLORS = [
  "#2F7BF6",
  "#0A8F63",
  "#E8A33D",
  "#E8703A",
  "#7B4FE0",
  "#0EA5E9",
  "#C41E3A",
  "#0A1B3D",
];

const TYPE_LABEL: Record<AdminNotificationRecord["type"], string> = {
  NEW_ORDER: "Commande",
  NEW_REVIEW: "Avis",
  NEW_FEEDBACK: "Retour client",
  DELETION_REQUEST: "Suppression",
  LOW_STOCK: "Stock",
};

const TYPE_COLOR: Record<AdminNotificationRecord["type"], string> = {
  NEW_ORDER: "primary",
  NEW_REVIEW: "warning",
  NEW_FEEDBACK: "info",
  DELETION_REQUEST: "error",
  LOW_STOCK: "error",
};

const formatAriary = (amount: number) => {
  const n = Number(amount ?? 0);
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} M Ar`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)} k Ar`;
  return `${n.toLocaleString("fr-FR")} Ar`;
};

const formatShortAriary = (amount: number) => {
  const n = Number(amount ?? 0);
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return String(n);
};

// ─────────────────────────────────────────────────────────────────────────────
// SOUS-COMPOSANTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Wrapper de carte pour un graphique (sans titre — le titre est dans l'onglet).
 */
const ChartWrapper = ({ children }: { children: React.ReactNode }) => (
  <Box sx={{ width: "100%", height: "100%", px: 1 }}>
    <ResponsiveContainer width="100%" height="100%">
      {children as any}
    </ResponsiveContainer>
  </Box>
);

/**
 * Tooltip personnalisé pour Recharts.
 */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1.5,
        p: 1.25,
        boxShadow: "0 8px 24px -12px rgba(10,27,61,0.3)",
        minWidth: 140,
      }}
    >
      <Typography sx={{ fontSize: 11, fontWeight: 700, mb: 0.75 }}>
        {label}
      </Typography>
      {payload.map((entry: any, index: number) => (
        <Stack
          key={index}
          direction="row"
          spacing={0.75}
          alignItems="center"
          sx={{ mb: 0.25 }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: entry.color,
              flexShrink: 0,
            }}
          />
          <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
            {entry.name} :
          </Typography>
          <Typography sx={{ fontSize: 11, fontWeight: 700 }}>
            {typeof entry.value === "number" && entry.value > 1000
              ? formatAriary(entry.value)
              : entry.value}
          </Typography>
        </Stack>
      ))}
    </Box>
  );
};

/**
 * Message affiché si aucune donnée n'est disponible.
 */
const EmptyChart = ({ label = "Aucune donnée" }: { label?: string }) => (
  <Box
    sx={{
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "text.secondary",
      fontSize: 12,
    }}
  >
    {label}
  </Box>
);

// ─────────────────────────────────────────────────────────────────────────────
// ONGLETS
// ─────────────────────────────────────────────────────────────────────────────

interface TabPanelProps {
  children: React.ReactNode;
  value: number;
  index: number;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => (
  <Box
    role="tabpanel"
    hidden={value !== index}
    id={`dashboard-tabpanel-${index}`}
    aria-labelledby={`dashboard-tab-${index}`}
    sx={{ width: "100%", height: "100%" }}
  >
    {value === index && children}
  </Box>
);

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────

export const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [activity, setActivity] = useState<AdminNotificationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      fetchStats().catch(() => null),
      fetchAdminNotifications(false, 12).catch(() => []),
    ])
      .then(([statsRes, activityRes]) => {
        if (!statsRes) setError(true);
        setStats(statsRes);
        setActivity(activityRes as AdminNotificationRecord[]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // ─── Extraction des données ───
  const revenueLast30d = stats?.revenue30d ?? 0;
  const orders30dCount = stats?.orders30dCount ?? 0;
  const totalUsers = stats?.totalUsers ?? 0;
  const newUsers7d = stats?.newUsers7d ?? 0;
  const totalProducts = stats?.totalProducts ?? 0;
  const lowStockProducts = stats?.lowStockProducts ?? 0;
  const pendingOrders = stats?.pendingOrders ?? 0;
  const pendingDeletions = stats?.pendingDeletionRequests ?? 0;
  const totalReviews = stats?.totalReviews ?? 0;
  const unreadAdmin = stats?.unreadAdminNotifications ?? 0;

  const revenueSeries = stats?.revenueSeries ?? [];
  const ordersByStatus = stats?.ordersByStatus ?? [];
  const topProducts = stats?.topProducts ?? [];
  const salesByCategory = stats?.salesByCategory ?? [];
  const paymentMethods = stats?.paymentMethods ?? [];
  const userGrowth = stats?.userGrowth ?? [];

  if (loading) {
    return (
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Title title="Tableau de bord" />
        <Skeleton variant="text" width={200} height={40} />
        <Skeleton variant="text" width={300} height={48} sx={{ mb: 3 }} />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 2,
            mb: 3,
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={110} />
          ))}
        </Box>
        <Skeleton variant="rounded" height={400} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        maxWidth: 1440,
        mx: "auto",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Title title="Tableau de bord" />

      {/* ═══════ HEADER ═══════ */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        sx={{ mb: 2.5 }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: 10.5,
              fontWeight: 700,
              color: "primary.main",
              letterSpacing: 2,
              textTransform: "uppercase",
              mb: 0.5,
            }}
          >
            Vue d'ensemble · Lurevia
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.25 }}>
            Bonjour, équipe Lurevia 👋
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Suivez les performances de la boutique en temps réel.
          </Typography>
        </Box>
        <Tooltip title="Rafraîchir les données" arrow>
          <IconButton
            onClick={loadData}
            sx={{
              color: "text.secondary",
              "&:hover": { color: "primary.main", backgroundColor: "action.hover" },
            }}
          >
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>

      {error && (
        <Alert severity="warning" sx={{ mb: 2, borderRadius: 2, py: 0.5 }}>
          Certaines données ne sont pas disponibles. Vérifiez l'endpoint{" "}
          <code>/admin/stats</code>.
        </Alert>
      )}

      {/* ═══════ KPIs (2 lignes × 4) ═══════ */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <StatCard
          icon={PaidIcon}
          label="Revenu (30 j)"
          value={formatAriary(revenueLast30d)}
          hint={`${orders30dCount} commande(s)`}
          color="success"
          trend={stats?.revenueTrend ? { value: stats.revenueTrend } : undefined}
        />
        <StatCard
          icon={ReceiptIcon}
          label="Commandes en attente"
          value={pendingOrders}
          hint="À traiter"
          color="warning"
        />
        <StatCard
          icon={PeopleIcon}
          label="Clients"
          value={totalUsers}
          hint={`+${newUsers7d} cette semaine`}
          color="primary"
        />
        <StatCard
          icon={InventoryIcon}
          label="Produits"
          value={totalProducts}
          hint={`${lowStockProducts} en stock faible`}
          color="info"
        />
        <StatCard
          icon={WarningIcon}
          label="Stock faible"
          value={lowStockProducts}
          color="error"
          hint="≤ 5 unités"
        />
        <StatCard
          icon={StarIcon}
          label="Avis produits"
          value={totalReviews}
          color="warning"
          hint="Tous statuts"
        />
        <StatCard
          icon={PersonRemoveIcon}
          label="Suppressions"
          value={pendingDeletions}
          color="error"
          hint="En attente"
        />
        <StatCard
          icon={StorefrontIcon}
          label="Notifications"
          value={unreadAdmin}
          color="primary"
          hint="Non lues"
        />
      </Box>

      {/* ═══════ GRAPHIQUES AVEC ONGLETS ═══════ */}
      <Card
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2.5,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 460,
        }}
      >
        {/* ─── Barre d'onglets ─── */}
        <Box
          sx={{
            borderBottom: "1px solid",
            borderColor: "divider",
            backgroundColor: "background.paper",
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              minHeight: 56,
              px: 1,
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 700,
                fontSize: 13,
                minHeight: 56,
                px: 2.5,
                color: "text.secondary",
                "&.Mui-selected": { color: "primary.main" },
              },
              "& .MuiTabs-indicator": {
                height: 3,
                borderRadius: "3px 3px 0 0",
              },
            }}
          >
            <Tab
              icon={<LineChartIcon sx={{ fontSize: 18 }} />}
              iconPosition="start"
              label="Revenu (30 j)"
            />
            <Tab
              icon={<PieIcon sx={{ fontSize: 18 }} />}
              iconPosition="start"
              label="Commandes"
            />
            <Tab
              icon={<PieIcon sx={{ fontSize: 18 }} />}
              iconPosition="start"
              label="Catégories"
            />
            <Tab
              icon={<BarIcon sx={{ fontSize: 18 }} />}
              iconPosition="start"
              label="Top produits"
            />
            <Tab
              icon={<PieIcon sx={{ fontSize: 18 }} />}
              iconPosition="start"
              label="Paiements"
            />
            <Tab
              icon={<LineChartIcon sx={{ fontSize: 18 }} />}
              iconPosition="start"
              label="Utilisateurs"
            />
            <Tab
              icon={<ScheduleIcon sx={{ fontSize: 18 }} />}
              iconPosition="start"
              label="Activité"
            />
          </Tabs>
        </Box>

        {/* ─── Contenu ─── */}
        <Box
          sx={{
            flex: 1,
            p: 3,
            minHeight: 380,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* ─── Onglet 1 : Revenu ─── */}
          <TabPanel value={tabValue} index={0}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: 15, mb: 0.25 }}>
                  Revenu des 30 derniers jours
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total : {formatAriary(revenueLast30d)}
                </Typography>
              </Box>
              <Chip
                icon={<TrendingUpIcon sx={{ fontSize: 14 }} />}
                label="Tendance"
                size="small"
                sx={{
                  height: 22,
                  fontSize: 10.5,
                  fontWeight: 700,
                  backgroundColor: (theme) =>
                    alpha(theme.palette.success.main, 0.1),
                  color: "success.main",
                  "& .MuiChip-icon": { color: "inherit" },
                }}
              />
            </Stack>
            <Box sx={{ flex: 1, minHeight: 300 }}>
              {revenueSeries.length > 0 ? (
                <ChartWrapper>
                  <AreaChart
                    data={revenueSeries}
                    margin={{ top: 10, right: 24, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={CHART_COLORS[0]} stopOpacity={0.35} />
                        <stop offset="100%" stopColor={CHART_COLORS[0]} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E4EAF4" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: "#64748B" }}
                      stroke="#CBD5E1"
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#64748B" }}
                      stroke="#CBD5E1"
                      tickLine={false}
                      tickFormatter={formatShortAriary}
                    />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      name="Revenu"
                      stroke={CHART_COLORS[0]}
                      strokeWidth={2.5}
                      fill="url(#revenueGradient)"
                      dot={false}
                      activeDot={{ r: 5 }}
                    />
                  </AreaChart>
                </ChartWrapper>
              ) : (
                <EmptyChart label="Aucune donnée de revenu" />
              )}
            </Box>
          </TabPanel>

          {/* ─── Onglet 2 : Commandes par statut ─── */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ fontWeight: 800, fontSize: 15, mb: 0.25 }}>
                Commandes par statut
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Répartition actuelle
              </Typography>
            </Box>
            <Box sx={{ flex: 1, minHeight: 300 }}>
              {ordersByStatus.length > 0 ? (
                <ChartWrapper>
                  <PieChart>
                    <Pie
                      data={ordersByStatus}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={120}
                      paddingAngle={2}
                      stroke="none"
                    >
                      {ordersByStatus.map((entry: any, index: number) => (
                        <Cell
                          key={index}
                          fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: 11, fontWeight: 600 }}
                    />
                  </PieChart>
                </ChartWrapper>
              ) : (
                <EmptyChart />
              )}
            </Box>
          </TabPanel>

          {/* ─── Onglet 3 : Ventes par catégorie ─── */}
          <TabPanel value={tabValue} index={2}>
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ fontWeight: 800, fontSize: 15, mb: 0.25 }}>
                Ventes par catégorie
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Chiffre d'affaires par catégorie
              </Typography>
            </Box>
            <Box sx={{ flex: 1, minHeight: 300 }}>
              {salesByCategory.length > 0 ? (
                <ChartWrapper>
                  <PieChart>
                    <Pie
                      data={salesByCategory}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      stroke="none"
                    >
                      {salesByCategory.map((_: any, index: number) => (
                        <Cell
                          key={index}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: 11, fontWeight: 600 }}
                    />
                  </PieChart>
                </ChartWrapper>
              ) : (
                <EmptyChart />
              )}
            </Box>
          </TabPanel>

          {/* ─── Onglet 4 : Top produits ─── */}
          <TabPanel value={tabValue} index={3}>
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ fontWeight: 800, fontSize: 15, mb: 0.25 }}>
                Top 5 produits vendus
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Meilleures ventes (toutes périodes)
              </Typography>
            </Box>
            <Box sx={{ flex: 1, minHeight: 300 }}>
              {topProducts.length > 0 ? (
                <ChartWrapper>
                  <BarChart
                    data={topProducts}
                    layout="vertical"
                    margin={{ top: 10, right: 24, left: 24, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E4EAF4" horizontal={false} />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 11, fill: "#64748B" }}
                      stroke="#CBD5E1"
                      tickLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 11, fill: "#64748B" }}
                      stroke="#CBD5E1"
                      tickLine={false}
                      width={160}
                    />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="sales"
                      name="Ventes"
                      fill={CHART_COLORS[0]}
                      radius={[0, 6, 6, 0]}
                      barSize={26}
                    />
                  </BarChart>
                </ChartWrapper>
              ) : (
                <EmptyChart label="Aucune vente enregistrée" />
              )}
            </Box>
          </TabPanel>

          {/* ─── Onglet 5 : Méthodes de paiement ─── */}
          <TabPanel value={tabValue} index={4}>
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ fontWeight: 800, fontSize: 15, mb: 0.25 }}>
                Méthodes de paiement
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Répartition des paiements
              </Typography>
            </Box>
            <Box sx={{ flex: 1, minHeight: 300 }}>
              {paymentMethods.length > 0 ? (
                <ChartWrapper>
                  <PieChart>
                    <Pie
                      data={paymentMethods}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={115}
                      paddingAngle={2}
                      stroke="none"
                    >
                      {paymentMethods.map((entry: any, index: number) => (
                        <Cell
                          key={index}
                          fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: 11, fontWeight: 600 }}
                    />
                  </PieChart>
                </ChartWrapper>
              ) : (
                <EmptyChart />
              )}
            </Box>
          </TabPanel>

          {/* ─── Onglet 6 : Croissance utilisateurs ─── */}
          <TabPanel value={tabValue} index={5}>
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ fontWeight: 800, fontSize: 15, mb: 0.25 }}>
                Nouveaux utilisateurs
              </Typography>
              <Typography variant="caption" color="text.secondary">
                7 derniers jours
              </Typography>
            </Box>
            <Box sx={{ flex: 1, minHeight: 300 }}>
              {userGrowth.length > 0 ? (
                <ChartWrapper>
                  <LineChart
                    data={userGrowth}
                    margin={{ top: 10, right: 24, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E4EAF4" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: "#64748B" }}
                      stroke="#CBD5E1"
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#64748B" }}
                      stroke="#CBD5E1"
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="users"
                      name="Inscriptions"
                      stroke={CHART_COLORS[1]}
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: CHART_COLORS[1] }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ChartWrapper>
              ) : (
                <EmptyChart label="Aucune inscription récente" />
              )}
            </Box>
          </TabPanel>

          {/* ─── Onglet 7 : Activité récente ─── */}
          <TabPanel value={tabValue} index={6}>
            <Box sx={{ mb: 2 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: 15, mb: 0.25 }}>
                    Activité récente
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Dernières actions clientes
                  </Typography>
                </Box>
                <Chip
                  icon={<ScheduleIcon sx={{ fontSize: 12 }} />}
                  label={`${activity.length}`}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: 10,
                    fontWeight: 700,
                    "& .MuiChip-icon": { color: "inherit" },
                  }}
                />
              </Stack>
            </Box>

            <Box sx={{ flex: 1, overflowY: "auto" }}>
              {activity.length === 0 ? (
                <Box
                  sx={{
                    p: 4,
                    textAlign: "center",
                    color: "text.secondary",
                    fontSize: 12,
                  }}
                >
                  Aucune activité pour le moment
                </Box>
              ) : (
                <List dense disablePadding>
                  {activity.map((n, index) => (
                    <Box key={n.id}>
                      <ListItem
                        sx={{
                          py: 1.25,
                          px: 0,
                          alignItems: "flex-start",
                          gap: 1.5,
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 36,
                            height: 36,
                            fontSize: 14,
                            fontWeight: 700,
                            bgcolor: (theme) =>
                              alpha(
                                theme.palette[
                                  TYPE_COLOR[n.type] as
                                    | "primary"
                                    | "warning"
                                    | "info"
                                    | "error"
                                ].main,
                                0.12
                              ),
                            color: `${TYPE_COLOR[n.type]}.main`,
                            mt: 0.25,
                          }}
                        >
                          {n.title.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            spacing={1}
                            sx={{ mb: 0.25 }}
                          >
                            <Typography
                              sx={{
                                fontSize: 13,
                                fontWeight: n.read ? 500 : 700,
                              }}
                              noWrap
                              title={n.title}
                            >
                              {n.title}
                            </Typography>
                            <Chip
                              label={TYPE_LABEL[n.type]}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: 9.5,
                                fontWeight: 700,
                                flexShrink: 0,
                                "& .MuiChip-label": { px: 0.75 },
                              }}
                            />
                          </Stack>
                          <Typography
                            sx={{
                              fontSize: 11.5,
                              color: "text.secondary",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {n.message}
                          </Typography>
                          <Typography
                            sx={{ fontSize: 10, color: "text.secondary", mt: 0.25 }}
                          >
                            {new Date(n.createdAt).toLocaleString("fr-FR", {
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Typography>
                        </Box>
                      </ListItem>
                      {index < activity.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              )}
            </Box>
          </TabPanel>
        </Box>
      </Card>
    </Box>
  );
};