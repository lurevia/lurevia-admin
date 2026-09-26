import { useGetList, Title } from "react-admin";
import { useMemo } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import AccountBalanceIconModule from "@mui/icons-material/AccountBalance";
import PaidIconModule from "@mui/icons-material/Paid";
import SwapHorizIconModule from "@mui/icons-material/SwapHoriz";
import StorefrontIconModule from "@mui/icons-material/Storefront";
import TrendingUpIconModule from "@mui/icons-material/TrendingUp";
import WarningAmberIconModule from "@mui/icons-material/WarningAmber";
import HourglassEmptyIconModule from "@mui/icons-material/HourglassEmpty";
import { normalizeMuiIcon } from "../../muiIcon";
import { StatCard } from "../../dashboard/StatCard";

const AccountBalanceIcon = normalizeMuiIcon(AccountBalanceIconModule);
const PaidIcon = normalizeMuiIcon(PaidIconModule);
const SwapHorizIcon = normalizeMuiIcon(SwapHorizIconModule);
const StorefrontIcon = normalizeMuiIcon(StorefrontIconModule);
const TrendingUpIcon = normalizeMuiIcon(TrendingUpIconModule);
const WarningIcon = normalizeMuiIcon(WarningAmberIconModule);
const PendingIcon = normalizeMuiIcon(HourglassEmptyIconModule);

type Row = {
  id: string | number;
  amount?: number;
  netAmount?: number;
  commissionAmount?: number;
  status?: string;
  createdAt?: string;
};

const money = (value: number) =>
  new Intl.NumberFormat("fr-MG").format(value) + " Ar";

const sum = (rows: Row[], field: keyof Row) =>
  rows.reduce((total, row) => total + (Number(row[field]) || 0), 0);

const MiniBars = ({ values }: { values: number[] }) => {
  const max = Math.max(...values, 1);
  return (
    <Box
      sx={{
        display: "flex",
        gap: 0.75,
        alignItems: "flex-end",
        height: 140,
        mt: 2,
      }}
    >
      {values.map((value, index) => {
        const height = Math.max((value / max) * 100, 5);
        return (
          <Box
            key={index}
            sx={{
              flex: 1,
              bgcolor: "primary.main",
              height: `${height}%`,
              borderRadius: "6px 6px 0 0",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "primary.dark",
                transform: "scaleY(1.03)",
                transformOrigin: "bottom",
              },
            }}
          />
        );
      })}
    </Box>
  );
};

export const FinancialDashboard = () => {
  const sellers = useGetList<Row>("sellers", {
    pagination: { page: 1, perPage: 100 },
    sort: { field: "createdAt", order: "DESC" },
    filter: {},
  });
  const settlements = useGetList<Row>("settlements", {
    pagination: { page: 1, perPage: 100 },
    sort: { field: "createdAt", order: "DESC" },
    filter: {},
  });
  const commissions = useGetList<Row>("commissions", {
    pagination: { page: 1, perPage: 100 },
    sort: { field: "createdAt", order: "DESC" },
    filter: {},
  });
  const transfers = useGetList<Row>("transfers", {
    pagination: { page: 1, perPage: 100 },
    sort: { field: "createdAt", order: "DESC" },
    filter: {},
  });

  const rows = settlements.data ?? [];
  const chart = useMemo(
    () => rows.slice(-8).map((row) => Number(row.netAmount ?? row.amount) || 0),
    [rows]
  );

  const errors = [
    sellers.error,
    settlements.error,
    commissions.error,
    transfers.error,
  ].filter(Boolean);

  const pendingSettlements = rows.filter(
    (row) => row.status === "PENDING_REVIEW" || row.status === "pending"
  ).length;
  const pendingTransfers = (transfers.data ?? []).filter(
    (row) => row.status === "PENDING" || row.status === "pending"
  ).length;

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1440, mx: "auto" }}>
      <Title title="Pilotage financier" />

      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="overline"
          sx={{
            color: "primary.main",
            letterSpacing: 2,
            fontWeight: 700,
            fontSize: 10.5,
          }}
        >
          Finance · Socle
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.25 }}>
          Pilotage financier
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Vue d'ensemble des flux financiers : settlements, commissions et transferts.
        </Typography>
      </Box>

      {errors.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 0.5 }}>
            Certaines données financières ne sont pas disponibles.
          </Typography>
          <Typography sx={{ fontSize: 12.5, lineHeight: 1.5 }}>
            Vérifiez que les endpoints{" "}
            <code style={{ backgroundColor: "rgba(0,0,0,0.06)", padding: "1px 5px", borderRadius: 4 }}>
              /admin/sellers
            </code>
            {", "}
            <code style={{ backgroundColor: "rgba(0,0,0,0.06)", padding: "1px 5px", borderRadius: 4 }}>
              /admin/settlements
            </code>
            {", "}
            <code style={{ backgroundColor: "rgba(0,0,0,0.06)", padding: "1px 5px", borderRadius: 4 }}>
              /admin/commissions
            </code>
            {" et "}
            <code style={{ backgroundColor: "rgba(0,0,0,0.06)", padding: "1px 5px", borderRadius: 4 }}>
              /admin/transfers
            </code>{" "}
            sont activés côté API.
          </Typography>
        </Alert>
      )}

      {/* KPIs */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <StatCard
          icon={StorefrontIcon}
          label="Vendeurs"
          value={sellers.isLoading ? "…" : sellers.data?.length ?? 0}
          color="primary"
        />
        <StatCard
          icon={AccountBalanceIcon}
          label="Settlements nets"
          value={settlements.isLoading ? "…" : money(sum(rows, "netAmount"))}
          color="primary"
        />
        <StatCard
          icon={PaidIcon}
          label="Commissions"
          value={
            commissions.isLoading
              ? "…"
              : money(sum(commissions.data ?? [], "amount"))
          }
          color="success"
        />
        <StatCard
          icon={SwapHorizIcon}
          label="Transferts"
          value={transfers.isLoading ? "…" : transfers.data?.length ?? 0}
          color="warning"
        />
      </Box>

      {/* Graphiques */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.4fr 1fr" },
          gap: 2,
        }}
      >
        {/* Évolution des settlements */}
        <Card
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2.5,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
              sx={{ mb: 1 }}
            >
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Évolution des settlements
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Dernières lignes reçues de l'API
                </Typography>
              </Box>
              <Chip
                icon={<TrendingUpIcon sx={{ fontSize: 14 }} />}
                label="Net"
                size="small"
                sx={{
                  height: 22,
                  fontSize: 10.5,
                  fontWeight: 700,
                  backgroundColor: (theme) =>
                    alpha(theme.palette.primary.main, 0.1),
                  color: "primary.main",
                  "& .MuiChip-icon": { color: "inherit" },
                }}
              />
            </Stack>
            <MiniBars values={chart.length ? chart : [0]} />
            <Divider sx={{ my: 2 }} />
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ fontSize: 11.5, color: "text.secondary" }}
            >
              <Typography sx={{ fontSize: 11.5 }}>
                {chart.length} point{chart.length > 1 ? "s" : ""} de données
              </Typography>
              <Typography sx={{ fontSize: 11.5, fontWeight: 600 }}>
                Total : {money(chart.reduce((a, b) => a + b, 0))}
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        {/* À surveiller */}
        <Card
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2.5,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <WarningIcon sx={{ fontSize: 20, color: "warning.main" }} />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                À surveiller
              </Typography>
            </Stack>

            {/* Settlements en attente */}
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: (theme) =>
                  alpha(theme.palette.warning.main, 0.06),
                border: "1px solid",
                borderColor: (theme) =>
                  alpha(theme.palette.warning.main, 0.2),
                mb: 2,
              }}
            >
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: (theme) =>
                      alpha(theme.palette.warning.main, 0.15),
                    color: "warning.main",
                  }}
                >
                  <PendingIcon sx={{ fontSize: 18 }} />
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontSize: 10.5,
                      color: "text.secondary",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      fontWeight: 700,
                    }}
                  >
                    Settlements en attente
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 22,
                      fontWeight: 800,
                      color: "warning.dark",
                      lineHeight: 1.1,
                    }}
                  >
                    {settlements.isLoading ? "…" : pendingSettlements}
                  </Typography>
                </Box>
              </Stack>
              <Typography sx={{ fontSize: 11.5, color: "text.secondary" }}>
                Nécessitent une revue avant transfert.
              </Typography>
            </Box>

            {/* Transferts en attente */}
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: (theme) =>
                  alpha(theme.palette.error.main, 0.06),
                border: "1px solid",
                borderColor: (theme) => alpha(theme.palette.error.main, 0.2),
              }}
            >
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: (theme) =>
                      alpha(theme.palette.error.main, 0.15),
                    color: "error.main",
                  }}
                >
                  <SwapHorizIcon sx={{ fontSize: 18 }} />
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontSize: 10.5,
                      color: "text.secondary",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      fontWeight: 700,
                    }}
                  >
                    Transferts en attente
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 22,
                      fontWeight: 800,
                      color: "error.dark",
                      lineHeight: 1.1,
                    }}
                  >
                    {transfers.isLoading ? "…" : pendingTransfers}
                  </Typography>
                </Box>
              </Stack>
              <Typography sx={{ fontSize: 11.5, color: "text.secondary" }}>
                À traiter pour finaliser les paiements vendeurs.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};