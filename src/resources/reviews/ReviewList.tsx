import { List, useListContext, Title } from "react-admin";
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
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import RateReviewIconModule from "@mui/icons-material/RateReview";
import VisibilityOutlinedIconModule from "@mui/icons-material/VisibilityOutlined";
import SearchIconModule from "@mui/icons-material/Search";
import CloseIconModule from "@mui/icons-material/Close";
import StarIconModule from "@mui/icons-material/Star";
import VerifiedIconModule from "@mui/icons-material/Verified";
import ScheduleIconModule from "@mui/icons-material/Schedule";
import SortIconModule from "@mui/icons-material/Sort";
import HourglassEmptyIconModule from "@mui/icons-material/HourglassEmpty";
import CheckCircleIconModule from "@mui/icons-material/CheckCircle";
import CancelIconModule from "@mui/icons-material/Cancel";
import FilterAltOffIconModule from "@mui/icons-material/FilterAltOff";
import ViewModuleIconModule from "@mui/icons-material/ViewModule";
import ShoppingBagIconModule from "@mui/icons-material/ShoppingBag";
import StarRateIconModule from "@mui/icons-material/StarRate";
import BadgeIconModule from "@mui/icons-material/Badge";
import { normalizeMuiIcon } from "../../muiIcon";
import { scrollAdminContentToTop } from "../../utils/scrollAdminContent";
import { SmartSelect, type SmartSelectOption } from "../../components/SmartSelect";
import { ReviewActions } from "./ReviewActions";
import { ReviewDetailDialog } from "./ReviewDetailDialog";

// ─── Icônes normalisées ───
const ReviewIcon = normalizeMuiIcon(RateReviewIconModule);
const VisibilityIcon = normalizeMuiIcon(VisibilityOutlinedIconModule);
const SearchIcon = normalizeMuiIcon(SearchIconModule);
const CloseIcon = normalizeMuiIcon(CloseIconModule);
const StarIcon = normalizeMuiIcon(StarIconModule);
const VerifiedIcon = normalizeMuiIcon(VerifiedIconModule);
const ScheduleIcon = normalizeMuiIcon(ScheduleIconModule);
const SortIcon = normalizeMuiIcon(SortIconModule);
const PendingIcon = normalizeMuiIcon(HourglassEmptyIconModule);
const ApprovedIcon = normalizeMuiIcon(CheckCircleIconModule);
const RejectedIcon = normalizeMuiIcon(CancelIconModule);
const FilterOffIcon = normalizeMuiIcon(FilterAltOffIconModule);
const ViewModuleIcon = normalizeMuiIcon(ViewModuleIconModule);
const BagIcon = normalizeMuiIcon(ShoppingBagIconModule);
const RatingIcon = normalizeMuiIcon(StarRateIconModule);
const StatusIcon = normalizeMuiIcon(BadgeIconModule);

// ─────────────────────────────────────────────────────────────────────────────
// OPTIONS
// ─────────────────────────────────────────────────────────────────────────────

const SORT_OPTIONS: SmartSelectOption[] = [
  { value: "createdAt:DESC", label: "Plus récents", icon: ScheduleIcon },
  { value: "createdAt:ASC", label: "Plus anciens", icon: ScheduleIcon },
  { value: "rating:DESC", label: "Meilleures notes", icon: RatingIcon },
  { value: "rating:ASC", label: "Notes faibles", icon: RatingIcon },
];

const STATUS_OPTIONS: SmartSelectOption[] = [
  { value: "pending", label: "En attente", icon: PendingIcon },
  { value: "approved", label: "Publiés", icon: ApprovedIcon },
  { value: "rejected", label: "Rejetés", icon: RejectedIcon },
];

const RATING_OPTIONS: SmartSelectOption[] = [
  { value: "5", label: "5 étoiles", icon: StarIcon },
  { value: "4", label: "4 étoiles", icon: StarIcon },
  { value: "3", label: "3 étoiles", icon: StarIcon },
  { value: "2", label: "2 étoiles", icon: StarIcon },
  { value: "1", label: "1 étoile", icon: StarIcon },
];

const PER_PAGE_OPTIONS = [12, 24, 48, 96];

const PER_PAGE_SELECT_OPTIONS: SmartSelectOption[] = PER_PAGE_OPTIONS.map((n) => ({
  value: String(n),
  label: `${n} / page`,
}));

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const getStatusConfig = (record: any) => {
  if (record?.isApproved === true)
    return { label: "Publié", color: "success" as const, icon: ApprovedIcon };
  if (record?.rejectedAt || record?.rejectionReason)
    return { label: "Rejeté", color: "error" as const, icon: RejectedIcon };
  return {
    label: "En attente",
    color: "warning" as const,
    icon: PendingIcon,
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

const StarRow = ({ rating }: { rating: number }) => (
  <Stack direction="row" spacing={0.25} alignItems="center">
    {Array.from({ length: 5 }).map((_, i) => (
      <StarIcon
        key={i}
        sx={{
          fontSize: 13,
          color: i < rating ? "#FDB022" : "action.disabled",
        }}
      />
    ))}
  </Stack>
);

// ─────────────────────────────────────────────────────────────────────────────
// CARTE AVIS
// ─────────────────────────────────────────────────────────────────────────────

const ReviewCard = ({ record, onView }: any) => {
  const statusConfig = getStatusConfig(record);
  const StatusIconCmp = statusConfig.icon;
  const initial = (record.userName ?? "?").charAt(0).toUpperCase();
  const isPending = !record.isApproved && !record.rejectedAt;

  const getBarColor = () => {
    if (statusConfig.color === "success") return "success.main";
    if (statusConfig.color === "error") return "error.main";
    return "warning.main";
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
        position: "relative",
        "&:hover": {
          borderColor: "primary.main",
          boxShadow: (theme) =>
            `0 8px 24px -12px ${alpha(theme.palette.primary.main, 0.3)}`,
          transform: "translateY(-2px)",
        },
      }}
    >
      {/* Bande latérale colorée selon statut */}
      <Box
        sx={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          backgroundColor: getBarColor(),
        }}
      />

      <CardContent sx={{ flex: 1, p: 2, pl: 2.5, pb: 1.5 }}>
        {/* En-tête utilisateur */}
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
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
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, lineHeight: 1.2 }}
                noWrap
                title={record.userName}
              >
                {record.userName ?? "Client"}
              </Typography>
              {record.isVerifiedPurchase && (
                <Tooltip title="Achat vérifié" arrow>
                  <VerifiedIcon
                    sx={{ fontSize: 14, color: "success.main", flexShrink: 0 }}
                  />
                </Tooltip>
              )}
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5 }}>
              <StarRow rating={record.rating ?? 0} />
              <Typography
                sx={{
                  fontSize: 11,
                  color: "text.secondary",
                  fontWeight: 600,
                  ml: 0.5,
                }}
              >
                {record.rating}/5
              </Typography>
            </Stack>
          </Box>
        </Stack>

        {/* Produit concerné */}
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{
            p: 1,
            mb: 1.5,
            borderRadius: 1,
            backgroundColor: (theme) =>
              alpha(theme.palette.primary.main, 0.04),
          }}
        >
          <BagIcon
            sx={{ fontSize: 13, color: "primary.main", flexShrink: 0 }}
          />
          <Typography
            sx={{ fontSize: 11.5, fontWeight: 600, color: "text.secondary" }}
            noWrap
            title={record.productTitle}
          >
            {record.productTitle ?? "Produit"}
          </Typography>
        </Stack>

        {/* Titre + Commentaire */}
        {record.title && (
          <Typography
            sx={{
              fontSize: 12.5,
              fontWeight: 700,
              mb: 0.75,
              color: "text.primary",
            }}
            noWrap
            title={record.title}
          >
            {record.title}
          </Typography>
        )}

        <Typography
          sx={{
            fontSize: 12,
            lineHeight: 1.6,
            color: "text.secondary",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: 58,
          }}
        >
          {record.comment || "Aucun commentaire."}
        </Typography>

        {/* Date + statut */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
          sx={{
            mt: 2,
            pt: 1.5,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Stack direction="row" spacing={0.5} alignItems="center">
            <ScheduleIcon
              sx={{ fontSize: 12, color: "text.secondary", flexShrink: 0 }}
            />
            <Typography sx={{ fontSize: 10.5, color: "text.secondary" }}>
              {formatDate(record.createdAt)}
            </Typography>
          </Stack>

          <Chip
            icon={<StatusIconCmp sx={{ fontSize: 11 }} />}
            label={statusConfig.label}
            color={statusConfig.color}
            size="small"
            sx={{
              height: 20,
              fontSize: 9.5,
              fontWeight: 700,
              "& .MuiChip-icon": { color: "inherit" },
              "& .MuiChip-label": { px: 0.75 },
            }}
          />
        </Stack>
      </CardContent>

      {/* Actions */}
      <CardActions
        sx={{
          px: 1.5,
          py: 0.75,
          pl: 2.5,
          borderTop: "1px solid",
          borderColor: "divider",
          justifyContent: "space-between",
          gap: 0.5,
        }}
      >
        <Tooltip title="Voir l'avis complet" arrow>
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

        {isPending && <ReviewActions record={record} />}
      </CardActions>
    </Card>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON
// ─────────────────────────────────────────────────────────────────────────────

const ReviewSkeleton = () => (
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
      <Stack direction="row" spacing={1.5} sx={{ mb: 2 }}>
        <Skeleton variant="circular" width={44} height={44} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="70%" />
          <Skeleton variant="text" width="40%" />
        </Box>
      </Stack>
      <Skeleton variant="rounded" height={28} sx={{ mb: 1.5 }} />
      <Skeleton variant="text" width="90%" />
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="60%" />
    </CardContent>
  </Card>
);

// ─────────────────────────────────────────────────────────────────────────────
// PAGINATION
// ─────────────────────────────────────────────────────────────────────────────

const ReviewPagination = ({
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
            <strong>{total}</strong> avis
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

const ReviewFilterBar = ({
  searchValue,
  onSearchChange,
  sortValue,
  onSortChange,
  statusValue,
  onStatusChange,
  ratingValue,
  onRatingChange,
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

        <SmartSelect
          placeholder="Statut"
          icon={StatusIcon}
          iconColor="warning.main"
          options={STATUS_OPTIONS}
          value={statusValue}
          onChange={onStatusChange}
          minWidth={150}
          maxWidth={190}
        />

        <SmartSelect
          placeholder="Note"
          icon={RatingIcon}
          iconColor="info.main"
          options={RATING_OPTIONS}
          value={ratingValue}
          onChange={onRatingChange}
          minWidth={140}
          maxWidth={180}
        />

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

const ReviewGrid = () => {
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

  const [searchValue, setSearchValue] = useState(
    (filterValues.search as string) ?? ""
  );
  const [sortValue, setSortValue] = useState("createdAt:DESC");
  const [statusValue, setStatusValue] = useState(
    (filterValues.status as string) ?? ""
  );
  const [ratingValue, setRatingValue] = useState(
    (filterValues.rating as string) ?? ""
  );
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any>(null);

  const hasActiveFilters =
    Boolean(searchValue) || Boolean(statusValue) || Boolean(ratingValue);

  const applyFilters = (overrides: Record<string, any> = {}) => {
    const next: Record<string, any> = {
      ...filterValues,
      search: searchValue || undefined,
      status: statusValue || undefined,
      rating: ratingValue || undefined,
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

  const handleRatingChange = (value: string) => {
    setRatingValue(value);
    applyFilters({ rating: value || undefined });
  };

  const handleResetFilters = () => {
    setSearchValue("");
    setStatusValue("");
    setRatingValue("");
    setFilters({}, {});
    setPage(1);
  };

  const handleView = (record: any) => {
    setSelectedReview(record);
    setDetailOpen(true);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Title title="Avis produits — modération" />

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
            Avis produits
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Modérez les avis clients avant leur publication.
          </Typography>
        </Box>
      </Stack>

      {/* Filtres */}
      <ReviewFilterBar
        searchValue={searchValue}
        onSearchChange={handleSearch}
        sortValue={sortValue}
        onSortChange={handleSort}
        statusValue={statusValue}
        onStatusChange={handleStatusChange}
        ratingValue={ratingValue}
        onRatingChange={handleRatingChange}
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
            <ReviewSkeleton key={i} />
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
            <ReviewIcon sx={{ fontSize: 30 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
            {hasActiveFilters ? "Aucun avis trouvé" : "Aucun avis"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {hasActiveFilters
              ? "Aucun résultat pour ces critères. Essayez de modifier les filtres."
              : "Les avis clients apparaîtront ici dès qu'ils seront soumis."}
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
              <ReviewCard
                key={record.id}
                record={record}
                onView={() => handleView(record)}
              />
            ))}
          </Box>

          <ReviewPagination
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

      <ReviewDetailDialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        record={selectedReview}
      />
    </Box>
  );
};


export const ReviewList = () => (
  <List
    perPage={24}
    sort={{ field: "createdAt", order: "DESC" }}
    actions={false}
    pagination={false}
    filterDefaultValues={{}}
  >
    <ReviewGrid />
  </List>
);