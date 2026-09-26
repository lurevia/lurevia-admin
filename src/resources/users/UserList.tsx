import {
  List,
  useListContext,
  useRedirect,
  Title,
} from "react-admin";
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
import PeopleIconModule from "@mui/icons-material/People";
import EditOutlinedIconModule from "@mui/icons-material/EditOutlined";
import DeleteOutlineIconModule from "@mui/icons-material/DeleteOutline";
import VisibilityOutlinedIconModule from "@mui/icons-material/VisibilityOutlined";
import SearchIconModule from "@mui/icons-material/Search";
import CloseIconModule from "@mui/icons-material/Close";
import MailOutlineIconModule from "@mui/icons-material/MailOutline";
import PhoneIconModule from "@mui/icons-material/Phone";
import ShoppingBagIconModule from "@mui/icons-material/ShoppingBag";
import CalendarTodayIconModule from "@mui/icons-material/CalendarToday";
import ShieldOutlinedIconModule from "@mui/icons-material/ShieldOutlined";
import StorefrontIconModule from "@mui/icons-material/Storefront";
import PersonOutlineIconModule from "@mui/icons-material/PersonOutline";
import VerifiedIconModule from "@mui/icons-material/Verified";
import SortIconModule from "@mui/icons-material/Sort";
import CakeIconModule from "@mui/icons-material/Cake";
import WcIconModule from "@mui/icons-material/Wc";
import BadgeIconModule from "@mui/icons-material/Badge";
import FilterAltOffIconModule from "@mui/icons-material/FilterAltOff";
import ManIconModule from "@mui/icons-material/Man";
import WomanIconModule from "@mui/icons-material/Woman";
import TransgenderIconModule from "@mui/icons-material/Transgender";
import AdminPanelSettingsIconModule from "@mui/icons-material/AdminPanelSettings";
import ViewModuleIconModule from "@mui/icons-material/ViewModule";
import { normalizeMuiIcon } from "../../muiIcon";
import { scrollAdminContentToTop } from "../../utils/scrollAdminContent";
import { SmartSelect, type SmartSelectOption } from "../../components/SmartSelect";
import { UserDetailDialog } from "./UserDetailDialog";

// ─── Icônes normalisées ───
const PeopleIcon = normalizeMuiIcon(PeopleIconModule);
const EditIcon = normalizeMuiIcon(EditOutlinedIconModule);
const DeleteIcon = normalizeMuiIcon(DeleteOutlineIconModule);
const VisibilityIcon = normalizeMuiIcon(VisibilityOutlinedIconModule);
const SearchIcon = normalizeMuiIcon(SearchIconModule);
const CloseIcon = normalizeMuiIcon(CloseIconModule);
const MailIcon = normalizeMuiIcon(MailOutlineIconModule);
const PhoneIcon = normalizeMuiIcon(PhoneIconModule);
const OrdersIcon = normalizeMuiIcon(ShoppingBagIconModule);
const CalendarIcon = normalizeMuiIcon(CalendarTodayIconModule);
const ShieldIcon = normalizeMuiIcon(ShieldOutlinedIconModule);
const SellerIcon = normalizeMuiIcon(StorefrontIconModule);
const CustomerIcon = normalizeMuiIcon(PersonOutlineIconModule);
const VerifiedIcon = normalizeMuiIcon(VerifiedIconModule);
const SortIcon = normalizeMuiIcon(SortIconModule);
const CakeIcon = normalizeMuiIcon(CakeIconModule);
const GenderIcon = normalizeMuiIcon(WcIconModule);
const RoleIcon = normalizeMuiIcon(BadgeIconModule);
const FilterOffIcon = normalizeMuiIcon(FilterAltOffIconModule);
const ManIcon = normalizeMuiIcon(ManIconModule);
const WomanIcon = normalizeMuiIcon(WomanIconModule);
const TransgenderIcon = normalizeMuiIcon(TransgenderIconModule);
const AdminIcon = normalizeMuiIcon(AdminPanelSettingsIconModule);
const ViewModuleIcon = normalizeMuiIcon(ViewModuleIconModule);

// ─────────────────────────────────────────────────────────────────────────────
// OPTIONS
// ─────────────────────────────────────────────────────────────────────────────

const SORT_OPTIONS: SmartSelectOption[] = [
  { value: "createdAt:DESC", label: "Plus récents" },
  { value: "createdAt:ASC", label: "Plus anciens" },
  { value: "fullName:ASC", label: "Nom (A → Z)" },
  { value: "fullName:DESC", label: "Nom (Z → A)" },
  { value: "ordersCount:DESC", label: "Plus de commandes" },
];

const ROLE_OPTIONS: SmartSelectOption[] = [
  { value: "CUSTOMER", label: "Clients", icon: CustomerIcon },
  { value: "SELLER", label: "Vendeurs", icon: SellerIcon },
  { value: "ADMIN", label: "Administrateurs", icon: AdminIcon },
];

const GENDER_OPTIONS: SmartSelectOption[] = [
  { value: "MALE", label: "Hommes", icon: ManIcon },
  { value: "FEMALE", label: "Femmes", icon: WomanIcon },
  { value: "OTHER", label: "Autres", icon: TransgenderIcon },
];

const AGE_OPTIONS: SmartSelectOption[] = [
  { value: "18-25", label: "18 – 25 ans", icon: CakeIcon },
  { value: "26-35", label: "26 – 35 ans", icon: CakeIcon },
  { value: "36-50", label: "36 – 50 ans", icon: CakeIcon },
  { value: "51-99", label: "Plus de 50 ans", icon: CakeIcon },
  { value: "unknown", label: "Non renseigné", icon: CakeIcon },
];

const PER_PAGE_OPTIONS = [12, 24, 48, 96];

const PER_PAGE_SELECT_OPTIONS: SmartSelectOption[] = PER_PAGE_OPTIONS.map((n) => ({
  value: String(n),
  label: `${n} / page`,
}));

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const getRoleConfig = (role: string) => {
  switch (role) {
    case "ADMIN":
      return { label: "Admin", color: "error" as const, icon: ShieldIcon };
    case "SELLER":
      return { label: "Vendeur", color: "warning" as const, icon: SellerIcon };
    default:
      return { label: "Client", color: "default" as const, icon: CustomerIcon };
  }
};

const getGenderLabel = (gender: string | null | undefined) => {
  switch (gender) {
    case "MALE":
      return "Homme";
    case "FEMALE":
      return "Femme";
    case "OTHER":
      return "Autre";
    default:
      return null;
  }
};

const formatDate = (date: string | null | undefined) => {
  if (!date) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

// ─────────────────────────────────────────────────────────────────────────────
// CARTE UTILISATEUR
// ─────────────────────────────────────────────────────────────────────────────

const UserCard = ({ record, onView, onEdit, onDelete }: any) => {
  const roleConfig = getRoleConfig(record.role);
  const RoleIconCmp = roleConfig.icon;
  const initial = record.fullName?.charAt(0).toUpperCase() ?? "?";
  const isVerified = record.isVerified === true;
  const genderLabel = getGenderLabel(record.gender);
  const hasAge = typeof record.age === "number" && record.age > 0;

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
      <CardContent sx={{ flex: 1, p: 2, pb: 1.5 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
          <Box sx={{ position: "relative", flexShrink: 0 }}>
            <Avatar
              src={record.avatarUrl || undefined}
              alt={record.fullName}
              sx={{
                width: 52,
                height: 52,
                fontSize: 20,
                fontWeight: 800,
                bgcolor: "primary.main",
                color: "primary.contrastText",
              }}
            >
              {initial}
            </Avatar>
            {isVerified && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: -2,
                  right: -2,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#27C93F",
                  border: "2px solid",
                  borderColor: "background.paper",
                }}
              >
                <VerifiedIcon sx={{ fontSize: 10, color: "#FFFFFF" }} />
              </Box>
            )}
          </Box>

          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 700, lineHeight: 1.2, mb: 0.5 }}
              noWrap
              title={record.fullName}
            >
              {record.fullName}
            </Typography>
            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
              <Chip
                icon={<RoleIconCmp sx={{ fontSize: 12 }} />}
                label={roleConfig.label}
                color={roleConfig.color}
                size="small"
                sx={{
                  height: 20,
                  fontSize: 10,
                  fontWeight: 700,
                  "& .MuiChip-icon": { color: "inherit" },
                  "& .MuiChip-label": { px: 0.75 },
                }}
              />
              {genderLabel && (
                <Chip
                  label={genderLabel}
                  size="small"
                  variant="outlined"
                  sx={{
                    height: 20,
                    fontSize: 10,
                    fontWeight: 700,
                    "& .MuiChip-label": { px: 0.75 },
                  }}
                />
              )}
            </Stack>
          </Box>
        </Stack>

        <Stack spacing={0.75}>
          <Stack direction="row" spacing={1} alignItems="center">
            <MailIcon sx={{ fontSize: 14, color: "text.secondary", flexShrink: 0 }} />
            <Typography
              sx={{ fontSize: 11.5, color: "text.secondary", wordBreak: "break-all" }}
              noWrap
              title={record.email}
            >
              {record.email || "—"}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <PhoneIcon sx={{ fontSize: 14, color: "text.secondary", flexShrink: 0 }} />
            <Typography sx={{ fontSize: 11.5, color: "text.secondary" }} noWrap>
              {record.phone || "—"}
            </Typography>
          </Stack>

          {hasAge && (
            <Stack direction="row" spacing={1} alignItems="center">
              <CakeIcon sx={{ fontSize: 14, color: "text.secondary", flexShrink: 0 }} />
              <Typography sx={{ fontSize: 11.5, color: "text.secondary" }}>
                {record.age} ans
              </Typography>
            </Stack>
          )}

          <Stack direction="row" spacing={1} alignItems="center">
            <OrdersIcon sx={{ fontSize: 14, color: "text.secondary", flexShrink: 0 }} />
            <Typography sx={{ fontSize: 11.5, color: "text.secondary" }}>
              <strong>{record.ordersCount ?? 0}</strong> commande
              {(record.ordersCount ?? 0) > 1 ? "s" : ""}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <CalendarIcon sx={{ fontSize: 14, color: "text.secondary", flexShrink: 0 }} />
            <Typography sx={{ fontSize: 11.5, color: "text.secondary" }}>
              Inscrit le {formatDate(record.createdAt)}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>

      <CardActions
        sx={{
          px: 1,
          py: 0.75,
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
                width: 30,
                height: 30,
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
                width: 30,
                height: 30,
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

const UserSkeleton = () => (
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
        <Skeleton variant="circular" width={52} height={52} />
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

const UserPagination = ({
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
            <strong>{total}</strong> utilisateur{total > 1 ? "s" : ""}
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

const UserFilterBar = ({
  searchValue,
  onSearchChange,
  sortValue,
  onSortChange,
  roleValue,
  onRoleChange,
  genderValue,
  onGenderChange,
  ageValue,
  onAgeChange,
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
        {/* Recherche — compacte */}
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

        {/* Rôle */}
        <SmartSelect
          placeholder="Rôle"
          icon={RoleIcon}
          iconColor="primary.main"
          options={ROLE_OPTIONS}
          value={roleValue}
          onChange={onRoleChange}
          minWidth={150}
          maxWidth={200}
        />

        {/* Genre */}
        <SmartSelect
          placeholder="Genre"
          icon={GenderIcon}
          iconColor="info.main"
          options={GENDER_OPTIONS}
          value={genderValue}
          onChange={onGenderChange}
          minWidth={140}
          maxWidth={180}
        />

        {/* Âge */}
        <SmartSelect
          placeholder="Âge"
          icon={CakeIcon}
          iconColor="warning.main"
          options={AGE_OPTIONS}
          value={ageValue}
          onChange={onAgeChange}
          minWidth={150}
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

const UserGrid = () => {
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
  const [roleValue, setRoleValue] = useState((filterValues.role as string) ?? "");
  const [genderValue, setGenderValue] = useState(
    (filterValues.gender as string) ?? ""
  );
  const [ageValue, setAgeValue] = useState((filterValues.age as string) ?? "");
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const hasActiveFilters =
    Boolean(searchValue) ||
    Boolean(roleValue) ||
    Boolean(genderValue) ||
    Boolean(ageValue);

  const applyFilters = (overrides: Record<string, any> = {}) => {
    const next: Record<string, any> = {
      ...filterValues,
      search: searchValue || undefined,
      role: roleValue || undefined,
      gender: genderValue || undefined,
      age: ageValue || undefined,
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

  const handleRoleChange = (value: string) => {
    setRoleValue(value);
    applyFilters({ role: value || undefined });
  };

  const handleGenderChange = (value: string) => {
    setGenderValue(value);
    applyFilters({ gender: value || undefined });
  };

  const handleAgeChange = (value: string) => {
    setAgeValue(value);
    applyFilters({ age: value || undefined });
  };

  const handleResetFilters = () => {
    setSearchValue("");
    setRoleValue("");
    setGenderValue("");
    setAgeValue("");
    setFilters({}, {});
    setPage(1);
  };

  const handleEdit = (id: string) => redirect("edit", "users", id);
  const handleDelete = (id: string) => redirect("delete", "users", id);

  const handleView = (record: any) => {
    setSelectedUser(record);
    setDetailOpen(true);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Title title="Utilisateurs" />

      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.25 }}>
            Utilisateurs
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gérez les comptes clients, vendeurs et administrateurs.
          </Typography>
        </Box>
      </Stack>

      <UserFilterBar
        searchValue={searchValue}
        onSearchChange={handleSearch}
        sortValue={sortValue}
        onSortChange={handleSort}
        roleValue={roleValue}
        onRoleChange={handleRoleChange}
        genderValue={genderValue}
        onGenderChange={handleGenderChange}
        ageValue={ageValue}
        onAgeChange={handleAgeChange}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

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
            <UserSkeleton key={i} />
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
            <PeopleIcon sx={{ fontSize: 30 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
            Aucun utilisateur
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {hasActiveFilters
              ? "Aucun résultat pour ces critères. Essayez de modifier les filtres."
              : "Les utilisateurs apparaîtront ici après leur inscription."}
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
              <UserCard
                key={record.id}
                record={record}
                onView={() => handleView(record)}
                onEdit={() => handleEdit(record.id)}
                onDelete={() => handleDelete(record.id)}
              />
            ))}
          </Box>

          <UserPagination
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

      <UserDetailDialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        record={selectedUser}
        onEdit={() => {
          if (selectedUser) {
            setDetailOpen(false);
            handleEdit(selectedUser.id);
          }
        }}
      />
    </Box>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export const UserList = () => (
  <List
    perPage={24}
    sort={{ field: "createdAt", order: "DESC" }}
    actions={false}
    pagination={false}
    filterDefaultValues={{}}
  >
    <UserGrid />
  </List>
);