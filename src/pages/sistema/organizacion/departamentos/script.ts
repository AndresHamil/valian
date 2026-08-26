import { useTemplateProcessScript } from "../../../../hooks/useTemplateProcessScript";

export function useDepartamentosProcessScript() {
  return useTemplateProcessScript({
    fallbackTitle: "Departamentos",
    fallbackDescription: "No fue posible recuperar la descripcion del proceso de departamentos desde la sesion activa.",
  });
}