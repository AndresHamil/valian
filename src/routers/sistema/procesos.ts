import { createAppRoutes, type AppRoute } from "../types";

export const sistemaProcesosRoutes: AppRoute[] = createAppRoutes([
  {
    canonicalPath: "/sistema/sistemas/procesos",
    importPath: "./pages/sistema/sistema/procesos",
    legacyPaths: ["/sistema/procesos"],
  },
]);