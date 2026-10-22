import { fetchUtils, HttpError } from "react-admin";

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

export const API_URL = (
  configuredApiUrl || "/api/v1"
).replace(/\/+$/, "");
const ACCESS_TOKEN_KEY = "lurevia_admin_access_token";
const USER_KEY = "lurevia_admin_user";
let refreshInFlight: Promise<string | null> | null = null;

export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const parsed = JSON.parse(jsonPayload);
    if (!parsed.exp) return false;
    // Buffer de 10 secondes pour anticiper l'expiration
    return Date.now() >= parsed.exp * 1000 - 10_000;
  } catch {
    return true;
  }
};

export const getRawAccessToken = (): string | null => localStorage.getItem(ACCESS_TOKEN_KEY);

export const getAccessToken = (): string | null => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (!token) return null;
  if (isTokenExpired(token)) {
    return null;
  }
  return token;
};

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
  let token = getAccessToken();

  // Si le token a expiré mais qu'on a un jeton brut ou une session potentielle, tenter le rafraîchissement
  if (!token && getRawAccessToken()) {
    token = await refreshAccessToken();
  }

  if (token) headers.set("Authorization", `Bearer ${token}`);

  try {
    return await fetchUtils.fetchJson(url, { ...options, headers, credentials: "include" });
  } catch (err) {
    if (err instanceof HttpError) {
      if (err.status === 401) {
        const refreshedToken = await refreshAccessToken();
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
      const body = err.body as
        | { message?: string; code?: string; error?: { message?: string } }
        | undefined;
      const message = body?.error?.message ?? body?.message ?? err.message;
      throw new HttpError(message, err.status, err.body);
    }
    throw err;
  }
};
