import { List, useListContext, useRedirect, Title } from "react-admin";
import { useState } from "react";
import {
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
import CategoryIconModule from "@mui/icons-material/Category";
import EditOutlinedIconModule from "@mui/icons-material/EditOutlined";
import DeleteOutlineIconModule from "@mui/icons-material/DeleteOutline";
import AddIconModule from "@mui/icons-material/Add";
import InventoryIconModule from "@mui/icons-material/Inventory2";
import ArrowForwardIconModule from "@mui/icons-material/ArrowForward";
import SearchIconModule from "@mui/icons-material/Search";
import CloseIconModule from "@mui/icons-material/Close";
import SortIconModule from "@mui/icons-material/Sort";
import ScheduleIconModule from "@mui/icons-material/Schedule";
import SortByAlphaIconModule from "@mui/icons-material/SortByAlpha";
import StarOutlineIconModule from "@mui/icons-material/StarOutline";
import TrendingUpIconModule from "@mui/icons-material/TrendingUp";
import FilterAltOffIconModule from "@mui/icons-material/FilterAltOff";
import ViewModuleIconModule from "@mui/icons-material/ViewModule";
import Inventory2IconModule from "@mui/icons-material/Inventory2";
import { normalizeMuiIcon } from "../../muiIcon";
import { SmartSelect, type SmartSelectOption } from "../../components/SmartSelect";

// ─── Icônes normalisées ───
const CategoryIcon = normalizeMuiIcon(CategoryIconModule);
const EditIcon = normalizeMuiIcon(EditOutlinedIconModule);
const DeleteIcon = normalizeMuiIcon(DeleteOutlineIconModule);
const AddIcon = normalizeMuiIcon(AddIconModule);
const InventoryIcon = normalizeMuiIcon(InventoryIconModule);
const ArrowForwardIcon = normalizeMuiIcon(ArrowForwardIconModule);
const SearchIcon = normalizeMuiIcon(SearchIconModule);
const CloseIcon = normalizeMuiIcon(CloseIconModule);
const SortIcon = normalizeMuiIcon(SortIconModule);
const ScheduleIcon = normalizeMuiIcon(ScheduleIconModule);
const AlphaIcon = normalizeMuiIcon(SortByAlphaIconModule);
const PopularIcon = normalizeMuiIcon(StarOutlineIconModule);
const TrendingIcon = normalizeMuiIcon(TrendingUpIconModule);
const FilterOffIcon = normalizeMuiIcon(FilterAltOffIconModule);
const ViewModuleIcon = normalizeMuiIcon(ViewModuleIconModule);
const StockIcon = normalizeMuiIcon(Inventory2IconModule);

// ─────────────────────────────────────────────────────────────────────────────
// OPTIONS
// ─────────────────────────────────────────────────────────────────────────────

const SORT_OPTIONS: SmartSelectOption[] = [
  { value: "position:ASC", label: "Ordre personnalisé", icon: SortIcon },
  { value: "name:ASC", label: "Nom (A → Z)", icon: AlphaIcon },
  { value: "name:DESC", label: "Nom (Z → A)", icon: AlphaIcon },
  { value: "createdAt:DESC", label: "Plus récentes", icon: ScheduleIcon },
  { value: "createdAt:ASC", label: "Plus anciennes", icon: ScheduleIcon },
];

const PRODUCT_COUNT_OPTIONS: SmartSelectOption[] = [
  { value: "empty", label: "Vides (0 produit)", icon: StockIcon },
  { value: "few", label: "1 à 5 produits", icon: StockIcon },
  { value: "many", label: "Plus de 5 produits", icon: TrendingIcon },
];

const PER_PAGE_OPTIONS = [8, 12, 24, 48];

const PER_PAGE_SELECT_OPTIONS: SmartSelectOption[] = PER_PAGE_OPTIONS.map((n) => ({
  value: String(n),
  label: `${n} / page`,
}));

// ─────────────────────────────────────────────────────────────────────────────
// CARTE CATÉGORIE
// ─────────────────────────────────────────────────────────────────────────────

interface CategoryCardProps {
  record: any;
  productCount: number;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const CategoryCard = ({
  record,
  productCount,
  onOpen,
  onEdit,
  onDelete,
}: CategoryCardProps) => {
  return (
    <Card
      elevation={0}
      onClick={onOpen}
      sx={{
        display: "flex",
        flexDirection: "column",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2.5,
        overflow: "hidden",
        height: "100%",
        cursor: "pointer",
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: "primary.main",
          boxShadow: (theme) =>
            `0 8px 24px -12px ${alpha(theme.palette.primary.main, 0.3)}`,
          transform: "translateY(-2px)",
          "& .category-arrow": { opacity: 1, transform: "translateX(0)" },
        },
      }}
    >
      {/* Bandeau bannière */}
      <Box
        sx={{
          position: "relative",
          height: 72,
          backgroundImage: record.bannerUrl
            ? `url(${record.bannerUrl})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: (theme) =>
            record.bannerUrl
              ? "transparent"
              : alpha(theme.palette.primary.main, 0.08),
        }}
      >
        {/* Avatar rond chevauchant */}
        <Box
          sx={{
            position: "absolute",
            bottom: -28,
            left: 16,
            width: 56,
            height: 56,
            borderRadius: "50%",
            overflow: "hidden",
            border: "3px solid",
            borderColor: "background.paper",
            backgroundColor: "background.paper",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          {record.imageUrl ? (
            <Box
              component="img"
              src={record.imageUrl}
              alt={record.name}
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <CategoryIcon sx={{ fontSize: 26, color: "primary.main" }} />
          )}
        </Box>
      </Box>

      {/* Contenu */}
      <CardContent sx={{ pt: 5, pb: 1.5, flex: 1 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, lineHeight: 1.3, mb: 0.25 }}
            noWrap
            title={record.name}
          >
            {record.name}
          </Typography>

          <ArrowForwardIcon
            className="category-arrow"
            sx={{
              fontSize: 18,
              color: "primary.main",
              opacity: 0,
              transform: "translateX(-6px)",
              transition: "all 0.2s ease",
              flexShrink: 0,
            }}
          />
        </Stack>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", fontFamily: "monospace", mb: 1 }}
          noWrap
        >
          /{record.slug}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontSize: 12.5,
            lineHeight: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: 36,
          }}
        >
          {record.description || "Aucune description."}
        </Typography>

        <Stack direction="row" spacing={0.75} sx={{ mt: 1.5 }} flexWrap="wrap">
          <Chip
            icon={<InventoryIcon sx={{ fontSize: 14 }} />}
            label={`${productCount} produit${productCount !== 1 ? "s" : ""}`}
            size="small"
            sx={{
              height: 22,
              fontSize: 11,
              fontWeight: 600,
              "& .MuiChip-icon": { color: "inherit" },
            }}
          />
        </Stack>
      </CardContent>

      {/* Actions */}
      <CardActions
        sx={{
          px: 1.5,
          py: 1,
          borderTop: "1px solid",
          borderColor: "divider",
          justifyContent: "flex-end",
          gap: 0.5,
        }}
      >
        <Tooltip title="Modifier">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            sx={{
              color: "text.secondary",
              "&:hover": {
                color: "primary.main",
                backgroundColor: "action.hover",
              },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Supprimer">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            sx={{
              color: "text.secondary",
              "&:hover": {
                color: "error.main",
                backgroundColor: "action.hover",
              },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON
// ─────────────────────────────────────────────────────────────────────────────

const CategorySkeleton = () => (
  <Card
    elevation={0}
    sx={{
      border: "1px solid",
      borderColor: "divider",
      borderRadius: 2.5,
      overflow: "hidden",
      height: 240,
    }}
  >
    <Skeleton variant="rectangular" height={72} />
    <CardContent sx={{ pt: 5 }}>
      <Skeleton variant="text" width="70%" />
      <Skeleton variant="text" width="40%" />
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width="90%" />
    </CardContent>
  </Card>
);

// ─────────────────────────────────────────────────────────────────────────────
// PAGINATION
// ─────────────────────────────────────────────────────────────────────────────

const CategoryPagination = ({
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
            <strong>{total}</strong> catégorie{total > 1 ? "s" : ""}
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
// BARRE DE FILTRES COMPACTE
// ─────────────────────────────────────────────────────────────────────────────

const CategoryFilterBar = ({
  searchValue,
  onSearchChange,
  sortValue,
  onSortChange,
  productCountFilter,
  onProductCountChange,
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
          minWidth={190}
          maxWidth={230}
          clearable={false}
          disableSearch
        />

        {/* Nombre de produits */}
        <SmartSelect
          placeholder="Produits"
          icon={StockIcon}
          iconColor="info.main"
          options={PRODUCT_COUNT_OPTIONS}
          value={productCountFilter}
          onChange={onProductCountChange}
          minWidth={170}
          maxWidth={210}
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

const CategoryGrid = () => {
  const {
    data: categories,
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
  const [sortValue, setSortValue] = useState("position:ASC");
  const [productCountFilter, setProductCountFilter] = useState(
    (filterValues.productCount as string) ?? ""
  );

  const hasActiveFilters =
    Boolean(searchValue) ||
    Boolean(productCountFilter);

  // ─── Filtre côté client par nombre de produits (fallback) ───
  const filteredCategories = (categories ?? []).filter((cat: any) => {
    if (!productCountFilter) return true;
    const count = cat.productCount ?? 0;
    if (productCountFilter === "empty") return count === 0;
    if (productCountFilter === "few") return count >= 1 && count <= 5;
    if (productCountFilter === "many") return count > 5;
    return true;
  });

  const applyFilters = (overrides: Record<string, any> = {}) => {
    const next: Record<string, any> = {
      ...filterValues,
      search: searchValue || undefined,
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

  const handleProductCountChange = (value: string) => {
    setProductCountFilter(value);
    // Ce filtre est appliqué côté client (fallback).
    // Si tu veux le rendre backend, ajoute `productCount` dans les filtres.
  };

  const handleResetFilters = () => {
    setSearchValue("");
    setProductCountFilter("");
    setFilters({}, {});
    setPage(1);
  };

  const handleOpen = (id: string) => {
    redirect(`/products?categoryId=${encodeURIComponent(id)}`);
  };

  const handleEdit = (id: string) => redirect("edit", "categories", id);
  const handleDelete = (id: string) => redirect("delete", "categories", id);
  const handleCreate = () => redirect("create", "categories");

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Title title="Catégories" />

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
            Catégories
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Cliquez sur une catégorie pour voir ses produits.
          </Typography>
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
          }}
        >
          Nouvelle catégorie
        </Button>
      </Stack>

      {/* Barre de filtres */}
      <CategoryFilterBar
        searchValue={searchValue}
        onSearchChange={handleSearch}
        sortValue={sortValue}
        onSortChange={handleSort}
        productCountFilter={productCountFilter}
        onProductCountChange={handleProductCountChange}
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
            gap: 2.5,
          }}
        >
          {Array.from({ length: perPage }).map((_, i) => (
            <CategorySkeleton key={i} />
          ))}
        </Box>
      ) : filteredCategories.length === 0 ? (
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
            <CategoryIcon sx={{ fontSize: 30 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
            {hasActiveFilters
              ? "Aucune catégorie trouvée"
              : "Aucune catégorie"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {hasActiveFilters
              ? "Aucun résultat pour ces critères. Essayez de modifier les filtres."
              : "Commencez par créer votre première catégorie."}
          </Typography>
          {!hasActiveFilters && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreate}
              sx={{ textTransform: "none", fontWeight: 700, borderRadius: 1.5 }}
            >
              Créer une catégorie
            </Button>
          )}
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
              gap: 2.5,
            }}
          >
            {filteredCategories.map((record: any) => (
              <CategoryCard
                key={record.id}
                record={record}
                productCount={record.productCount ?? 0}
                onOpen={() => handleOpen(record.id)}
                onEdit={() => handleEdit(record.id)}
                onDelete={() => handleDelete(record.id)}
              />
            ))}
          </Box>

          <CategoryPagination
            page={page}
            perPage={perPage}
            total={total ?? 0}
            onPageChange={(p) => {
              setPage(p);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onPerPageChange={(pp) => {
              setPerPage(pp);
              setPage(1);
            }}
          />
        </>
      )}
    </Box>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export const CategoryList = () => (
  <List
    perPage={12}
    sort={{ field: "position", order: "ASC" }}
    actions={false}
    pagination={false}
    filterDefaultValues={{}}
  >
    <CategoryGrid />
  </List>
);