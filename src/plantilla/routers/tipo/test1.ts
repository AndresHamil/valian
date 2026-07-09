import type { AppRoute } from "../types";

// Copia este archivo al tipo real y renombralo segun el modulo.
// test1 = modulo
// test2 = proceso
export const tipoTest1Routes: AppRoute[] = [
  { path: "/tipo/test1/test2", importPath: "./pages/tipo/test1/test2", theme: true },
];