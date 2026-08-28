import { defineConfig, loadEnv, type UserConfig } from "vite";
import react from "@vitejs/plugin-react";

const DEFAULT_API_TARGET = "http://localhost:3000";

export default ({ mode }: { mode: string }): UserConfig => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiTarget = env.URL_BASE || DEFAULT_API_TARGET;

  console.log(`\x1b[36m➜  API Host:\x1b[0m ${apiTarget}`);

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




