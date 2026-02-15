import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: true, // Sudah benar, wajib untuk Docker
    port: 5173,
    strictPort: true, // Memaksa Vite gagal jika port 5173 tidak tersedia (biar ketahuan error-nya)
    watch: {
      usePolling: true, // SANGAT PENTING di Docker agar file yang kamu save di laptop terbaca di container
    },
    hmr: {
      overlay: false,
      clientPort: 5173, // Memastikan jalur komunikasi WebSocket untuk Hot Reload aman
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
