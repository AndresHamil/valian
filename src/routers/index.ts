import type { AppRoute } from "./types";
import { gestionRoutes } from "./gestion";
import { otrosRoutes } from "./otros";
import { sistemaRoutes } from "./sistema";

export const appRoutes: AppRoute[] = [
  ...otrosRoutes,
  ...gestionRoutes,
  ...sistemaRoutes,
];

export const rutasApi = appRoutes;

export type { AppRoute } from "./types";