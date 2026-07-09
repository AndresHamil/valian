import type { AppRoute } from "../types";
import { gestionInventariosRoutes } from "./inventarios";
import { gestionSeguridadRoutes} from "./seguridad";
 
export const gestionRoutes: AppRoute[] = [
  ...gestionInventariosRoutes,
  ...gestionSeguridadRoutes,
];