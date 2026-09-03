import { createAppRoutes, type AppRoute } from "../types";

export const gestionInventarioRoutes: AppRoute[] = createAppRoutes([
  {
    canonicalPath: "/gestion/inventario/productos",
    importPath: "./pages/gestion/inventario/productos",
  },
  {
    canonicalPath: "/gestion/inventario/catalogos",
    importPath: "./pages/gestion/inventario/catalgos",
  },
]);