import { fileURLToPath, URL } from "node:url";
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { version } from "./package.json";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/m-trade/", // Change to "/" if hosted at root
  plugins: [
    vue(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      includeAssets: [
        "favicon.png",
        "favicon.png",
        "apple-touch-icon.png",
        "mask-icon.png",
        "robots.txt"
      ],

      manifest: {
        name: "M-Trade",
        short_name: "M-Trade",
        description: "application for trading",
        theme_color: "#000000",
        background_color: "#000000",
        icons: [
          {
            src: "pwa-64x64.png",
            sizes: "64x64",
            type: "image/png"
          },
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "pwa-1024x1024.png",
            sizes: "1024x1024",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "mask-icon.png",
            sizes: "1024x1024",
            type: "image/png",
            purpose: "maskable"
          }
        ]
      },

      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,json}"],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true, // add this
        navigateFallback: "/m-trade/index.html",
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/my-api-domain\.com\/.*$/,
            handler: "NetworkFirst", // Prefer network, fallback to cache
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60 // 1 day
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /\.(?:html|js|css|png|jpg|jpeg|svg|gif|ico|json)$/,
            handler: "StaleWhileRevalidate", // Serve cached assets, update in background
            options: {
              cacheName: "app-assets-cache",
              expiration: {
                maxEntries: 1000,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
              }
            }
          },
          {
            urlPattern: /\/.*/,
            handler: "NetworkFirst", // Offline fallback for navigation
            options: {
              cacheName: "navigation-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 7 * 24 * 60 * 60 // Cache for 7 days
              }
            }
          }
        ],
        offlineGoogleAnalytics: false // Disable if not used
      },
      devOptions: {
        enabled: process.env.NODE_ENV === "development",
        navigateFallback: "/m-trade/index.html",
        suppressWarnings: true
        //type: "module",
      }
    })
  ],
  build: {
    sourcemap: true // Enable for better debugging in development
  },
  define: {
    __APP_VERSION__: JSON.stringify(version) // Inject the version into the build
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  }
});
