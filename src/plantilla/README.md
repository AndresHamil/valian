# Guia rapida de la plantilla

Este directorio existe para que cualquier persona pueda dar de alta un modulo o un proceso nuevo sin tener que adivinar la estructura del proyecto. La idea es simple: copiar la base correcta, pegarla en el lugar correcto y registrar la ruta.

## De que va este proyecto

El frontend esta dividido en tres grupos principales:

- `gestion`: procesos operativos del negocio. Aqui viven pantallas de trabajo diario, captura, consulta y seguimiento. Ejemplos del repo: inventario, almacen, camaras.
- `sistema`: configuracion interna del sistema. Aqui viven pantallas administrativas que cambian el comportamiento del ERP o la seguridad. Ejemplos del repo: modulos, procesos, usuarios, perfiles, departamentos.
- `otros`: vistas generales o transversales que no dependen de un modulo de negocio del backend. Ejemplos: login, dashboard y not found.

Regla practica:

- Si la pantalla representa trabajo operativo de un area, va en `gestion`.
- Si la pantalla administra catalogos tecnicos, accesos o configuracion, va en `sistema`.
- Si la pantalla es global, publica o de soporte a la aplicacion, va en `otros`.

## Como funciona la conexion con Vite

El proyecto usa el proxy de Vite para enviar todas las rutas que empiezan con `/api` al backend real. La URL del backend se toma desde `.env` y, si no existe o viene vacia, se usa un valor por defecto.

Paso a paso:

1. Descarga el proyecto.
2. Instala dependencias con `npm install`.
3. Crea un archivo `.env` en la raiz del proyecto.
4. Dentro de `.env` agrega esta linea:

```env
URL_BASE=<aqui a tu servicio de api>
```

5. Ejecuta `npm run dev`.
6. Vite leera `URL_BASE` en [vite.config.ts](../vite.config.ts#L1).
7. Si `URL_BASE` no existe o viene vacia, Vite usara `DEFAULT_API_TARGET`, que hoy apunta a `http://localhost:3000`.
8. El frontend llama rutas relativas como `/api/...` desde [src/shared/api.ts](../shared/api.ts#L1), por eso el proxy es el que decide a que servidor llegar.

En resumen:

- Con `.env`, el proyecto apunta al backend definido en `URL_BASE`.
- Sin `.env`, o con `URL_BASE` vacia, el proyecto apunta al backend local por defecto.

## Que trae esta carpeta

- `test1/test2`: plantilla base de un proceso.
- `routers`: ejemplos para registrar rutas nuevas.
- `icons`: guia para ligar iconos nuevos.

## Como crear un modulo o proceso nuevo

Antes de tocar frontend, confirma que backend ya te dio estos datos:

1. Tipo: `gestion`, `sistema` u otro que ya exista.
2. Nombre del modulo.
3. Nombre del proceso.
4. URL canonica del proceso.
5. Alias del icono del modulo y del proceso, si aplica.

Ejemplo:

- tipo: `gestion`
- modulo: `inventarios`
- proceso: `almacen`
- url: `gestion/inventarios/almacen`

### Caso 1: solo vas a crear un proceso dentro de un modulo existente

1. Copia el contenido de [src/plantilla/test1/test2](test1/test2/README.md) a `src/pages/<tipo>/<modulo>/<proceso>`.
2. Renombra el componente principal y reemplaza el texto base por un hola mundo o por la UI real.
3. Ajusta el import de `session/auth` en `script.ts` segun la profundidad real de la carpeta.
4. Registra la ruta en `src/routers/<tipo>/<modulo>.ts`.
5. Usa `canonicalPath` como la URL real del proceso.
6. Verifica que `importPath` apunte a `./pages/<tipo>/<modulo>/<proceso>`.
7. Si necesitas mantener una URL vieja por compatibilidad, agregala en `legacyPaths`.

### Caso 2: vas a crear un modulo nuevo con uno o mas procesos

1. Crea la carpeta del proceso en `src/pages/<tipo>/<modulo>/<proceso>` copiando la plantilla base.
2. Si todavia no existe el archivo del modulo en `src/routers/<tipo>`, copia [src/plantilla/routers/tipo/test1.ts](routers/tipo/test1.ts) y renombralo con el nombre real del modulo.
3. Si el `index.ts` del tipo necesita agregar ese modulo, usa [src/plantilla/routers/tipo/index.ts](routers/tipo/index.ts) como referencia.
4. Registra cada proceso nuevo dentro del archivo del modulo.
5. Si backend envia un icono nuevo para ese modulo, registralo tambien.

Nota importante:

- En frontend la pantalla real siempre vive a nivel de proceso.
- El modulo normalmente agrupa procesos en navegacion y en routers.

## Como dejar un hola mundo funcional

Para levantar una pantalla base no necesitas construir toda la UI desde el inicio.

1. Copia la plantilla del proceso.
2. Deja el `titulo` y la `descripcion` leyendo la sesion, como ya viene en la base.
3. Cambia el contenido del cuerpo por un texto simple como `Hola mundo`.
4. Registra la ruta.
5. Abre la app y entra al proceso desde la navegacion o por URL.

Con eso ya tienes una pantalla conectada a la estructura real del proyecto.

## Como funcionan los iconos

Los iconos del sidebar se resuelven en [src/components/ThemeProvider/icons/index.tsx](../components/ThemeProvider/icons/index.tsx#L1).

Si backend envia un alias conocido, la UI muestra el icono que este ligado a ese alias.

Si backend no envia icono, o envia un alias no registrado, el proyecto muestra un icono por defecto: `SettingsSuggestIcon`.

Paso a paso para agregar un icono nuevo:

1. Busca el icono en Material UI Icons.
2. Copia el import oficial.
3. Pegalo en [src/components/ThemeProvider/icons/index.tsx](../components/ThemeProvider/icons/index.tsx#L1), junto a los demas imports de iconos.
4. Dentro del mismo archivo, busca el objeto `iconMap` y registra el alias con `registerIconAliases`.
5. Usa exactamente el mismo alias que guarda backend; si cambia una letra, el sidebar no lo encontrara.
6. Si no agregas ese alias en `iconMap`, el sidebar mostrara el icono por defecto.

## Checklist final

1. Existe `.env` con `URL_BASE`, o sabes que se usara `DEFAULT_API_TARGET`.
2. La carpeta del proceso existe en `src/pages/<tipo>/<modulo>/<proceso>`.
3. El componente ya no se llama `Test2Page`.
4. El import de `session/auth` tiene la profundidad correcta.
5. El router tiene `canonicalPath` e `importPath` correctos.
6. El alias del icono existe, o aceptas que se use el icono por defecto.
7. La URL del router coincide con la URL canonica que backend envia en sesion.

## Archivos de apoyo

- [Guia de iconos](icons/README.md)
- [Guia de routers](routers/README.md)
- [Plantilla del proceso](test1/test2/README.md)