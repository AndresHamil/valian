# Plantilla de alta de modulo y proceso

Usa esta carpeta como contexto completo para que un programador sepa que debe crear, copiar o modificar cuando backend da de alta un modulo o un proceso nuevo.

## Que representa cada carpeta

- `test1/test2`: plantilla base de un proceso dentro de un modulo y un tipo de ejemplo.
- `routers`: plantilla para registrar la ruta segun el tipo y el modulo.
- `icons`: referencia del flujo para ligar alias de iconos.

## Flujo completo de alta en frontend

1. Backend da de alta el modulo y el proceso.
2. Backend devuelve el alias del icono del modulo y del proceso.
3. Backend devuelve la URL del proceso.
4. Frontend liga los iconos en `src/components/ThemeProvider/icons/index.tsx`.
5. Frontend crea la carpeta fisica del proceso usando `test1/test2` como base.
6. Frontend registra la ruta del proceso usando la estructura de `routers` como referencia.
7. Frontend debe respetar exactamente la URL canonica que regresa backend; ya no existen alias en sesion.

## Ejemplo

Si backend devuelve:

- tipo: `gestion`
- modulo: `inventarios`
- proceso: `almacen`
- url: `gestion/inventarios/almacen`

entonces normalmente se impacta esto:

1. `src/components/ThemeProvider/icons/index.tsx`
2. `src/pages/gestion/inventarios/almacen/index.tsx`
3. `src/pages/gestion/inventarios/almacen/script.ts` si aplica
4. `src/pages/gestion/inventarios/almacen/index.scss` si aplica
5. `src/routers/gestion/inventarios.ts`
6. `src/routers/gestion/index.ts`

Si el proceso real se crea en una ruta como `src/pages/sistema/accesos/usuarios`, el import a sesion dentro de `script.ts` debe apuntar a `../../../../session/auth`.

La plantilla vive en `src/plantilla`, asi que dentro de la plantilla de ejemplo `src/plantilla/test1/test2/script.ts` el import correcto a sesion es `../../../session/auth`.

## Checklist operativo

1. Crear la carpeta fisica del proceso en `src/pages/<tipo>/<modulo>/<proceso>`.
2. Copiar como base `index.tsx`, `script.ts` e `index.scss` desde `src/plantilla`.
3. Registrar la ruta en `src/routers/<tipo>/<modulo>.ts`.
4. Importar ese archivo en `src/routers/<tipo>/index.ts`.
5. Si el alias de icono es nuevo, ligarlo en `src/components/ThemeProvider/icons/index.tsx`.
6. Confirmar que el `path` del router coincida con la URL que devuelve el login.
7. Confirmar que `importPath` del router apunte a `./pages/<tipo>/<modulo>/<proceso>` real.
8. Validar que `titulo` y `descripcion` salgan de sesion.
9. Renombrar el componente exportado y quitar textos de relleno.
10. Ejecutar una validacion final con build o revision de errores.

## Regla practica

Si el icono es nuevo, se liga.

Si la URL es nueva, se registra en routers.

Si el proceso es nuevo, se crea su carpeta en pages.

## Reemplazos obligatorios en la plantilla

1. `test1` por el nombre real del modulo.
2. `test2` por el nombre real del proceso.
3. El componente `Test2Page` por el nombre real de la pantalla.
4. El import de `session/auth` segun la profundidad real de la carpeta.
5. El texto `Contenido base del proceso.` por la UI inicial del proceso.