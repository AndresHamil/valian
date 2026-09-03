import { createAppRoutes, type AppRoute } from "../types";

export const sistemaAccesosRoutes: AppRoute[] = createAppRoutes([
  {
    canonicalPath: "/sistema/accesos/usuarios",
    importPath: "./pages/sistema/accesos/usuarios",
  },
  {
    canonicalPath: "/sistema/accesos/usuarios/:id",
    importPath: "./pages/sistema/accesos/usuarios/usuario",
  },
  {
    canonicalPath: "/sistema/accesos/perfiles",
    importPath: "./pages/sistema/accesos/perfiles",
  },
]);