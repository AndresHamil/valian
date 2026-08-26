# Proceso Ejemplo: Usuarios

Este modulo esta organizado como referencia para procesos futuros del proyecto.

La idea no es copiar archivos a ciegas. La idea es repetir la estructura, conservar los contratos base y cambiar solo las piezas propias del dominio del nuevo proceso.

## Estructura

- index.tsx: ensamblador de pantalla. Solo compone secciones, dialogs y paginacion.
- model.ts: contratos del proceso, constantes, builders y derivados puros.
- api.ts: operaciones HTTP del modulo y resolucion uniforme de errores.
- use-usuarios-script.ts: estado, orquestacion, navegacion y acciones del proceso.
- script.ts: fachada publica del proceso para mantener la convencion del repo.
- components/UsuariosHeader: header del listado.
- components/UsuariosToolbar: toolbar del listado.
- components/UsuariosFiltersPopover: popover de filtros.
- components/UsuariosTableSection: tabla del listado.
- components/UsuariosCardsSection: cards del listado.
- components/UsuariosErrorBanner: estado visual de error.
- components/dialogs.tsx: dialogo de alta.
- components/dialog-styles.ts: estilos sx reutilizables para shells visuales.
- usuario/: flujo de detalle y edicion por ruta, reutilizando el mismo nucleo del modulo.
- styles/: parciales SCSS compartidos del proceso.

## Principios

- La pantalla principal no contiene logica de negocio compleja.
- Los contratos y builders viven fuera de React para poder reutilizarse.
- La capa API centraliza endpoints, deduplicacion y respuestas.
- La UI consume tipos del modelo, no del hook principal.
- El detalle por ruta reutiliza helpers, payloads y fetches del mismo modulo.

## Antes De Replicar

Usa este modulo como plantilla cuando el nuevo proceso cumpla al menos una de estas condiciones:

1. Tiene listado con tabla o cards.
2. Tiene alta y edicion con formularios.
3. Tiene detalle o edicion por ruta.
4. Va a consumir backend con endpoints propios y necesita un contrato mantenible.

Si el proceso es muy pequeno y solo necesita mostrar titulo, descripcion y un bloque simple, no copies todo usuarios. Usa la plantilla compartida del proyecto:

1. [src/hooks/useTemplateProcessScript.ts](src/hooks/useTemplateProcessScript.ts)
2. [src/components/TemplateProcessPage/index.tsx](src/components/TemplateProcessPage/index.tsx)

Eso ya se esta usando en procesos base como perfiles, empresas, departamentos y sucursales.

## Checklist Para Replicar

1. Crear model.ts con tipos, endpoints y builders del proceso.
2. Crear api.ts con requests y resolucion de errores.
3. Dejar script.ts como fachada y mover la orquestacion a un hook dedicado.
4. Mantener index.tsx como ensamblador, no como archivo gigante.
5. Separar dialogs y secciones visuales en componentes locales pequenos dentro de components/.
6. Centralizar shells visuales repetidos en un archivo como dialog-styles.ts.
7. Si existe detalle por ruta, reutilizar el mismo model.ts y api.ts.

## Que Debes Conservar

Estas piezas deben mantenerse casi iguales entre modulos porque definen el patron tecnico del proyecto:

1. La separacion por capas: model.ts, api.ts, hook principal, index.tsx y components/.
2. El criterio de que index.tsx solo ensambla la pantalla.
3. El criterio de que model.ts contiene tipos, builders, constantes y validaciones puras.
4. El criterio de que api.ts concentra endpoints, deduplicacion y manejo uniforme de errores.
5. El criterio de que script.ts puede quedar como fachada si el repo sigue usando esa convencion.
6. El criterio de que los dialogs y secciones visuales se separan del hook principal.
7. El criterio de que si existe detalle por ruta, debe reutilizar model.ts y api.ts del mismo modulo.
8. El criterio de que las validaciones importantes deben poder probarse sin renderizar React.

## Que Si Debes Cambiar

Estas piezas deben adaptarse al dominio del nuevo proceso. No deben quedarse con nombres de usuarios ni con textos heredados.

1. El nombre del hook principal.
Ejemplo: useUsuariosScript debe convertirse en algo como usePerfilesScript o useEmpresasScript.

2. Las constantes de ruta y endpoints.
Ejemplo: USUARIOS_ROUTE y USUARIOS_API_ENDPOINTS deben renombrarse al dominio correcto.

3. Los tipos del modelo.
Ejemplo: UsuarioRow, UsuarioApiItem, UsuarioFilters y los payloads deben cambiar al lenguaje del nuevo proceso.

4. Los builders.
Ejemplo: buildEditUsuarioForm, buildEditUsuarioPayload y buildCreateUsuarioPayload deben expresar el contrato real del nuevo backend.

5. Las validaciones de negocio.
Ejemplo: validateCreateUsuarioForm y validateEditUsuarioForm deben cambiar segun los campos obligatorios y reglas del nuevo modulo.

6. Las columnas, labels y textos visibles.
Ejemplo: nombre de columnas, subtitulos, mensajes de error, eyebrow de dialogs y helperText.

7. La forma de renderizar cards, tabla y detalle.
Ejemplo: un proceso de empresas no deberia mostrar los mismos bloques que un proceso de usuarios.

8. Los tests.
Ejemplo: no copies pruebas con nombres de usuarios. Conserva la estructura, pero cambia los fixtures y reglas al proceso nuevo.

## Orden Recomendado Para Crear Un Modulo Nuevo

1. Crear la carpeta del proceso y su ruta en routers.
2. Empezar por model.ts.
Define tipos, constantes, builders y validaciones puras antes de tocar UI.

3. Crear api.ts.
Conecta los endpoints reales del backend y deja uniforme el manejo de errores.

4. Crear el hook principal.
Orquesta estado, filtros, carga, envios y navegacion, sin JSX.

5. Crear index.tsx como ensamblador.
Solo compone header, toolbar, tabla, cards, dialogs y paginacion.

6. Extraer dialogs y secciones visuales.
Si una parte ya tiene demasiado JSX o demasiada responsabilidad, sale a components/.

7. Si existe detalle por ruta, reutilizar model.ts y api.ts.
No dupliques builders ni requests solo porque cambia la vista.

8. Agregar tests a model.ts y a helpers criticos.
Como minimo, valida alta y edicion si el proceso las usa.

## Regla Rapida De Copia

Cuando copies este modulo como base, piensa asi:

1. Copia la estructura.
2. Conserva la arquitectura.
3. Renombra todo lo que huela al dominio anterior.
4. Reescribe contratos y validaciones al backend nuevo.
5. No heredes textos, columnas ni formularios por comodidad.

## Antipatrones A Evitar

1. Meter la logica HTTP dentro del componente visual.
2. Duplicar tipos entre listado y detalle por ruta.
3. Dejar nombres viejos del modulo anterior en tipos, hooks o endpoints.
4. Usar index.tsx como archivo gigante con estado, requests y JSX mezclados.
5. Validar formularios solo dentro del boton submit sin extraer funciones puras.
6. Copiar tests del modulo anterior sin cambiar fixtures ni reglas.

## Minimo Que Debes Cambiar Si Clonas Usuarios

Si alguien clona este modulo como punto de partida, estos son los cambios minimos obligatorios:

1. Renombrar ruta, endpoints, hook principal, tipos y payloads.
2. Reemplazar textos visibles y mensajes de error.
3. Ajustar columnas, filtros y campos de formulario.
4. Reescribir validaciones segun el backend del proceso nuevo.
5. Rehacer fixtures y tests para el dominio correcto.
6. Revisar si realmente necesita detalle por ruta, dialogs, cards y tabla. Si no, se elimina lo que sobre.

## Regla Practica

Si una pieza puede vivir sin React, no deberia estar en el hook.