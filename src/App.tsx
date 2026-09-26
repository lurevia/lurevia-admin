import { useMemo } from "react";
import { Admin, Resource, resolveBrowserLocale, CustomRoutes } from "react-admin";
import polyglotI18nProvider from "ra-i18n-polyglot";
import frenchMessages from "ra-language-french";
import { Route } from "react-router-dom";
import { QueryClient } from "react-query";

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

import { dataProvider } from "./dataProvider";
import { authProvider } from "./authProvider";
import { LureviaLayout } from "./layout/Layout";
import { normalizeMuiIcon } from "./muiIcon";

import { ThemeCustomizerProvider, useThemeCustomizer } from "./theme/ThemeCustomizerContext";
import { buildTheme } from "./theme/buildTheme";
import {
  AdminCreatePage,
  AdminMessage,
  CategoryCreatePage,
  CategoryEditPage,
  CategoryListPage,
  CommissionsPage,
  ContractsPage,
  DashboardPage,
  DeletionRequestListPage,
  FinancialDashboardPage,
  LoginPage,
  OrderEditPage,
  OrderListPage,
  ProductCreatePage,
  ProductEditPage,
  ProductListPage,
  ProfileChangeListPage,
  ProfileRoute,
  ReviewListPage,
  SellersPage,
  SettingsRoute,
  SettlementsPage,
  TransfersPage,
  UserEditPage,
  UserListPage,
  VerificationListPage,
} from "./adminPages";

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

const i18nProvider = polyglotI18nProvider(
  () => frenchMessages,
  resolveBrowserLocale("fr")
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 20_000,
      cacheTime: 300_000,
      refetchOnWindowFocus: false,
    },
  },
});

const ThemedAdmin = () => {
  const { config } = useThemeCustomizer();
  const theme = useMemo(() => buildTheme(config), [config]);

  return (
    <Admin
      title="Lurevia — Espace Admin"
      dataProvider={dataProvider}
      queryClient={queryClient}
      authProvider={authProvider}
      i18nProvider={i18nProvider}
      theme={theme}
      layout={LureviaLayout}
      dashboard={DashboardPage}
      loginPage={LoginPage}
      basename="/lurevia-admin"
      requireAuth
      disableTelemetry
    >
      <Resource
        name="products"
        list={ProductListPage}
        edit={ProductEditPage}
        create={ProductCreatePage}
        icon={InventoryIcon}
        options={{ label: "Produits" }}
      />
      <Resource
        name="categories"
        list={CategoryListPage}
        edit={CategoryEditPage}
        create={CategoryCreatePage}
        icon={CategoryIcon}
        options={{ label: "Catégories" }}
      />
      <Resource name="orders" list={OrderListPage} edit={OrderEditPage} icon={ReceiptIcon} options={{ label: "Commandes" }} />
      <Resource name="users" list={UserListPage} edit={UserEditPage} icon={PeopleIcon} options={{ label: "Utilisateurs" }} />
      <Resource name="reviews" list={ReviewListPage} icon={ReviewsIcon} options={{ label: "Avis" }} />
      <Resource
        name="deletion-requests"
        list={DeletionRequestListPage}
        icon={PersonRemoveIcon}
        options={{ label: "Suppressions" }}
      />
      <Resource
        name="profile-change-requests"
        list={ProfileChangeListPage}
        icon={ManageAccountsIcon}
        options={{ label: "Modifications de profil" }}
      />
      <Resource name="verifications" list={VerificationListPage} icon={FactCheckIcon} options={{ label: "Vérifications" }} />
      <Resource name="sellers" list={SellersPage} icon={StorefrontIcon} options={{ label: "Vendeurs" }} />
      <Resource name="contracts" list={ContractsPage} icon={FactCheckIcon} options={{ label: "Contrats" }} />
      <Resource name="settlements" list={SettlementsPage} icon={AccountBalanceIcon} options={{ label: "Settlements" }} />
      <Resource name="commissions" list={CommissionsPage} icon={AccountBalanceIcon} options={{ label: "Commissions" }} />
      <Resource name="transfers" list={TransfersPage} icon={SwapHorizIcon} options={{ label: "Transferts" }} />
      <CustomRoutes>
        <Route path="/messages" element={<AdminMessage />} />
        <Route path="/admins/create" element={<AdminCreatePage />} />
        <Route path="/financial-dashboard" element={<FinancialDashboardPage />} />
        <Route path="/configuration" element={<SettingsRoute />} />
        <Route path="/my-profile" element={<ProfileRoute />} />
      </CustomRoutes>
    </Admin>
  );
};

export const App = () => (
  <ThemeCustomizerProvider>
    <ThemedAdmin />
  </ThemeCustomizerProvider>
);
