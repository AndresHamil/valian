import { createAppRoutes, type AppRoute } from "../types";

export const sistemaModulosRoutes: AppRoute[] = createAppRoutes([
  {
    canonicalPath: "/sistema/sistemas/modulos",
    importPath: "./pages/sistema/sistema/modulos",
    legacyPaths: ["/sistema/modulos"],
  },
]);