import type { AppRoute } from "../types";
import { sistemaModulosRoutes } from "./modulos";
import { sistemaProcesosRoutes } from "./procesos";

export const sistemaRoutes: AppRoute[] = [
  ...sistemaModulosRoutes,
  ...sistemaProcesosRoutes,
];