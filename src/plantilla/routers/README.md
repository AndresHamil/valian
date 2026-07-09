# Plantilla de routers

Usa esta carpeta como referencia para registrar rutas nuevas segun el tipo y el modulo.

## Flujo

1. Identifica el tipo del modulo: `gestion`, `sistema`, `seguridad` o el que corresponda.
2. Copia la estructura de `tipo` al dominio real dentro de `src/routers`.
3. Usa `test1.ts` como base del archivo del modulo.
4. Reemplaza `test1` por el nombre real del modulo.
5. Reemplaza `test2` por el nombre real del proceso.
6. Agrega cada proceso nuevo como una ruta dentro del archivo del modulo.
7. Importa ese archivo en el `index.ts` del tipo correspondiente.

## Archivos de ejemplo

- `types.ts`: tipo base de las rutas.
- `tipo/test1.ts`: archivo del modulo con rutas del proceso.
- `tipo/index.ts`: agregador del tipo.