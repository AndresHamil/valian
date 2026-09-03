import { createAppRoutes, type AppRoute } from "../types";

export const gestionSeguridadRoutes: AppRoute[] = createAppRoutes([
  {
    canonicalPath: "/gestion/seguridad/camaras",
    importPath: "./pages/gestion/seguridad/camaras",
  },
]);