import { List, useListContext, useRedirect, Title } from "react-admin";
import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
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
  Divider
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import ReceiptLongIconModule from "@mui/icons-material/ReceiptLong";
import VisibilityOutlinedIconModule from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIconModule from "@mui/icons-material/EditOutlined";
import SearchIconModule from "@mui/icons-material/Search";
import CloseIconModule from "@mui/icons-material/Close";
import SortIconModule from "@mui/icons-material/Sort";
import ScheduleIconModule from "@mui/icons-material/Schedule";
import HourglassEmptyIconModule from "@mui/icons-material/HourglassEmpty";
import CheckCircleIconModule from "@mui/icons-material/CheckCircle";
import LocalShippingIconModule from "@mui/icons-material/LocalShipping";
import CancelIconModule from "@mui/icons-material/Cancel";
import PaymentIconModule from "@mui/icons-material/Payment";
import PhoneIconModule from "@mui/icons-material/Phone";
import PlaceIconModule from "@mui/icons-material/Place";
import ShoppingBagIconModule from "@mui/icons-material/ShoppingBag";
import FilterAltOffIconModule from "@mui/icons-material/FilterAltOff";
import ViewModuleIconModule from "@mui/icons-material/ViewModule";
import BadgeIconModule from "@mui/icons-material/Badge";
import MoneyIconModule from "@mui/icons-material/Paid";
import { normalizeMuiIcon } from "../../muiIcon";
import { scrollAdminContentToTop } from "../../utils/scrollAdminContent";
import { SmartSelect, type SmartSelectOption } from "../../components/SmartSelect";
import { OrderDetailDialog } from "./OrderDetailDialog";

// ─── Icônes normalisées ───
const ReceiptIcon = normalizeMuiIcon(ReceiptLongIconModule);
const VisibilityIcon = normalizeMuiIcon(VisibilityOutlinedIconModule);
const EditIcon = normalizeMuiIcon(EditOutlinedIconModule);
const SearchIcon = normalizeMuiIcon(SearchIconModule);
const CloseIcon = normalizeMuiIcon(CloseIconModule);
const SortIcon = normalizeMuiIcon(SortIconModule);
const ScheduleIcon = normalizeMuiIcon(ScheduleIconModule);
const PendingIcon = normalizeMuiIcon(HourglassEmptyIconModule);
const PaidIcon = normalizeMuiIcon(CheckCircleIconModule);
const ShippedIcon = normalizeMuiIcon(LocalShippingIconModule);
const CancelledIcon = normalizeMuiIcon(CancelIconModule);
const PaymentIcon = normalizeMuiIcon(PaymentIconModule);
const PhoneIcon = normalizeMuiIcon(PhoneIconModule);
const PlaceIcon = normalizeMuiIcon(PlaceIconModule);
const BagIcon = normalizeMuiIcon(ShoppingBagIconModule);
const FilterOffIcon = normalizeMuiIcon(FilterAltOffIconModule);
const ViewModuleIcon = normalizeMuiIcon(ViewModuleIconModule);
const StatusIcon = normalizeMuiIcon(BadgeIconModule);
const MoneyIcon = normalizeMuiIcon(MoneyIconModule);

// ─────────────────────────────────────────────────────────────────────────────
// OPTIONS
// ─────────────────────────────────────────────────────────────────────────────

const SORT_OPTIONS: SmartSelectOption[] = [
  { value: "createdAt:DESC", label: "Plus récentes", icon: ScheduleIcon },
  { value: "createdAt:ASC", label: "Plus anciennes", icon: ScheduleIcon },
  { value: "total:DESC", label: "Montant élevé", icon: MoneyIcon },
  { value: "total:ASC", label: "Montant faible", icon: MoneyIcon },
];

const STATUS_OPTIONS: SmartSelectOption[] = [
  { value: "PENDING", label: "En attente", icon: PendingIcon },
  { value: "PAID", label: "Payées", icon: PaidIcon },
  { value: "SHIPPED", label: "Expédiées", icon: ShippedIcon },
  { value: "DELIVERED", label: "Livrées", icon: PaidIcon },
  { value: "CANCELLED", label: "Annulées", icon: CancelledIcon },
  { value: "COD_PENDING", label: "COD en attente", icon: PendingIcon },
  { value: "COD_FAILED", label: "COD échoué", icon: CancelledIcon },
  { value: "REFUNDED", label: "Remboursées", icon: CancelledIcon },
  { value: "PAYMENT_FAILED", label: "Paiement échoué", icon: CancelledIcon },
];

const PAYMENT_OPTIONS: SmartSelectOption[] = [
  { value: "MOBILE_MONEY", label: "Mobile Money", icon: PaymentIcon },
  { value: "COD", label: "Paiement à la livraison", icon: PaymentIcon },
  { value: "CARD", label: "Carte bancaire", icon: PaymentIcon },
  { value: "BANK_TRANSFERT", label: "Virement", icon: PaymentIcon },
];

const PER_PAGE_OPTIONS = [12, 24, 48, 96];

const PER_PAGE_SELECT_OPTIONS: SmartSelectOption[] = PER_PAGE_OPTIONS.map((n) => ({
  value: String(n),
  label: `${n} / page`,
}));

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    color: "success" | "warning" | "error" | "info" | "default";
    icon: any;
  }
> = {
  PENDING: { label: "En attente", color: "warning", icon: PendingIcon },
  PAID: { label: "Payée", color: "info", icon: PaidIcon },
  SHIPPED: { label: "Expédiée", color: "info", icon: ShippedIcon },
  DELIVERED: { label: "Livrée", color: "success", icon: PaidIcon },
  CANCELLED: { label: "Annulée", color: "error", icon: CancelledIcon },
  COD_PENDING: { label: "COD en attente", color: "warning", icon: PendingIcon },
  COD_FAILED: { label: "COD échoué", color: "error", icon: CancelledIcon },
  REFUNDED: { label: "Remboursée", color: "error", icon: CancelledIcon },
  PAYMENT_FAILED: { label: "Paiement échoué", color: "error", icon: CancelledIcon },
  // Fallback pour les statuts en minuscules
  pending: { label: "En attente", color: "warning", icon: PendingIcon },
  paid: { label: "Payée", color: "info", icon: PaidIcon },
  shipped: { label: "Expédiée", color: "info", icon: ShippedIcon },
  delivered: { label: "Livrée", color: "success", icon: PaidIcon },
  cancelled: { label: "Annulée", color: "error", icon: CancelledIcon },
};

const getStatusConfig = (status: string) =>
  STATUS_CONFIG[status] ?? {
    label: status,
    color: "default" as const,
    icon: PendingIcon,
  };

const PAYMENT_LABELS: Record<string, string> = {
  MOBILE_MONEY: "Mobile Money",
  COD: "À la livraison",
  CARD: "Carte bancaire",
  BANK_TRANSFERT: "Virement",
  mobile_money: "Mobile Money",
  cod: "À la livraison",
  card: "Carte bancaire",
  bank_transfert: "Virement",
};

const getPaymentLabel = (method: string) =>
  PAYMENT_LABELS[method] ?? method ?? "—";

const formatMoney = (value: number | undefined | null) => {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("fr-MG").format(n) + " Ar";
};

const formatDateTime = (date: string | null | undefined) => {
  if (!date) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

// ─────────────────────────────────────────────────────────────────────────────
// CARTE COMMANDE
// ─────────────────────────────────────────────────────────────────────────────

const OrderCard = ({ record, onView, onEdit }: any) => {
  const statusConfig = getStatusConfig(record.status);
  const StatusIconCmp = statusConfig.icon;
  const shipping = record.shipping ?? {};
  const itemsCount = Array.isArray(record.items) ? record.items.length : 0;
  const initial = (shipping.fullName ?? "?").charAt(0).toUpperCase();

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
        position: "relative",
        "&:hover": {
          borderColor: "primary.main",
          boxShadow: (theme) =>
            `0 8px 24px -12px ${alpha(theme.palette.primary.main, 0.3)}`,
          transform: "translateY(-2px)",
        },
      }}
    >
      {/* Bande latérale colorée */}
      <Box
        sx={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          backgroundColor:
            statusConfig.color === "success"
              ? "success.main"
              : statusConfig.color === "error"
                ? "error.main"
                : statusConfig.color === "info"
                  ? "info.main"
                  : "warning.main",
        }}
      />

      <CardContent sx={{ flex: 1, p: 2, pl: 2.5, pb: 1.5 }}>
        {/* Header : numéro + statut */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={1}
          sx={{ mb: 2 }}
        >
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <ReceiptIcon
                sx={{ fontSize: 14, color: "text.secondary", flexShrink: 0 }}
              />
              <Typography
                sx={{ fontFamily: "monospace", fontSize: 11, color: "text.secondary" }}
                noWrap
                title={record.orderNumber ?? record.id}
              >
                {record.orderNumber ??
                  `#${String(record.id).slice(0, 8).toUpperCase()}`}
              </Typography>
            </Stack>
            <Typography
              sx={{
                fontSize: 10.5,
                color: "text.secondary",
                mt: 0.25,
              }}
            >
              {formatDateTime(record.createdAt)}
            </Typography>
          </Box>

          <Chip
            icon={<StatusIconCmp sx={{ fontSize: 12 }} />}
            label={statusConfig.label}
            color={statusConfig.color}
            size="small"
            sx={{
              height: 22,
              fontSize: 10,
              fontWeight: 700,
              flexShrink: 0,
              "& .MuiChip-icon": { color: "inherit" },
              "& .MuiChip-label": { px: 0.75 },
            }}
          />
        </Stack>

        <Divider />

        {/* Client */}
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          sx={{ mt: 2, mb: 2 }}
        >
          <Avatar
            sx={{
              width: 44,
              height: 44,
              fontSize: 17,
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
              sx={{ fontWeight: 700, lineHeight: 1.2, mb: 0.25 }}
              noWrap
              title={shipping.fullName}
            >
              {shipping.fullName ?? "Client inconnu"}
            </Typography>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <PhoneIcon
                sx={{ fontSize: 11, color: "text.secondary", flexShrink: 0 }}
              />
              <Typography
                sx={{ fontSize: 11, color: "text.secondary" }}
                noWrap
              >
                {shipping.phone ?? "—"}
              </Typography>
            </Stack>
          </Box>
        </Stack>

        {/* Détails commande */}
        <Stack spacing={0.75}>
          <Stack direction="row" spacing={1} alignItems="center">
            <BagIcon
              sx={{ fontSize: 14, color: "text.secondary", flexShrink: 0 }}
            />
            <Typography sx={{ fontSize: 11.5, color: "text.secondary" }}>
              <strong>{itemsCount}</strong> article{itemsCount > 1 ? "s" : ""}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <PlaceIcon
              sx={{ fontSize: 14, color: "text.secondary", flexShrink: 0 }}
            />
            <Typography
              sx={{ fontSize: 11.5, color: "text.secondary" }}
              noWrap
              title={`${shipping.city}, ${shipping.region}`}
            >
              {shipping.city ?? "—"}, {shipping.region ?? "—"}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <PaymentIcon
              sx={{ fontSize: 14, color: "text.secondary", flexShrink: 0 }}
            />
            <Typography sx={{ fontSize: 11.5, color: "text.secondary" }}>
              {getPaymentLabel(record.paymentMethod)}
            </Typography>
          </Stack>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* Total */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="baseline"
        >
          <Typography
            sx={{
              fontSize: 10.5,
              color: "text.secondary",
              textTransform: "uppercase",
              letterSpacing: 0.5,
              fontWeight: 700,
            }}
          >
            Total
          </Typography>
          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 800,
              color: "primary.main",
              letterSpacing: "-0.3px",
            }}
          >
            {formatMoney(record.total)}
          </Typography>
        </Stack>
      </CardContent>

      {/* Actions */}
      <CardActions
        sx={{
          px: 1,
          py: 0.75,
          pl: 2.5,
          borderTop: "1px solid",
          borderColor: "divider",
          justifyContent: "space-between",
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
              "&:hover": {
                color: "info.main",
                backgroundColor: "action.hover",
              },
            }}
          >
            <VisibilityIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Gérer la commande" arrow>
          <IconButton
            size="small"
            onClick={onEdit}
            sx={{
              color: "text.secondary",
              width: 30,
              height: 30,
              "&:hover": {
                color: "primary.main",
                backgroundColor: "action.hover",
              },
            }}
          >
            <EditIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};


const OrderSkeleton = () => (
  <Card
    elevation={0}
    sx={{
      border: "1px solid",
      borderColor: "divider",
      borderRadius: 2.5,
      overflow: "hidden",
    }}
  >
    <CardContent sx={{ p: 2, pl: 2.5 }}>
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="50%" height={14} />
          <Skeleton variant="text" width="40%" height={12} />
        </Box>
        <Skeleton variant="rounded" width={70} height={22} />
      </Stack>
      <Stack direction="row" spacing={1.5} sx={{ mb: 2 }}>
        <Skeleton variant="circular" width={44} height={44} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="50%" />
        </Box>
      </Stack>
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="70%" />
      <Skeleton variant="text" width="40%" />
    </CardContent>
  </Card>
);

// ─────────────────────────────────────────────────────────────────────────────
// PAGINATION
// ─────────────────────────────────────────────────────────────────────────────

const OrderPagination = ({
  page,
  perPage,
  total,
  onPageChange,
  onPerPageChange,
}: {
  page: number;
  perPage: number;
  total: number;
  onPageChange: (p: number) => void;
  onPerPageChange: (pp: number) => void;
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
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: 12.5 }}
          >
            <strong>{total}</strong> commande{total > 1 ? "s" : ""}
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

const OrderFilterBar = ({
  searchValue,
  onSearchChange,
  sortValue,
  onSortChange,
  statusValue,
  onStatusChange,
  paymentValue,
  onPaymentChange,
  onResetFilters,
  hasActiveFilters,
}: any) => {
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
        {/* Recherche */}
        <TextField
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Rechercher…"
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

        {/* Tri */}
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

        {/* Statut */}
        <SmartSelect
          placeholder="Statut"
          icon={StatusIcon}
          iconColor="warning.main"
          options={STATUS_OPTIONS}
          value={statusValue}
          onChange={onStatusChange}
          minWidth={180}
          maxWidth={220}
        />

        {/* Paiement */}
        <SmartSelect
          placeholder="Paiement"
          icon={PaymentIcon}
          iconColor="info.main"
          options={PAYMENT_OPTIONS}
          value={paymentValue}
          onChange={onPaymentChange}
          minWidth={180}
          maxWidth={220}
        />

        {/* Reset */}
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

const OrderGrid = () => {
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
  const redirect = useRedirect();

  const [searchValue, setSearchValue] = useState(
    (filterValues.search as string) ?? ""
  );
  const [sortValue, setSortValue] = useState("createdAt:DESC");
  const [statusValue, setStatusValue] = useState(
    (filterValues.status as string) ?? ""
  );
  const [paymentValue, setPaymentValue] = useState(
    (filterValues.paymentMethod as string) ?? ""
  );
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const hasActiveFilters =
    Boolean(searchValue) ||
    Boolean(statusValue) ||
    Boolean(paymentValue);

  const applyFilters = (overrides: Record<string, any> = {}) => {
    const next: Record<string, any> = {
      ...filterValues,
      search: searchValue || undefined,
      status: statusValue || undefined,
      paymentMethod: paymentValue || undefined,
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

  const handlePaymentChange = (value: string) => {
    setPaymentValue(value);
    applyFilters({ paymentMethod: value || undefined });
  };

  const handleResetFilters = () => {
    setSearchValue("");
    setStatusValue("");
    setPaymentValue("");
    setFilters({}, {});
    setPage(1);
  };

  const handleEdit = (id: string) => redirect("edit", "orders", id);
  const handleView = (record: any) => {
    setSelectedOrder(record);
    setDetailOpen(true);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Title title="Commandes" />

      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.25 }}>
            Commandes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Suivez et gérez toutes les commandes de votre boutique.
          </Typography>
        </Box>
      </Stack>

      {/* Filtres */}
      <OrderFilterBar
        searchValue={searchValue}
        onSearchChange={handleSearch}
        sortValue={sortValue}
        onSortChange={handleSort}
        statusValue={statusValue}
        onStatusChange={handleStatusChange}
        paymentValue={paymentValue}
        onPaymentChange={handlePaymentChange}
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
            <OrderSkeleton key={i} />
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
            <ReceiptIcon sx={{ fontSize: 30 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
            {hasActiveFilters
              ? "Aucune commande trouvée"
              : "Aucune commande"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {hasActiveFilters
              ? "Aucun résultat pour ces critères. Essayez de modifier les filtres."
              : "Les commandes apparaîtront ici dès que vos clients passeront commande."}
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
              <OrderCard
                key={record.id}
                record={record}
                onView={() => handleView(record)}
                onEdit={() => handleEdit(record.id)}
              />
            ))}
          </Box>

          <OrderPagination
            page={page}
            perPage={perPage}
            total={total ?? 0}
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
      <OrderDetailDialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        record={selectedOrder}
        onEdit={() => {
          if (selectedOrder) {
            setDetailOpen(false);
            handleEdit(selectedOrder.id);
          }
        }}
      />
    </Box>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export const OrderList = () => (
  <List
    perPage={24}
    sort={{ field: "createdAt", order: "DESC" }}
    actions={false}
    pagination={false}
    filterDefaultValues={{}}
  >
    <OrderGrid />
  </List>
);