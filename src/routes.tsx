import React from "react";
import { appRoutes } from "./routers";
export { appRoutes };

export const dynamicRoutes = appRoutes.map((route) => ({
  path: route.path,
  theme: route.theme,
  element: React.createElement(
    React.lazy(() => import(/* @vite-ignore */ route.importPath))
  ),
}));