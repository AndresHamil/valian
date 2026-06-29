import { useEffect, useState } from "react";
import type { ChangeEvent, MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getSessionToken } from "../../../../session/auth";

const CONSULTAR_USUARIOS_URL = "/api/gestion/usuarios/consultarUsuarios";
const CONSULTAR_USUARIOS_FILTROS_URL = "/api/gestion/usuarios/consultarUsuariosFiltros";

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

type ConsultarUsuariosResponse = {
  success: boolean;
  message: string;
  error: string | null;
  data: Array<{
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
  }>;
  totalCount: number;
  resultCount?: number;
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

export function useUsuariosScript() {
  const navigate = useNavigate();
  const permiso = false;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<UsuarioFilters>(EMPTY_FILTERS);
  const [usuarios, setUsuarios] = useState<UsuarioRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestError, setRequestError] = useState("");
  const [filtersAnchorEl, setFiltersAnchorEl] = useState<null | HTMLElement>(null);

  const mapUsuarios = (data: ConsultarUsuariosResponse["data"]) =>
    data.map((usuario) => ({
      ...usuario,
      nombreCompleto: `${usuario.nombre} ${usuario.apellido}`.trim(),
    }));

  useEffect(() => {
    if (permiso) {
      navigate("/login");
    }
  }, [permiso, navigate]);

  const consultarUsuarios = async () => {
    const token = getSessionToken();

    if (!token) {
      setLoading(false);
      setRequestError("No se encontro un token de sesion para consultar usuarios.");
      return;
    }

    setLoading(true);
    setRequestError("");

    try {
      const response = await axios.get<ConsultarUsuariosResponse>(
        CONSULTAR_USUARIOS_URL,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      const payload = response.data;

      if (!payload.success) {
        setRequestError(payload.message || "No fue posible consultar los usuarios.");
        setUsuarios([]);
        return;
      }

      setUsuarios(mapUsuarios(payload.data));
    } catch (error) {
      if (axios.isAxiosError<ConsultarUsuariosResponse>(error) && error.response) {
        setRequestError(
          error.response.data.message || "No fue posible consultar los usuarios."
        );
      } else {
        setRequestError("No fue posible conectar con el servicio de usuarios.");
      }

      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    consultarUsuarios();
  }, []);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  const handleFilterChange = (
    key: keyof UsuarioFilters,
    value: string | boolean | null
  ) => {
    setFilters((current) => ({
      ...current,
      [key]: value === "" ? null : value,
    }));
    setPage(0);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setPage(0);
  };

  const handleChangeViewMode = (
    _event: MouseEvent<HTMLElement>,
    nextViewMode: ViewMode | null
  ) => {
    if (!nextViewMode) {
      return;
    }

    setViewMode(nextViewMode);
  };

  const handleOpenFilters = (event: MouseEvent<HTMLElement>) => {
    setFiltersAnchorEl(event.currentTarget);
  };

  const handleCloseFilters = () => {
    setFiltersAnchorEl(null);
  };

  const handleApplyFilters = async () => {
    const token = getSessionToken();

    if (!token) {
      setRequestError("No se encontro un token de sesion para consultar usuarios.");
      return;
    }

    setLoading(true);
    setRequestError("");
    setPage(0);

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

      const payload = response.data;

      if (!payload.success) {
        setRequestError(payload.message || "No fue posible filtrar los usuarios.");
        setUsuarios([]);
        return;
      }

      setUsuarios(mapUsuarios(payload.data));
      handleCloseFilters();
    } catch (error) {
      if (axios.isAxiosError<ConsultarUsuariosResponse>(error) && error.response) {
        setRequestError(
          error.response.data.message || "No fue posible filtrar los usuarios."
        );
      } else {
        setRequestError("No fue posible conectar con el servicio de filtros de usuarios.");
      }

      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = async () => {
    setFilters(EMPTY_FILTERS);
    setPage(0);
    handleCloseFilters();
    await consultarUsuarios();
  };

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const visibleRows = usuarios.filter((row) => {
    if (!normalizedSearch) {
      return true;
    }

    return [
      row.nombreCompleto,
      row.usuario,
      row.email,
      row.telefono,
      row.fechaRegistro,
      row.estado ? "activo" : "inactivo",
      row.sesion ? "abierta" : "cerrada",
    ].some((value) => value.toLowerCase().includes(normalizedSearch));
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
    handleApplyFilters,
    handleClearFilters,
  };
}