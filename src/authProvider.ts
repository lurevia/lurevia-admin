import type { AuthProvider } from "react-admin";
import { API_URL, clearAccessToken, getAccessToken, setAccessToken } from "./httpClient";

const USER_KEY = "lurevia_admin_user";

interface StoredUser {
  id: string;
  fullName: string;
  email?: string;
  role: "CUSTOMER" | "ADMIN";
  avatarUrl?: string;
}

const getStoredUser = (): StoredUser | null => {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as StoredUser) : null;
};

export const authProvider: AuthProvider = {
  async login({ username, password }) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email: username, password }),
    });

    const body = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(body?.message ?? "Identifiants incorrects.");
    }

    const { user, accessToken } = body.data as { user: StoredUser; accessToken: string };

    // Le back-office est réservé aux comptes ADMIN — un client normal ne
    // doit jamais pouvoir s'y connecter, même avec des identifiants valides.
    if (user.role !== "ADMIN") {
      throw new Error("Ce compte n'a pas accès à l'espace admin.");
    }

    setAccessToken(accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  async logout() {
    try {
      await fetch(`${API_URL}/auth/logout`, { method: "POST", credentials: "include" });
    } catch {
      // La déconnexion locale doit réussir même si l'appel réseau échoue.
    }
    clearAccessToken();
    localStorage.removeItem(USER_KEY);
  },

  async checkAuth() {
    if (!getAccessToken()) throw new Error("Authentification requise");
  },

  async checkError(error) {
    const status = (error as { status?: number })?.status;
    if (status === 401 || status === 403) {
      clearAccessToken();
      localStorage.removeItem(USER_KEY);
      throw new Error("Session expirée");
    }
  },

  async getIdentity() {
    const user = getStoredUser();
    if (!user) throw new Error("Utilisateur inconnu");
    return { id: user.id, fullName: user.fullName, avatar: user.avatarUrl };
  },

  async getPermissions() {
    return getStoredUser()?.role ?? null;
  },
};
