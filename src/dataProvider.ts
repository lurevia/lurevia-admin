import type { DataProvider, GetListParams, RaRecord } from "react-admin";
import { API_URL, httpClient } from "./httpClient";


const ADMIN_SCOPED = new Set([
  "orders",
  "users",
  "reviews",
  "deletion-requests",
  "profile-change-requests",
  "verifications",
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
};

const CLIENT_SIDE_RESOURCES = new Set(["categories"]);

const baseUrl = (resource: string) =>
  ADMIN_SCOPED.has(resource)
    ? ["contracts", "settlements", "transfers"].includes(resource)
      ? `${API_URL}/admin/financial/${resource}`
      : resource === "commissions"
        ? `${API_URL}/admin/financial/settlements`
        : `${API_URL}/admin/${resource}`
    : `${API_URL}/${resource}`;

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
    const cmp = av > bv ? 1 : -1;
    return order === "ASC" ? cmp : -cmp;
  });
};

export const dataProvider: DataProvider = {
  async getList(resource, params) {
    const { page, perPage } = params.pagination ?? { page: 1, perPage: 25 };

    if (CLIENT_SIDE_RESOURCES.has(resource)) {
      const { json } = await httpClient(baseUrl(resource));
      let items: RaRecord[] = (json.data.categories ?? []) as RaRecord[];

      const q = (params.filter?.q as string | undefined)?.toLowerCase();
      if (q) items = items.filter((i) => String(i.name ?? "").toLowerCase().includes(q));

      items = sortRecords(items, params.sort);
      const start = (page - 1) * perPage;
      const pageItems = items.slice(start, start + perPage);
      return { data: pageItems, total: items.length };
    }

    const query = buildQuery({ page, limit: perPage, ...params.filter });
    const { json } = await httpClient(`${baseUrl(resource)}${query}`);
    const items = json.data.items ?? json.data.requests ?? [];
    return { data: items, total: json.data.pagination?.totalItems ?? items.length };
  },

  async getOne(resource, params) {
    if (CLIENT_SIDE_RESOURCES.has(resource)) {
      const { json } = await httpClient(baseUrl(resource));
      const items = (json.data.categories ?? []) as RaRecord[];
      const record = items.find((i) => String(i.id) === String(params.id));
      if (!record) throw new Error("Introuvable");
      return { data: record };
    }

    const { json } = await httpClient(`${baseUrl(resource)}/${params.id}`);
    const key = SINGULAR_KEY[resource];
    return { data: key ? json.data[key] : json.data };
  },

  async getMany(resource, params) {
    const results = await Promise.all(
      params.ids.map(async (id) => {
        const { data } = await dataProvider.getOne(resource, { id });
        return data;
      })
    );
    return { data: results };
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
    return { data: json.data.items ?? [], total: json.data.pagination?.totalItems ?? 0 };
  },

  async create(resource, params) {
    const { json } = await httpClient(baseUrl(resource), {
      method: "POST",
      body: JSON.stringify(params.data),
    });
    const key = SINGULAR_KEY[resource];
    return { data: key ? json.data[key] : json.data };
  },

  async update(resource, params) {
    if (resource === "orders") {
      const { json } = await httpClient(`${API_URL}/orders/${params.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: params.data.status }),
      });
      return { data: json.data.order };
    }
    if (resource === "users") {
      const { json } = await httpClient(`${baseUrl(resource)}/${params.id}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role: params.data.role }),
      });
      return { data: json.data.user };
    }

    const { json } = await httpClient(`${baseUrl(resource)}/${params.id}`, {
      method: "PATCH",
      body: JSON.stringify(params.data),
    });
    const key = SINGULAR_KEY[resource];
    return { data: key ? json.data[key] : json.data };
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
