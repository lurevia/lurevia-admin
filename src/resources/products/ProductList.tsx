import {
  List,
  useListContext,
  useRedirect,
  useGetList,
  useGetOne,
  Title,
} from "react-admin";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Alert,
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
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import InventoryIconModule from "@mui/icons-material/Inventory2";
import EditOutlinedIconModule from "@mui/icons-material/EditOutlined";
import DeleteOutlineIconModule from "@mui/icons-material/DeleteOutline";
import AddIconModule from "@mui/icons-material/Add";
import SearchIconModule from "@mui/icons-material/Search";
import StarIconModule from "@mui/icons-material/Star";
import WarningAmberIconModule from "@mui/icons-material/WarningAmber";
import CloseIconModule from "@mui/icons-material/Close";
import CategoryIconModule from "@mui/icons-material/Category";
import ArrowBackIconModule from "@mui/icons-material/ArrowBack";
import ScheduleIconModule from "@mui/icons-material/Schedule";
import AttachMoneyIconModule from "@mui/icons-material/AttachMoney";
import StarOutlineIconModule from "@mui/icons-material/StarOutline";
import SortIconModule from "@mui/icons-material/Sort";
import VisibilityOutlinedIconModule from "@mui/icons-material/VisibilityOutlined";
import LocalOfferIconModule from "@mui/icons-material/LocalOffer";
import Inventory2IconModule from "@mui/icons-material/Inventory2";
import ErrorOutlineIconModule from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIconModule from "@mui/icons-material/CheckCircleOutline";
import TrendingUpIconModule from "@mui/icons-material/TrendingUp";
import NewReleasesIconModule from "@mui/icons-material/NewReleases";
import FilterAltOffIconModule from "@mui/icons-material/FilterAltOff";
import ViewModuleIconModule from "@mui/icons-material/ViewModule";
import { normalizeMuiIcon } from "../../muiIcon";
import { scrollAdminContentToTop } from "../../utils/scrollAdminContent";
import { SmartSelect, type SmartSelectOption } from "../../components/SmartSelect";
import { ProductDetailDialog } from "./ProductDetailDialog";

// ─── Icônes normalisées ───
const InventoryIcon = normalizeMuiIcon(InventoryIconModule);
const EditIcon = normalizeMuiIcon(EditOutlinedIconModule);
const DeleteIcon = normalizeMuiIcon(DeleteOutlineIconModule);
const AddIcon = normalizeMuiIcon(AddIconModule);
const SearchIcon = normalizeMuiIcon(SearchIconModule);
const StarIcon = normalizeMuiIcon(StarIconModule);
const WarningIcon = normalizeMuiIcon(WarningAmberIconModule);
const CloseIcon = normalizeMuiIcon(CloseIconModule);
const CategoryIcon = normalizeMuiIcon(CategoryIconModule);
const ArrowBackIcon = normalizeMuiIcon(ArrowBackIconModule);
const ScheduleIcon = normalizeMuiIcon(ScheduleIconModule);
const MoneyIcon = normalizeMuiIcon(AttachMoneyIconModule);
const StarOutlineIcon = normalizeMuiIcon(StarOutlineIconModule);
const SortIcon = normalizeMuiIcon(SortIconModule);
const VisibilityIcon = normalizeMuiIcon(VisibilityOutlinedIconModule);
const PromoIcon = normalizeMuiIcon(LocalOfferIconModule);
const StockIcon = normalizeMuiIcon(Inventory2IconModule);
const LowStockIcon = normalizeMuiIcon(ErrorOutlineIconModule);
const InStockIcon = normalizeMuiIcon(CheckCircleOutlineIconModule);
const PopularIcon = normalizeMuiIcon(TrendingUpIconModule);
const NewIcon = normalizeMuiIcon(NewReleasesIconModule);
const FilterOffIcon = normalizeMuiIcon(FilterAltOffIconModule);
const ViewModuleIcon = normalizeMuiIcon(ViewModuleIconModule);

// ─────────────────────────────────────────────────────────────────────────────
// OPTIONS DE FILTRES
// ─────────────────────────────────────────────────────────────────────────────

const SORT_OPTIONS: SmartSelectOption[] = [
  { value: "createdAt:DESC", label: "Plus récents", icon: ScheduleIcon },
  { value: "createdAt:ASC", label: "Plus anciens", icon: ScheduleIcon },
  { value: "price:ASC", label: "Prix croissant", icon: MoneyIcon },
  { value: "price:DESC", label: "Prix décroissant", icon: MoneyIcon },
  { value: "stock:ASC", label: "Stock faible", icon: StockIcon },
  { value: "stock:DESC", label: "Stock élevé", icon: StockIcon },
  { value: "ratingCache:DESC", label: "Mieux notés", icon: StarOutlineIcon },
];

const PRICE_RANGE_OPTIONS: SmartSelectOption[] = [
  { value: "0-50000", label: "Moins de 50 000 Ar", icon: MoneyIcon },
  { value: "50000-100000", label: "50 000 – 100 000 Ar", icon: MoneyIcon },
  { value: "100000-500000", label: "100 000 – 500 000 Ar", icon: MoneyIcon },
  { value: "500000-99999999", label: "Plus de 500 000 Ar", icon: MoneyIcon },
];

const STOCK_OPTIONS: SmartSelectOption[] = [
  { value: "out", label: "En rupture", icon: LowStockIcon },
  { value: "low", label: "Stock faible", icon: LowStockIcon },
  { value: "in", label: "En stock", icon: InStockIcon },
  { value: "high", label: "Stock élevé", icon: StockIcon },
];

const STATUS_OPTIONS: SmartSelectOption[] = [
  { value: "new", label: "Nouveautés", icon: NewIcon },
  { value: "promo", label: "En promotion", icon: PromoIcon },
  { value: "popular", label: "Populaires", icon: PopularIcon },
];

const PER_PAGE_OPTIONS = [12, 24, 48, 96];

const PER_PAGE_SELECT_OPTIONS: SmartSelectOption[] = PER_PAGE_OPTIONS.map((n) => ({
  value: String(n),
  label: `${n} / page`,
}));

// ─────────────────────────────────────────────────────────────────────────────
// CARTE PRODUIT — VERSION COMPACTE
// ─────────────────────────────────────────────────────────────────────────────

const ProductCard = ({ record, onView, onEdit, onDelete }: any) => {
  const mainImage =
    Array.isArray(record.images) && record.images.length > 0
      ? record.images[0]?.url ?? record.images[0]
      : record.imageUrl;

  const stock = record.stock ?? 0;
  const isLowStock = stock <= (record.lowStockThreshold ?? 5) && stock > 0;
  const isOutOfStock = stock === 0;
  const rating = record.ratingCache ?? 0;
  const reviewCount = record.reviewCountCache ?? 0;

  const price = record.price ?? 0;
  const originalPrice = record.originalPrice;
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const formatPrice = (n: number) =>
    new Intl.NumberFormat("fr-MG").format(n) + " Ar";

  return (
    <Card
      elevation={0}
      sx={{
        display: "flex",
        flexDirection: "column",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        overflow: "hidden",
        height: "100%",
        transition: "all 0.2s ease",
        position: "relative",
        "&:hover": {
          borderColor: "primary.main",
          boxShadow: (theme) =>
            `0 6px 18px -10px ${alpha(theme.palette.primary.main, 0.3)}`,
          transform: "translateY(-2px)",
          "& .product-actions": { opacity: 1 },
        },
      }}
    >
      <Stack
        direction="row"
        spacing={0.5}
        sx={{ position: "absolute", top: 8, left: 8, zIndex: 2 }}
      >
        {record.isNew && (
          <Chip
            label="NOUVEAU"
            size="small"
            sx={{
              height: 18,
              fontSize: 8.5,
              fontWeight: 800,
              letterSpacing: 0.5,
              backgroundColor: "primary.main",
              color: "primary.contrastText",
              "& .MuiChip-label": { px: 0.75 },
            }}
          />
        )}
        {hasDiscount && (
          <Chip
            label={`-${discountPercent}%`}
            size="small"
            sx={{
              height: 18,
              fontSize: 8.5,
              fontWeight: 800,
              backgroundColor: "error.main",
              color: "#FFFFFF",
              "& .MuiChip-label": { px: 0.75 },
            }}
          />
        )}
      </Stack>

      {isOutOfStock && (
        <Chip
          label="RUPTURE"
          size="small"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 2,
            height: 18,
            fontSize: 8.5,
            fontWeight: 800,
            backgroundColor: "error.main",
            color: "#FFFFFF",
            "& .MuiChip-label": { px: 0.75 },
          }}
        />
      )}

      <Box
        sx={{
          position: "relative",
          aspectRatio: "4 / 3",
          backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.04),
          overflow: "hidden",
          cursor: "pointer",
        }}
        onClick={onView}
      >
        {mainImage ? (
          <Box
            component="img"
            src={mainImage}
            alt={record.title}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.3s ease",
            }}
          />
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "text.secondary",
            }}
          >
            <InventoryIcon sx={{ fontSize: 32, opacity: 0.3 }} />
          </Box>
        )}

        <Box
          className="product-actions"
          sx={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.75,
            opacity: 0,
            transition: "opacity 0.2s ease",
          }}
        >
          <Tooltip title="Voir le détail" arrow>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onView();
              }}
              sx={{
                backgroundColor: "rgba(255,255,255,0.9)",
                color: "text.primary",
                width: 32,
                height: 32,
                "&:hover": { backgroundColor: "#FFFFFF" },
              }}
            >
              <VisibilityIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Modifier" arrow>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              sx={{
                backgroundColor: "rgba(255,255,255,0.9)",
                color: "primary.main",
                width: 32,
                height: 32,
                "&:hover": { backgroundColor: "#FFFFFF" },
              }}
            >
              <EditIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <CardContent sx={{ flex: 1, p: 1.25, pb: 0.75, "&:last-child": { pb: 0.75 } }}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", fontFamily: "monospace", fontSize: 9.5, mb: 0.25 }}
          noWrap
        >
          {record.sku}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
            lineHeight: 1.3,
            mb: 0.75,
            fontSize: 12.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: 32,
          }}
          title={record.title}
        >
          {record.title}
        </Typography>

        <Stack direction="row" spacing={0.75} alignItems="baseline" sx={{ mb: 0.75 }}>
          <Typography
            sx={{
              fontSize: 13.5,
              fontWeight: 800,
              color: "primary.main",
              letterSpacing: "-0.3px",
            }}
          >
            {formatPrice(price)}
          </Typography>
          {hasDiscount && (
            <Typography
              sx={{
                fontSize: 10,
                color: "text.secondary",
                textDecoration: "line-through",
              }}
            >
              {formatPrice(originalPrice)}
            </Typography>
          )}
        </Stack>

        <Stack
          direction="row"
          spacing={0.75}
          alignItems="center"
          justifyContent="space-between"
        >
          {reviewCount > 0 ? (
            <Stack direction="row" spacing={0.25} alignItems="center">
              <StarIcon sx={{ fontSize: 12, color: "#FDB022" }} />
              <Typography sx={{ fontSize: 10.5, fontWeight: 600 }}>
                {rating.toFixed(1)}
              </Typography>
              <Typography sx={{ fontSize: 10, color: "text.secondary" }}>
                ({reviewCount})
              </Typography>
            </Stack>
          ) : (
            <Typography sx={{ fontSize: 10, color: "text.secondary" }}>
              Aucun avis
            </Typography>
          )}

          {isOutOfStock ? (
            <Chip
              icon={<WarningIcon sx={{ fontSize: 10 }} />}
              label="Rupture"
              size="small"
              sx={{
                height: 17,
                fontSize: 9,
                fontWeight: 700,
                backgroundColor: "error.light",
                color: "error.dark",
                "& .MuiChip-icon": { color: "inherit", ml: 0.5 },
                "& .MuiChip-label": { px: 0.5 },
              }}
            />
          ) : isLowStock ? (
            <Chip
              icon={<WarningIcon sx={{ fontSize: 10 }} />}
              label={`${stock}`}
              size="small"
              sx={{
                height: 17,
                fontSize: 9,
                fontWeight: 700,
                backgroundColor: "warning.light",
                color: "warning.dark",
                "& .MuiChip-icon": { color: "inherit", ml: 0.5 },
                "& .MuiChip-label": { px: 0.5 },
              }}
            />
          ) : (
            <Typography sx={{ fontSize: 10, color: "text.secondary" }}>
              Stock : {stock}
            </Typography>
          )}
        </Stack>
      </CardContent>

      <CardActions
        sx={{
          px: 1,
          py: 0.75,
          borderTop: "1px solid",
          borderColor: "divider",
          justifyContent: "space-between",
          gap: 0.5,
        }}
      >
        <Tooltip title="Voir le détail" arrow>
          <IconButton
            size="small"
            onClick={onView}
            sx={{
              color: "text.secondary",
              width: 28,
              height: 28,
              "&:hover": { color: "info.main", backgroundColor: "action.hover" },
            }}
          >
            <VisibilityIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>

        <Stack direction="row" spacing={0.25}>
          <Tooltip title="Modifier" arrow>
            <IconButton
              size="small"
              onClick={onEdit}
              sx={{
                color: "text.secondary",
                width: 28,
                height: 28,
                "&:hover": { color: "primary.main", backgroundColor: "action.hover" },
              }}
            >
              <EditIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Supprimer" arrow>
            <IconButton
              size="small"
              onClick={onDelete}
              sx={{
                color: "text.secondary",
                width: 28,
                height: 28,
                "&:hover": { color: "error.main", backgroundColor: "action.hover" },
              }}
            >
              <DeleteIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Stack>
      </CardActions>
    </Card>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON
// ─────────────────────────────────────────────────────────────────────────────

const ProductSkeleton = () => (
  <Card
    elevation={0}
    sx={{
      border: "1px solid",
      borderColor: "divider",
      borderRadius: 2,
      overflow: "hidden",
    }}
  >
    <Skeleton variant="rectangular" sx={{ aspectRatio: "4 / 3" }} />
    <CardContent sx={{ p: 1.25 }}>
      <Skeleton variant="text" width="40%" height={14} />
      <Skeleton variant="text" width="90%" />
      <Skeleton variant="text" width="60%" />
    </CardContent>
  </Card>
);

// ─────────────────────────────────────────────────────────────────────────────
// PAGINATION
// ─────────────────────────────────────────────────────────────────────────────

const PaginationBar = ({
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
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12.5 }}>
            <strong>{total}</strong> produit{total > 1 ? "s" : ""}
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
// BARRE DE FILTRES COMPACTE (1 SEULE LIGNE)
// ─────────────────────────────────────────────────────────────────────────────

const FilterBar = ({
  searchValue,
  onSearchChange,
  sortValue,
  onSortChange,
  categoryId,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  stockFilter,
  onStockChange,
  statusFilter,
  onStatusChange,
  onResetFilters,
  hasActiveFilters,
}: any) => {
  const { data: categories } = useGetList("categories", {
    pagination: { page: 1, perPage: 100 },
    sort: { field: "position", order: "ASC" },
  });

  const categoryOptions: SmartSelectOption[] = (categories ?? []).map((c: any) => ({
    value: c.id,
    label: c.name,
    icon: CategoryIcon,
  }));

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

        {/* Catégorie */}
        <SmartSelect
          placeholder="Catégorie"
          icon={CategoryIcon}
          iconColor="info.main"
          options={categoryOptions}
          value={categoryId ?? ""}
          onChange={(v) => onCategoryChange(v || null)}
          minWidth={180}
          maxWidth={220}
        />

        {/* Prix */}
        <SmartSelect
          placeholder="Prix"
          icon={MoneyIcon}
          iconColor="success.main"
          options={PRICE_RANGE_OPTIONS}
          value={priceRange}
          onChange={onPriceRangeChange}
          minWidth={170}
          maxWidth={210}
        />

        {/* Stock */}
        <SmartSelect
          placeholder="Stock"
          icon={StockIcon}
          iconColor="warning.main"
          options={STOCK_OPTIONS}
          value={stockFilter}
          onChange={onStockChange}
          minWidth={150}
          maxWidth={190}
        />

        {/* Statut */}
        <SmartSelect
          placeholder="Statut"
          icon={PromoIcon}
          iconColor="error.main"
          options={STATUS_OPTIONS}
          value={statusFilter}
          onChange={onStatusChange}
          minWidth={160}
          maxWidth={200}
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

const ProductGrid = () => {
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
  const location = useLocation();
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(location.search);
  const categoryIdFromUrl = urlParams.get("categoryId");

  const { data: activeCategory } = useGetOne(
    "categories",
    { id: categoryIdFromUrl ?? "" },
    { enabled: Boolean(categoryIdFromUrl) }
  );

  const [searchValue, setSearchValue] = useState(
    (filterValues.search as string) ?? ""
  );
  const [sortValue, setSortValue] = useState("createdAt:DESC");
  const [priceRange, setPriceRange] = useState(
    (filterValues.priceRange as string) ?? ""
  );
  const [stockFilter, setStockFilter] = useState(
    (filterValues.stock as string) ?? ""
  );
  const [statusFilter, setStatusFilter] = useState(
    (filterValues.status as string) ?? ""
  );
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const hasActiveFilters =
    Boolean(searchValue) ||
    Boolean(categoryIdFromUrl) ||
    Boolean(priceRange) ||
    Boolean(stockFilter) ||
    Boolean(statusFilter);

  useEffect(() => {
    if (categoryIdFromUrl && filterValues.categoryId !== categoryIdFromUrl) {
      setFilters({ ...filterValues, categoryId: categoryIdFromUrl }, {});
    }
  }, [categoryIdFromUrl]);

  const applyFilters = (overrides: Record<string, any> = {}) => {
    const next: Record<string, any> = {
      ...filterValues,
      search: searchValue || undefined,
      categoryId: categoryIdFromUrl || undefined,
      priceRange: priceRange || undefined,
      stock: stockFilter || undefined,
      status: statusFilter || undefined,
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

  const handleCategoryChange = (id: string | null) => {
    const url = new URL(window.location.href);
    if (id) url.searchParams.set("categoryId", id);
    else url.searchParams.delete("categoryId");
    navigate(url.pathname + url.search, { replace: true });
    setFilters({ ...filterValues, categoryId: id ?? undefined }, {});
    setPage(1);
  };

  const handlePriceRangeChange = (value: string) => {
    setPriceRange(value);
    applyFilters({ priceRange: value || undefined });
  };

  const handleStockChange = (value: string) => {
    setStockFilter(value);
    applyFilters({ stock: value || undefined });
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    applyFilters({ status: value || undefined });
  };

  const handleResetFilters = () => {
    setSearchValue("");
    setPriceRange("");
    setStockFilter("");
    setStatusFilter("");
    const url = new URL(window.location.href);
    url.searchParams.delete("categoryId");
    navigate(url.pathname + url.search, { replace: true });
    setFilters({}, {});
    setPage(1);
  };

  const handleBackToAllCategories = () => navigate("/categories");
  const handleEdit = (id: string) => redirect("edit", "products", id);
  const handleDelete = (id: string) => redirect("delete", "products", id);
  const handleCreate = () => {
    const url = categoryIdFromUrl
      ? `/products/create?categoryId=${categoryIdFromUrl}`
      : "/products/create";
    navigate(url);
  };

  const handleView = (record: any) => {
    setSelectedProduct(record);
    setDetailOpen(true);
  };

  const pageTitle = activeCategory?.name ?? "Tous les produits";
  const pageSubtitle = activeCategory
    ? activeCategory.description ?? `${total ?? 0} produit(s) dans cette catégorie.`
    : `${total ?? 0} produit(s) disponibles dans votre catalogue.`;

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Title title={pageTitle} />

      {activeCategory && (
        <Button
          size="small"
          startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
          onClick={handleBackToAllCategories}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            fontSize: 12.5,
            color: "text.secondary",
            mb: 1.5,
            ml: -1,
            "&:hover": { color: "primary.main", backgroundColor: "transparent" },
          }}
        >
          Retour aux catégories
        </Button>
      )}

      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "flex-start" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" alignItems="center" spacing={1.25}>
            {activeCategory && (
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1.5,
                  overflow: "hidden",
                  flexShrink: 0,
                  backgroundColor: (theme) =>
                    alpha(theme.palette.primary.main, 0.08),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {activeCategory.imageUrl ? (
                  <Box
                    component="img"
                    src={activeCategory.imageUrl}
                    alt={activeCategory.name}
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <CategoryIcon sx={{ fontSize: 20, color: "primary.main" }} />
                )}
              </Box>
            )}
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="h5"
                sx={{ fontWeight: 800, mb: 0.25 }}
                noWrap
                title={pageTitle}
              >
                {pageTitle}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {pageSubtitle}
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
          sx={{
            textTransform: "none",
            fontWeight: 700,
            borderRadius: 1.5,
            boxShadow: "none",
            alignSelf: { xs: "stretch", sm: "center" },
            flexShrink: 0,
          }}
        >
          Nouveau produit
        </Button>
      </Stack>

      {categoryIdFromUrl && activeCategory && (
        <Alert
          severity="info"
          icon={<CategoryIcon sx={{ fontSize: 18 }} />}
          onClose={() => handleCategoryChange(null)}
          sx={{
            mb: 2.5,
            borderRadius: 2,
            alignItems: "center",
            "& .MuiAlert-message": { width: "100%" },
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
            sx={{ width: "100%" }}
          >
            <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
              Filtre actif : <strong>{activeCategory.name}</strong>
            </Typography>
            <Chip
              label={`${total ?? 0} produit${(total ?? 0) > 1 ? "s" : ""}`}
              size="small"
              sx={{ height: 22, fontSize: 11, fontWeight: 600 }}
            />
          </Stack>
        </Alert>
      )}

      <FilterBar
        searchValue={searchValue}
        onSearchChange={handleSearch}
        sortValue={sortValue}
        onSortChange={handleSort}
        categoryId={categoryIdFromUrl}
        onCategoryChange={handleCategoryChange}
        priceRange={priceRange}
        onPriceRangeChange={handlePriceRangeChange}
        stockFilter={stockFilter}
        onStockChange={handleStockChange}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {isLoading ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              sm: "repeat(3, 1fr)",
              md: "repeat(4, 1fr)",
              lg: "repeat(5, 1fr)",
              xl: "repeat(6, 1fr)",
            },
            gap: 1.5,
          }}
        >
          {Array.from({ length: perPage }).map((_, i) => (
            <ProductSkeleton key={i} />
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
            <InventoryIcon sx={{ fontSize: 30 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
            Aucun produit
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {hasActiveFilters
              ? "Aucun résultat pour ces critères. Essayez de modifier les filtres."
              : "Ajoutez votre premier produit pour enrichir votre catalogue."}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
            sx={{ textTransform: "none", fontWeight: 700, borderRadius: 1.5 }}
          >
            Ajouter un produit
          </Button>
        </Card>
      ) : (
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(3, 1fr)",
                md: "repeat(4, 1fr)",
                lg: "repeat(5, 1fr)",
                xl: "repeat(6, 1fr)",
              },
              gap: 1.5,
            }}
          >
            {data.map((record: any) => (
              <ProductCard
                key={record.id}
                record={record}
                onView={() => handleView(record)}
                onEdit={() => handleEdit(record.id)}
                onDelete={() => handleDelete(record.id)}
              />
            ))}
          </Box>

          <PaginationBar
            page={page}
            perPage={perPage}
            total={total ?? 0}
            onPageChange={(p) => {
              setPage(p);
              scrollAdminContentToTop();
            }}
            onPerPageChange={(pp) => {
              setPerPage(pp);
              setPage(1);
            }}
          />
        </>
      )}

      <ProductDetailDialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        record={selectedProduct}
        onEdit={() => {
          if (selectedProduct) {
            setDetailOpen(false);
            handleEdit(selectedProduct.id);
          }
        }}
      />
    </Box>
  );
};


export const ProductList = () => (
  <List
    perPage={24}
    sort={{ field: "createdAt", order: "DESC" }}
    actions={false}
    pagination={false}
    filterDefaultValues={{}}
  >
    <ProductGrid />
  </List>
);