import type { AppRoute } from "./types";
import { gestionRoutes } from "./gestion";
import { sistemaRoutes } from "./sistema";

const baseRoutes: AppRoute[] = [
  { path: "/dashboard", importPath: "./pages/otros/Dashboard", theme: true },
  { path: "/inventario/productos", importPath: "./pages/gestion/inventario/productos", theme: true },
  { path: "/inventario/catalogos", importPath: "./pages/gestion/inventario/catalgos", theme: true },
  { path: "/seguridad/accesos", importPath: "./pages/sistema/seguridad/accesos", theme: true },
  { path: "/seguridad/perfiles", importPath: "./pages/sistema/seguridad/perfiles", theme: true },
  { path: "/login", importPath: "./pages/otros/Login", theme: false },
  { path: "*", importPath: "./pages/otros/NotFound", theme: false },
];

export const rutasApi: AppRoute[] = [
  ...baseRoutes,
  ...gestionRoutes,
  ...sistemaRoutes,
];

export type { AppRoute } from "./types";