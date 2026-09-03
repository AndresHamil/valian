import { createAppRoutes, type AppRoute } from "../types";

export const otrosRoutes: AppRoute[] = createAppRoutes([
  {
    canonicalPath: "/dashboard",
    importPath: "./pages/otros/Dashboard",
    legacyPaths: ["/"],
  },
  {
    canonicalPath: "/login",
    importPath: "./pages/otros/Login",
    theme: false,
  },
  {
    canonicalPath: "*",
    importPath: "./pages/otros/NotFound",
    theme: false,
  },
]);