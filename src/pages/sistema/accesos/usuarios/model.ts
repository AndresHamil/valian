import type { ApiEnvelope, ApiMutationResult, ValidationResult } from "../../../../shared/contracts/http";

export const USUARIOS_ROUTE = "/sistema/accesos/usuarios";

export const USUARIOS_API_ENDPOINTS = {
  consultarUsuarios: "/api/sistema/accesos/usuarios/consultarUsuarios",
  consultarUsuariosFiltros: "/api/sistema/accesos/usuarios/consultarUsuariosFiltros",
  consultarUsuario: "/api/sistema/accesos/usuarios/consultarUsuario",
  editarUsuario: "/api/sistema/accesos/usuarios/editarUsuario",
  registrarUsuario: "/api/sistema/accesos/usuarios/registrarUsuario",
} as const;

export type ResponseWithMessage = {
  message: string;
};

export type Column = {
  id:
    | "nombreCompleto"
    | "fechaNacimiento"
    | "usuario"
    | "email"
    | "telefono"
    | "empresa"
    | "sucursal"
    | "departamento"
    | "perfil"
    | "usuarioRegistro"
    | "sesionesActivas"
    | "fechaRegistro"
    | "fechaActualizacion"
    | "estado"
    | "sesion";
  label: string;
  minWidth?: number;
};

export type UsuarioRow = {
  id: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  nombreCompleto: string;
  usuario: string;
  email: string;
  telefono: string;
  empresaId: string;
  empresa: string;
  sucursalId: string;
  sucursal: string;
  departamentoId: string;
  departamento: string;
  perfilId: string;
  perfil: string;
  usuarioRegistroId: string;
  usuarioRegistro: string;
  sesionesActivas: number;
  asignaciones: UsuarioAssignment[];
  fechaRegistro: string;
  fechaActualizacion: string;
  estado: boolean;
  sesion: boolean;
};

export type UsuarioAssignment = {
  empresaId: string;
  sucursalId: string;
  departamentoId: string;
  perfilId: string;
  principal: boolean;
  estado: boolean;
  usuarioRegistroId: string;
  fechaAsignacion: string;
};

export type UsuarioApiItem = {
  id: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  usuario: string;
  email: string;
  telefono: string;
  empresaId: string;
  empresa: string;
  sucursalId: string;
  sucursal: string;
  departamentoId: string;
  departamento: string;
  perfilId: string;
  perfil: string;
  usuarioRegistroId: string;
  usuarioRegistro: string;
  sesionesActivas: number;
  asignaciones: UsuarioAssignment[];
  fechaRegistro: string;
  fechaActualizacion: string;
  estado: boolean;
  sesion: boolean;
};

export type ConsultarUsuariosResponse = ApiEnvelope<UsuarioApiItem[]> & {
  totalCount: number;
  resultCount?: number;
};

export type ConsultarUsuarioResponse = ApiEnvelope<UsuarioApiItem>;

export type MutationResponse = ApiMutationResult;

export type RegistrarUsuarioResponse = ApiEnvelope<{
  usuario: UsuarioApiItem;
} | null>;

export type UsuarioFilters = {
  id: string | null;
  nombre: string | null;
  apellido: string | null;
  usuario: string | null;
  email: string | null;
  telefono: string | null;
  fechaRegistro: string | null;
  fechaActualizacion: string | null;
  estado: boolean | null;
  sesion: boolean | null;
};

export type ViewMode = "table" | "cards";

export type EditUsuarioForm = {
  id: string;
  nombre: string;
  apellido: string | null;
  fechaNacimiento: string | null;
  usuario: string;
  email: string | null;
  telefono: string | null;
  empresaId: string;
  empresa: string | null;
  sucursalId: string;
  sucursal: string | null;
  departamentoId: string;
  departamento: string | null;
  perfilId: string;
  perfil: string | null;
  usuarioRegistroId: string;
  usuarioRegistro: string | null;
  sesionesActivas: number;
  asignaciones: UsuarioAssignment[];
  fechaRegistro: string;
  fechaActualizacion: string;
  passwordActual: string | null;
  passwordNueva: string | null;
  estado: boolean | null;
  sesion: boolean;
};

export type CreateUsuarioForm = {
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  telefono: string;
  email: string;
  password: string;
  empresaId: string;
  sucursalId: string;
  departamentoId: string;
  perfilId: string;
  usuarioRegistroId: string;
};

export type EditUsuarioPayload = {
  id: string;
  nombre: string | null;
  apellido: string | null;
  email: string | null;
  telefono: string | null;
  passwordactual: string | null;
  passworNueva: string | null;
  estado: boolean | null;
  sesion: boolean | null;
};

export type CreateUsuarioPayload = {
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  telefono: string;
  email: string;
  password: string;
  empresaId: string;
  sucursalId: string;
  departamentoId: string;
  perfilId: string;
  usuarioRegistroId: string;
};

export type AssignmentSnapshot = {
  empresaId?: string | null;
  sucursalId?: string | null;
  departamentoId?: string | null;
  perfilId?: string | null;
};

export const EMPTY_FILTERS: UsuarioFilters = {
  id: null,
  nombre: null,
  apellido: null,
  usuario: null,
  email: null,
  telefono: null,
  fechaRegistro: null,
  fechaActualizacion: null,
  estado: null,
  sesion: null,
};

export const columns: readonly Column[] = [
  { id: "nombreCompleto", label: "Nombre" },
  { id: "email", label: "Correo" },
  { id: "telefono", label: "Telefono" },
  { id: "fechaNacimiento", label: "Nacimiento" },
  { id: "usuario", label: "Usuario" },
  { id: "perfil", label: "Perfil" },
  { id: "departamento", label: "Departamento" },
  { id: "sucursal", label: "Sucursal" },
  { id: "empresa", label: "Empresa" },
  { id: "usuarioRegistro", label: "Usuario registro" },
  { id: "fechaRegistro", label: "Registro" },
  { id: "sesionesActivas", label: "Sesiones activas" },
  { id: "fechaActualizacion", label: "Actualizacion" },
  { id: "estado", label: "Estado" },
  { id: "sesion", label: "Sesion" },
];

export const BODY_ROW_HEIGHT = 53;
export const ACTIONS_COLUMN_WIDTH = 64;
export const TABLE_MIN_WIDTH = 0;
export const BODY_CELL_SX = {
  height: BODY_ROW_HEIGHT,
  py: 1,
  boxSizing: "border-box",
  whiteSpace: "nowrap",
  verticalAlign: "middle",
} as const;

const usuarioBirthDateFormatter = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function formatUsuarioBirthDate(value: string) {
  if (!value) {
    return "Sin fecha";
  }

  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00Z` : value;
  const parsedDate = new Date(normalized);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return usuarioBirthDateFormatter.format(parsedDate);
}

export function buildNombreCompleto(usuario: Pick<UsuarioApiItem, "nombre" | "apellido">) {
  return `${usuario.nombre} ${usuario.apellido}`.trim();
}

export function mapUsuarios(data: UsuarioApiItem[]): UsuarioRow[] {
  return data.map((usuario) => ({
    ...usuario,
    nombreCompleto: buildNombreCompleto(usuario),
  }));
}

export function getSearchableUsuarioValues(row: UsuarioRow) {
  return [
    row.nombreCompleto,
    row.usuario,
    row.email,
    row.telefono,
    row.empresa,
    row.sucursal,
    row.departamento,
    row.perfil,
    row.usuarioRegistro,
    row.fechaNacimiento,
    String(row.sesionesActivas),
    row.fechaRegistro,
    row.estado ? "activo" : "inactivo",
    row.sesion ? "abierta" : "cerrada",
  ];
}

export function buildEditUsuarioForm(usuario: UsuarioApiItem): EditUsuarioForm {
  return {
    id: usuario.id,
    nombre: usuario.nombre,
    apellido: usuario.apellido || null,
    fechaNacimiento: usuario.fechaNacimiento || null,
    usuario: usuario.usuario,
    email: usuario.email || null,
    telefono: usuario.telefono || null,
    empresaId: usuario.empresaId,
    empresa: usuario.empresa || null,
    sucursalId: usuario.sucursalId,
    sucursal: usuario.sucursal || null,
    departamentoId: usuario.departamentoId,
    departamento: usuario.departamento || null,
    perfilId: usuario.perfilId,
    perfil: usuario.perfil || null,
    usuarioRegistroId: usuario.usuarioRegistroId,
    usuarioRegistro: usuario.usuarioRegistro || null,
    sesionesActivas: usuario.sesionesActivas,
    asignaciones: usuario.asignaciones,
    fechaRegistro: usuario.fechaRegistro,
    fechaActualizacion: usuario.fechaActualizacion,
    passwordActual: null,
    passwordNueva: null,
    estado: usuario.estado,
    sesion: usuario.sesion,
  };
}

export function normalizeOptionalText(value: string | null) {
  const normalized = value?.trim() ?? "";
  return normalized ? normalized : null;
}

export function buildEditUsuarioPayload(current: EditUsuarioForm, original: EditUsuarioForm): EditUsuarioPayload {
  const normalizedNombre = current.nombre.trim();
  const normalizedApellido = normalizeOptionalText(current.apellido);
  const normalizedEmail = normalizeOptionalText(current.email);
  const normalizedTelefono = normalizeOptionalText(current.telefono);
  const normalizedPasswordActual = normalizeOptionalText(current.passwordActual);
  const normalizedPasswordNueva = normalizeOptionalText(current.passwordNueva);

  return {
    id: current.id,
    nombre: normalizedNombre !== original.nombre.trim() ? normalizedNombre : null,
    apellido: normalizedApellido !== normalizeOptionalText(original.apellido) ? normalizedApellido : null,
    email: normalizedEmail !== normalizeOptionalText(original.email) ? normalizedEmail : null,
    telefono: normalizedTelefono !== normalizeOptionalText(original.telefono) ? normalizedTelefono : null,
    passwordactual: normalizedPasswordActual,
    passworNueva: normalizedPasswordNueva,
    estado: current.estado !== original.estado ? current.estado : null,
    sesion: null,
  };
}

function buildValidationResult(message?: string): ValidationResult {
  return {
    isValid: !message,
    message: message ?? null,
  };
}

export function validateEditUsuarioForm(form: EditUsuarioForm): ValidationResult {
  if (!form.nombre.trim()) {
    return buildValidationResult("El nombre es obligatorio.");
  }

  if (normalizeOptionalText(form.passwordNueva) && !normalizeOptionalText(form.passwordActual)) {
    return buildValidationResult("Debes capturar el password actual para definir un password nuevo.");
  }

  return buildValidationResult();
}

export function validateCreateUsuarioForm(form: CreateUsuarioForm): ValidationResult {
  const requiredFields = [
    [form.nombre, "Completa el nombre del usuario."],
    [form.apellido, "Completa el apellido del usuario."],
    [form.telefono, "Completa el telefono del usuario."],
    [form.email, "Completa el correo del usuario."],
    [form.password, "Completa el password inicial del usuario."],
    [form.empresaId, "Completa la empresa principal del usuario."],
    [form.sucursalId, "Completa la sucursal principal del usuario."],
    [form.departamentoId, "Completa el departamento principal del usuario."],
    [form.perfilId, "Completa el perfil principal del usuario."],
    [form.usuarioRegistroId, "No se encontro el usuario de sesion que registra el alta."],
  ] as const;

  for (const [value, message] of requiredFields) {
    if (!value.trim()) {
      return buildValidationResult(message);
    }
  }

  if (!form.email.includes("@")) {
    return buildValidationResult("Captura un correo valido para registrar el usuario.");
  }

  return buildValidationResult();
}

export function buildCreateUsuarioPayload(form: CreateUsuarioForm): CreateUsuarioPayload {
  return {
    nombre: form.nombre.trim(),
    apellido: form.apellido.trim(),
    fechaNacimiento: form.fechaNacimiento.trim(),
    telefono: form.telefono.trim(),
    email: form.email.trim(),
    password: form.password,
    empresaId: form.empresaId.trim(),
    sucursalId: form.sucursalId.trim(),
    departamentoId: form.departamentoId.trim(),
    perfilId: form.perfilId.trim(),
    usuarioRegistroId: form.usuarioRegistroId.trim(),
  };
}

export function buildInitialCreateUsuarioForm(
  activeAssignment: AssignmentSnapshot | null | undefined,
  sessionUserId: string | null | undefined
): CreateUsuarioForm {
  return {
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    telefono: "",
    email: "",
    password: "",
    empresaId: activeAssignment?.empresaId ?? "",
    sucursalId: activeAssignment?.sucursalId ?? "",
    departamentoId: activeAssignment?.departamentoId ?? "",
    perfilId: activeAssignment?.perfilId ?? "",
    usuarioRegistroId: sessionUserId ?? "",
  };
}