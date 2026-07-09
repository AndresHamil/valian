import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getSessionProcessByPath } from "../../../../session/auth";

// Plantilla base:
// 1. Mantiene titulo y descripcion leyendo la ruta activa desde la sesion.
// 2. Si el proceso consulta API, agrega aqui sus hooks, estados y llamadas.
// 3. Si cambias la profundidad de carpetas, ajusta tambien este import a session/auth.
export function useProcessScript() {
  const navigate = useNavigate();
  const location = useLocation();
  const permiso = false;
  const currentProcess = getSessionProcessByPath(location.pathname);
  const titulo = currentProcess?.nombre || "Proceso no disponible";
  const descripcion = currentProcess?.descripcion || "No fue posible recuperar la descripcion del proceso desde la sesion activa.";

  useEffect(() => {
    if (permiso) {
      navigate("/login");
    }
  }, [permiso, navigate]);

  return {
    permiso,
    titulo,
    descripcion,
  };
}