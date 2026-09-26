import { useEffect, useState } from "react";
import { useLogout, useGetIdentity } from "react-admin";
import { Link, useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import MenuOpenIconModule from "@mui/icons-material/MenuOpen";
import MenuIconModule from "@mui/icons-material/Menu";
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

// ─── Icônes normalisées ───
const MenuOpenIcon = normalizeMuiIcon(MenuOpenIconModule);
const MenuIcon = normalizeMuiIcon(MenuIconModule);
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

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = "lurevia-admin-menu-collapsed";
const STORAGE_OPEN_KEY = "lurevia-admin-menu-open-categories";
const RAIL_WIDTH = 72;
const EXPANDED_WIDTH = 240;

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
      { to: "/admins/create", label: "Créer un administrateur", icon: AdminPanelSettingsIcon },
      { to: "/verifications", label: "Vérifications de compte", icon: FactCheckIcon },
      { to: "/profile-change-requests", label: "Modifications de profil", icon: ManageAccountsIcon },
      { to: "/deletion-requests", label: "Suppressions de compte", icon: PersonRemoveIcon },
      { to: "/messages", label: "Messages clients", icon: MarkEmailReadIcon },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

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

// sx pour l'en-tête de catégorie
const categoryHeaderSx = (collapsed: boolean) => ({
  borderRadius: 1,
  margin: "2px 8px",
  minHeight: 40,
  pl: collapsed ? 0 : 1.5,
  pr: collapsed ? 0 : 1.5,
  justifyContent: collapsed ? "center" : "flex-start",
  "& .MuiListItemIcon-root": {
    minWidth: collapsed ? 0 : 32,
    mr: collapsed ? 0 : 1,
    justifyContent: "center",
  },
}) as const;

// sx pour un item de menu (lien)
const itemLinkSx = (active: boolean) => ({
  borderRadius: 1,
  margin: "2px 8px 2px 20px",
  minHeight: 36,
  pl: 1.5,
  pr: 1.5,
  ...(active && {
    backgroundColor: "action.selected",
    "&:hover": { backgroundColor: "action.selected" },
  }),
}) as const;

// ─────────────────────────────────────────────────────────────────────────────
// STYLES STRUCTURELS
// ─────────────────────────────────────────────────────────────────────────────

const MenuContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "collapsed",
})<{ collapsed: boolean }>(({ theme, collapsed }) => ({
  width: collapsed ? RAIL_WIDTH : EXPANDED_WIDTH,
  minWidth: collapsed ? RAIL_WIDTH : EXPANDED_WIDTH,
  height: "100%",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  transition: theme.transitions.create(["width", "min-width"], {
    duration: theme.transitions.duration.standard,
    easing: theme.transitions.easing.easeInOut,
  }),
}));

const MenuHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(1.5),
  minHeight: 56,
  gap: theme.spacing(1),
  flexShrink: 0,
}));

const LogoBox = styled(Box)(({ theme }) => ({
  width: 34,
  height: 34,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 800,
  fontSize: 16,
  flexShrink: 0,
}));

const ScrollArea = styled(Box)({
  flex: 1,
  overflowY: "auto",
  overflowX: "hidden",
  "&::-webkit-scrollbar": { width: 6 },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(128,128,128,0.25)",
    borderRadius: 3,
  },
});

const FooterArea = styled(Box)(({ theme }) => ({
  flexShrink: 0,
  borderTop: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(1),
}));

// ─────────────────────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────────────────────

export const LureviaMenu = () => {
  const location = useLocation();
  const logout = useLogout();
  const { identity } = useGetIdentity();

  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(STORAGE_KEY) === "true";
  });

  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const raw = window.localStorage.getItem(STORAGE_OPEN_KEY);
      return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, String(collapsed));
    }
  }, [collapsed]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_OPEN_KEY, JSON.stringify(openCategories));
    }
  }, [openCategories]);

  useEffect(() => {
    const activeId = findActiveCategoryId(location.pathname);
    if (activeId) {
      setOpenCategories((prev) =>
        prev[activeId] ? prev : { ...prev, [activeId]: true }
      );
    }
  }, [location.pathname]);

  const toggleCollapsed = () => setCollapsed((prev) => !prev);

  const toggleCategory = (id: string) => {
    if (collapsed) setCollapsed(false);
    setOpenCategories((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLogout = () => {
    logout();
  };

  const initial = identity?.fullName?.charAt(0).toUpperCase() ?? "?";
  const displayName = identity?.fullName ?? "Utilisateur";

  return (
    <MenuContainer collapsed={collapsed}>
      {/* ═══════ HEADER ═══════ */}
      <MenuHeader>
        {!collapsed ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, overflow: "hidden" }}>
            <LogoBox>L</LogoBox>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: 15,
                whiteSpace: "nowrap",
                color: "text.primary",
              }}
            >
              Lurevia
            </Typography>
          </Box>
        ) : (
          <LogoBox>L</LogoBox>
        )}

        <Tooltip title={collapsed ? "Déployer le menu" : "Réduire le menu"} arrow>
          <IconButton
            size="small"
            onClick={toggleCollapsed}
            sx={{
              ml: collapsed ? 0 : "auto",
              color: "text.secondary",
              "&:hover": { color: "primary.main" },
            }}
            aria-label={collapsed ? "Déployer le menu" : "Réduire le menu"}
          >
            {collapsed ? <MenuIcon fontSize="small" /> : <MenuOpenIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      </MenuHeader>

      <Divider />

      {/* ═══════ ZONE SCROLLABLE ═══════ */}
      <ScrollArea>
        <List disablePadding sx={{ pt: 1, pb: 1 }}>
          {/* Tableau de bord */}
          <Tooltip title={collapsed ? "Tableau de bord" : ""} placement="right" arrow>
            <ListItemButton
              component={Link}
              to="/"
              sx={{
                ...itemLinkSx(matchesPath(location.pathname, "/")),
                margin: "2px 8px",
                justifyContent: collapsed ? "center" : "flex-start",
                pl: collapsed ? 0 : 1.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: collapsed ? 0 : 32,
                  mr: collapsed ? 0 : 1,
                  justifyContent: "center",
                }}
              >
                <DashboardIcon fontSize="small" />
              </ListItemIcon>
              {!collapsed && <ListItemText primary="Tableau de bord" />}
            </ListItemButton>
          </Tooltip>

          <Divider sx={{ mx: 2, my: 1.5 }} />

          {/* Catégories */}
          {MENU_CATEGORIES.map((category) => {
            const CategoryIcon = category.icon;
            const isOpen = !!openCategories[category.id];
            const hasActiveChild = category.items.some((item) =>
              matchesPath(location.pathname, item.to)
            );

            return (
              <Box key={category.id}>
                <Tooltip
                  title={collapsed ? category.label : ""}
                  placement="right"
                  arrow
                >
                  <ListItemButton
                    onClick={() => toggleCategory(category.id)}
                    sx={{
                      ...categoryHeaderSx(collapsed),
                      ...(hasActiveChild && !isOpen && { color: "primary.main" }),
                    }}
                  >
                    <ListItemIcon>
                      <CategoryIcon fontSize="small" />
                    </ListItemIcon>

                    {!collapsed && (
                      <>
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
                          }}
                        />
                      </>
                    )}
                  </ListItemButton>
                </Tooltip>

                {!collapsed && (
                  <Collapse in={isOpen} timeout={200} unmountOnExit>
                    <List disablePadding>
                      {category.items.map((item) => {
                        const ItemIcon = item.icon;
                        const active = matchesPath(location.pathname, item.to);

                        return (
                          <ListItemButton
                            key={item.to}
                            component={Link}
                            to={item.to}
                            sx={itemLinkSx(active)}
                          >
                            <ListItemIcon sx={{ minWidth: 32 }}>
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
                )}
              </Box>
            );
          })}
        </List>
      </ScrollArea>

      {/* ═══════ FOOTER ═══════ */}
      <FooterArea>
        <Tooltip title={collapsed ? `${displayName} — Se déconnecter` : ""} placement="right" arrow>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 1,
              justifyContent: collapsed ? "center" : "flex-start",
              pl: collapsed ? 0 : 1,
              pr: collapsed ? 0 : 1,
              "&:hover": { backgroundColor: "action.hover" },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: collapsed ? 0 : 40,
                mr: collapsed ? 0 : 1,
                justifyContent: "center",
              }}
            >
              <Avatar
                src={identity?.avatar}
                alt={displayName}
                sx={{
                  width: 30,
                  height: 30,
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {initial}
              </Avatar>
            </ListItemIcon>

            {!collapsed && (
              <>
                <Box sx={{ flex: 1, minWidth: 0, ml: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {displayName}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ whiteSpace: "nowrap" }}
                  >
                    Se déconnecter
                  </Typography>
                </Box>
                <LogoutIcon fontSize="small" sx={{ opacity: 0.6 }} />
              </>
            )}
          </ListItemButton>
        </Tooltip>
      </FooterArea>
    </MenuContainer>
  );
};