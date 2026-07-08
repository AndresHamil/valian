import React from "react";
import { rutasApi } from "./routers";
export { rutasApi };

export const dynamicRoutes = rutasApi.map((ruta) => ({
  path: ruta.path,
  theme: ruta.theme,
  element: React.createElement(
    React.lazy(() => import(/* @vite-ignore */ ruta.importPath))
  ),
}));