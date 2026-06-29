export type SessionUser = {
  id: string;
  nombre: string;
  apellido: string;
  usuario: string;
  email: string;
  telefono: string;
  fechaRegistro: string;
  fechaActualizacion: string;
  estado: boolean;
  sesion: boolean;
};

export const TOKEN_STORAGE_KEY = "valian.session.token";
export const USER_STORAGE_KEY = "valian.session.user";

export function saveSession(token: string, user: SessionUser) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
}

export function getSessionToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function getSessionUser(): SessionUser | null {
  const rawUser = localStorage.getItem(USER_STORAGE_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as SessionUser;
  } catch {
    clearSession();
    return null;
  }
}

export function hasRequiredSessionData(user: SessionUser | null) {
  if (!user) {
    return false;
  }

  return Boolean(
    user.id &&
      user.nombre &&
      user.apellido &&
      user.usuario &&
      user.email &&
      user.telefono &&
      user.fechaRegistro &&
      user.fechaActualizacion
  );
}

export function hasValidSession() {
  const token = getSessionToken();
  const user = getSessionUser();

  if (!token || !hasRequiredSessionData(user)) {
    clearSession();
    return false;
  }

  return true;
}

export function isAuthenticated() {
  return Boolean(getSessionToken());
}

export function getUserInitials(user: SessionUser | null) {
  if (!user) {
    return "U";
  }

  return `${user.nombre.charAt(0)}${user.apellido.charAt(0)}`.toUpperCase();
}

export function getUserFullName(user: SessionUser | null) {
  if (!user) {
    return "Usuario";
  }

  return `${user.nombre} ${user.apellido}`.trim();
}