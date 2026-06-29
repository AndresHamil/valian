import React from "react";

// Objeto con rutas, importPath y si usan ThemeProvider
export const rutasApi = [
  // --------------------------------------------------------------------------------------------------------- [DASHBOARD]
  { path: "/catalogos", importPath: "./pages/independiente/inventario/catalgos", theme: true },
  // ----------------------------------------------------------------------------------------------------------------------- [SISTEMA]
  // --------------------------------------------------------------------------------------------------------- [Gestion]
  { path: "/organizacion/usuarios", importPath: "./pages/sistema/gestion/usuarios", theme: true },
  { path: "/organizacion/departamentos", importPath: "./pages/sistema/gestion/departamentos", theme: true },
  // --------------------------------------------------------------------------------------------------------- [Sistema]
  { path: "/sistema/modulos", importPath: "./pages/sistema/sistema/modulos", theme: true },
  { path: "/sistema/procesos", importPath: "./pages/sistema/sistema/procesos", theme: true },
  // --------------------------------------------------------------------------------------------------------- [Otros]
  { path: "/login", importPath: "./pages/otros/Login", theme: false },
  { path: "*", importPath: "./pages/otros/NotFound", theme: false },
];

// Genera las rutas dinámicamente usando React.lazy
export const dynamicRoutes = rutasApi.map(ruta => ({
  path: ruta.path,
  theme: ruta.theme,
  element: React.createElement(
    React.lazy(() => import(/* @vite-ignore */ ruta.importPath))
  ),
}));