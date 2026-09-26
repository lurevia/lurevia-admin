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
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import ManageAccountsIconModule from "@mui/icons-material/ManageAccounts";
import VisibilityOutlinedIconModule from "@mui/icons-material/VisibilityOutlined";
import SearchIconModule from "@mui/icons-material/Search";
import CloseIconModule from "@mui/icons-material/Close";
import MailOutlineIconModule from "@mui/icons-material/MailOutline";
import PhoneIconModule from "@mui/icons-material/Phone";
import BadgeIconModule from "@mui/icons-material/Badge";
import CalendarTodayIconModule from "@mui/icons-material/CalendarToday";
import ScheduleIconModule from "@mui/icons-material/Schedule";
import SortIconModule from "@mui/icons-material/Sort";
import HourglassEmptyIconModule from "@mui/icons-material/HourglassEmpty";
import CheckCircleIconModule from "@mui/icons-material/CheckCircle";
import CancelIconModule from "@mui/icons-material/Cancel";
import FilterAltOffIconModule from "@mui/icons-material/FilterAltOff";
import ViewModuleIconModule from "@mui/icons-material/ViewModule";
import { normalizeMuiIcon } from "../../muiIcon";
import { scrollAdminContentToTop } from "../../utils/scrollAdminContent";
import { SmartSelect, type SmartSelectOption } from "../../components/SmartSelect";
import { ProfileChangeActions } from "./ProfileChangeActions";
import { ProfileChangeDetailDialog } from "./ProfileChangeDetailDialog";

// ─── Icônes normalisées ───
const ManageIcon = normalizeMuiIcon(ManageAccountsIconModule);
const VisibilityIcon = normalizeMuiIcon(VisibilityOutlinedIconModule);
const SearchIcon = normalizeMuiIcon(SearchIconModule);
const CloseIcon = normalizeMuiIcon(CloseIconModule);
const MailIcon = normalizeMuiIcon(MailOutlineIconModule);
const PhoneIcon = normalizeMuiIcon(PhoneIconModule);
const BadgeIcon = normalizeMuiIcon(BadgeIconModule);
const CalendarIcon = normalizeMuiIcon(CalendarTodayIconModule);
const ScheduleIcon = normalizeMuiIcon(ScheduleIconModule);
const SortIcon = normalizeMuiIcon(SortIconModule);
const PendingIcon = normalizeMuiIcon(HourglassEmptyIconModule);
const ApprovedIcon = normalizeMuiIcon(CheckCircleIconModule);
const RejectedIcon = normalizeMuiIcon(CancelIconModule);
const FilterOffIcon = normalizeMuiIcon(FilterAltOffIconModule);
const ViewModuleIcon = normalizeMuiIcon(ViewModuleIconModule);

// ─────────────────────────────────────────────────────────────────────────────
// OPTIONS
// ─────────────────────────────────────────────────────────────────────────────

const SORT_OPTIONS: SmartSelectOption[] = [
  { value: "createdAt:DESC", label: "Plus récentes", icon: ScheduleIcon },
  { value: "createdAt:ASC", label: "Plus anciennes", icon: ScheduleIcon },
];

const STATUS_OPTIONS: SmartSelectOption[] = [
  { value: "PENDING", label: "En attente", icon: PendingIcon },
  { value: "APPROVED", label: "Approuvées", icon: ApprovedIcon },
  { value: "REJECTED", label: "Rejetées", icon: RejectedIcon },
];

const PER_PAGE_OPTIONS = [12, 24, 48, 96];

const PER_PAGE_SELECT_OPTIONS: SmartSelectOption[] = PER_PAGE_OPTIONS.map((n) => ({
  value: String(n),
  label: `${n} / page`,
}));

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const getStatusConfig = (status: string) => {
  switch (status) {
    case "APPROVED":
      return {
        label: "Approuvée",
        color: "success" as const,
        icon: ApprovedIcon,
      };
    case "REJECTED":
      return {
        label: "Rejetée",
        color: "error" as const,
        icon: RejectedIcon,
      };
    default:
      return {
        label: "En attente",
        color: "warning" as const,
        icon: PendingIcon,
      };
  }
};

const formatDate = (date: string | null | undefined) => {
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
// CARTE DEMANDE
// ─────────────────────────────────────────────────────────────────────────────

const ProfileChangeCard = ({ record, onView }: any) => {
  const statusConfig = getStatusConfig(record.status);
  const StatusIconCmp = statusConfig.icon;
  const user = record.user ?? {};
  const initial = (user.fullName ?? "?").charAt(0).toUpperCase();

  const changesCount = [
    record.requestedFullName,
    record.requestedEmail,
    record.requestedPhone,
  ].filter(Boolean).length;

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
      {/* Bande latérale colorée */}
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
        {/* En-tête : utilisateur */}
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
          <Avatar
            src={user.avatarUrl || undefined}
            alt={user.fullName}
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
              sx={{ fontWeight: 700, lineHeight: 1.2, mb: 0.25 }}
              noWrap
              title={user.fullName}
            >
              {user.fullName ?? "Utilisateur"}
            </Typography>
            <Typography
              sx={{ fontSize: 11, color: "text.secondary" }}
              noWrap
              title={user.email}
            >
              {user.email ?? "—"}
            </Typography>
          </Box>
        </Stack>

        {/* Statut + compteur */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
          sx={{ mb: 2 }}
        >
          <Chip
            icon={<StatusIconCmp sx={{ fontSize: 12 }} />}
            label={statusConfig.label}
            color={statusConfig.color}
            size="small"
            sx={{
              height: 22,
              fontSize: 10,
              fontWeight: 700,
              "& .MuiChip-icon": { color: "inherit" },
              "& .MuiChip-label": { px: 0.75 },
            }}
          />
          {changesCount > 0 && (
            <Typography sx={{ fontSize: 10.5, color: "text.secondary" }}>
              {changesCount} changement{changesCount > 1 ? "s" : ""}
            </Typography>
          )}
        </Stack>

        {/* Changements demandés */}
        <Stack spacing={0.75}>
          {record.requestedFullName && (
            <ChangeRow
              icon={BadgeIcon}
              label="Nom"
              value={record.requestedFullName}
            />
          )}
          {record.requestedEmail && (
            <ChangeRow
              icon={MailIcon}
              label="Email"
              value={record.requestedEmail}
            />
          )}
          {record.requestedPhone && (
            <ChangeRow
              icon={PhoneIcon}
              label="Téléphone"
              value={record.requestedPhone}
            />
          )}
          {changesCount === 0 && (
            <Typography
              sx={{
                fontSize: 11.5,
                color: "text.secondary",
                fontStyle: "italic",
              }}
            >
              Aucun changement spécifié.
            </Typography>
          )}
        </Stack>

        <Box
          sx={{
            mt: 2,
            pt: 1.5,
            borderTop: "1px solid",
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            gap: 0.75,
          }}
        >
          <CalendarIcon
            sx={{ fontSize: 13, color: "text.secondary", flexShrink: 0 }}
          />
          <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
            {formatDate(record.createdAt)}
          </Typography>
        </Box>
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

        {record.status === "PENDING" && (
          <Stack direction="row" spacing={0.5}>
            <ProfileChangeActions record={record} />
          </Stack>
        )}
      </CardActions>
    </Card>
  );
};

const ChangeRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) => (
  <Stack direction="row" spacing={1} alignItems="center">
    <Icon
      sx={{ fontSize: 13, color: "primary.main", flexShrink: 0 }}
    />
    <Typography
      sx={{
        fontSize: 10,
        color: "text.secondary",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        minWidth: 60,
      }}
    >
      {label}
    </Typography>
    <Typography
      sx={{ fontSize: 11.5, fontWeight: 600, flex: 1 }}
      noWrap
      title={value}
    >
      {value}
    </Typography>
  </Stack>
);

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON
// ─────────────────────────────────────────────────────────────────────────────

const ProfileChangeSkeleton = () => (
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
        <Skeleton variant="circular" width={48} height={48} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="60%" />
        </Box>
      </Stack>
      <Skeleton variant="rounded" width={80} height={22} sx={{ mb: 2 }} />
      <Skeleton variant="text" width="90%" />
      <Skeleton variant="text" width="70%" />
    </CardContent>
  </Card>
);

// ─────────────────────────────────────────────────────────────────────────────
// PAGINATION
// ─────────────────────────────────────────────────────────────────────────────

const ProfileChangePagination = ({
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
            <strong>{total}</strong> demande{total > 1 ? "s" : ""}
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

const ProfileChangeFilterBar = ({
  searchValue,
  onSearchChange,
  sortValue,
  onSortChange,
  statusValue,
  onStatusChange,
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
          icon={PendingIcon}
          iconColor="warning.main"
          options={STATUS_OPTIONS}
          value={statusValue}
          onChange={onStatusChange}
          minWidth={160}
          maxWidth={200}
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

const ProfileChangeGrid = () => {
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
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

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
    setSelectedRequest(record);
    setDetailOpen(true);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Title title="Modifications de profil" />

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
            Modifications de profil
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Traitez les demandes de modification de profil des utilisateurs.
          </Typography>
        </Box>
      </Stack>

      {/* Filtres */}
      <ProfileChangeFilterBar
        searchValue={searchValue}
        onSearchChange={handleSearch}
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
            <ProfileChangeSkeleton key={i} />
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
            <ManageIcon sx={{ fontSize: 30 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
            {hasActiveFilters
              ? "Aucune demande trouvée"
              : "Aucune demande"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {hasActiveFilters
              ? "Aucun résultat pour ces critères. Essayez de modifier les filtres."
              : "Les demandes de modification apparaîtront ici dès qu'un utilisateur en fera la demande."}
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
              <ProfileChangeCard
                key={record.id}
                record={record}
                onView={() => handleView(record)}
              />
            ))}
          </Box>

          <ProfileChangePagination
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
      <ProfileChangeDetailDialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        record={selectedRequest}
      />
    </Box>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export const ProfileChangeList = () => (
  <List
    perPage={24}
    sort={{ field: "createdAt", order: "DESC" }}
    actions={false}
    pagination={false}
    filterDefaultValues={{}}
  >
    <ProfileChangeGrid />
  </List>
);