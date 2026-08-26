import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
// Lee VITE_API_TARGET para el proxy en desarrollo. Por defecto apunta al API en la nube.
export default ({ mode }: { mode: string }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiTarget = env.VITE_API_TARGET || "https://node-mongodb-api-rest.vercel.app";

  return defineConfig({
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  });
};




