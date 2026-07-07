import { useEffect, useState } from "react";
import type { ChangeEvent, MouseEvent } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { getSessionToken } from "../../../../session/auth";

// Endpoints
const CONSULTAR_USUARIOS_URL = "/api/gestion/usuarios/consultarUsuarios";
const CONSULTAR_USUARIOS_FILTROS_URL = "/api/gestion/usuarios/consultarUsuariosFiltros";
const CONSULTAR_USUARIO_URL = "/api/gestion/usuarios/consultarUsuario";
const EDITAR_USUARIO_URL = "/api/gestion/usuarios/editarUsuario";
const USUARIOS_ROUTE = "/organizacion/usuarios";

// Tipos de vista
export type Column = {
  id:
    | "nombreCompleto"
    | "usuario"
    | "email"
    | "telefono"
    | "fechaRegistro"
    | "estado"
    | "sesion";
  label: string;
  minWidth?: number;
};

export type UsuarioRow = {
  id: string;
  nombre: string;
  apellido: string;
  nombreCompleto: string;
  usuario: string;
  email: string;
  telefono: string;
  fechaRegistro: string;
  fechaActualizacion: string;
  estado: boolean;
  sesion: boolean;
};

type UsuarioApiItem = {
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

type ConsultarUsuariosResponse = {
  success: boolean;
  message: string;
  error: string | null;
  data: UsuarioApiItem[];
  totalCount: number;
  resultCount?: number;
};

type MutationResponse = {
  success: boolean;
  message: string;
  error: string | null;
};

type ConsultarUsuarioResponse = {
  success: boolean;
  message: string;
  error: string | null;
  data: UsuarioApiItem;
};

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
  usuario: string;
  email: string | null;
  telefono: string | null;
  fechaRegistro: string;
  fechaActualizacion: string;
  passwordactual: string | null;
  passworNueva: string | null;
  estado: boolean | null;
  sesion: boolean;
};

type EditUsuarioPayload = {
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

// Configuración de filtros y vista
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
  { id: "nombreCompleto", label: "Nombre", minWidth: 220 },
  { id: "usuario", label: "Usuario", minWidth: 220 },
  { id: "email", label: "Correo", minWidth: 240 },
  { id: "telefono", label: "Telefono", minWidth: 140 },
  { id: "fechaRegistro", label: "Registro", minWidth: 170 },
  { id: "estado", label: "Estado", minWidth: 120 },
  { id: "sesion", label: "Sesion", minWidth: 120 },
];

export const BODY_ROW_HEIGHT = 53;
export const ACTIONS_COLUMN_WIDTH = 64;
export const TABLE_MIN_WIDTH = 1226;
export const BODY_CELL_SX = {
  height: BODY_ROW_HEIGHT,
  py: 1,
  boxSizing: "border-box",
} as const;

// Helpers de transformación
function buildNombreCompleto(usuario: Pick<UsuarioApiItem, "nombre" | "apellido">) {
  return `${usuario.nombre} ${usuario.apellido}`.trim();
}

function mapUsuarios(data: UsuarioApiItem[]): UsuarioRow[] {
  return data.map((usuario) => ({
    ...usuario,
    nombreCompleto: buildNombreCompleto(usuario),
  }));
}

function getSearchableUsuarioValues(row: UsuarioRow) {
  return [
    row.nombreCompleto,
    row.usuario,
    row.email,
    row.telefono,
    row.fechaRegistro,
    row.estado ? "activo" : "inactivo",
    row.sesion ? "abierta" : "cerrada",
  ];
}

function buildEditUsuarioForm(usuario: UsuarioApiItem): EditUsuarioForm {
  return {
    id: usuario.id,
    nombre: usuario.nombre,
    apellido: usuario.apellido || null,
    usuario: usuario.usuario,
    email: usuario.email || null,
    telefono: usuario.telefono || null,
    fechaRegistro: usuario.fechaRegistro,
    fechaActualizacion: usuario.fechaActualizacion,
    passwordactual: null,
    passworNueva: null,
    estado: usuario.estado,
    sesion: usuario.sesion,
  };
}

function normalizeOptionalText(value: string | null) {
  const normalized = value?.trim() ?? "";
  return normalized ? normalized : null;
}

function buildEditUsuarioPayload(current: EditUsuarioForm, original: EditUsuarioForm): EditUsuarioPayload {
  const normalizedNombre = current.nombre.trim();
  const normalizedApellido = normalizeOptionalText(current.apellido);
  const normalizedEmail = normalizeOptionalText(current.email);
  const normalizedTelefono = normalizeOptionalText(current.telefono);
  const normalizedPasswordActual = normalizeOptionalText(current.passwordactual);
  const normalizedPasswordNueva = normalizeOptionalText(current.passworNueva);

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

export function useUsuariosScript() {
  const navigate = useNavigate();
  const { id: routeUsuarioId } = useParams<{ id?: string }>();
  const permiso = false;
  const isMobileView = useMediaQuery("(max-width:900px)");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [viewMode, setViewMode] = useState<ViewMode>(() => (isMobileView ? "cards" : "table"));
  const [hasManualViewModeSelection, setHasManualViewModeSelection] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<UsuarioFilters>(EMPTY_FILTERS);
  const [usuarios, setUsuarios] = useState<UsuarioRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestError, setRequestError] = useState("");
  const [filtersAnchorEl, setFiltersAnchorEl] = useState<null | HTMLElement>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editDialogLoading, setEditDialogLoading] = useState(false);
  const [editDialogSubmitting, setEditDialogSubmitting] = useState(false);
  const [editDialogError, setEditDialogError] = useState("");
  const [editForm, setEditForm] = useState<EditUsuarioForm | null>(null);
  const [editFormOriginal, setEditFormOriginal] = useState<EditUsuarioForm | null>(null);

  // Redirección defensiva si la vista llegara a abrirse sin permiso.
  useEffect(() => {
    if (permiso) {
      navigate("/login");
    }
  }, [permiso, navigate]);

  const resetPagination = () => {
    setPage(0);
  };

  const clearUsuariosWithError = (message: string) => {
    setRequestError(message);
    setUsuarios([]);
  };

  const startRequest = () => {
    setLoading(true);
    setRequestError("");
  };

  const ensureSessionToken = (options?: { stopLoadingOnFail?: boolean }) => {
    const token = getSessionToken();

    if (token) {
      return token;
    }

    if (options?.stopLoadingOnFail) {
      setLoading(false);
    }

    setRequestError("No se encontro un token de sesion para consultar usuarios.");
    return null;
  };

  const applyUsuariosPayload = (
    payload: ConsultarUsuariosResponse,
    fallbackMessage: string
  ) => {
    if (!payload.success) {
      clearUsuariosWithError(payload.message || fallbackMessage);
      return false;
    }

    setUsuarios(mapUsuarios(payload.data));
    return true;
  };

  const resolveAxiosErrorMessage = (
    error: unknown,
    requestFallbackMessage: string,
    connectionFallbackMessage: string
  ) => {
    if (axios.isAxiosError<ConsultarUsuariosResponse>(error) && error.response) {
      return error.response.data.message || requestFallbackMessage;
    }

    return connectionFallbackMessage;
  };

  const consultarUsuarios = async () => {
    const token = ensureSessionToken({ stopLoadingOnFail: true });

    if (!token) {
      return;
    }

    startRequest();

    try {
      const response = await axios.get<ConsultarUsuariosResponse>(
        CONSULTAR_USUARIOS_URL,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      applyUsuariosPayload(
        response.data,
        "No fue posible consultar los usuarios."
      );
    } catch (error) {
      clearUsuariosWithError(
        resolveAxiosErrorMessage(
          error,
          "No fue posible consultar los usuarios.",
          "No fue posible conectar con el servicio de usuarios."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    consultarUsuarios();
  }, []);

  useEffect(() => {
    let isActive = true;

    const syncEditDialogFromRoute = async () => {
      if (!routeUsuarioId) {
        setEditDialogOpen(false);
        setEditDialogLoading(false);
        setEditDialogError("");
        setEditForm(null);
        setEditFormOriginal(null);
        return;
      }

      const token = ensureSessionToken();

      if (!token) {
        return;
      }

      setEditDialogError("");
      setEditDialogOpen(true);
      setEditDialogLoading(true);
      setEditForm(null);
      setEditFormOriginal(null);

      try {
        const response = await axios.post<ConsultarUsuarioResponse>(
          CONSULTAR_USUARIO_URL,
          { id: routeUsuarioId },
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }
        );

        if (!isActive) {
          return;
        }

        if (!response.data.success) {
          setEditDialogError(response.data.message || "No fue posible consultar el usuario.");
          return;
        }

        const hydratedForm = buildEditUsuarioForm(response.data.data);
        setEditForm(hydratedForm);
        setEditFormOriginal(hydratedForm);
      } catch (error) {
        if (!isActive) {
          return;
        }

        if (axios.isAxiosError<ConsultarUsuarioResponse>(error) && error.response) {
          setEditDialogError(error.response.data.message || "No fue posible consultar el usuario.");
        } else {
          setEditDialogError("No fue posible conectar con el servicio de consulta de usuario.");
        }
      } finally {
        if (isActive) {
          setEditDialogLoading(false);
        }
      }
    };

    void syncEditDialogFromRoute();

    return () => {
      isActive = false;
    };
  }, [routeUsuarioId]);

  useEffect(() => {
    if (hasManualViewModeSelection) {
      return;
    }

    setViewMode(isMobileView ? "cards" : "table");
  }, [hasManualViewModeSelection, isMobileView]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number(event.target.value));
    resetPagination();
  };

  const handleFilterChange = (
    key: keyof UsuarioFilters,
    value: string | boolean | null
  ) => {
    setFilters((current) => ({
      ...current,
      [key]: value === "" ? null : value,
    }));
    resetPagination();
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    resetPagination();
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    resetPagination();
  };

  const handleChangeViewMode = (
    _event: MouseEvent<HTMLElement>,
    nextViewMode: ViewMode | null
  ) => {
    if (!nextViewMode) {
      return;
    }

    setHasManualViewModeSelection(true);
    setViewMode(nextViewMode);
  };

  const handleOpenFilters = (event: MouseEvent<HTMLElement>) => {
    setFiltersAnchorEl(event.currentTarget);
  };

  const handleCloseFilters = () => {
    setFiltersAnchorEl(null);
  };

  const handleOpenEditDialog = async (row: Pick<UsuarioRow, "id">) => {
    await navigate(`${USUARIOS_ROUTE}/${row.id}`);
  };

  const handleCloseEditDialog = () => {
    if (editDialogSubmitting) {
      return;
    }

    void navigate(USUARIOS_ROUTE);
  };

  const handleEditFormChange = <K extends keyof EditUsuarioForm>(
    key: K,
    value: EditUsuarioForm[K]
  ) => {
    setEditForm((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        [key]: value,
      };
    });
  };

  const handleSubmitEditDialog = async () => {
    if (!editForm || !editFormOriginal) {
      return;
    }

    const token = ensureSessionToken();

    if (!token) {
      return;
    }

    if (!editForm.nombre.trim()) {
      setEditDialogError("El nombre es obligatorio.");
      return;
    }

    setEditDialogSubmitting(true);
    setEditDialogError("");

    const payload = buildEditUsuarioPayload(editForm, editFormOriginal);

    try {
      const response = await axios.put<MutationResponse>(EDITAR_USUARIO_URL, payload, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });

      if (!response.data.success) {
        setEditDialogError(response.data.message || "No fue posible editar el usuario.");
        return;
      }

      void navigate(USUARIOS_ROUTE);
      await consultarUsuarios();
    } catch (error) {
      if (axios.isAxiosError<MutationResponse>(error) && error.response) {
        setEditDialogError(error.response.data.message || "No fue posible editar el usuario.");
      } else {
        setEditDialogError("No fue posible conectar con el servicio de edicion de usuarios.");
      }
    } finally {
      setEditDialogSubmitting(false);
    }
  };

  const handleApplyFilters = async () => {
    const token = ensureSessionToken();

    if (!token) {
      return;
    }

    startRequest();
    resetPagination();

    try {
      const response = await axios.post<ConsultarUsuariosResponse>(
        CONSULTAR_USUARIOS_FILTROS_URL,
        filters,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      const requestSucceeded = applyUsuariosPayload(
        response.data,
        "No fue posible filtrar los usuarios."
      );

      if (requestSucceeded) {
        handleCloseFilters();
      }
    } catch (error) {
      clearUsuariosWithError(
        resolveAxiosErrorMessage(
          error,
          "No fue posible filtrar los usuarios.",
          "No fue posible conectar con el servicio de filtros de usuarios."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = async () => {
    setFilters(EMPTY_FILTERS);
    resetPagination();
    handleCloseFilters();
    await consultarUsuarios();
  };

  // Derivados de vista
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const visibleRows = usuarios.filter((row) => {
    if (!normalizedSearch) {
      return true;
    }

    return getSearchableUsuarioValues(row).some((value) =>
      value.toLowerCase().includes(normalizedSearch)
    );
  });

  const activeFiltersCount = Object.values(filters).filter(
    (value) => value !== null && value !== ""
  ).length;

  const paginatedRows = visibleRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return {
    permiso,
    page,
    rowsPerPage,
    viewMode,
    searchTerm,
    filters,
    loading,
    requestError,
    filtersAnchorEl,
    editDialogOpen,
    editDialogLoading,
    editDialogSubmitting,
    editDialogError,
    editForm,
    editFormOriginal,
    activeFiltersCount,
    paginatedRows,
    visibleRows,
    consultarUsuarios,
    handleChangePage,
    handleChangeRowsPerPage,
    handleFilterChange,
    handleSearchChange,
    handleClearSearch,
    handleChangeViewMode,
    handleOpenFilters,
    handleCloseFilters,
    handleOpenEditDialog,
    handleCloseEditDialog,
    handleEditFormChange,
    handleSubmitEditDialog,
    handleApplyFilters,
    handleClearFilters,
  };
}