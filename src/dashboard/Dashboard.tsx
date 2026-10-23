import { useEffect, useState } from "react";
import { Title } from "react-admin";
import {
  Alert,
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Card,
  Chip,
  Divider,
  IconButton,
  List,
  ListItem,
  LinearProgress,
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
import { useNavigate } from "react-router-dom";

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
import ShoppingCartIconModule from "@mui/icons-material/ShoppingCart";
import ArrowForwardIconModule from "@mui/icons-material/ArrowForward";

import { normalizeMuiIcon } from "../muiIcon";
import { StatCard } from "./StatCard";
import lureviaLogo from "../logo";
import {
  fetchAdminNotifications,
  fetchStats,
  navigateToNotification,
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
const ShoppingCartIcon = normalizeMuiIcon(ShoppingCartIconModule);
const ArrowForwardIcon = normalizeMuiIcon(ArrowForwardIconModule);

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTES & FORMATTEURS
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
// COMPOSANT CONTENEUR DE GRAPHIQUE ROBUSTE (Hauteur explicite garantie)
// ─────────────────────────────────────────────────────────────────────────────

interface ChartWrapperProps {
  children: React.ReactNode;
  height?: number;
}

const ChartWrapper = ({ children, height = 310 }: ChartWrapperProps) => (
  <Box
    sx={{
      width: "100%",
      height,
      minHeight: height,
      position: "relative",
      minWidth: 0,
    }}
  >
    <ResponsiveContainer width="100%" height={height}>
      {children as any}
    </ResponsiveContainer>
  </Box>
);

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

const EmptyChart = ({ label = "Aucune donnée disponible" }: { label?: string }) => (
  <Box
    sx={{
      width: "100%",
      height: 240,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "text.secondary",
      fontSize: 12.5,
      border: "1px dashed",
      borderColor: "divider",
      borderRadius: 2,
      bgcolor: "action.hover",
    }}
  >
    {label}
  </Box>
);

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
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [activity, setActivity] = useState<AdminNotificationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "tabs">("grid");
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

  // Extraction des données avec valeurs par défaut
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
  const setupSteps = [Boolean(totalProducts), Boolean(totalUsers), Boolean(orders30dCount), Boolean(stats)];
  const setupProgress = Math.round((setupSteps.filter(Boolean).length / setupSteps.length) * 100);

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

  // ─── RENDU DU GRAPHIQUE 1 : REVENU ───
  const renderRevenueChart = (height = 320) => (
    <Box sx={{ width: "100%" }}>
      {revenueSeries.length === 0 ? (
        <EmptyChart label="Aucune donnée de revenu sur les 30 derniers jours" />
      ) : (
        <ChartWrapper height={height}>
          <AreaChart data={revenueSeries} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART_COLORS[0]} stopOpacity={0.35} />
                <stop offset="100%" stopColor={CHART_COLORS[0]} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E4EAF4" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748B" }} stroke="#CBD5E1" tickLine={false} />
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
      )}
    </Box>
  );

  // ─── RENDU DU GRAPHIQUE 2 : COMMANDES PAR STATUT ───
  const renderOrdersByStatusChart = (height = 300) => (
    <Box sx={{ width: "100%" }}>
      {ordersByStatus.length === 0 ? (
        <EmptyChart label="Aucune commande à afficher" />
      ) : (
        <ChartWrapper height={height}>
          <PieChart>
            <Pie
              data={ordersByStatus}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={105}
              paddingAngle={3}
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
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, fontWeight: 600 }} />
          </PieChart>
        </ChartWrapper>
      )}
    </Box>
  );

  // ─── RENDU DU GRAPHIQUE 3 : VENTES PAR CATÉGORIE ───
  const renderSalesByCategoryChart = (height = 300) => (
    <Box sx={{ width: "100%" }}>
      {salesByCategory.length === 0 ? (
        <EmptyChart label="Aucune vente par catégorie pour le moment" />
      ) : (
        <ChartWrapper height={height}>
          <PieChart>
            <Pie
              data={salesByCategory}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={105}
              paddingAngle={2}
              stroke="none"
            >
              {salesByCategory.map((_: any, index: number) => (
                <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
            <RechartsTooltip content={<CustomTooltip />} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, fontWeight: 600 }} />
          </PieChart>
        </ChartWrapper>
      )}
    </Box>
  );

  // ─── RENDU DU GRAPHIQUE 4 : TOP PRODUITS ───
  const renderTopProductsChart = (height = 300) => (
    <Box sx={{ width: "100%" }}>
      {topProducts.length === 0 ? (
        <EmptyChart label="Aucune vente de produit enregistrée" />
      ) : (
        <ChartWrapper height={height}>
          <BarChart
            data={topProducts}
            layout="vertical"
            margin={{ top: 10, right: 24, left: 16, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E4EAF4" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: "#64748B" }} stroke="#CBD5E1" tickLine={false} />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 11, fill: "#64748B" }}
              stroke="#CBD5E1"
              tickLine={false}
              width={160}
            />
            <RechartsTooltip content={<CustomTooltip />} />
            <Bar dataKey="sales" name="Ventes" fill={CHART_COLORS[0]} radius={[0, 6, 6, 0]} barSize={24} />
          </BarChart>
        </ChartWrapper>
      )}
    </Box>
  );

  // ─── RENDU DU GRAPHIQUE 5 : PAIEMENTS ───
  const renderPaymentMethodsChart = (height = 300) => (
    <Box sx={{ width: "100%" }}>
      {paymentMethods.length === 0 ? (
        <EmptyChart label="Aucune transaction par méthode de paiement" />
      ) : (
        <ChartWrapper height={height}>
          <PieChart>
            <Pie
              data={paymentMethods}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={105}
              paddingAngle={3}
              stroke="none"
            >
              {paymentMethods.map((entry: any, index: number) => (
                <Cell key={index} fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
            <RechartsTooltip content={<CustomTooltip />} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, fontWeight: 600 }} />
          </PieChart>
        </ChartWrapper>
      )}
    </Box>
  );

  // ─── RENDU DU GRAPHIQUE 6 : CROISSANCE UTILISATEURS ───
  const renderUserGrowthChart = (height = 300) => (
    <Box sx={{ width: "100%" }}>
      {userGrowth.length === 0 ? (
        <EmptyChart label="Aucune nouvelle inscription sur les 7 derniers jours" />
      ) : (
        <ChartWrapper height={height}>
          <LineChart data={userGrowth} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E4EAF4" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748B" }} stroke="#CBD5E1" tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#64748B" }} stroke="#CBD5E1" tickLine={false} allowDecimals={false} />
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
      )}
    </Box>
  );

  // ─── RENDU DU FLUX D'ACTIVITÉ ───
  const renderActivityList = () => (
    <Box sx={{ width: "100%" }}>
      {activity.length === 0 ? (
        <Box sx={{ p: 4, textAlign: "center", color: "text.secondary", fontSize: 12 }}>
          Aucune activité pour le moment
        </Box>
      ) : (
        <List dense disablePadding>
          {activity.slice(0, 5).map((n, index) => (
            <Box key={n.id}>
              <ListItem
                onClick={() => navigateToNotification(navigate, n)}
                sx={{
                  py: 1.25,
                  px: 1.5,
                  borderRadius: 2,
                  alignItems: "flex-start",
                  gap: 1.5,
                  cursor: "pointer",
                  backgroundColor: n.read ? "transparent" : "action.hover",
                  transition: "all 0.15s ease",
                  "&:hover": {
                    backgroundColor: "action.selected",
                    transform: "translateX(3px)",
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 34,
                    height: 34,
                    fontSize: 13,
                    fontWeight: 700,
                    bgcolor: (theme) =>
                      alpha(
                        theme.palette[
                          TYPE_COLOR[n.type] as "primary" | "warning" | "info" | "error"
                        ].main,
                        0.14
                      ),
                    color: `${TYPE_COLOR[n.type]}.main`,
                    mt: 0.25,
                  }}
                >
                  {n.title.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} sx={{ mb: 0.25 }}>
                    <Typography
                      sx={{
                        fontSize: 12.5,
                        fontWeight: n.read ? 600 : 800,
                        color: n.read ? "text.primary" : "primary.main",
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
                        height: 19,
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
                  <Typography sx={{ fontSize: 10, color: "text.disabled", mt: 0.25 }}>
                    {new Date(n.createdAt).toLocaleString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })} · Cliquez pour ouvrir
                  </Typography>
                </Box>
              </ListItem>
              {index < Math.min(activity.length, 5) - 1 && <Divider />}
            </Box>
          ))}
        </List>
      )}

      <Box sx={{ pt: 2, display: "flex", justifyContent: "center" }}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => navigate("/notifications")}
          endIcon={<ArrowForwardIcon fontSize="small" />}
          sx={{ fontWeight: 700, borderRadius: 2, fontSize: 11.5 }}
        >
          Voir toutes les notifications ({activity.length})
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        maxWidth: 1440,
        mx: "auto",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Title title="Tableau de bord" />

      {/* ═══════ HEADER ═══════ */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{ mb: 2.5 }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            component="img"
            src={lureviaLogo}
            alt="Lurevia"
            sx={{
              width: 52,
              height: 52,
              borderRadius: 2,
              objectFit: "cover",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
              border: "1px solid",
              borderColor: "divider",
              display: { xs: "none", sm: "block" },
            }}
          />
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
              Vue d'ensemble · Lurevia Madagascar
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.25 }}>
              Tableau de Bord & Analytics 📊
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Suivi des ventes, commandes, produits et utilisateurs en Ariary (MGA).
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1.5} alignItems="center">
          {/* Sélecteur de vue : Tous les graphiques ou Vue par onglets */}
          <ButtonGroup size="small" variant="outlined" sx={{ borderRadius: 2 }}>
            <Button
              variant={viewMode === "grid" ? "contained" : "outlined"}
              onClick={() => setViewMode("grid")}
              startIcon={<BarIcon fontSize="small" />}
              sx={{ fontWeight: 700, fontSize: 12, textTransform: "none" }}
            >
              Tous les graphes
            </Button>
            <Button
              variant={viewMode === "tabs" ? "contained" : "outlined"}
              onClick={() => setViewMode("tabs")}
              startIcon={<LineChartIcon fontSize="small" />}
              sx={{ fontWeight: 700, fontSize: 12, textTransform: "none" }}
            >
              Vue détaillée
            </Button>
          </ButtonGroup>

          <Tooltip title="Rafraîchir les données" arrow>
            <IconButton
              onClick={loadData}
              sx={{
                color: "text.secondary",
                border: "1px solid",
                borderColor: "divider",
                "&:hover": { color: "primary.main", backgroundColor: "action.hover" },
              }}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {/* ═══════ BARRE D'AVANCEMENT ═══════ */}
      <Box
        sx={{
          mb: 2.5,
          p: 1.75,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          backgroundColor: "background.paper",
        }}
      >
        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 0.75 }}>
          <ShoppingCartIcon sx={{ color: "primary.main", fontSize: 20 }} />
          <Typography sx={{ fontWeight: 800, fontSize: 13, flex: 1 }}>
            Boutique prête à vendre
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {setupProgress}%
          </Typography>
        </Stack>
        <LinearProgress variant="determinate" value={setupProgress} sx={{ height: 7, borderRadius: 4 }} />
      </Box>

      {error && (
        <Alert severity="warning" sx={{ mb: 2, borderRadius: 2, py: 0.5 }}>
          Certaines données en direct ne sont pas encore disponibles. Les graphiques affichent les données analytiques consolidées.
        </Alert>
      )}

      {/* ═══════ STAT CARDS (8 KPIs) ═══════ */}
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
          trend={stats?.revenueTrend != null ? { value: stats.revenueTrend } : undefined}
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
          label="Clients enregistrés"
          value={totalUsers}
          hint={`+${newUsers7d} cette semaine`}
          color="primary"
        />
        <StatCard
          icon={InventoryIcon}
          label="Catalogue produits"
          value={totalProducts}
          hint={`${lowStockProducts} en stock faible`}
          color="info"
        />
        <StatCard
          icon={WarningIcon}
          label="Stock critique"
          value={lowStockProducts}
          color="error"
          hint="≤ 5 unités"
        />
        <StatCard
          icon={StarIcon}
          label="Avis clients"
          value={totalReviews}
          color="warning"
          hint="En modération"
        />
        <StatCard
          icon={PersonRemoveIcon}
          label="Demandes suppression"
          value={pendingDeletions}
          color="error"
          hint="À examiner"
        />
        <StatCard
          icon={StorefrontIcon}
          label="Notifications"
          value={activity.length}
          color="primary"
          hint="Centre d'alertes"
        />
      </Box>

      {/* ═══════ VUE 1 : GRILLE COMPLÈTE (TOUS LES GRAPHES VISIBLES DIRECTEMENT) ═══════ */}
      {viewMode === "grid" && (
        <Stack spacing={3}>
          {/* 1. Évolution du Revenu (Pleine largeur) */}
          <Card
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2.5,
              p: 2.5,
              backgroundColor: "background.paper",
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: 16 }}>
                  Évolution du Chiffre d'Affaires & Revenus (30 jours)
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total sur la période : {formatAriary(revenueLast30d)} · {orders30dCount} commandes traitées
                </Typography>
              </Box>
              {stats?.revenueTrend != null && (
                <Chip
                  icon={<TrendingUpIcon sx={{ fontSize: 14 }} />}
                  label={`${stats.revenueTrend > 0 ? "+" : ""}${stats.revenueTrend}%`}
                  size="small"
                  sx={{
                    height: 24,
                    fontSize: 11,
                    fontWeight: 700,
                    backgroundColor: (theme) => alpha(theme.palette.success.main, 0.12),
                    color: "success.main",
                    "& .MuiChip-icon": { color: "inherit" },
                  }}
                />
              )}
            </Stack>
            {renderRevenueChart(320)}
          </Card>

          {/* 2. Ligne 2 colonnes : Commandes par statut & Ventes par catégorie */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
              gap: 3,
            }}
          >
            {/* Commandes par statut */}
            <Card
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2.5,
                p: 2.5,
                backgroundColor: "background.paper",
              }}
            >
              <Box sx={{ mb: 1.5 }}>
                <Typography sx={{ fontWeight: 800, fontSize: 15 }}>
                  Commandes par statut
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Répartition des flux logistiques
                </Typography>
              </Box>
              {renderOrdersByStatusChart(280)}
            </Card>

            {/* Ventes par catégorie */}
            <Card
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2.5,
                p: 2.5,
                backgroundColor: "background.paper",
              }}
            >
              <Box sx={{ mb: 1.5 }}>
                <Typography sx={{ fontWeight: 800, fontSize: 15 }}>
                  Ventes par catégorie de produits
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Chiffre d'affaires par filière artisanale
                </Typography>
              </Box>
              {renderSalesByCategoryChart(280)}
            </Card>
          </Box>

          {/* 3. Ligne 2 colonnes : Méthodes de paiement & Croissance utilisateurs */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
              gap: 3,
            }}
          >
            {/* Méthodes de paiement */}
            <Card
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2.5,
                p: 2.5,
                backgroundColor: "background.paper",
              }}
            >
              <Box sx={{ mb: 1.5 }}>
                <Typography sx={{ fontWeight: 800, fontSize: 15 }}>
                  Méthodes de paiement (Madagascar)
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  MVola, Orange Money, Airtel Money, Espèces, Carte
                </Typography>
              </Box>
              {renderPaymentMethodsChart(280)}
            </Card>

            {/* Croissance utilisateurs */}
            <Card
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2.5,
                p: 2.5,
                backgroundColor: "background.paper",
              }}
            >
              <Box sx={{ mb: 1.5 }}>
                <Typography sx={{ fontWeight: 800, fontSize: 15 }}>
                  Nouveaux utilisateurs enregistrés
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Évolution des inscriptions sur 7 jours
                </Typography>
              </Box>
              {renderUserGrowthChart(280)}
            </Card>
          </Box>

          {/* 4. Ligne 2 colonnes : Top 5 produits vendus & Activité récente */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
              gap: 3,
            }}
          >
            {/* Top 5 produits */}
            <Card
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2.5,
                p: 2.5,
                backgroundColor: "background.paper",
              }}
            >
              <Box sx={{ mb: 1.5 }}>
                <Typography sx={{ fontWeight: 800, fontSize: 15 }}>
                  Top 5 produits les plus vendus
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Volumes de ventes et popularité
                </Typography>
              </Box>
              {renderTopProductsChart(280)}
            </Card>

            {/* Activité récente & Notifications */}
            <Card
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2.5,
                p: 2.5,
                backgroundColor: "background.paper",
              }}
            >
              <Box sx={{ mb: 1.5 }}>
                <Typography sx={{ fontWeight: 800, fontSize: 15 }}>
                  Dernières activités & alertes
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Cliquez sur une notification pour ouvrir l'élément
                </Typography>
              </Box>
              {renderActivityList()}
            </Card>
          </Box>
        </Stack>
      )}

      {/* ═══════ VUE 2 : VUE DÉTAILLÉE PAR ONGLET ═══════ */}
      {viewMode === "tabs" && (
        <Card
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2.5,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "background.paper",
          }}
        >
          {/* Barre d'onglets */}
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
              sx={{
                minHeight: 48,
                "& .MuiTab-root": {
                  minHeight: 48,
                  fontSize: 12.5,
                  fontWeight: 700,
                  textTransform: "none",
                  px: 2,
                },
                "& .MuiTabs-indicator": {
                  height: 3,
                  borderRadius: "3px 3px 0 0",
                },
              }}
            >
              <Tab icon={<LineChartIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Revenu (30 j)" />
              <Tab icon={<PieIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Commandes" />
              <Tab icon={<PieIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Catégories" />
              <Tab icon={<BarIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Top produits" />
              <Tab icon={<PieIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Paiements" />
              <Tab icon={<LineChartIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Utilisateurs" />
              <Tab icon={<ScheduleIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Activité" />
            </Tabs>
          </Box>

          {/* Contenu de l'onglet actif */}
          <Box sx={{ p: 3 }}>
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ fontWeight: 800, fontSize: 16 }}>Revenu des 30 derniers jours</Typography>
                <Typography variant="caption" color="text.secondary">Total : {formatAriary(revenueLast30d)}</Typography>
              </Box>
              {renderRevenueChart(360)}
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ fontWeight: 800, fontSize: 16 }}>Commandes par statut</Typography>
                <Typography variant="caption" color="text.secondary">Répartition des flux</Typography>
              </Box>
              {renderOrdersByStatusChart(360)}
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ fontWeight: 800, fontSize: 16 }}>Ventes par catégorie</Typography>
                <Typography variant="caption" color="text.secondary">Chiffre d'affaires par filière artisanale</Typography>
              </Box>
              {renderSalesByCategoryChart(360)}
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ fontWeight: 800, fontSize: 16 }}>Top 5 produits les plus vendus</Typography>
                <Typography variant="caption" color="text.secondary">Volume de ventes</Typography>
              </Box>
              {renderTopProductsChart(360)}
            </TabPanel>

            <TabPanel value={tabValue} index={4}>
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ fontWeight: 800, fontSize: 16 }}>Méthodes de paiement</Typography>
                <Typography variant="caption" color="text.secondary">MVola, Orange Money, Airtel Money, Espèces, Carte</Typography>
              </Box>
              {renderPaymentMethodsChart(360)}
            </TabPanel>

            <TabPanel value={tabValue} index={5}>
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ fontWeight: 800, fontSize: 16 }}>Nouveaux utilisateurs</Typography>
                <Typography variant="caption" color="text.secondary">Inscriptions sur 7 jours</Typography>
              </Box>
              {renderUserGrowthChart(360)}
            </TabPanel>

            <TabPanel value={tabValue} index={6}>
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ fontWeight: 800, fontSize: 16 }}>Flux d'activité récent</Typography>
                <Typography variant="caption" color="text.secondary">Notifications et alertes prioritaires</Typography>
              </Box>
              {renderActivityList()}
            </TabPanel>
          </Box>
        </Card>
      )}
    </Box>
  );
};