import { lazyAdminPage } from "./utils/lazyAdminPage";

export const DashboardPage = lazyAdminPage(() =>
  import("./dashboard/Dashboard").then((module) => ({ default: module.Dashboard }))
);
export const ProductListPage = lazyAdminPage(() =>
  import("./resources/products/ProductList").then((module) => ({ default: module.ProductList }))
);
export const ProductEditPage = lazyAdminPage(() =>
  import("./resources/products/ProductEdit").then((module) => ({ default: module.ProductEdit }))
);
export const ProductCreatePage = lazyAdminPage(() =>
  import("./resources/products/ProductCreate").then((module) => ({ default: module.ProductCreate }))
);
export const CategoryListPage = lazyAdminPage(() =>
  import("./resources/categories/CategoryList").then((module) => ({ default: module.CategoryList }))
);
export const CategoryEditPage = lazyAdminPage(() =>
  import("./resources/categories/CategoryEdit").then((module) => ({ default: module.CategoryEdit }))
);
export const CategoryCreatePage = lazyAdminPage(() =>
  import("./resources/categories/CategoryCreate").then((module) => ({ default: module.CategoryCreate }))
);
export const OrderListPage = lazyAdminPage(() =>
  import("./resources/orders/OrderList").then((module) => ({ default: module.OrderList }))
);
export const OrderEditPage = lazyAdminPage(() =>
  import("./resources/orders/OrderEdit").then((module) => ({ default: module.OrderEdit }))
);
export const UserListPage = lazyAdminPage(() =>
  import("./resources/users/UserList").then((module) => ({ default: module.UserList }))
);
export const UserEditPage = lazyAdminPage(() =>
  import("./resources/users/UserEdit").then((module) => ({ default: module.UserEdit }))
);
export const ReviewListPage = lazyAdminPage(() =>
  import("./resources/reviews/ReviewList").then((module) => ({ default: module.ReviewList }))
);
export const DeletionRequestListPage = lazyAdminPage(() =>
  import("./resources/deletionRequests/DeletionRequestList").then((module) => ({ default: module.DeletionRequestList }))
);
export const ProfileChangeListPage = lazyAdminPage(() =>
  import("./resources/profileChanges/ProfileChangeList").then((module) => ({ default: module.ProfileChangeList }))
);
export const VerificationListPage = lazyAdminPage(() =>
  import("./resources/verifications/VerificationList").then((module) => ({ default: module.VerificationList }))
);
export const SellersPage = lazyAdminPage(() =>
  import("./resources/finance/FinanceResources").then((module) => ({ default: module.SellersList }))
);
export const ContractsPage = lazyAdminPage(() =>
  import("./resources/finance/FinanceResources").then((module) => ({ default: module.ContractsList }))
);
export const SettlementsPage = lazyAdminPage(() =>
  import("./resources/finance/FinanceResources").then((module) => ({ default: module.SettlementsList }))
);
export const CommissionsPage = lazyAdminPage(() =>
  import("./resources/finance/FinanceResources").then((module) => ({ default: module.CommissionsList }))
);
export const TransfersPage = lazyAdminPage(() =>
  import("./resources/finance/FinanceResources").then((module) => ({ default: module.TransfersList }))
);
export const AdminMessage = lazyAdminPage(() =>
  import("./resources/messages/AdminMessagePage").then((module) => ({ default: module.AdminMessagePage }))
);
export const AdminCreatePage = lazyAdminPage(() =>
  import("./resources/admins/AdminCreate").then((module) => ({ default: module.AdminCreate }))
);
export const FinancialDashboardPage = lazyAdminPage(() =>
  import("./resources/finance/FinancialDashboard").then((module) => ({ default: module.FinancialDashboard }))
);
export const SettingsRoute = lazyAdminPage(() =>
  import("./setting/SettingsPage").then((module) => ({ default: module.SettingsPage }))
);
export const ProfileRoute = lazyAdminPage(() =>
  import("./setting/ProfilePage").then((module) => ({ default: module.ProfilePage }))
);
export const LoginPage = lazyAdminPage(() =>
  import("./auth/LoginPage").then((module) => ({ default: module.LureviaLoginPage }))
);