import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "PushApp",
        short_name: "PushApp",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#4CAF50",
        icons: [
          { src: "/pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "/pwa-512x512.png", sizes: "512x512", type: "image/png" },
        ],
      },

      // ⭐⭐ 여기 반드시 필요함
      workbox: {
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [
          /^\/api\//, // /api 요청은 SPA 라우팅에서 제외
          /^\/ws\//, // 웹소켓도 제외
          /^\/media\//, // 웹소켓도 제외
          /^\/assets\//, // 웹소켓도 제외
        ],
      },
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
