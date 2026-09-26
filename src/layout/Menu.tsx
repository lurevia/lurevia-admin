import { useEffect, useState, type ReactNode } from "react";
import { Menu as RaMenu } from "react-admin";
import { styled, type Theme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Divider from "@mui/material/Divider";
import MenuOpenIconModule from "@mui/icons-material/MenuOpen";
import MenuIconModule from "@mui/icons-material/Menu";
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
import { normalizeMuiIcon } from "../muiIcon";

const MenuOpenIcon = normalizeMuiIcon(MenuOpenIconModule);
const MenuIcon = normalizeMuiIcon(MenuIconModule);
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

const STORAGE_KEY = "lurevia-admin-menu-collapsed";
const RAIL_WIDTH = 72;
const EXPANDED_WIDTH = 240;

// ─────────────────────────────────────────────────────────────────────────────
// STYLES STRUCTURELS (aucune couleur — tout vient du thème)
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
  // ⚠️ PAS de backgroundColor ni borderRight : le Drawer les fournit via le thème.
  transition: theme.transitions.create(["width", "min-width"], {
    duration: theme.transitions.duration.standard,
    easing: theme.transitions.easing.easeInOut,
  }),

  // Mode rail : items centrés, labels masqués
  ...(collapsed && {
    "& .RaMenuItemLink-label": {
      opacity: 0,
      width: 0,
      pointerEvents: "none",
    },
    "& .RaMenuItemLink-root": {
      justifyContent: "center",
      paddingLeft: 0,
      paddingRight: 0,
      marginLeft: 8,
      marginRight: 8,
    },
    "& .MuiListItemIcon-root": {
      minWidth: 0,
      marginRight: 0,
      justifyContent: "center",
    },
  }),
}));

const MenuHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(1.5),
  minHeight: 56,
  gap: theme.spacing(1),
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

const SectionLabel = ({
  children,
  collapsed,
}: {
  children: string;
  collapsed: boolean;
}) =>
  collapsed ? (
    <Divider sx={{ mx: 2, my: 1.5 }} />
  ) : (
    <Typography
      variant="caption"
      sx={{
        display: "block",
        px: 2.5,
        pt: 2.5,
        pb: 0.75,
        color: "text.secondary",
        fontWeight: 700,
        letterSpacing: 0.6,
        textTransform: "uppercase",
        fontSize: 10.5,
        opacity: 0.85,
      }}
    >
      {children}
    </Typography>
  );

const ItemWrapper = ({
  collapsed,
  label,
  children,
}: {
  collapsed: boolean;
  label: string;
  children: ReactNode;
}) =>
  collapsed ? (
    <Tooltip title={label} placement="right" arrow>
      <Box>{children}</Box>
    </Tooltip>
  ) : (
    <>{children}</>
  );


export const LureviaMenu = () => {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(STORAGE_KEY) === "true";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, String(collapsed));
    }
  }, [collapsed]);

  const toggle = () => setCollapsed((prev) => !prev);

  return (
    <MenuContainer collapsed={collapsed}>
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
            onClick={toggle}
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

      <RaMenu sx={{ pt: 1, pb: 2 }}>
        <ItemWrapper collapsed={collapsed} label="Tableau de bord">
          <RaMenu.Item to="/" primaryText="Tableau de bord" leftIcon={<DashboardIcon fontSize="small" />} />
        </ItemWrapper>

        <SectionLabel collapsed={collapsed}>Catalogue</SectionLabel>
        <ItemWrapper collapsed={collapsed} label="Produits">
          <RaMenu.Item to="/products" primaryText="Produits" leftIcon={<InventoryIcon fontSize="small" />} />
        </ItemWrapper>
        <ItemWrapper collapsed={collapsed} label="Catégories">
          <RaMenu.Item to="/categories" primaryText="Catégories" leftIcon={<CategoryIcon fontSize="small" />} />
        </ItemWrapper>

        <SectionLabel collapsed={collapsed}>Ventes</SectionLabel>
        <ItemWrapper collapsed={collapsed} label="Commandes">
          <RaMenu.Item to="/orders" primaryText="Commandes" leftIcon={<ReceiptIcon fontSize="small" />} />
        </ItemWrapper>
        <ItemWrapper collapsed={collapsed} label="Avis à modérer">
          <RaMenu.Item to="/reviews" primaryText="Avis à modérer" leftIcon={<ReviewsIcon fontSize="small" />} />
        </ItemWrapper>

        <SectionLabel collapsed={collapsed}>Finance</SectionLabel>
        <ItemWrapper collapsed={collapsed} label="Pilotage financier">
          <RaMenu.Item to="/financial-dashboard" primaryText="Pilotage financier" leftIcon={<BarChartIcon fontSize="small" />} />
        </ItemWrapper>
        <ItemWrapper collapsed={collapsed} label="Vendeurs">
          <RaMenu.Item to="/sellers" primaryText="Vendeurs" leftIcon={<StorefrontIcon fontSize="small" />} />
        </ItemWrapper>
        <ItemWrapper collapsed={collapsed} label="Contrats">
          <RaMenu.Item to="/contracts" primaryText="Contrats" leftIcon={<FactCheckIcon fontSize="small" />} />
        </ItemWrapper>
        <ItemWrapper collapsed={collapsed} label="Settlements">
          <RaMenu.Item to="/settlements" primaryText="Settlements" leftIcon={<AccountBalanceIcon fontSize="small" />} />
        </ItemWrapper>
        <ItemWrapper collapsed={collapsed} label="Commissions">
          <RaMenu.Item to="/commissions" primaryText="Commissions" leftIcon={<AccountBalanceIcon fontSize="small" />} />
        </ItemWrapper>
        <ItemWrapper collapsed={collapsed} label="Transferts">
          <RaMenu.Item to="/transfers" primaryText="Transferts" leftIcon={<SwapHorizIcon fontSize="small" />} />
        </ItemWrapper>

        <SectionLabel collapsed={collapsed}>Clients</SectionLabel>
        <ItemWrapper collapsed={collapsed} label="Utilisateurs">
          <RaMenu.Item to="/users" primaryText="Utilisateurs" leftIcon={<PeopleIcon fontSize="small" />} />
        </ItemWrapper>
        <ItemWrapper collapsed={collapsed} label="Créer un administrateur">
          <RaMenu.Item to="/admins/create" primaryText="Créer un administrateur" leftIcon={<AdminPanelSettingsIcon fontSize="small" />} />
        </ItemWrapper>
        <ItemWrapper collapsed={collapsed} label="Vérifications de compte">
          <RaMenu.Item to="/verifications" primaryText="Vérifications de compte" leftIcon={<FactCheckIcon fontSize="small" />} />
        </ItemWrapper>
        <ItemWrapper collapsed={collapsed} label="Modifications de profil">
          <RaMenu.Item to="/profile-change-requests" primaryText="Modifications de profil" leftIcon={<ManageAccountsIcon fontSize="small" />} />
        </ItemWrapper>
        <ItemWrapper collapsed={collapsed} label="Suppressions de compte">
          <RaMenu.Item to="/deletion-requests" primaryText="Suppressions de compte" leftIcon={<PersonRemoveIcon fontSize="small" />} />
        </ItemWrapper>
        <ItemWrapper collapsed={collapsed} label="Messages clients">
          <RaMenu.Item to="/messages" primaryText="Messages clients" leftIcon={<MarkEmailReadIcon fontSize="small" />} />
        </ItemWrapper>
      </RaMenu>
    </MenuContainer>
  );
};