export type SessionProcess = {
  procesoId: string;
  nombre: string;
  descripcion?: string;
  codigo: string;
  icono: string | null;
  url: string;
  path: string;
  tipoPermiso: number;
  permisos: string[];
};

export type SessionModule = {
  moduloId: string;
  modulo: string;
  codigo: string;
  tipo: string;
  icono: string | null;
  procesos: SessionProcess[];
};

export type SessionAccesses = {
  gestion: SessionModule[];
  sistemas: SessionModule[];
  otros: SessionModule[];
};

export type SessionAssignment = {
  empresaId: string;
  sucursalId: string;
  departamentoId: string;
  perfilId: string;
  principal: boolean;
  estado: boolean;
  usuarioRegistroId: string;
  fechaAsignacion: string;
  empresa: string;
  sucursal: string;
  departamento: string;
  perfil: string;
};

export type SessionUser = {
  id: string;
  nombre: string;
  apellido: string;
  fechaNacimiento?: string;
  usuario: string;
  email: string;
  telefono: string;
  asignaciones?: SessionAssignment[];
  accesos?: SessionAccesses;
  fechaRegistro: string;
  fechaActualizacion: string;
  estado: boolean;
  sesion: boolean;
};

type RawSessionProcess = {
  procesoId: string;
  nombre: string;
  descripcion?: string;
  codigo: string;
  icono: string | null;
  url: string;
  tipoPermiso: number;
  permisos: string[];
};

type RawSessionModule = {
  moduloId: string;
  modulo: string;
  codigo: string;
  tipo: string;
  icono: string | null;
  procesos?: RawSessionProcess[];
};

type RawSessionAccesses = Partial<Record<keyof SessionAccesses, RawSessionModule[]>>;

type RawSessionUser = Omit<SessionUser, "accesos"> & {
  accesos?: RawSessionAccesses;
};

export const TOKEN_STORAGE_KEY = "valian.session.token";
export const USER_STORAGE_KEY = "valian.session.user";

const EMPTY_ACCESSES: SessionAccesses = {
  gestion: [],
  sistemas: [],
  otros: [],
};

function sanitizePathSegment(value: string) {
  return value
    .trim()
    .replace(/^\/+|\/+$/g, "")
    .toLowerCase();
}

export function normalizeAccessPath(url: string) {
  const normalizedUrl = `/${url
    .trim()
    .replace(/^\/+|\/+$/g, "")
    .split("/")
    .map(sanitizePathSegment)
    .filter(Boolean)
    .join("/")}`;

  return normalizedUrl;
}

function normalizeProcesses(processes?: RawSessionProcess[]) {
  return Array.isArray(processes)
    ? processes.map((process) => ({
        ...process,
        path: normalizeAccessPath(process.url),
      }))
    : [];
}

function normalizeModules(modules?: RawSessionModule[]) {
  return Array.isArray(modules)
    ? modules.map((module) => ({
        ...module,
        procesos: normalizeProcesses(module.procesos),
      }))
    : [];
}

export function normalizeSessionAccesses(accesses?: RawSessionAccesses): SessionAccesses {
  if (!accesses) {
    return EMPTY_ACCESSES;
  }

  return {
    gestion: normalizeModules(accesses.gestion),
    sistemas: normalizeModules(accesses.sistemas),
    otros: normalizeModules(accesses.otros),
  };
}

export function normalizeSessionUser(user: RawSessionUser): SessionUser {
  return {
    ...user,
    accesos: normalizeSessionAccesses(user.accesos),
  };
}

export function saveSession(token: string, user: SessionUser | RawSessionUser) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(normalizeSessionUser(user)));
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
    return normalizeSessionUser(JSON.parse(rawUser) as RawSessionUser);
  } catch {
    clearSession();
    return null;
  }
}

export function getSessionProcessByPath(pathname: string) {
  const user = getSessionUser();
  const processGroups = [
    ...(user?.accesos?.gestion || []),
    ...(user?.accesos?.sistemas || []),
    ...(user?.accesos?.otros || []),
  ];

  return processGroups
    .flatMap((module) => module.procesos)
    .find((process) => process.path === pathname);
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

export function getUserCompanyName(user: SessionUser | null) {
  if (!user?.asignaciones?.length) {
    return "Mi ERP";
  }

  const primaryAssignment = user.asignaciones.find((assignment) => assignment.principal && assignment.estado);
  const activeAssignment = primaryAssignment || user.asignaciones.find((assignment) => assignment.estado);

  return activeAssignment?.empresa?.trim() || "Mi ERP";
}