import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

const cssFileName = "index.min.css";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
    host: true,
    strictPort: true,
    port: 5173,
  },
  publicDir: "./public",
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (file) => {
          return `assets/css/${cssFileName}`;
        },
        entryFileNames: (file) => {
          return `assets/js/[name].min.js`;
        },
      },
    },
  },
});
