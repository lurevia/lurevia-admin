import { Menu } from "react-admin";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import DashboardIcon from "@mui/icons-material/GridViewRounded";
import InventoryIcon from "@mui/icons-material/Inventory2";
import CategoryIcon from "@mui/icons-material/Category";
import ReceiptIcon from "@mui/icons-material/ReceiptLong";
import PeopleIcon from "@mui/icons-material/People";
import ReviewsIcon from "@mui/icons-material/RateReview";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

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
