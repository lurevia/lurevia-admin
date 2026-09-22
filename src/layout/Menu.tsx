import { Menu, useGetIdentity } from "react-admin";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import InventoryIcon from "@mui/icons-material/Inventory2";
import CategoryIcon from "@mui/icons-material/Category";
import ReceiptIcon from "@mui/icons-material/ReceiptLong";
import PeopleIcon from "@mui/icons-material/People";
import ReviewsIcon from "@mui/icons-material/RateReview";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

export const LureviaMenu = () => {
  const { identity } = useGetIdentity();

  return (
  <Menu sx={{ "& .RaMenuItemLink-root": { borderRadius: 2.5, mx: 1, mb: 0.5 } }}>
    <Box sx={{ px: 2.5, pt: 2, pb: 2.5 }}>
      <Typography variant="overline" sx={{ color: "primary.light", letterSpacing: 2 }}>LUREVIA</Typography>
      <Typography variant="body2" color="text.secondary">Centre de pilotage</Typography>
    </Box>
    {identity && (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 2.5, pb: 2.5 }}>
        <Avatar sx={{ width: 34, height: 34, bgcolor: "primary.main", fontSize: 14 }}>
          {identity.fullName?.charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" noWrap sx={{ fontWeight: 700 }}>{identity.fullName}</Typography>
          <Typography variant="caption" color="text.secondary">Administrateur</Typography>
        </Box>
      </Box>
    )}
    <Menu.DashboardItem />
    <Menu.Item to="/products" primaryText="Produits" leftIcon={<InventoryIcon />} />
    <Menu.Item to="/categories" primaryText="Catégories" leftIcon={<CategoryIcon />} />
    <Menu.Item to="/orders" primaryText="Commandes" leftIcon={<ReceiptIcon />} />
    <Menu.Item to="/users" primaryText="Utilisateurs" leftIcon={<PeopleIcon />} />
    <Menu.Item to="/reviews" primaryText="Avis à modérer" leftIcon={<ReviewsIcon />} />
    <Menu.Item to="/deletion-requests" primaryText="Suppressions de compte" leftIcon={<PersonRemoveIcon />} />
    <Menu.Item to="/profile-change-requests" primaryText="Modifications de profil" leftIcon={<ManageAccountsIcon />} />
    <Menu.Item to="/verifications" primaryText="Vérifications de compte" leftIcon={<FactCheckIcon />} />
    <Menu.Item to="/messages" primaryText="Messages clients" leftIcon={<MarkEmailReadIcon />} />
  </Menu>
  );
};
