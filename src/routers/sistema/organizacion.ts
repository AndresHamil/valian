import type { AppRoute } from "../types";

export const sistemaOrganizacionRoutes: AppRoute[] = [
  { path: "/sistema/organizacion/departamentos", importPath: "./pages/sistema/organizacion/departamentos", theme: true },
  { path: "/sistema/organizacion/empresas", importPath: "./pages/sistema/organizacion/empresas", theme: true },
  { path: "/sistema/organizacion/sucursales", importPath: "./pages/sistema/organizacion/sucursales", theme: true },
];