import React from "react";

// Objeto con rutas, importPath y si usan ThemeProvider
export const rutasApi = [
  // --------------------------------------------------------------------------------------------------------- [DASHBOARD]
  { path: "/dashboard", importPath: "./pages/otros/Dashboard", theme: true },
  { path: "/inventario/productos", importPath: "./pages/independiente/inventario/productos", theme: true },
  { path: "/inventario/catalogos", importPath: "./pages/independiente/inventario/catalgos", theme: true },
  // ----------------------------------------------------------------------------------------------------------------------- [SISTEMA]
  // --------------------------------------------------------------------------------------------------------- [Gestion]
  { path: "/organizacion/usuarios", importPath: "./pages/sistema/gestion/usuarios", theme: true },
  { path: "/organizacion/departamentos", importPath: "./pages/sistema/gestion/departamentos", theme: true },
  { path: "/organizacion/sucursal", importPath: "./pages/sistema/gestion/sucursal", theme: true },
  // --------------------------------------------------------------------------------------------------------- [Seguridad]
  { path: "/seguridad/accesos", importPath: "./pages/sistema/seguridad/accesos", theme: true },
  { path: "/seguridad/perfiles", importPath: "./pages/sistema/seguridad/perfiles", theme: true },
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