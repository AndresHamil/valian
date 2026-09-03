# Plantilla del proceso

Si vas a crear un proceso nuevo, copia estos tres archivos y pegalos en la carpeta real del proceso:

- `index.tsx`
- `script.ts`
- `index.scss`

Destino esperado:

```text
src/pages/<tipo>/<modulo>/<proceso>/
```

## Que debes cambiar

1. Renombra la carpeta `test2` por el nombre real del proceso.
2. Cambia `Test2Page` por el nombre real del componente.
3. Ajusta el import de `session/auth` en `script.ts` segun la profundidad real.
4. Cambia `Hola mundo.` por la UI inicial del proceso.
5. Registra la ruta en `src/routers`.

## Iconos del sidebar

Si este proceso o su modulo necesita un icono nuevo en el menu lateral, debes agregarlo en [src/components/ThemeProvider/icons/index.tsx](../../../components/ThemeProvider/icons/index.tsx#L1).

Paso a paso:

1. Busca el icono que quieres usar en Material UI Icons.
2. Copia el import oficial.
3. Pegalo en [src/components/ThemeProvider/icons/index.tsx](../../../components/ThemeProvider/icons/index.tsx#L1), junto a los demas imports.
4. En ese mismo archivo busca el objeto `iconMap`.
5. Agrega una entrada con el alias exacto que backend enviara y ligalo al componente del icono.

Ejemplo:

```tsx
import WarehouseRoundedIcon from "@mui/icons-material/WarehouseRounded";

"warehouse-rounded": <WarehouseRoundedIcon />,
```

Si no agregas el alias en `iconMap`, el sidebar mostrara el icono por defecto.

## Resultado minimo esperado

Con esos cambios ya puedes levantar una pantalla base que:

- lee `titulo` y `descripcion` desde la sesion
- respeta la estructura visual del proyecto
- queda lista para conectar API o agregar componentes