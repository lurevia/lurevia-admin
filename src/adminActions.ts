import { API_URL, httpClient } from "./httpClient";

export interface AdminNotificationRecord {
  id: string;
  type: "NEW_ORDER" | "NEW_REVIEW" | "NEW_FEEDBACK" | "DELETION_REQUEST" | "LOW_STOCK";
  title: string;
  message: string;
  entityType: string;
  entityId: string;
  read: boolean;
  createdAt: string;
}

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

export const reviewProfileChange = (id: string, approved: boolean, adminNote?: string) =>
  httpClient(`${API_URL}/admin/profile-change-requests/${id}/review`, {
    method: "POST",
    body: JSON.stringify({ approved, adminNote }),
  });

export const approveVerification = (id: string) =>
  httpClient(`${API_URL}/admin/verifications/${id}/approve`, { method: "POST" });

export const rejectVerification = (id: string, reason?: string) =>
  httpClient(`${API_URL}/admin/verifications/${id}/reject`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });

export const sendAdminMessage = (input: { userId?: string; allUsers?: boolean; subject: string; body: string }) =>
  httpClient(`${API_URL}/admin/messages`, { method: "POST", body: JSON.stringify(input) });

export const fetchUnreadNotificationsCount = async (): Promise<number> => {
  const { json } = await httpClient(`${API_URL}/admin/notifications/unread-count`);
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
