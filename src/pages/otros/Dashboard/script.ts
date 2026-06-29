import {
  getSessionUser,
  getUserFullName,
  hasValidSession,
} from "../../../session/auth";

export function useDashboardScript() {
  const permiso = hasValidSession();
  const user = getSessionUser();

  const cards = [
    {
      label: "Usuario",
      value: user?.usuario || "Sin dato",
    },
    {
      label: "Correo",
      value: user?.email || "Sin dato",
    },
    {
      label: "Telefono",
      value: user?.telefono || "Sin dato",
    },
    {
      label: "Estado",
      value: user?.estado ? "Activo" : "Inactivo",
    },
  ];

  return {
    permiso,
    fullName: getUserFullName(user),
    cards,
  };
}