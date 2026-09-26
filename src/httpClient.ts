import { fetchUtils, HttpError } from "react-admin";

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

export const API_URL = (
  configuredApiUrl || "http://localhost:4000/api/v1"
).replace(/\/+$/, "");
const ACCESS_TOKEN_KEY = "lurevia_admin_access_token";
const USER_KEY = "lurevia_admin_user";
let refreshInFlight: Promise<string | null> | null = null;

export const getAccessToken = (): string | null => localStorage.getItem(ACCESS_TOKEN_KEY);
export const setAccessToken = (token: string): void => localStorage.setItem(ACCESS_TOKEN_KEY, token);
export const clearAccessToken = (): void => localStorage.removeItem(ACCESS_TOKEN_KEY);

export const clearAdminSession = (): void => {
  clearAccessToken();
  localStorage.removeItem(USER_KEY);
};

export const refreshAccessToken = (): Promise<string | null> => {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { Accept: "application/json" },
    credentials: "include",
  })
    .then(async (response) => {
      const body = await response.json().catch(() => null);
      const session = body?.data as { accessToken?: string; user?: { role?: string } } | undefined;
      if (!response.ok || !session?.accessToken || session.user?.role !== "ADMIN") {
        if (response.status === 401 || response.status === 403 || session?.user?.role !== "ADMIN") {
          clearAdminSession();
        }
        return null;
      }
      setAccessToken(session.accessToken);
      if (session.user) localStorage.setItem(USER_KEY, JSON.stringify(session.user));
      return session.accessToken;
    })
    .catch(() => null)
    .finally(() => {
      refreshInFlight = null;
    });

  return refreshInFlight;
};

export const httpClient = async (url: string, options: fetchUtils.Options = {}) => {
  const headers = new Headers(options.headers ?? { Accept: "application/json" });
  const token = getAccessToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  try {
    return await fetchUtils.fetchJson(url, { ...options, headers, credentials: "include" });
  } catch (err) {
    if (err instanceof HttpError) {
      if (err.status === 401) {
        const currentToken = getAccessToken();
        const refreshedToken = currentToken !== token
          ? currentToken
          : await refreshAccessToken();
        if (refreshedToken) {
          const retryHeaders = new Headers(options.headers ?? { Accept: "application/json" });
          retryHeaders.set("Authorization", `Bearer ${refreshedToken}`);
          return fetchUtils.fetchJson(url, {
            ...options,
            headers: retryHeaders,
            credentials: "include",
          });
        }
      }
      const body = err.body as { message?: string; code?: string } | undefined;
      throw new HttpError(body?.message ?? err.message, err.status, err.body);
    }
    throw err;
  }
};
