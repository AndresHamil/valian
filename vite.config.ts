import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default ({ mode }: { mode: string }) => {
  const cwd = (globalThis as any).process?.cwd?.() || ".";
  // Prefijo "" para leer también variables sin prefijo VITE_
  const env = loadEnv(mode, cwd, "");
  const devApiTarget = env.URL_BASE || "http://localhost:3000";

  const baseConfig: any = {
    plugins: [react()],
  };

  if (mode !== "production") {
    baseConfig.server = {
      proxy: {
        "/api": {
          target: devApiTarget,
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/api/, ""),
        },
      },
    };
  }

  return defineConfig(baseConfig);
};




