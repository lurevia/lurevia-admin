import { Menu } from "react-admin";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
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
import { normalizeMuiIcon } from "../muiIcon";

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

const SectionLabel = ({ children }: { children: string }) => (
  <Typography
    variant="caption"
    sx={{
      display: "block",
      px: 2,
      pt: 2,
      pb: 0.5,
      color: "text.secondary",
      fontWeight: 700,
      letterSpacing: 0.6,
      textTransform: "uppercase",
      fontSize: 11,
    }}
  >
    {children}
  </Typography>
);

export const LureviaMenu = () => (
  <Menu sx={{ "& .RaMenuItemLink-root": { mx: 1, mb: 0.25 }, pt: 1 }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 2, pb: 1 }}>
      <Box
        sx={{
          width: 30,
          height: 30,
          borderRadius: 1.5,
          bgcolor: "primary.main",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 800,
          fontSize: 14,
        }}
      >
        L
      </Box>
      <Typography sx={{ fontWeight: 800 }}>Lurevia</Typography>
    </Box>

    <Menu.Item to="/" primaryText="Tableau de bord" leftIcon={<DashboardIcon fontSize="small" />} />

    <SectionLabel>Catalogue</SectionLabel>
    <Menu.Item to="/products" primaryText="Produits" leftIcon={<InventoryIcon fontSize="small" />} />
    <Menu.Item to="/categories" primaryText="Catégories" leftIcon={<CategoryIcon fontSize="small" />} />

    <SectionLabel>Ventes</SectionLabel>
    <Menu.Item to="/orders" primaryText="Commandes" leftIcon={<ReceiptIcon fontSize="small" />} />
    <Menu.Item to="/reviews" primaryText="Avis à modérer" leftIcon={<ReviewsIcon fontSize="small" />} />

    <SectionLabel>Clients</SectionLabel>
    <Menu.Item to="/users" primaryText="Utilisateurs" leftIcon={<PeopleIcon fontSize="small" />} />
    <Menu.Item to="/verifications" primaryText="Vérifications de compte" leftIcon={<FactCheckIcon fontSize="small" />} />
    <Menu.Item
      to="/profile-change-requests"
      primaryText="Modifications de profil"
      leftIcon={<ManageAccountsIcon fontSize="small" />}
    />
    <Menu.Item
      to="/deletion-requests"
      primaryText="Suppressions de compte"
      leftIcon={<PersonRemoveIcon fontSize="small" />}
    />
    <Menu.Item to="/messages" primaryText="Messages clients" leftIcon={<MarkEmailReadIcon fontSize="small" />} />
  </Menu>
);
