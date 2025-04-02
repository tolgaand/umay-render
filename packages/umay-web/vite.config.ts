import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import sitemap from "vite-plugin-sitemap";
import demoMap from "./public/demo/demo-map.json";

// Demo ID'lerini alma
const demoRoutes = demoMap.demos.map((demo) => `/demos/${demo.id}`);

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    nodePolyfills(),
    sitemap({
      hostname: "https://www.umayrender.com",
      dynamicRoutes: ["/", "/demos", ...demoRoutes],
      exclude: ["/404", "/demos/:id", "/demo/examples/**"],
      outDir: "dist",
      robots: [
        {
          userAgent: "*",
          allow: "/",
        },
      ],
    }),
  ],

  optimizeDeps: {
    include: ["umay-render"],
  },

  build: {
    commonjsOptions: {
      include: [/umay-render/, /node_modules/],
    },
  },

  resolve: {
    mainFields: ["module", "main", "browser"],
  },
});
