import { API_URL, httpClient } from "./httpClient";

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
  httpClient(`${API_URL}/admin/verifications/${id}/approve`, { method: "POST" });

export const rejectVerification = (id: string, reason?: string) =>
  httpClient(`${API_URL}/admin/verifications/${id}/reject`, {
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
// NOTIFICATIONS ADMIN
// ─────────────────────────────────────────────────────────────────────────────

export const fetchUnreadNotificationsCount = async (): Promise<number> => {
  const { json } = await httpClient(
    `${API_URL}/admin/notifications/unread-count`
  );
  return json.data.count as number;
};

export const fetchAdminNotifications = async (
  unreadOnly = false,
  limit = 10
): Promise<AdminNotificationRecord[]> => {
  const { json } = await httpClient(
    `${API_URL}/admin/notifications?limit=${limit}&unreadOnly=${unreadOnly}`
  );
  return json.data.items as AdminNotificationRecord[];
};

export const markNotificationRead = (id: string) =>
  httpClient(`${API_URL}/admin/notifications/${id}/read`, { method: "POST" });

export const markAllNotificationsRead = () =>
  httpClient(`${API_URL}/admin/notifications/read-all`, { method: "POST" });

export const fetchStats = async () => {
  const { json } = await httpClient(`${API_URL}/admin/stats`);
  return json.data.stats as {
    totalUsers: number;
    newUsers7d: number;
    totalProducts: number;
    lowStockProducts: number;
    pendingOrders: number;
    revenue30d: number;
    orders30dCount: number;
    totalReviews: number;
    pendingDeletionRequests: number;
    unreadAdminNotifications: number;
  };
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
  const { json } = await httpClient(`${API_URL}/admin/settings`);
  return json.data as PlatformSettings;
};

export const updateSettings = async (
  patch: Partial<PlatformSettings>
): Promise<PlatformSettings> => {
  const { json } = await httpClient(`${API_URL}/admin/settings`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
  return json.data as PlatformSettings;
};