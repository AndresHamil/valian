import type { AppRoute } from "../types";

export const sistemaAccesosRoutes: AppRoute[] = [
  { path: "/sistema/accesos/usuarios", importPath: "./pages/sistema/accesos/usuarios", theme: true },
  { path: "/sistema/accesos/usuarios/:id", importPath: "./pages/sistema/accesos/usuarios/usuario", theme: true },
  { path: "/sistema/accesos/perfiles", importPath: "./pages/sistema/accesos/perfiles", theme: true },
];