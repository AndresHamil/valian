import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
// En desarrollo: usa VITE_API_TARGET si está definido, si no usa localhost:3000.
// NO incluir la URL de producción en el código para que la rama `develop`
// no muestre la URL de producción en ningún lado.
export default ({ mode }: { mode: string }) => {
  const cwd = (globalThis as any).process?.cwd?.() || ".";
  const env = loadEnv(mode, cwd, "");
  const defaultDevTarget = "http://localhost:3000";

  // Sólo en desarrollo usamos proxy (y por tanto target configurado).
  const devApiTarget = env.VITE_API_TARGET || defaultDevTarget;

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




