import { List, useListContext, Title } from "react-admin";
import { useState } from "react";
import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  Chip,
  IconButton,
  InputAdornment,
  Pagination as MuiPagination,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Button,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import SearchIconModule from "@mui/icons-material/Search";
import CloseIconModule from "@mui/icons-material/Close";
import SortIconModule from "@mui/icons-material/Sort";
import ScheduleIconModule from "@mui/icons-material/Schedule";
import StorefrontIconModule from "@mui/icons-material/Storefront";
import DescriptionIconModule from "@mui/icons-material/Description";
import ReceiptLongIconModule from "@mui/icons-material/ReceiptLong";
import AccountBalanceIconModule from "@mui/icons-material/AccountBalance";
import SwapHorizIconModule from "@mui/icons-material/SwapHoriz";
import HourglassEmptyIconModule from "@mui/icons-material/HourglassEmpty";
import CheckCircleIconModule from "@mui/icons-material/CheckCircle";
import CancelIconModule from "@mui/icons-material/Cancel";
import MailOutlineIconModule from "@mui/icons-material/MailOutline";
import EventIconModule from "@mui/icons-material/Event";
import PaidIconModule from "@mui/icons-material/Paid";
import TrendingUpIconModule from "@mui/icons-material/TrendingUp";
import VisibilityOutlinedIconModule from "@mui/icons-material/VisibilityOutlined";
import FilterAltOffIconModule from "@mui/icons-material/FilterAltOff";
import ViewModuleIconModule from "@mui/icons-material/ViewModule";
import BadgeIconModule from "@mui/icons-material/Badge";
import TagIconModule from "@mui/icons-material/Tag";
import { normalizeMuiIcon } from "../../muiIcon";
import { scrollAdminContentToTop } from "../../utils/scrollAdminContent";
import { SmartSelect, type SmartSelectOption } from "../../components/SmartSelect";
import { FinanceDetailDialog } from "./FinanceDetailDialog";

// ─── Icônes normalisées ───
const SearchIcon = normalizeMuiIcon(SearchIconModule);
const CloseIcon = normalizeMuiIcon(CloseIconModule);
const SortIcon = normalizeMuiIcon(SortIconModule);
const ScheduleIcon = normalizeMuiIcon(ScheduleIconModule);
const SellerIcon = normalizeMuiIcon(StorefrontIconModule);
const ContractIcon = normalizeMuiIcon(DescriptionIconModule);
const SettlementIcon = normalizeMuiIcon(ReceiptLongIconModule);
const CommissionIcon = normalizeMuiIcon(AccountBalanceIconModule);
const TransferIcon = normalizeMuiIcon(SwapHorizIconModule);
const PendingIcon = normalizeMuiIcon(HourglassEmptyIconModule);
const ApprovedIcon = normalizeMuiIcon(CheckCircleIconModule);
const RejectedIcon = normalizeMuiIcon(CancelIconModule);
const MailIcon = normalizeMuiIcon(MailOutlineIconModule);
const DateIcon = normalizeMuiIcon(EventIconModule);
const MoneyIcon = normalizeMuiIcon(PaidIconModule);
const RateIcon = normalizeMuiIcon(TrendingUpIconModule);
const VisibilityIcon = normalizeMuiIcon(VisibilityOutlinedIconModule);
const FilterOffIcon = normalizeMuiIcon(FilterAltOffIconModule);
const ViewModuleIcon = normalizeMuiIcon(ViewModuleIconModule);
const StatusIcon = normalizeMuiIcon(BadgeIconModule);
const RefIcon = normalizeMuiIcon(TagIconModule);

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG PAR RESSOURCE
// ─────────────────────────────────────────────────────────────────────────────

type ResourceKey = "sellers" | "contracts" | "settlements" | "commissions" | "transfers";

interface ResourceConfig {
  label: string;
  singular: string;
  description: string;
  icon: any;
  statusOptions?: SmartSelectOption[];
}

const RESOURCE_CONFIG: Record<ResourceKey, ResourceConfig> = {
  sellers: {
    label: "Vendeurs",
    singular: "Vendeur",
    description: "Gérez les vendeurs et leurs taux de commission.",
    icon: SellerIcon,
    statusOptions: [
      { value: "active", label: "Actifs", icon: ApprovedIcon },
      { value: "pending", label: "En attente", icon: PendingIcon },
      { value: "suspended", label: "Suspendus", icon: RejectedIcon },
    ],
  },
  contracts: {
    label: "Contrats",
    singular: "Contrat",
    description: "Suivez les contrats vendeurs et leur validité.",
    icon: ContractIcon,
    statusOptions: [
      { value: "PENDING", label: "En attente", icon: PendingIcon },
      { value: "APPROVED", label: "Approuvés", icon: ApprovedIcon },
      { value: "REJECTED", label: "Rejetés", icon: RejectedIcon },
    ],
  },
  settlements: {
    label: "Settlements",
    singular: "Settlement",
    description: "Suivez les règlements dus aux vendeurs.",
    icon: SettlementIcon,
    statusOptions: [
      { value: "PENDING_REVIEW", label: "En revue", icon: PendingIcon },
      { value: "READY", label: "Prêts", icon: ApprovedIcon },
      { value: "TRANSFER_PENDING", label: "Transfert en cours", icon: PendingIcon },
      { value: "PAID", label: "Payés", icon: ApprovedIcon },
      { value: "FAILED", label: "Échoués", icon: RejectedIcon },
      { value: "CANCELLED", label: "Annulés", icon: RejectedIcon },
    ],
  },
  commissions: {
    label: "Commissions",
    singular: "Commission",
    description: "Détail des commissions perçues sur les ventes.",
    icon: CommissionIcon,
  },
  transfers: {
    label: "Transferts",
    singular: "Transfert",
    description: "Historique des transferts vers les vendeurs.",
    icon: TransferIcon,
    statusOptions: [
      { value: "PENDING", label: "En attente", icon: PendingIcon },
      { value: "PROCESSING", label: "En cours", icon: PendingIcon },
      { value: "COMPLETED", label: "Complétés", icon: ApprovedIcon },
      { value: "FAILED", label: "Échoués", icon: RejectedIcon },
      { value: "CANCELLED", label: "Annulés", icon: RejectedIcon },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<string, string> = {
  // Sellers
  active: "Actif",
  pending: "En attente",
  suspended: "Suspendu",
  // Contracts
  PENDING: "En attente",
  APPROVED: "Approuvé",
  REJECTED: "Rejeté",
  // Settlements / Transfers
  PENDING_REVIEW: "En revue",
  READY: "Prêt",
  TRANSFER_PENDING: "Transfert en cours",
  PAID: "Payé",
  FAILED: "Échoué",
  CANCELLED: "Annulé",
  PROCESSING: "En cours",
  COMPLETED: "Complété",
};

const getStatusConfig = (status: string | null | undefined) => {
  if (!status) return null;
  const normalized = status.toLowerCase();
  const isSuccess = ["active", "approved", "paid", "completed", "ready"].includes(
    normalized
  );
  const isError = ["rejected", "failed", "cancelled", "suspended"].includes(
    normalized
  );
  const color = isSuccess ? "success" : isError ? "error" : "warning";
  const Icon = isSuccess ? ApprovedIcon : isError ? RejectedIcon : PendingIcon;
  return {
    label: STATUS_LABELS[status] ?? status,
    color: color as "success" | "error" | "warning",
    icon: Icon,
  };
};

const formatDate = (date: string | null | undefined) => {
  if (!date) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

const formatMoney = (value: number | undefined | null) => {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("fr-MG").format(n) + " Ar";
};

// ─────────────────────────────────────────────────────────────────────────────
// CARTE FINANCIÈRE GÉNÉRIQUE
// ─────────────────────────────────────────────────────────────────────────────

interface FinanceCardProps {
  resource: ResourceKey;
  record: any;
  onView: () => void;
}

const FinanceCard = ({ resource, record, onView }: FinanceCardProps) => {
  const config = RESOURCE_CONFIG[resource];
  const statusConfig = getStatusConfig(record.status);
  const StatusIconCmp = statusConfig?.icon;

  // Rendu spécifique par ressource
  const renderContent = () => {
    switch (resource) {
      case "sellers":
        return (
          <>
            <CardHeader
              initial={(record.name ?? "?").charAt(0).toUpperCase()}
              title={record.name}
              subtitle={record.email}
              statusConfig={statusConfig}
            />
            <Stack spacing={0.75} sx={{ mt: 2 }}>
              <InfoRow icon={MailIcon} label="Email" value={record.email} />
              <InfoRow
                icon={RateIcon}
                label="Commission"
                value={record.commissionRate != null ? `${record.commissionRate} %` : "—"}
              />
              <InfoRow
                icon={DateIcon}
                label="Créé le"
                value={formatDate(record.createdAt)}
              />
            </Stack>
          </>
        );

      case "contracts":
        return (
          <>
            <CardHeader
              initial={(record.sellerName ?? "?").charAt(0).toUpperCase()}
              title={record.sellerName ?? "Vendeur"}
              subtitle={`Version ${record.version ?? "—"}`}
              statusConfig={statusConfig}
            />
            <Stack spacing={0.75} sx={{ mt: 2 }}>
              <InfoRow
                icon={RateIcon}
                label="Commission"
                value={
                  record.value != null
                    ? `${record.value}${record.type === "PERCENTAGE" ? " %" : " Ar"}`
                    : "—"
                }
              />
              <InfoRow
                icon={DateIcon}
                label="Début"
                value={formatDate(record.effectiveFrom ?? record.startsAt)}
              />
              <InfoRow
                icon={DateIcon}
                label="Fin"
                value={formatDate(record.effectiveTo ?? record.endsAt)}
              />
            </Stack>
          </>
        );

      case "settlements":
        return (
          <>
            <CardHeader
              initial={(record.sellerName ?? "?").charAt(0).toUpperCase()}
              title={record.sellerName ?? "Vendeur"}
              subtitle={record.period ?? undefined}
              statusConfig={statusConfig}
            />
            <Stack spacing={0.75} sx={{ mt: 2 }}>
              <InfoRow
                icon={MoneyIcon}
                label="Brut"
                value={formatMoney(record.grossAmount)}
              />
              <InfoRow
                icon={MoneyIcon}
                label="Commission"
                value={formatMoney(record.commissionAmount)}
                accent="warning"
              />
              <InfoRow
                icon={MoneyIcon}
                label="Net à payer"
                value={formatMoney(record.netAmount)}
                accent="success"
                bold
              />
            </Stack>
          </>
        );

      case "commissions":
        return (
          <>
            <CardHeader
              initial={(record.sellerName ?? "?").charAt(0).toUpperCase()}
              title={record.sellerName ?? "Vendeur"}
              subtitle={
                record.orderId
                  ? `Commande #${String(record.orderId).slice(0, 8)}`
                  : undefined
              }
              statusConfig={null}
            />
            <Stack spacing={0.75} sx={{ mt: 2 }}>
              <InfoRow
                icon={RateIcon}
                label="Taux"
                value={record.rate != null ? `${record.rate} %` : "—"}
              />
              <InfoRow
                icon={MoneyIcon}
                label="Montant"
                value={formatMoney(record.amount)}
                accent="success"
                bold
              />
              <InfoRow
                icon={DateIcon}
                label="Date"
                value={formatDate(record.createdAt)}
              />
            </Stack>
          </>
        );

      case "transfers":
        return (
          <>
            <CardHeader
              initial={(record.sellerName ?? "?").charAt(0).toUpperCase()}
              title={record.sellerName ?? "Vendeur"}
              subtitle={record.reference ?? undefined}
              statusConfig={statusConfig}
            />
            <Stack spacing={0.75} sx={{ mt: 2 }}>
              <InfoRow
                icon={MoneyIcon}
                label="Montant"
                value={formatMoney(record.amount)}
                bold
              />
              <InfoRow
                icon={RefIcon}
                label="Référence"
                value={record.reference ?? "—"}
              />
              <InfoRow
                icon={DateIcon}
                label="Date"
                value={formatDate(record.createdAt)}
              />
            </Stack>
          </>
        );
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        display: "flex",
        flexDirection: "column",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2.5,
        overflow: "hidden",
        height: "100%",
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: "primary.main",
          boxShadow: (theme) =>
            `0 8px 24px -12px ${alpha(theme.palette.primary.main, 0.3)}`,
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent sx={{ flex: 1, p: 2, pb: 1.5 }}>{renderContent()}</CardContent>
      <CardActions
        sx={{
          px: 1,
          py: 0.75,
          borderTop: "1px solid",
          borderColor: "divider",
          justifyContent: "flex-end",
        }}
      >
        <Tooltip title="Voir le détail" arrow>
          <IconButton
            size="small"
            onClick={onView}
            sx={{
              color: "text.secondary",
              width: 30,
              height: 30,
              "&:hover": { color: "info.main", backgroundColor: "action.hover" },
            }}
          >
            <VisibilityIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SOUS-COMPOSANTS
// ─────────────────────────────────────────────────────────────────────────────

const CardHeader = ({
  initial,
  title,
  subtitle,
  statusConfig,
}: {
  initial: string;
  title: string;
  subtitle?: string;
  statusConfig: any;
}) => {
  const StatusIconCmp = statusConfig?.icon;
  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Avatar
        sx={{
          width: 48,
          height: 48,
          fontSize: 18,
          fontWeight: 800,
          bgcolor: "primary.main",
          color: "primary.contrastText",
          flexShrink: 0,
        }}
      >
        {initial}
      </Avatar>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 700, lineHeight: 1.2, mb: 0.5 }}
          noWrap
          title={title}
        >
          {title}
        </Typography>
        {statusConfig ? (
          <Chip
            icon={<StatusIconCmp sx={{ fontSize: 12 }} />}
            label={statusConfig.label}
            color={statusConfig.color}
            size="small"
            sx={{
              height: 20,
              fontSize: 10,
              fontWeight: 700,
              "& .MuiChip-icon": { color: "inherit" },
              "& .MuiChip-label": { px: 0.75 },
            }}
          />
        ) : (
          subtitle && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontFamily: "monospace", fontSize: 10.5 }}
              noWrap
            >
              {subtitle}
            </Typography>
          )
        )}
      </Box>
    </Stack>
  );
};

const InfoRow = ({
  icon: Icon,
  label,
  value,
  accent,
  bold,
}: {
  icon: any;
  label: string;
  value: string;
  accent?: "success" | "warning" | "error" | "primary";
  bold?: boolean;
}) => {
  const color = accent ? `${accent}.main` : "text.secondary";
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Icon
        sx={{
          fontSize: 14,
          color: accent ? `${accent}.main` : "text.secondary",
          flexShrink: 0,
        }}
      />
      <Typography
        sx={{ fontSize: 11.5, color: "text.secondary", flex: 1 }}
        noWrap
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: bold ? 13 : 11.5,
          fontWeight: bold ? 800 : 600,
          color,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: 160,
        }}
        noWrap
        title={value}
      >
        {value}
      </Typography>
    </Stack>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON
// ─────────────────────────────────────────────────────────────────────────────

const FinanceSkeleton = () => (
  <Card
    elevation={0}
    sx={{
      border: "1px solid",
      borderColor: "divider",
      borderRadius: 2.5,
      overflow: "hidden",
    }}
  >
    <CardContent sx={{ p: 2 }}>
      <Stack direction="row" spacing={1.5} sx={{ mb: 2 }}>
        <Skeleton variant="circular" width={48} height={48} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="40%" />
        </Box>
      </Stack>
      <Skeleton variant="text" width="90%" />
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="70%" />
    </CardContent>
  </Card>
);

// ─────────────────────────────────────────────────────────────────────────────
// PAGINATION
// ─────────────────────────────────────────────────────────────────────────────

const PER_PAGE_OPTIONS = [12, 24, 48, 96];
const PER_PAGE_SELECT_OPTIONS: SmartSelectOption[] = PER_PAGE_OPTIONS.map((n) => ({
  value: String(n),
  label: `${n} / page`,
}));

const FinancePagination = ({
  page,
  perPage,
  total,
  onPageChange,
  onPerPageChange,
  singular,
}: {
  page: number;
  perPage: number;
  total: number;
  onPageChange: (p: number) => void;
  onPerPageChange: (pp: number) => void;
  singular: string;
}) => {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  if (total === 0) return null;

  return (
    <Paper
      elevation={0}
      sx={{
        mt: 3,
        p: 1.5,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12.5 }}>
            <strong>{total}</strong> {singular.toLowerCase()}
            {total > 1 ? "s" : ""}
          </Typography>

          <SmartSelect
            placeholder="Par page"
            icon={ViewModuleIcon}
            iconColor="text.secondary"
            options={PER_PAGE_SELECT_OPTIONS}
            value={String(perPage)}
            onChange={(v) => onPerPageChange(Number(v))}
            minWidth={130}
            maxWidth={150}
            clearable={false}
            disableSearch
          />
        </Stack>

        <MuiPagination
          count={totalPages}
          page={page}
          onChange={(_, p) => onPageChange(p)}
          color="primary"
          shape="rounded"
          size="medium"
          showFirstButton
          showLastButton
          sx={{
            "& .MuiPaginationItem-root": {
              fontWeight: 600,
              borderRadius: 1.5,
            },
          }}
        />
      </Stack>
    </Paper>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// BARRE DE FILTRES
// ─────────────────────────────────────────────────────────────────────────────

const SORT_OPTIONS: SmartSelectOption[] = [
  { value: "createdAt:DESC", label: "Plus récents", icon: ScheduleIcon },
  { value: "createdAt:ASC", label: "Plus anciens", icon: ScheduleIcon },
];

const FinanceFilterBar = ({
  resource,
  searchValue,
  onSearchChange,
  sortValue,
  onSortChange,
  statusValue,
  onStatusChange,
  onResetFilters,
  hasActiveFilters,
}: any) => {
  const config = RESOURCE_CONFIG[resource as ResourceKey];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.5,
        mb: 3,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1}
        alignItems={{ xs: "stretch", md: "center" }}
        flexWrap="wrap"
        useFlexGap
      >
        <TextField
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)} placeholder="Rechercher…"
          size="small"
          sx={{
            flex: { md: "1 1 200px", lg: "1 1 240px" },
            minWidth: 180,
            maxWidth: 320,
            "& .MuiOutlinedInput-root": {
              borderRadius: 1.5,
              backgroundColor: "background.default",
              paddingLeft: "8px",
              "& fieldset": { borderColor: "divider" },
              "&:hover fieldset": { borderColor: "primary.main" },
              "&.Mui-focused fieldset": { borderColor: "primary.main" },
              "& input": { fontSize: 13, py: 0.9 },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment
                position="start"
                sx={{ mr: 0.5, minWidth: 20, justifyContent: "center" }}
              >
                <SearchIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              </InputAdornment>
            ),
            endAdornment: searchValue && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => onSearchChange("")}
                  sx={{ p: 0.25 }}
                >
                  <CloseIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <SmartSelect
          placeholder="Trier par…"
          icon={SortIcon}
          iconColor="primary.main"
          options={SORT_OPTIONS}
          value={sortValue}
          onChange={onSortChange}
          minWidth={180}
          maxWidth={220}
          clearable={false}
          disableSearch
        />

        {config.statusOptions && (
          <SmartSelect
            placeholder="Statut"
            icon={StatusIcon}
            iconColor="warning.main"
            options={config.statusOptions}
            value={statusValue}
            onChange={onStatusChange}
            minWidth={160}
            maxWidth={220}
          />
        )}

        {hasActiveFilters && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<FilterOffIcon sx={{ fontSize: 16 }} />}
            onClick={onResetFilters}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              fontSize: 12,
              borderRadius: 1.5,
              flexShrink: 0,
              height: 36,
              borderColor: "divider",
              color: "text.secondary",
              "&:hover": {
                borderColor: "error.main",
                color: "error.main",
                backgroundColor: (theme) =>
                  alpha(theme.palette.error.main, 0.04),
              },
            }}
          >
            Effacer
          </Button>
        )}
      </Stack>
    </Paper>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// GRILLE
// ─────────────────────────────────────────────────────────────────────────────

const FinanceGrid = ({ resource }: { resource: ResourceKey }) => {
  const {
    data,
    isLoading,
    total,
    page,
    perPage,
    filterValues,
    setFilters,
    setPage,
    setPerPage,
  } = useListContext();

  const config = RESOURCE_CONFIG[resource];

  const [searchValue, setSearchValue] = useState(
    (filterValues.search as string) ?? ""
  );
  const [sortValue, setSortValue] = useState("createdAt:DESC");
  const [statusValue, setStatusValue] = useState(
    (filterValues.status as string) ?? ""
  );
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const hasActiveFilters = Boolean(searchValue) || Boolean(statusValue);

  const applyFilters = (overrides: Record<string, any> = {}) => {
    const next: Record<string, any> = {
      ...filterValues,
      search: searchValue || undefined,
      status: statusValue || undefined,
      ...overrides,
    };
    Object.keys(next).forEach((k) => {
      if (next[k] === undefined || next[k] === "") delete next[k];
    });
    setFilters(next, {});
    setPage(1);
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
    applyFilters({ search: value || undefined });
  };

  const handleSort = (value: string) => {
    setSortValue(value);
    const [field, order] = value.split(":");
    setFilters(filterValues, { field, order: order as "ASC" | "DESC" });
    setPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusValue(value);
    applyFilters({ status: value || undefined });
  };

  const handleResetFilters = () => {
    setSearchValue("");
    setStatusValue("");
    setFilters({}, {});
    setPage(1);
  };

  const handleView = (record: any) => {
    setSelectedRecord(record);
    setDetailOpen(true);
  };

  const Icon = config.icon;

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Title title={config.label} />

      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: (theme) =>
                alpha(theme.palette.primary.main, 0.1),
              color: "primary.main",
              flexShrink: 0,
            }}
          >
            <Icon sx={{ fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.25 }}>
              {config.label}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {config.description}
            </Typography>
          </Box>
        </Stack>
      </Stack>

      {/* Filtres */}
      <FinanceFilterBar
        resource={resource}
        searchValue={searchValue}
        onSearchValue={handleSearch}
        sortValue={sortValue}
        onSortChange={handleSort}
        statusValue={statusValue}
        onStatusChange={handleStatusChange}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Grille */}
      {isLoading ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 2,
          }}
        >
          {Array.from({ length: perPage }).map((_, i) => (
            <FinanceSkeleton key={i} />
          ))}
        </Box>
      ) : !data || data.length === 0 ? (
        <Card
          elevation={0}
          sx={{
            p: 6,
            textAlign: "center",
            border: "2px dashed",
            borderColor: "divider",
            borderRadius: 2.5,
            backgroundColor: "transparent",
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: (theme) =>
                alpha(theme.palette.primary.main, 0.1),
              color: "primary.main",
              mx: "auto",
              mb: 2,
            }}
          >
            <Icon sx={{ fontSize: 30 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
            Aucun élément
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {hasActiveFilters
              ? "Aucun résultat pour ces critères. Essayez de modifier les filtres."
              : `Les ${config.label.toLowerCase()} apparaîtront ici lorsqu'ils seront disponibles.`}
          </Typography>
        </Card>
      ) : (
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: 2,
            }}
          >
            {data.map((record: any) => (
              <FinanceCard
                key={record.id}
                resource={resource}
                record={record}
                onView={() => handleView(record)}
              />
            ))}
          </Box>

          <FinancePagination
            page={page}
            perPage={perPage}
            total={total ?? 0}
            singular={config.singular}
            onPageChange={(p: number) => {
              setPage(p);
              scrollAdminContentToTop();
            }}
            onPerPageChange={(pp: number) => {
              setPerPage(pp);
              setPage(1);
            }}
          />
        </>
      )}

      {/* Modale détail */}
      <FinanceDetailDialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        resource={resource}
        record={selectedRecord}
      />
    </Box>
  );
};

export const FinancialList = ({ resource }: { resource: ResourceKey }) => (
  <List
    resource={resource}
    perPage={24}
    sort={{ field: "createdAt", order: "DESC" }}
    actions={false}
    pagination={false}
    filterDefaultValues={{}}
  >
    <FinanceGrid resource={resource} />
  </List>
);