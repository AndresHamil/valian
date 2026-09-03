import { createAppRoutes, type AppRoute } from "../types";

export const sistemaOrganizacionRoutes: AppRoute[] = createAppRoutes([
  {
    canonicalPath: "/sistema/organizacion/departamentos",
    importPath: "./pages/sistema/organizacion/departamentos",
  },
  {
    canonicalPath: "/sistema/organizacion/empresas",
    importPath: "./pages/sistema/organizacion/empresas",
  },
  {
    canonicalPath: "/sistema/organizacion/sucursales",
    importPath: "./pages/sistema/organizacion/sucursales",
  },
]);