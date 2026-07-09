# Plantilla de iconos

Cuando un modulo o proceso nuevo necesite icono, el alta real se hace en:

- `src/components/ThemeProvider/icons/index.tsx`

## Que debe hacer el programador

1. Copiar el import oficial desde MUI Icons.
2. Pegar el import en `src/components/ThemeProvider/icons/index.tsx`.
3. Registrar el alias que devuelve backend en `iconMap`.
4. Verificar que el alias coincida con el valor guardado en backend.

## Ejemplo

Si backend manda el alias `warehouse-rounded`:

1. Importar `WarehouseRoundedIcon`.
2. Agregar:

```tsx
"warehouse-rounded": <WarehouseRoundedIcon />,
```

## Checklist rapido

1. Confirmar el alias exacto que devuelve backend.
2. Importar el icono oficial de MUI en el archivo real de iconos.
3. Registrar el alias con el mismo texto que devuelve backend.
4. Si backend manda basura como `';`, confiar en la normalizacion solo como respaldo, no como regla.

## Nota

Esta carpeta solo documenta el flujo. El archivo real de iconos no vive dentro de `src/plantilla`.