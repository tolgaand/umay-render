import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [react(), tsconfigPaths(), nodePolyfills()],

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
