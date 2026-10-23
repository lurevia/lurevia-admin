import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",
  plugins: [react()],
  resolve: {
    dedupe: ["react", "react-dom", "@mui/material", "@mui/icons-material"],
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    allowedHosts: true,
    hmr: false,
    proxy: {
      "/api/v1": {
        target: "https://lurevia-ecommerce.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: {
    host: "0.0.0.0",
    port: 3000,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: "assets/js/[name]-[hash].js",
        chunkFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || "";
          if (/\.(css)$/i.test(name)) {
            return "assets/css/[name]-[hash][extname]";
          }
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(name)) {
            return "assets/img/[name]-[hash][extname]";
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(name)) {
            return "assets/fonts/[name]-[hash][extname]";
          }
          return "assets/misc/[name]-[hash][extname]";
        },
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react-admin") || id.includes("ra-core") || id.includes("ra-ui-materialui") || id.includes("ra-language-french") || id.includes("ra-i18n-polyglot")) {
              return "vendor-react-admin";
            }
            if (id.includes("@mui") || id.includes("@emotion")) {
              return "vendor-mui";
            }
            if (id.includes("recharts") || id.includes("d3-") || id.includes("victory-vendor")) {
              return "vendor-charts";
            }
            if (id.includes("react") || id.includes("react-dom")) {
              return "vendor-react";
            }
          }
        },
      },
    },
  },
});
