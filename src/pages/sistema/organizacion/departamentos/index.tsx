import TemplateProcessPage from "../../../../components/TemplateProcessPage";
import "./index.scss";
import { useDepartamentosProcessScript } from "./script";

export default function DepartamentosPage() {
  const { permiso, titulo, descripcion } = useDepartamentosProcessScript();

  if (permiso) {
    return null;
  }

  return (
    <TemplateProcessPage
      title={titulo}
      description={descripcion}
      body="Vista base del proceso de departamentos del sistema. Este proceso ya usa el mismo hook y shell compartidos para mantener la plantilla oficial del proyecto."
    />
  );
}