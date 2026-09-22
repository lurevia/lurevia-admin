import { Admin, Resource, resolveBrowserLocale } from "react-admin";
import polyglotI18nProvider from "ra-i18n-polyglot";
import frenchMessages from "ra-language-french";
import InventoryIcon from "@mui/icons-material/Inventory2";
import CategoryIcon from "@mui/icons-material/Category";
import ReceiptIcon from "@mui/icons-material/ReceiptLong";
import PeopleIcon from "@mui/icons-material/People";
import ReviewsIcon from "@mui/icons-material/RateReview";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { CustomRoutes } from "react-admin";
import { Route } from "react-router-dom";

import { dataProvider } from "./dataProvider";
import { authProvider } from "./authProvider";
import { lureviaAdminTheme } from "./theme";
import { LureviaLayout } from "./layout/Layout";
import { Dashboard } from "./dashboard/Dashboard";

import { ProductList } from "./resources/products/ProductList";
import { ProductEdit } from "./resources/products/ProductEdit";
import { ProductCreate } from "./resources/products/ProductCreate";
import { CategoryList } from "./resources/categories/CategoryList";
import { CategoryEdit } from "./resources/categories/CategoryEdit";
import { CategoryCreate } from "./resources/categories/CategoryCreate";
import { OrderList } from "./resources/orders/OrderList";
import { OrderEdit } from "./resources/orders/OrderEdit";
import { UserList } from "./resources/users/UserList";
import { UserEdit } from "./resources/users/UserEdit";
import { ReviewList } from "./resources/reviews/ReviewList";
import { DeletionRequestList } from "./resources/deletionRequests/DeletionRequestList";
import { ProfileChangeList } from "./resources/profileChanges/ProfileChangeList";
import { VerificationList } from "./resources/verifications/VerificationList";
import { AdminMessagePage } from "./resources/messages/AdminMessagePage";
import { LureviaLoginPage } from "./auth/LoginPage";

// Interface 100% en français, y compris les textes intégrés de react-admin
// (pagination, confirmations, messages d'erreur) — cohérent avec le reste
// du produit Lurevia.
const i18nProvider = polyglotI18nProvider(
  () => frenchMessages,
  resolveBrowserLocale("fr")
);

export const App = () => (
  <Admin
    title="Lurevia — Espace Admin"
    dataProvider={dataProvider}
    authProvider={authProvider}
    i18nProvider={i18nProvider}
    theme={lureviaAdminTheme}
    layout={LureviaLayout}
    dashboard={Dashboard}
    loginPage={LureviaLoginPage}
    basename="/lurevia-admin"
    requireAuth
    disableTelemetry
  >
    <Resource
      name="products"
      list={ProductList}
      edit={ProductEdit}
      create={ProductCreate}
      icon={InventoryIcon}
      options={{ label: "Produits" }}
    />
    <Resource
      name="categories"
      list={CategoryList}
      edit={CategoryEdit}
      create={CategoryCreate}
      icon={CategoryIcon}
      options={{ label: "Catégories" }}
    />
    <Resource name="orders" list={OrderList} edit={OrderEdit} icon={ReceiptIcon} options={{ label: "Commandes" }} />
    <Resource name="users" list={UserList} edit={UserEdit} icon={PeopleIcon} options={{ label: "Utilisateurs" }} />
    <Resource name="reviews" list={ReviewList} icon={ReviewsIcon} options={{ label: "Avis" }} />
    <Resource
      name="deletion-requests"
      list={DeletionRequestList}
      icon={PersonRemoveIcon}
      options={{ label: "Suppressions" }}
    />
    <Resource name="profile-change-requests" list={ProfileChangeList} icon={ManageAccountsIcon} options={{ label: "Modifications de profil" }} />
    <Resource name="verifications" list={VerificationList} icon={FactCheckIcon} options={{ label: "Vérifications" }} />
    <CustomRoutes><Route path="/messages" element={<AdminMessagePage />} /></CustomRoutes>
  </Admin>
);
