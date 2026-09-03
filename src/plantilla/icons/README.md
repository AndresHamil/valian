# Guia de iconos

Los iconos reales del sidebar se registran en [src/components/ThemeProvider/icons/index.tsx](../../components/ThemeProvider/icons/index.tsx#L1).

## Que hacer

1. Confirma el alias exacto que backend guarda para el modulo o proceso.
2. Busca el icono en Material UI Icons.
3. Copia el import oficial y pegalo en [src/components/ThemeProvider/icons/index.tsx](../../components/ThemeProvider/icons/index.tsx#L1).
4. En ese mismo archivo agrega el alias dentro de `iconMap` usando `registerIconAliases`.
5. Verifica que el alias del backend y el alias del `iconMap` sean exactamente iguales.
6. Prueba que el menu lateral ya muestre el icono correcto.

## Ejemplo

Si backend envia el alias `warehouse-rounded`:

```tsx
import WarehouseRoundedIcon from "@mui/icons-material/WarehouseRounded";

...registerIconAliases(<WarehouseRoundedIcon />, ["warehouse-rounded"]),
```

Ese fragmento debe quedar dentro de [src/components/ThemeProvider/icons/index.tsx](../../components/ThemeProvider/icons/index.tsx#L1):

- el import va en la seccion de imports
- el alias va dentro del objeto `iconMap`

## Si no agregas el icono

No se rompe la navegacion. El proyecto usa un icono por defecto mediante `SettingsSuggestIcon` cuando no encuentra el alias.

En otras palabras: si quieres evitar el icono por defecto, el alias del backend debe existir dentro de `iconMap` en [src/components/ThemeProvider/icons/index.tsx](../../components/ThemeProvider/icons/index.tsx#L1).

## Nota

Esta carpeta solo documenta el flujo. No pegues iconos aqui; pegalo en el archivo real del ThemeProvider.