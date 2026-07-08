import type { AppRoute } from "../types";

export const gestionRoutes: AppRoute[] = [
  { path: "/organizacion/usuarios", importPath: "./pages/sistema/gestion/usuarios", theme: true },
  { path: "/organizacion/usuarios/:id", importPath: "./pages/sistema/gestion/usuarios/usuario", theme: true },
  { path: "/organizacion/departamentos", importPath: "./pages/sistema/gestion/departamentos", theme: true },
  { path: "/organizacion/sucursal", importPath: "./pages/sistema/gestion/sucursal", theme: true },
];