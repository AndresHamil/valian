import type { AppRoute } from "../types";
import { tipoTest1Routes } from "./test1";
 
// Copia este archivo al tipo real dentro de src/routers y renombra TipoRoutes.
export const tipoRoutes: AppRoute[] = [
  ...tipoTest1Routes,
];