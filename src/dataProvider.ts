import type { DataProvider, GetListParams, RaRecord } from "react-admin";
import { API_URL, httpClient } from "./httpClient";

const ADMIN_SCOPED = new Set([
  "orders",
  "users",
  "reviews",
  "deletion-requests",
  "profile-change-requests",
  "verifications",
  "identity-verifications",
  "sellers",
  "contracts",
  "settlements",
  "commissions",
  "transfers",
]);

const SINGULAR_KEY: Record<string, string> = {
  products: "product",
  categories: "category",
  orders: "order",
  users: "user",
  sellers: "seller",
  contracts: "contract",
  settlements: "settlement",
  commissions: "commission",
  transfers: "transfer",
  reviews: "review",
};

const CLIENT_SIDE_RESOURCES = new Set(["categories"]);

const baseUrl = (resource: string) => {
  if (resource === "verifications" || resource === "identity-verifications") {
    return `${API_URL}/admin/identity-verifications`;
  }
  if (resource === "pages") {
    return `${API_URL}/pages/admin`;
  }
  if (ADMIN_SCOPED.has(resource)) {
    if (["contracts", "settlements", "transfers"].includes(resource)) {
      return `${API_URL}/admin/financial/${resource}`;
    }
    if (resource === "commissions") {
      return `${API_URL}/admin/financial/commissions`;
    }
    return `${API_URL}/admin/${resource}`;
  }
  return `${API_URL}/${resource}`;
};

const buildQuery = (params: Record<string, unknown>): string => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    query.set(key, String(value));
  });
  const qs = query.toString();
  return qs ? `?${qs}` : "";
};

const sortRecords = <T extends RaRecord>(records: T[], sort?: GetListParams["sort"]): T[] => {
  if (!sort?.field) return records;
  const { field, order } = sort;
  return [...records].sort((a, b) => {
    const av = a[field];
    const bv = b[field];
    if (av === bv) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;
    const cmp = av > bv ? 1 : -1;
    return order === "ASC" ? cmp : -cmp;
  });
};

export const dataProvider: DataProvider = {
  async getList(resource, params) {
    const { page, perPage } = params.pagination ?? { page: 1, perPage: 25 };
    const filters = params.filter ?? {};

    // 1. Catégories (client-side)
    if (CLIENT_SIDE_RESOURCES.has(resource)) {
      const { json } = await httpClient(baseUrl(resource));
      let items: RaRecord[] = (json.data?.categories ?? []) as RaRecord[];

      const q = ((filters.search ?? filters.q) as string | undefined)?.toLowerCase().trim();
      if (q) items = items.filter((i) => String(i.name ?? "").toLowerCase().includes(q));

      items = sortRecords(items, params.sort);
      const start = (page - 1) * perPage;
      const pageItems = items.slice(start, start + perPage);
      return { data: pageItems, total: items.length };
    }

    // 2. Filtres sécurisés pour l'API backend
    const apiQueryObj: Record<string, unknown> = {
      page,
      limit: perPage,
    };

    // Pour éviter l'erreur 500 sur /products quand 'search' est envoyé, on convertit en 'q'
    if (filters.search || filters.q) {
      apiQueryObj.q = String(filters.search || filters.q).trim();
    }

    // Filtre spécifique selon la ressource
    if (resource === "users") {
      if (filters.role) apiQueryObj.role = filters.role;
      if (params.sort?.field) {
        apiQueryObj.sortField = params.sort.field;
        apiQueryObj.sortOrder = params.sort.order;
      }
    } else if (resource === "orders") {
      if (filters.status) apiQueryObj.status = String(filters.status).toLowerCase();
      if (filters.paymentMethod) {
        apiQueryObj.paymentMethod = String(filters.paymentMethod).toLowerCase().replace(/_/g, "-");
      }
    } else if (resource === "products") {
      if (filters.categoryId) apiQueryObj.categoryId = filters.categoryId;
      if (filters.priceRange) {
        const parts = String(filters.priceRange).split("-");
        if (parts.length === 2) {
          apiQueryObj.minPrice = parts[0];
          apiQueryObj.maxPrice = parts[1];
        }
      }
    } else if (resource === "sellers") {
      if (filters.status) apiQueryObj.status = String(filters.status).toLowerCase();
    }

    const query = buildQuery(apiQueryObj);
    const { json } = await httpClient(`${baseUrl(resource)}${query}`);
    let items: any[] = json.data?.items ?? json.data?.requests ?? [];

    // Enrichissement spécifique pour les vendeurs
    if (resource === "sellers") {
      items = items.map((s) => ({
        ...s,
        avatarUrl:
          s.avatarUrl ||
          s.logoUrl ||
          `https://picsum.photos/seed/${s.id}/200/200`,
        name: s.name || s.sellerName || "Boutique",
        sellerName: s.sellerName || s.name || "Vendeur",
      }));
    }

    // Enrichissement spécifique pour les profils ou vérifications
    if (resource === "identity-verifications" || resource === "verifications") {
      items = items.map((v) => ({
        ...v,
        userName: v.user?.fullName || v.userName || "Utilisateur",
        userEmail: v.user?.email || v.userEmail || "",
        avatarUrl: v.user?.avatarUrl || `https://picsum.photos/seed/${v.id}/200/200`,
      }));
    }

    // Filtrage et recherche intelligente côté client pour garantir des résultats précis
    const searchQuery = String(filters.search || filters.q || "").toLowerCase().trim();
    if (searchQuery) {
      items = items.filter((item) => {
        const title = String(item.title || item.name || item.fullName || item.sellerName || item.orderNumber || "").toLowerCase();
        const email = String(item.email || item.userEmail || "").toLowerCase();
        const sku = String(item.sku || "").toLowerCase();
        const desc = String(item.description || item.comment || "").toLowerCase();
        return title.includes(searchQuery) || email.includes(searchQuery) || sku.includes(searchQuery) || desc.includes(searchQuery);
      });
    }

    // Filtre stock (produits)
    if (resource === "products" && filters.stock) {
      items = items.filter((p) => {
        const stock = Number(p.stock ?? 0);
        const low = Number(p.lowStockThreshold ?? 5);
        if (filters.stock === "out") return stock === 0;
        if (filters.stock === "low") return stock > 0 && stock <= low;
        if (filters.stock === "in") return stock > 0;
        if (filters.stock === "high") return stock > 10;
        return true;
      });
    }

    // Filtre statut produit (new, promo, popular)
    if (resource === "products" && filters.status) {
      items = items.filter((p) => {
        if (filters.status === "new") return Boolean(p.isNew);
        if (filters.status === "promo") return Boolean(p.originalPrice && p.originalPrice > p.price);
        if (filters.status === "popular") return (p.ratingCache || 0) >= 4.5 || (p.reviewCountCache || 0) > 5;
        return true;
      });
    }

    // Filtre statut commande
    if (resource === "orders" && filters.status) {
      const targetStatus = String(filters.status).toLowerCase();
      items = items.filter((o) => String(o.status || "").toLowerCase() === targetStatus);
    }

    // Filtre paiement commande
    if (resource === "orders" && filters.paymentMethod) {
      const targetMethod = String(filters.paymentMethod).toLowerCase().replace(/[-_]/g, "");
      items = items.filter((o) => String(o.paymentMethod || "").toLowerCase().replace(/[-_]/g, "") === targetMethod);
    }

    // Filtre rôle utilisateur
    if (resource === "users" && filters.role) {
      const targetRole = String(filters.role).toUpperCase();
      items = items.filter((u) => String(u.role || "").toUpperCase() === targetRole);
    }

    // Filtre genre utilisateur
    if (resource === "users" && filters.gender) {
      const targetGender = String(filters.gender).toUpperCase();
      items = items.filter((u) => String(u.gender || "").toUpperCase() === targetGender);
    }

    // Filtre âge utilisateur
    if (resource === "users" && filters.age) {
      if (filters.age === "unknown") {
        items = items.filter((u) => u.age == null);
      } else {
        const [minAge, maxAge] = String(filters.age).split("-").map(Number);
        if (!isNaN(minAge) && !isNaN(maxAge)) {
          items = items.filter((u) => u.age != null && u.age >= minAge && u.age <= maxAge);
        }
      }
    }

    // Filtre statut vendeur
    if (resource === "sellers" && filters.status) {
      const targetStatus = String(filters.status).toLowerCase();
      items = items.filter((s) => String(s.status || "").toLowerCase() === targetStatus);
    }

    // Tri local si demandé
    if (params.sort?.field) {
      items = sortRecords(items, params.sort);
    }

    const total = json.data?.pagination?.totalItems ?? items.length;
    return { data: items, total };
  },

  async getOne(resource, params) {
    if (CLIENT_SIDE_RESOURCES.has(resource)) {
      const { json } = await httpClient(baseUrl(resource));
      const items = (json.data?.categories ?? []) as RaRecord[];
      const record = items.find((i) => String(i.id) === String(params.id));
      if (!record) throw new Error("Catégorie introuvable");
      return { data: record };
    }

    // Spécifique vendeurs : si /admin/sellers/:id n'existe pas, on cherche dans la liste ou /admin/users/:id
    if (resource === "sellers") {
      try {
        const { json } = await httpClient(`${API_URL}/admin/sellers?limit=100`);
        const items = json.data?.items ?? [];
        const found = items.find((s: any) => String(s.id) === String(params.id));
        if (found) {
          const enriched = {
            ...found,
            avatarUrl:
              found.avatarUrl ||
              found.logoUrl ||
              `https://picsum.photos/seed/${found.id}/200/200`,
            name: found.name || found.sellerName || "Boutique",
            sellerName: found.sellerName || found.name || "Vendeur",
          };
          return { data: enriched };
        }
      } catch {}

      try {
        const uRes = await httpClient(`${API_URL}/admin/users/${params.id}`);
        const u = uRes.json?.data?.user;
        if (u) {
          return {
            data: {
              id: u.id,
              name: u.fullName || "Boutique",
              sellerName: u.fullName,
              email: u.email,
              phone: u.phone,
              role: u.role,
              status: u.isActive ? "active" : "suspended",
              commissionRate: 12,
              avatarUrl: u.avatarUrl || `https://picsum.photos/seed/${u.id}/200/200`,
              createdAt: u.createdAt,
            },
          };
        }
      } catch {}
    }

    const { json } = await httpClient(`${baseUrl(resource)}/${params.id}`);
    const key = SINGULAR_KEY[resource];
    const data = key ? json.data?.[key] : json.data;
    return { data: data ?? json.data };
  },

  async getMany(resource, params) {
    const results = await Promise.all(
      params.ids.map(async (id) => {
        try {
          const { data } = await dataProvider.getOne(resource, { id });
          return data;
        } catch {
          return { id };
        }
      })
    );
    return { data: results.filter(Boolean) };
  },

  async getManyReference(resource, params) {
    const { page, perPage } = params.pagination;
    const query = buildQuery({
      page,
      limit: perPage,
      [params.target]: params.id,
      ...params.filter,
    });
    const { json } = await httpClient(`${baseUrl(resource)}${query}`);
    return { data: json.data?.items ?? [], total: json.data?.pagination?.totalItems ?? 0 };
  },

  async create(resource, params) {
    const { json } = await httpClient(baseUrl(resource), {
      method: "POST",
      body: JSON.stringify(params.data),
    });
    const key = SINGULAR_KEY[resource];
    return { data: key ? json.data?.[key] : json.data };
  },

  async update(resource, params) {
    if (resource === "orders") {
      const { json } = await httpClient(`${API_URL}/orders/${params.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: params.data.status }),
      });
      return { data: json.data?.order };
    }
    if (resource === "users") {
      const { json } = await httpClient(`${baseUrl(resource)}/${params.id}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role: params.data.role }),
      });
      return { data: json.data?.user };
    }

    const { json } = await httpClient(`${baseUrl(resource)}/${params.id}`, {
      method: "PATCH",
      body: JSON.stringify(params.data),
    });
    const key = SINGULAR_KEY[resource];
    return { data: key ? json.data?.[key] : json.data };
  },

  async updateMany(resource, params) {
    await Promise.all(
      params.ids.map((id) => dataProvider.update(resource, { id, data: params.data, previousData: {} }))
    );
    return { data: params.ids };
  },

  async delete<RecordType extends RaRecord = RaRecord>(resource: string, params: Parameters<NonNullable<DataProvider["delete"]>>[1]) {
    await httpClient(`${baseUrl(resource)}/${params.id}`, { method: "DELETE" });
    return { data: params.previousData as RecordType };
  },

  async deleteMany(resource, params) {
    await Promise.all(params.ids.map((id) => httpClient(`${baseUrl(resource)}/${id}`, { method: "DELETE" })));
    return { data: params.ids };
  },
};
