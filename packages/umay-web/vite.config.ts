import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import sitemap from "vite-plugin-sitemap";

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    nodePolyfills(),
    sitemap({
      hostname: "https://www.umayrender.com",
      dynamicRoutes: ["/", "/demos", "/demos/:id"],
      exclude: ["/404"],
      outDir: "dist",
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
