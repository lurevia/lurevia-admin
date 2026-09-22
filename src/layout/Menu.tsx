import { Menu } from "react-admin";
import InventoryIcon from "@mui/icons-material/Inventory2";
import CategoryIcon from "@mui/icons-material/Category";
import ReceiptIcon from "@mui/icons-material/ReceiptLong";
import PeopleIcon from "@mui/icons-material/People";
import ReviewsIcon from "@mui/icons-material/RateReview";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

export const LureviaMenu = () => (
  <Menu>
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
