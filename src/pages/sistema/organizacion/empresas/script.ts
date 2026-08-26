import { useTemplateProcessScript } from "../../../../hooks/useTemplateProcessScript";

export function useEmpresasProcessScript() {
  return useTemplateProcessScript({
    fallbackTitle: "Empresas",
    fallbackDescription: "No fue posible recuperar la descripcion del proceso de empresas desde la sesion activa.",
  });
}