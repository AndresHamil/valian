import type { AppRoute } from "./types";
import { gestionRoutes } from "./gestion";
import { otrosRoutes } from "./otros";
import { sistemaRoutes } from "./sistema";

export const rutasApi: AppRoute[] = [
  ...otrosRoutes,
  ...gestionRoutes,
  ...sistemaRoutes,
];

export type { AppRoute } from "./types";