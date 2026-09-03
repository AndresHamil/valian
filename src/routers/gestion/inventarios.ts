import { createAppRoutes, type AppRoute } from "../types";

export const gestionInventariosRoutes: AppRoute[] = createAppRoutes([
  {
    canonicalPath: "/gestion/inventarios/almacen",
    importPath: "./pages/gestion/inventarios/almacen",
  },
]);