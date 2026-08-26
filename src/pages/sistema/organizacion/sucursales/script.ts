import { useTemplateProcessScript } from "../../../../hooks/useTemplateProcessScript";

export function useSucursalesProcessScript() {
  return useTemplateProcessScript({
    fallbackTitle: "Sucursales",
    fallbackDescription: "No fue posible recuperar la descripcion del proceso de sucursales desde la sesion activa.",
  });
}