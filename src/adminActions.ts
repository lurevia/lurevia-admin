import { API_URL, getAccessToken, httpClient } from "./httpClient";

export interface AdminNotificationRecord {
  id: string;
  type:
    | "NEW_ORDER"
    | "NEW_REVIEW"
    | "NEW_FEEDBACK"
    | "DELETION_REQUEST"
    | "LOW_STOCK";
  title: string;
  message: string;
  entityType: string;
  entityId: string;
  read: boolean;
  createdAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// DEMANDES DE SUPPRESSION DE COMPTE
// ─────────────────────────────────────────────────────────────────────────────

export const approveDeletionRequest = (id: string, adminNote?: string) =>
  httpClient(`${API_URL}/admin/deletion-requests/${id}/approve`, {
    method: "POST",
    body: JSON.stringify({ adminNote }),
  });

export const rejectDeletionRequest = (id: string, adminNote?: string) =>
  httpClient(`${API_URL}/admin/deletion-requests/${id}/reject`, {
    method: "POST",
    body: JSON.stringify({ adminNote }),
  });

// ─────────────────────────────────────────────────────────────────────────────
// MODIFICATIONS DE PROFIL
// ─────────────────────────────────────────────────────────────────────────────

export const reviewProfileChange = (
  id: string,
  approved: boolean,
  adminNote?: string
) =>
  httpClient(`${API_URL}/admin/profile-change-requests/${id}/review`, {
    method: "POST",
    body: JSON.stringify({ approved, adminNote }),
  });

// ─────────────────────────────────────────────────────────────────────────────
// VÉRIFICATIONS DE COMPTE
// ─────────────────────────────────────────────────────────────────────────────

export const approveVerification = (id: string) =>
  httpClient(`${API_URL}/admin/identity-verifications/${id}/approve`, { method: "POST" });

export const rejectVerification = (id: string, reason?: string) =>
  httpClient(`${API_URL}/admin/identity-verifications/${id}/reject`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });

// ─────────────────────────────────────────────────────────────────────────────
// MODÉRATION DES AVIS PRODUITS (NOUVEAU)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Approuve un avis produit : il devient public sur la fiche produit.
 * POST /admin/reviews/:id/approve
 */
export const approveReview = (id: string) =>
  httpClient(`${API_URL}/admin/reviews/${id}/approve`, {
    method: "POST",
  });

/**
 * Rejette un avis produit avec une raison optionnelle.
 * POST /admin/reviews/:id/reject  { reason?: string }
 */
export const rejectReview = (id: string, reason?: string) =>
  httpClient(`${API_URL}/admin/reviews/${id}/reject`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });

// ─────────────────────────────────────────────────────────────────────────────
// MESSAGERIE ADMIN
// ─────────────────────────────────────────────────────────────────────────────

export const sendAdminMessage = (input: {
  userId?: string;
  allUsers?: boolean;
  subject: string;
  body: string;
}) =>
  httpClient(`${API_URL}/admin/messages`, {
    method: "POST",
    body: JSON.stringify(input),
  });

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATIONS ADMIN & REDIRECTION
// ─────────────────────────────────────────────────────────────────────────────

const READ_NOTIFS_STORAGE_KEY = "lurevia_admin_read_notifications";

export const getLocalReadNotificationIds = (): Set<string> => {
  try {
    const stored = localStorage.getItem(READ_NOTIFS_STORAGE_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
};

export const saveLocalReadNotificationId = (id: string) => {
  try {
    const set = getLocalReadNotificationIds();
    set.add(id);
    localStorage.setItem(READ_NOTIFS_STORAGE_KEY, JSON.stringify(Array.from(set)));
  } catch {}
};

export const saveAllLocalReadNotificationIds = (ids: string[]) => {
  try {
    const set = getLocalReadNotificationIds();
    ids.forEach((id) => set.add(id));
    localStorage.setItem(READ_NOTIFS_STORAGE_KEY, JSON.stringify(Array.from(set)));
  } catch {}
};

export const fetchUnreadNotificationsCount = async (): Promise<number> => {
  if (!getAccessToken()) {
    return 0;
  }
  try {
    const { json } = await httpClient(`${API_URL}/admin/notifications/unread-count`);
    const count = Number(json?.data?.count);
    if (!isNaN(count) && count >= 0) return count;
  } catch {}

  const all = await fetchAdminNotifications(true, 50);
  return all.length;
};

export const fetchAdminNotifications = async (
  unreadOnly = false,
  limit = 20
): Promise<AdminNotificationRecord[]> => {
  const localReadIds = getLocalReadNotificationIds();
  let items: AdminNotificationRecord[] = [];

  if (getAccessToken()) {
    try {
      const { json } = await httpClient(
        `${API_URL}/admin/notifications?limit=${limit}&unreadOnly=${unreadOnly}`
      );
      items = (json.data?.items ?? []) as AdminNotificationRecord[];
    } catch (err) {
      console.warn("[Admin] Impossible de récupérer les notifications:", err);
    }
  }

  // Appliquer les statuts lus enregistrés localement
  items = items.map((item) => ({
    ...item,
    read: item.read || localReadIds.has(item.id),
  }));

  if (unreadOnly) {
    items = items.filter((item) => !item.read);
  }

  return items.slice(0, limit);
};

export const markNotificationRead = async (id: string) => {
  saveLocalReadNotificationId(id);
  try {
    await httpClient(`${API_URL}/admin/notifications/${id}/read`, { method: "POST" });
  } catch {}
};

export const markAllNotificationsRead = async () => {
  const allNotifs = await fetchAdminNotifications(false, 100);
  saveAllLocalReadNotificationIds(allNotifs.map((n) => n.id));
  try {
    await httpClient(`${API_URL}/admin/notifications/read-all`, { method: "POST" });
  } catch {}
};

/**
 * Redirige instantanément vers l'entité concernée lors d'un clic sur une notification.
 */
export const navigateToNotification = (
  navigate: (path: string) => void,
  notification: AdminNotificationRecord
) => {
  void markNotificationRead(notification.id);

  const type = (notification.type || "").toUpperCase();
  const entityType = (notification.entityType || "").toLowerCase();
  const entityId = notification.entityId;

  if (type === "NEW_ORDER" || entityType === "order" || entityType === "orders") {
    navigate(entityId ? `/orders/${entityId}` : "/orders");
  } else if (type === "NEW_REVIEW" || entityType === "review" || entityType === "reviews") {
    navigate("/reviews");
  } else if (type === "NEW_FEEDBACK" || entityType === "feedback") {
    navigate("/reviews");
  } else if (type === "LOW_STOCK" || entityType === "product" || entityType === "products") {
    navigate(entityId ? `/products/${entityId}` : "/products");
  } else if (type === "DELETION_REQUEST" || entityType === "deletionrequest" || entityType === "deletion-requests") {
    navigate("/deletion-requests");
  } else if (entityType === "verification" || entityType === "identity-verifications") {
    navigate("/identity-verifications");
  } else if (entityType === "profilechange" || entityType === "profile-change-requests") {
    navigate("/profile-change-requests");
  } else if (entityType === "user" || entityType === "users") {
    navigate(entityId ? `/users/${entityId}` : "/users");
  } else if (entityType === "seller" || entityType === "sellers") {
    navigate("/sellers");
  } else if (entityType === "settlement" || entityType === "settlements") {
    navigate("/settlements");
  } else {
    navigate("/orders");
  }
};

const STATUS_COLORS: Record<string, string> = {
  DELIVERED: "#0A8F63",
  COD_PENDING: "#E8A33D",
  SHIPPED: "#0EA5E9",
  PROCESSING: "#2F7BF6",
  CANCELLED: "#C41E3A",
};

const STATUS_LABELS: Record<string, string> = {
  DELIVERED: "Livrées",
  COD_PENDING: "En attente paiement",
  SHIPPED: "En cours",
  PROCESSING: "En préparation",
  CANCELLED: "Annulées",
};

export interface AdminDashboardStats {
  totalUsers: number;
  newUsers7d: number;
  totalProducts: number;
  lowStockProducts: number;
  pendingOrders: number;
  revenue30d: number;
  orders30dCount: number;
  pendingReviewsCount: number;
  pendingIdentityVerifications: number;
  pendingDeletionRequests: number;
  unreadAdminNotifications: number;
  totalReviews: number;
  revenueSeries: Array<{ date: string; revenue: number; orders?: number }>;
  ordersByStatus: Array<{ status: string; count: number; color?: string }>;
  salesByCategory: Array<{ name: string; value: number }>;
  topProducts: Array<{ name: string; sales: number; revenue?: number }>;
  paymentMethods: Array<{ name: string; value: number; color?: string }>;
  userGrowth: Array<{ date: string; users: number }>;
}

const EMPTY_STATS: AdminDashboardStats = {
  totalUsers: 0,
  newUsers7d: 0,
  totalProducts: 0,
  lowStockProducts: 0,
  pendingOrders: 0,
  revenue30d: 0,
  orders30dCount: 0,
  pendingReviewsCount: 0,
  pendingIdentityVerifications: 0,
  pendingDeletionRequests: 0,
  unreadAdminNotifications: 0,
  totalReviews: 0,
  revenueSeries: [],
  ordersByStatus: [],
  salesByCategory: [],
  topProducts: [],
  paymentMethods: [],
  userGrowth: [],
};

export const fetchStats = async (): Promise<AdminDashboardStats> => {
  if (!getAccessToken()) {
    return EMPTY_STATS;
  }
  try {
    const { json } = await httpClient(`${API_URL}/admin/stats`);
    const live = json?.data?.stats;

    if (!live) return EMPTY_STATS;

    const formattedOrdersByStatus = Array.isArray(live.ordersByStatus)
      ? live.ordersByStatus.map((entry: any) => ({
          status: STATUS_LABELS[entry.status] || entry.status,
          count: Number(entry.count) || 0,
          color: STATUS_COLORS[entry.status] || "#2F7BF6",
        }))
      : [];

    return {
      totalUsers: Number(live.totalUsers) || 0,
      newUsers7d: Number(live.newUsers7d) || 0,
      totalProducts: Number(live.totalProducts) || 0,
      lowStockProducts: Number(live.lowStockProducts) || 0,
      pendingOrders: Number(live.pendingOrders) || 0,
      revenue30d: Number(live.revenue30d) || 0,
      orders30dCount: Number(live.orders30dCount) || 0,
      pendingReviewsCount: Number(live.pendingReviewsCount) || 0,
      pendingIdentityVerifications: Number(live.pendingIdentityVerifications) || 0,
      pendingDeletionRequests: Number(live.pendingDeletionRequests) || 0,
      unreadAdminNotifications: Number(live.unreadAdminNotifications) || 0,
      totalReviews: Number(live.totalReviews) || 0,
      revenueSeries: Array.isArray(live.revenueSeries) ? live.revenueSeries : [],
      ordersByStatus: formattedOrdersByStatus,
      salesByCategory: Array.isArray(live.salesByCategory) ? live.salesByCategory : [],
      topProducts: Array.isArray(live.topProducts) ? live.topProducts : [],
      paymentMethods: Array.isArray(live.paymentMethods) ? live.paymentMethods : [],
      userGrowth: Array.isArray(live.userGrowth) ? live.userGrowth : [],
    };
  } catch (err) {
    console.error("[Admin] Erreur lors de la récupération des statistiques:", err);
    return EMPTY_STATS;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PARAMÈTRES DE LA PLATEFORME
// ─────────────────────────────────────────────────────────────────────────────

export interface PlatformSettings {
  id: string;
  siteName: string;
  siteTagline: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  defaultCurrency: string;

  logoUrl: string | null;
  faviconUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;

  facebookUrl: string | null;
  instagramUrl: string | null;
  tiktokUrl: string | null;
  whatsappNumber: string | null;
  linkedinUrl: string | null;

  privacyPolicy: string;
  termsOfService: string;
  cookieMessage: string;
  legalCompanyName: string;
  legalRegistrationNumber: string | null;

  freeShippingThreshold: number;
  defaultShippingCost: number;

  enableMVola: boolean;
  enableCOD: boolean;
  enableCard: boolean;
  enableBankTransfer: boolean;
  mvolaMerchantNumber: string | null;
  codMaxAmount: number | null;

  notifyOnNewOrder: boolean;
  notifyOnNewReview: boolean;
  notifyOnLowStock: boolean;
  lowStockThreshold: number;
  sendOrderConfirmation: boolean;
  sendShippingNotification: boolean;

  metaTitle: string | null;
  metaDescription: string | null;

  maintenanceMode: boolean;
  maintenanceMessage: string;

  updatedAt: string;
  updatedBy: string | null;
}

export const fetchSettings = async (): Promise<PlatformSettings> => {
  const { json } = await httpClient(`${API_URL}/settings/admin`);
  return json.data as PlatformSettings;
};

export const updateSettings = async (
  patch: Partial<PlatformSettings>
): Promise<PlatformSettings> => {
  const { json } = await httpClient(`${API_URL}/settings/admin`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
  return json.data as PlatformSettings;
};

export type SitePageSection = "NAVIGATION" | "SERVICES" | "INFORMATION";

export interface SitePageRecord {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  published: boolean;
  showInFooter: boolean;
  footerSection: SitePageSection | null;
  updatedAt: string;
}

export type SitePageInput = Omit<SitePageRecord, "id" | "updatedAt">;

export const fetchSitePages = async (): Promise<SitePageRecord[]> => {
  const { json } = await httpClient(`${API_URL}/pages/admin`);
  return json.data as SitePageRecord[];
};

export const createSitePage = async (
  page: SitePageInput
): Promise<SitePageRecord> => {
  const { json } = await httpClient(`${API_URL}/pages/admin`, {
    method: "POST",
    body: JSON.stringify(page),
  });
  return json.data as SitePageRecord;
};

export const updateSitePage = async (
  id: string,
  page: SitePageInput
): Promise<SitePageRecord> => {
  const { json } = await httpClient(`${API_URL}/pages/admin/${id}`, {
    method: "PATCH",
    body: JSON.stringify(page),
  });
  return json.data as SitePageRecord;
};

export const deleteSitePage = async (id: string): Promise<void> => {
  await httpClient(`${API_URL}/pages/admin/${id}`, { method: "DELETE" });
};