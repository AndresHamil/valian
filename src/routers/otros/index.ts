import type { AppRoute } from "../types";

export const otrosRoutes: AppRoute[] = [
  { path: "/dashboard", importPath: "./pages/otros/Dashboard", theme: true },
  { path: "/", importPath: "./pages/otros/Dashboard", theme: true },
  { path: "/login", importPath: "./pages/otros/Login", theme: false },
  { path: "*", importPath: "./pages/otros/NotFound", theme: false },
];