import { fetchUtils, HttpError } from "react-admin";

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

// Keep the deployed admin usable even when the Pages repository variable was
// not configured yet. The workflow still injects VITE_API_URL when available.
export const API_URL = (
  configuredApiUrl || "https://lurevia-ecommerce.onrender.com/api/v1"
).replace(/\/+$/, "");
const ACCESS_TOKEN_KEY = "lurevia_admin_access_token";

export const getAccessToken = (): string | null => localStorage.getItem(ACCESS_TOKEN_KEY);
export const setAccessToken = (token: string): void => localStorage.setItem(ACCESS_TOKEN_KEY, token);
export const clearAccessToken = (): void => localStorage.removeItem(ACCESS_TOKEN_KEY);

export const httpClient = async (url: string, options: fetchUtils.Options = {}) => {
  const headers = new Headers(options.headers ?? { Accept: "application/json" });
  const token = getAccessToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  try {
    return await fetchUtils.fetchJson(url, { ...options, headers, credentials: "include" });
  } catch (err) {
    if (err instanceof HttpError) {
      const body = err.body as { message?: string; code?: string } | undefined;
      throw new HttpError(body?.message ?? err.message, err.status, err.body);
    }
    throw err;
  }
};
