import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getSessionProcessByPath } from "../../../../session/auth";

export function useProcessScript() {
  const navigate = useNavigate();
  const location = useLocation();
  const permiso = false;
  const currentProcess = getSessionProcessByPath(location.pathname);
  const titulo = currentProcess?.nombre || "Empresas";
  const descripcion = currentProcess?.descripcion || "No fue posible recuperar la descripcion del proceso de empresas desde la sesion activa.";

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