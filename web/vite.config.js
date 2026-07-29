import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The app calls the FastAPI backend directly at VITE_API_URL (absolute URL), so no
// dev proxy is needed — the backend enables CORS for this origin (see backend D-016).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
