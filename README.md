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

- Enrutamiento dinamico a partir de una configuracion central.
- Layout comun para vistas internas mediante un ThemeProvider personalizado.
- Sidebar con estructura por modulos y submodulos.
- Persistencia del modo de tema en localStorage.
- Vistas iniciales para secciones de inventario y sistema.
- Redireccion basica desde login hacia una ruta principal.

## Rutas configuradas actualmente

| Ruta | Modulo | Estado |
| --- | --- | --- |
| /catalogos | Inventario | Base implementada |
| /organizacion/usuarios | Organizacion | Base implementada |
| /organizacion/departamentos | Organizacion | Base implementada |
| /sistema/modulos | Sistema | Base implementada |
| /sistema/procesos | Sistema | Base implementada |
| /login | Acceso | Implementada |
| * | Fallback | Not Found |

## Estructura del proyecto

```text
src/
  components/
    ThemeProvider/
  pages/
    independiente/
      inventario/
        catalgos/
        productos/
    otros/
      Dashboard/
      Login/
      NotFound/
    sistema/
      gestion/
        departamentos/
        usuarios/
      sistema/
        modulos/
        procesos/
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

- Las rutas se definen en un solo punto y se resuelven de forma dinamica.
- Las vistas que requieren contenedor visual comun se renderizan dentro del layout principal.
- La estructura por carpetas separa paginas independientes, vistas generales y modulos del sistema.
- La base actual permite extender permisos, datos remotos y componentes compartidos sin rehacer la navegacion.

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
