import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const HOST = "0.0.0.0";
const BACKEND_API_URL = (
  process.env.VITE_API_URL || "https://lurevia-ecommerce.onrender.com/api/v1"
).replace(/\/+$/, "");

console.log(`[Lurevia Admin] Connecté au backend réel : ${BACKEND_API_URL}`);

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// ─────────────────────────────────────────────────────────────────────────────
// REVERSE PROXY VERS LE BACKEND RÉEL (Évite tout blocage CORS dans le navigateur)
// ─────────────────────────────────────────────────────────────────────────────

app.use("/api/v1", async (req: Request, res: Response) => {
  const subpath = req.url.split("?")[0];
  const queryString = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
  const targetUrl = `${BACKEND_API_URL}${subpath}${queryString}`;

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (req.headers.authorization) {
    headers["Authorization"] = String(req.headers.authorization);
  }
  if (req.headers["content-type"]) {
    headers["Content-Type"] = String(req.headers["content-type"]);
  }
  if (req.headers.cookie) {
    headers["Cookie"] = String(req.headers.cookie);
  }

  // Cas spécifique : GET /admin/sellers/:id n'existe pas sur Render (retourne 404),
  // on résout le vendeur depuis la liste des vendeurs ou /admin/users/:id
  const sellerDetailMatch = subpath.match(/^\/admin\/sellers\/([^/?]+)$/);
  if (req.method === "GET" && sellerDetailMatch) {
    const sellerId = sellerDetailMatch[1];
    try {
      const sellersListRes = await fetch(`${BACKEND_API_URL}/admin/sellers?limit=100`, {
        headers,
      });
      if (sellersListRes.ok) {
        const sellersData = (await sellersListRes.json()) as any;
        const items = sellersData?.data?.items ?? [];
        const found = items.find((s: any) => String(s.id) === String(sellerId));
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
          return res.json({ data: { seller: enriched } });
        }
      }

      // Fallback sur /admin/users/:id
      const userRes = await fetch(`${BACKEND_API_URL}/admin/users/${sellerId}`, { headers });
      if (userRes.ok) {
        const userData = (await userRes.json()) as any;
        const u = userData?.data?.user;
        if (u) {
          const sellerObj = {
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
          };
          return res.json({ data: { seller: sellerObj } });
        }
      }
    } catch (err) {
      console.error("[Proxy Seller Detail Error]", err);
    }
  }

  try {
    const fetchOptions: RequestInit = {
      method: req.method,
      headers,
    };

    if (req.method !== "GET" && req.method !== "HEAD" && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl, fetchOptions);

    // Forward Set-Cookie headers
    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
      res.setHeader("set-cookie", setCookie);
    }

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const data = await response.json();

      // Enrichissement des vendeurs dans la liste avec des photos réelles
      if (subpath === "/admin/sellers" && data?.data?.items && Array.isArray(data.data.items)) {
        data.data.items = data.data.items.map((item: any) => ({
          ...item,
          avatarUrl:
            item.avatarUrl ||
            item.logoUrl ||
            `https://picsum.photos/seed/${item.id}/200/200`,
          name: item.name || item.sellerName || "Boutique",
          sellerName: item.sellerName || item.name || "Vendeur",
        }));
      }

      return res.status(response.status).json(data);
    }

    const text = await response.text();
    return res.status(response.status).send(text);
  } catch (error: any) {
    console.error(`[Proxy Error] ${req.method} ${targetUrl}:`, error.message);
    return res.status(502).json({
      error: {
        code: "BAD_GATEWAY",
        message: "Erreur de communication avec le backend distant : " + error.message,
      },
    });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// SERVEUR VITE / STATIQUE
// ─────────────────────────────────────────────────────────────────────────────

async function startServer() {
  const isProduction = process.env.NODE_ENV === "production";

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get("*", (_req: Request, res: Response) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }
  }

  app.listen(PORT, HOST, () => {
    console.log(`[Lurevia Admin] Prêt sur http://${HOST}:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Échec du démarrage du serveur:", err);
  process.exit(1);
});
