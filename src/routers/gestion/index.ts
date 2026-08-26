import type { AppRoute } from "../types";
import { gestionInventarioRoutes } from "./inventario";
import { gestionInventariosRoutes } from "./inventarios";
import { gestionSeguridadRoutes} from "./seguridad";
 
export const gestionRoutes: AppRoute[] = [
  ...gestionInventarioRoutes,
  ...gestionInventariosRoutes,
  ...gestionSeguridadRoutes,
];