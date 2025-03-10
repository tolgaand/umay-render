import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import dotenv from "dotenv";
import { nodePolyfills } from "vite-plugin-node-polyfills";

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), nodePolyfills()],
  optimizeDeps: {
    include: ["umay-render"],
  },
  define: {
    "process.env": JSON.stringify(process.env),
  },
});
