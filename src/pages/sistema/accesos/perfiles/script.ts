import { useTemplateProcessScript } from "../../../../hooks/useTemplateProcessScript";

export function usePerfilesProcessScript() {
  return useTemplateProcessScript({
    fallbackTitle: "Perfiles",
    fallbackDescription: "No fue posible recuperar la descripcion del proceso de perfiles desde la sesion activa.",
  });
}