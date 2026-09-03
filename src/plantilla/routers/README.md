# Guia de routers

Usa esta carpeta como referencia cuando tengas que registrar rutas nuevas.

## Idea base

- Cada proceso visible en pantalla necesita una entrada en routers.
- Cada modulo suele tener su propio archivo dentro de `src/routers/<tipo>`.
- Cada tipo tiene un `index.ts` que junta los modulos de ese grupo.
- La ruta real del proceso debe declararse como `canonicalPath`.
- Si necesitas mantener una URL vieja, agregala en `legacyPaths`.

## Paso a paso

1. Identifica el tipo real: `gestion`, `sistema` u otro existente.
2. Si el modulo ya existe, abre `src/routers/<tipo>/<modulo>.ts` y agrega el proceso.
3. Si el modulo no existe, copia [src/plantilla/routers/tipo/test1.ts](tipo/test1.ts) hacia `src/routers/<tipo>/<modulo>.ts`.
4. Cambia `test1` por el nombre real del modulo.
5. Cambia `test2` por el nombre real del proceso.
6. Ajusta `canonicalPath` con la URL canonica del backend.
7. Ajusta `importPath` con la carpeta real creada en `src/pages`.
8. Si necesitas compatibilidad con una URL vieja, agregala en `legacyPaths`.
9. Si es un modulo nuevo, agregalo al `index.ts` del tipo usando [src/plantilla/routers/tipo/index.ts](tipo/index.ts) como referencia.

## Recuerda

- `canonicalPath` es la URL principal que el proyecto debe respetar.
- `legacyPaths` son rutas antiguas que siguen vivas solo por compatibilidad.
- `importPath` es la ubicacion del componente.
- Todas deben apuntar al mismo proceso real.