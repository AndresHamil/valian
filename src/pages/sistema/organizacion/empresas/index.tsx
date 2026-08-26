import TemplateProcessPage from "../../../../components/TemplateProcessPage";
import "./index.scss";
import { useEmpresasProcessScript } from "./script";

export default function EmpresasPage() {
  const { permiso, titulo, descripcion } = useEmpresasProcessScript();

  if (permiso) {
    return null;
  }

  return (
    <TemplateProcessPage
      title={titulo}
      description={descripcion}
      body="Vista base del proceso de empresas del sistema. Este modulo ya comparte el mismo shell base para evitar que usuarios quede como una excepcion aislada."
    />
  );
}