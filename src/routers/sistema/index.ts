import type { AppRoute } from "../types";
import { sistemaModulosRoutes } from "./modulos";
import { sistemaProcesosRoutes } from "./procesos";
import { sistemaAccesosRoutes } from "./accesos";
import { sistemaOrganizacionRoutes } from "./organizacion";

export const sistemaRoutes: AppRoute[] = [
  ...sistemaModulosRoutes,
  ...sistemaProcesosRoutes,
  ...sistemaAccesosRoutes,
  ...sistemaOrganizacionRoutes,
];