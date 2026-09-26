import { useEffect, useState } from "react";
import { useLogout, useGetIdentity } from "react-admin";
import { Link, useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ExpandMoreIconModule from "@mui/icons-material/ExpandMore";
import LogoutIconModule from "@mui/icons-material/Logout";
import DashboardIconModule from "@mui/icons-material/GridViewRounded";
import InventoryIconModule from "@mui/icons-material/Inventory2";
import CategoryIconModule from "@mui/icons-material/Category";
import ReceiptIconModule from "@mui/icons-material/ReceiptLong";
import PeopleIconModule from "@mui/icons-material/People";
import ReviewsIconModule from "@mui/icons-material/RateReview";
import PersonRemoveIconModule from "@mui/icons-material/PersonRemove";
import FactCheckIconModule from "@mui/icons-material/FactCheck";
import MarkEmailReadIconModule from "@mui/icons-material/MarkEmailRead";
import ManageAccountsIconModule from "@mui/icons-material/ManageAccounts";
import StorefrontIconModule from "@mui/icons-material/Storefront";
import AccountBalanceIconModule from "@mui/icons-material/AccountBalance";
import SwapHorizIconModule from "@mui/icons-material/SwapHoriz";
import BarChartIconModule from "@mui/icons-material/BarChart";
import AdminPanelSettingsIconModule from "@mui/icons-material/AdminPanelSettings";
import type { SvgIconComponent } from "@mui/icons-material";
import { normalizeMuiIcon } from "../muiIcon";

// ─── Icônes normalisées (obligatoire pour éviter React error #130) ───
const ExpandMoreIcon = normalizeMuiIcon(ExpandMoreIconModule);
const LogoutIcon = normalizeMuiIcon(LogoutIconModule);
const DashboardIcon = normalizeMuiIcon(DashboardIconModule);
const InventoryIcon = normalizeMuiIcon(InventoryIconModule);
const CategoryIcon = normalizeMuiIcon(CategoryIconModule);
const ReceiptIcon = normalizeMuiIcon(ReceiptIconModule);
const PeopleIcon = normalizeMuiIcon(PeopleIconModule);
const ReviewsIcon = normalizeMuiIcon(ReviewsIconModule);
const PersonRemoveIcon = normalizeMuiIcon(PersonRemoveIconModule);
const FactCheckIcon = normalizeMuiIcon(FactCheckIconModule);
const MarkEmailReadIcon = normalizeMuiIcon(MarkEmailReadIconModule);
const ManageAccountsIcon = normalizeMuiIcon(ManageAccountsIconModule);
const StorefrontIcon = normalizeMuiIcon(StorefrontIconModule);
const AccountBalanceIcon = normalizeMuiIcon(AccountBalanceIconModule);
const SwapHorizIcon = normalizeMuiIcon(SwapHorizIconModule);
const BarChartIcon = normalizeMuiIcon(BarChartIconModule);
const AdminPanelSettingsIcon = normalizeMuiIcon(AdminPanelSettingsIconModule);

// ─── Persistance ───
const STORAGE_OPEN_KEY = "lurevia-admin-menu-open-categories";

// ─── Types ───
interface MenuItemConfig {
  to: string;
  label: string;
  icon: SvgIconComponent;
}

interface MenuCategoryConfig {
  id: string;
  label: string;
  icon: SvgIconComponent;
  items: MenuItemConfig[];
}

interface FullIdentity {
  id?: string | number;
  fullName?: string;
  avatar?: string;
  email?: string;
}

// ─── Configuration du menu ───
const MENU_CATEGORIES: MenuCategoryConfig[] = [
  {
    id: "catalogue",
    label: "Catalogue",
    icon: InventoryIcon,
    items: [
      { to: "/products", label: "Produits", icon: InventoryIcon },
      { to: "/categories", label: "Catégories", icon: CategoryIcon },
    ],
  },
  {
    id: "ventes",
    label: "Ventes",
    icon: ReceiptIcon,
    items: [
      { to: "/orders", label: "Commandes", icon: ReceiptIcon },
      { to: "/reviews", label: "Avis à modérer", icon: ReviewsIcon },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    icon: AccountBalanceIcon,
    items: [
      { to: "/financial-dashboard", label: "Pilotage financier", icon: BarChartIcon },
      { to: "/sellers", label: "Vendeurs", icon: StorefrontIcon },
      { to: "/contracts", label: "Contrats", icon: FactCheckIcon },
      { to: "/settlements", label: "Settlements", icon: AccountBalanceIcon },
      { to: "/commissions", label: "Commissions", icon: AccountBalanceIcon },
      { to: "/transfers", label: "Transferts", icon: SwapHorizIcon },
    ],
  },
  {
    id: "clients",
    label: "Clients",
    icon: PeopleIcon,
    items: [
      { to: "/users", label: "Utilisateurs", icon: PeopleIcon },
      { to: "/admins/create", label: "Créer un admin", icon: AdminPanelSettingsIcon },
      { to: "/verifications", label: "Vérifications", icon: FactCheckIcon },
      { to: "/profile-change-requests", label: "Modifs profil", icon: ManageAccountsIcon },
      { to: "/deletion-requests", label: "Suppressions", icon: PersonRemoveIcon },
      { to: "/messages", label: "Messages clients", icon: MarkEmailReadIcon },
    ],
  },
];

// ─── Helpers ───
const matchesPath = (pathname: string, to: string) => {
  if (to === "/") return pathname === "/";
  return pathname === to || pathname.startsWith(to + "/");
};

const findActiveCategoryId = (pathname: string): string | null => {
  for (const cat of MENU_CATEGORIES) {
    if (cat.items.some((item) => matchesPath(pathname, item.to))) {
      return cat.id;
    }
  }
  return null;
};

const getActiveLabel = (pathname: string): string => {
  if (pathname === "/") return "Tableau de bord";
  for (const cat of MENU_CATEGORIES) {
    for (const item of cat.items) {
      if (matchesPath(pathname, item.to)) return item.label;
    }
  }
  return "";
};

// ─── Styles ───
const MenuContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxSizing: "border-box",
}));

const MenuHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  padding: theme.spacing(2, 2, 1),
  flexShrink: 0,
  width: "100%",
  boxSizing: "border-box",
}));

const LogoBox = styled(Box)(({ theme }) => ({
  width: 32,
  height: 32,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 800,
  fontSize: 15,
  flexShrink: 0,
}));

const ActiveLabel = styled(Typography)(({ theme }) => ({
  fontSize: 10.5,
  fontWeight: 700,
  letterSpacing: 1.2,
  textTransform: "uppercase",
  color: theme.palette.primary.main,
  padding: theme.spacing(0, 2, 1),
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
}));

const ScrollArea = styled(Box)({
  flex: 1,
  overflowY: "auto",
  overflowX: "hidden",
  paddingTop: 4,
  "&::-webkit-scrollbar": { width: 5 },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(128,128,128,0.2)",
    borderRadius: 3,
  },
});

const FooterArea = styled(Box)(({ theme }) => ({
  flexShrink: 0,
  borderTop: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(1.5, 2),
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(1),
}));

// ─── Composant principal ───
export const LureviaMenu = () => {
  const location = useLocation();
  const logout = useLogout();
  const { identity } = useGetIdentity();
  const typedIdentity = identity as FullIdentity | undefined;

  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const raw = window.localStorage.getItem(STORAGE_OPEN_KEY);
      return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
    } catch {
      return {};
    }
  });

  // Persistance de l'état ouvert/fermé
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_OPEN_KEY, JSON.stringify(openCategories));
    }
  }, [openCategories]);

  // Auto-ouverture de la catégorie active
  useEffect(() => {
    const activeId = findActiveCategoryId(location.pathname);
    if (activeId) {
      setOpenCategories((prev) =>
        prev[activeId] ? prev : { ...prev, [activeId]: true }
      );
    }
  }, [location.pathname]);

  const toggleCategory = (id: string) => {
    setOpenCategories((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLogout = () => logout();

  const initial = typedIdentity?.fullName?.charAt(0).toUpperCase() ?? "A";
  const activeLabel = getActiveLabel(location.pathname);

  return (
    <MenuContainer>
      {/* ═══════ HEADER : Logo + Nom ═══════ */}
      <MenuHeader>
        <LogoBox>L</LogoBox>
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: 15,
            color: "text.primary",
            letterSpacing: "-0.3px",
          }}
        >
          Lurevia
        </Typography>
      </MenuHeader>

      {/* Section active */}
      {activeLabel && <ActiveLabel>{activeLabel}</ActiveLabel>}

      <Divider />

      {/* ═══════ ZONE DÉFILANTE ═══════ */}
      <ScrollArea>
        <List disablePadding sx={{ pt: 1, pb: 1 }}>
          {/* ─── Tableau de bord ─── */}
          <ListItemButton
            component={Link}
            to="/"
            sx={{
              borderRadius: 1.5,
              margin: "2px 8px",
              minHeight: 40,
              pl: 1.5,
              pr: 1.5,
              color: matchesPath(location.pathname, "/")
                ? "text.primary"
                : "text.secondary",
              ...(matchesPath(location.pathname, "/") && {
                backgroundColor: "action.selected",
                "&:hover": { backgroundColor: "action.selected" },
              }),
              "&:hover": { backgroundColor: "action.hover" },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 32,
                color: matchesPath(location.pathname, "/")
                  ? "text.primary"
                  : "text.secondary",
              }}
            >
              <DashboardIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Tableau de bord"
              primaryTypographyProps={{
                fontSize: 13.5,
                fontWeight: matchesPath(location.pathname, "/") ? 700 : 500,
              }}
            />
          </ListItemButton>

          <Divider sx={{ mx: 2, my: 1 }} />

          {/* ─── Catégories en accordéon ─── */}
          {MENU_CATEGORIES.map((category) => {
            const CategoryIcon = category.icon;
            const isOpen = !!openCategories[category.id];
            const hasActiveChild = category.items.some((item) =>
              matchesPath(location.pathname, item.to)
            );

            return (
              <Box key={category.id}>
                {/* En-tête de catégorie */}
                <ListItemButton
                  onClick={() => toggleCategory(category.id)}
                  sx={{
                    borderRadius: 1.5,
                    margin: "2px 8px",
                    minHeight: 40,
                    pl: 1.5,
                    pr: 1.5,
                    color:
                      hasActiveChild && !isOpen
                        ? "primary.main"
                        : "text.primary",
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CategoryIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={category.label}
                    primaryTypographyProps={{
                      fontSize: 13.5,
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  />
                  <ExpandMoreIcon
                    fontSize="small"
                    sx={{
                      transition: "transform 0.2s ease",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      opacity: 0.6,
                      ml: 1,
                      flexShrink: 0,
                    }}
                  />
                </ListItemButton>

                {/* Sous-items repliables */}
                <Collapse in={isOpen} timeout={200}>
                  <List disablePadding>
                    {category.items.map((item) => {
                      const ItemIcon = item.icon;
                      const active = matchesPath(location.pathname, item.to);

                      return (
                        <ListItemButton
                          key={item.to}
                          component={Link}
                          to={item.to}
                          sx={{
                            borderRadius: 1.5,
                            margin: "2px 8px 2px 20px",
                            minHeight: 36,
                            pl: 1.5,
                            pr: 1.5,
                            color: active ? "text.primary" : "text.secondary",
                            ...(active && {
                              backgroundColor: "action.selected",
                              "&:hover": { backgroundColor: "action.selected" },
                            }),
                            "&:hover": { backgroundColor: "action.hover" },
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: 32,
                              color: active ? "text.primary" : "text.secondary",
                            }}
                          >
                            <ItemIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText
                            primary={item.label}
                            primaryTypographyProps={{
                              fontSize: 13,
                              fontWeight: active ? 700 : 500,
                              whiteSpace: "nowrap",
                            }}
                          />
                        </ListItemButton>
                      );
                    })}
                  </List>
                </Collapse>
              </Box>
            );
          })}
        </List>
      </ScrollArea>

      {/* ═══════ FOOTER : Avatar + Déconnexion ═══════ */}
      <FooterArea>
        <Avatar
          src={typedIdentity?.avatar}
          alt="Utilisateur"
          sx={{
            width: 36,
            height: 36,
            bgcolor: "primary.main",
            color: "primary.contrastText",
            fontSize: 13,
            fontWeight: 700,
            flexShrink: 0,
            cursor: "pointer",
          }}
        >
          {initial}
        </Avatar>

        <Tooltip title="Se déconnecter" arrow>
          <IconButton
            size="small"
            onClick={handleLogout}
            sx={{
              color: "text.secondary",
              flexShrink: 0,
              "&:hover": {
                color: "error.main",
                backgroundColor: "action.hover",
              },
            }}
            aria-label="Se déconnecter"
          >
            <LogoutIcon sx={{ fontSize: "1.15rem" }} />
          </IconButton>
        </Tooltip>
      </FooterArea>
    </MenuContainer>
  );
};