# Valian

Frontend administrativo desarrollado con React, TypeScript y Vite. El proyecto sirve como base para un sistema modular con navegacion lateral, rutas dinamicas y una estructura preparada para crecer por dominios funcionales como inventario, organizacion y configuracion del sistema.

## Descripcion general

Valian es una aplicacion web orientada a la gestion interna de modulos operativos y de administracion. Actualmente incluye una base de interfaz con layout reutilizable, enrutamiento centralizado y vistas iniciales para catalogos, usuarios, departamentos, modulos y procesos.

La aplicacion utiliza un contenedor visual comun para las pantallas protegidas, con menu lateral expandible, tema claro/oscuro y navegacion por secciones. Esto permite mantener consistencia visual y acelerar la incorporacion de nuevos modulos.

## Objetivos del proyecto

- Centralizar modulos administrativos dentro de una misma interfaz.
- Facilitar el crecimiento por areas funcionales sin duplicar estructura.
- Mantener una base moderna en frontend con tipado estatico y componentes reutilizables.
- Preparar el proyecto para integrar autenticacion, permisos y consumo de APIs.

## Stack tecnologico

- React 19
- TypeScript
- Vite
- React Router DOM
- Material UI
- Emotion
- Axios
- ESLint

## Funcionalidades visibles en la base actual

- Enrutamiento dinamico a partir de una configuracion central con rutas canonicas y aliases de compatibilidad.
- Layout comun para vistas internas mediante un ThemeProvider personalizado.
- Sidebar con estructura por modulos y submodulos.
- Persistencia del modo de tema en localStorage.
- Vistas iniciales para secciones de inventario y sistema.
- Redireccion basica desde login hacia una ruta principal.

## Conexion con API en desarrollo

El proyecto usa el proxy de Vite para reenviar todas las rutas que empiezan con `/api` hacia el backend.

Pasos minimos para levantarlo:

1. Instala dependencias con `npm install`.
2. Crea un archivo `.env` en la raiz del proyecto.
3. Agrega `URL_BASE=<aqui a tu servicio de api>`.
4. Ejecuta `npm run dev`.

Si `URL_BASE` no existe o viene vacia, [vite.config.ts](vite.config.ts#L1) usa `DEFAULT_API_TARGET`, que hoy apunta a `http://localhost:3000`.

## Rutas principales

| Ruta | Modulo | Estado |
| --- | --- | --- |
| /gestion/inventario/catalogos | Inventario | Base implementada |
| /gestion/inventario/productos | Inventario | Base implementada |
| /gestion/inventarios/almacen | Inventarios | Base implementada |
| /sistema/accesos/usuarios | Accesos | Base implementada |
| /sistema/organizacion/departamentos | Organizacion | Base implementada |
| /sistema/modulos | Sistema | Base implementada |
| /sistema/procesos | Sistema | Base implementada |
| /dashboard | Inicio | Implementada |
| /login | Acceso | Implementada |
| * | Fallback | Not Found |

Nota:

- Algunas rutas antiguas o cortas se mantienen como compatibilidad.
- La referencia real para crecer el proyecto es la ruta canonica definida en `canonicalPath` dentro de `src/routers`.

## Estructura del proyecto

```text
src/
  components/
    ThemeProvider/
      icons/
  pages/
    gestion/
      inventario/
        catalgos/
        productos/
      inventarios/
        almacen/
      seguridad/
        camaras/
    otros/
      Dashboard/
      Login/
      NotFound/
    sistema/
      accesos/
        perfiles/
        usuarios/
      organizacion/
        departamentos/
        empresas/
        sucursales/
      sistema/
        modulos/
        procesos/
  routers/
    gestion/
    otros/
    sistema/
  main.tsx
  routes.tsx
```

## Instalacion

```bash
npm install
```

## Ejecucion en desarrollo

```bash
npm run dev
```

La aplicacion se ejecutara en el servidor local de Vite. Normalmente queda disponible en http://localhost:5173.

## Scripts disponibles

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Enfoque arquitectonico

- Las rutas se definen en `src/routers` y se consolidan en [src/routers/index.ts](src/routers/index.ts#L1).
- Cada archivo de rutas define un `canonicalPath` y, si hace falta, aliases de compatibilidad mediante `legacyPaths`.
- Las rutas dinamicas se construyen desde [src/routes.tsx](src/routes.tsx#L1) usando `appRoutes`.
- Las vistas que requieren contenedor visual comun se renderizan dentro del layout principal.
- Los iconos del sidebar se resuelven en [src/components/ThemeProvider/icons/index.tsx](src/components/ThemeProvider/icons/index.tsx#L1) mediante `iconMap`.
- La estructura por carpetas separa vistas operativas en `gestion`, configuracion en `sistema` y vistas globales en `otros`.
- La base actual permite extender permisos, datos remotos y componentes compartidos sin rehacer la navegacion.

## Alta de modulos y procesos

Para agregar un modulo o proceso nuevo, no empieces desde cero. Usa [src/plantilla/README.md](src/plantilla/README.md#L1) como guia operativa.

Resumen corto:

1. Crea la carpeta del proceso en `src/pages/<tipo>/<modulo>/<proceso>`.
2. Copia la plantilla base desde `src/plantilla/test1/test2`.
3. Registra la ruta en `src/routers/<tipo>/<modulo>.ts`.
4. Usa `canonicalPath` como ruta real y `legacyPaths` solo si necesitas compatibilidad.
5. Si el backend devuelve un icono nuevo, agregalo en [src/components/ThemeProvider/icons/index.tsx](src/components/ThemeProvider/icons/index.tsx#L1).

## Estado actual

El proyecto se encuentra en una etapa base de construccion de interfaz. Ya existe la estructura principal del panel administrativo, pero varias vistas aun funcionan como placeholders y la logica de permisos/autenticacion todavia es inicial.

## Siguientes pasos recomendados

- Conectar las vistas con servicios reales mediante Axios.
- Formalizar autenticacion y control de acceso por ruta.
- Completar las pantallas de inventario, usuarios, departamentos, modulos y procesos.
- Agregar manejo de estado y retroalimentacion visual para carga, error y exito.
- Incorporar pruebas para rutas, layout y componentes criticos.

## Autor

Proyecto frontend Valian.
