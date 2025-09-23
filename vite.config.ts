import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 5173, // standard Vite port
    strictPort: true,
    proxy: {
      // Proxy API requests to the Express backend during development
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      // Serve uploaded files via the same origin in dev
      "/uploads": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    }
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean,
  ),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
