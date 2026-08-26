import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getSessionProcessByPath } from "../session/auth";
import type { ProcessViewCopy, ProtectedProcessState } from "../shared/contracts/process";

type UseTemplateProcessScriptOptions = Pick<ProcessViewCopy, "fallbackTitle" | "fallbackDescription">;

export function useTemplateProcessScript({
  fallbackTitle,
  fallbackDescription,
}: UseTemplateProcessScriptOptions): ProtectedProcessState {
  const navigate = useNavigate();
  const location = useLocation();
  const permiso = false;
  const currentProcess = getSessionProcessByPath(location.pathname);
  const titulo = currentProcess?.nombre || fallbackTitle;
  const descripcion = currentProcess?.descripcion || fallbackDescription;

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