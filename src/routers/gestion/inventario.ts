import type { AppRoute } from "../types";

export const gestionInventarioRoutes: AppRoute[] = [
  { path: "/gestion/inventario/productos", importPath: "./pages/gestion/inventario/productos", theme: true },
  { path: "/gestion/inventario/catalogos", importPath: "./pages/gestion/inventario/catalgos", theme: true },
];