import TemplateProcessPage from "../../../../components/TemplateProcessPage";
import "./index.scss";
import { useSucursalesProcessScript } from "./script";

export default function SucursalesPage() {
  const { permiso, titulo, descripcion } = useSucursalesProcessScript();

  if (permiso) {
    return null;
  }

  return (
    <TemplateProcessPage
      title={titulo}
      description={descripcion}
      body="Vista base del proceso de sucursales del sistema. Este modulo ya consume la plantilla compartida para mantener un patron uniforme entre procesos nuevos."
    />
  );
}