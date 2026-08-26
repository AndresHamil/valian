import TemplateProcessPage from "../../../../components/TemplateProcessPage";
import "./index.scss";
import { usePerfilesProcessScript } from "./script";

export default function PerfilesPage() {
  const { permiso, titulo, descripcion } = usePerfilesProcessScript();

  if (permiso) {
    return null;
  }

  return (
    <TemplateProcessPage
      title={titulo}
      description={descripcion}
      body="Vista base del proceso de perfiles del sistema. Esta pantalla ya consume la plantilla compartida para mantener el mismo contrato visual y tecnico del resto de procesos nuevos."
    />
  );
}