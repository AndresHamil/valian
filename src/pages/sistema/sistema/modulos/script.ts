import { useEffect, useState } from "react";
import type { ChangeEvent, MouseEvent } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../../../shared/api";
import axios from "axios";
import { getSessionUser } from "../../../../session/auth";

const CONSULTAR_MODULOS_URL = "/api/sistema/sistemas/modulos/consultarModulos";

export type Column = {
  id:
    | "nombre"
    | "descripcion"
    | "tipo"
    | "codigo"
    | "icono"
    | "numeroProcesos"
    | "fechaRegistro"
    | "estado";
  label: string;
  minWidth?: number;
};

export type ModuloRow = {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: string;
  codigo: string;
  icono: string;
  estado: boolean;
  fechaRegistro: string;
  fechaActualizacion: string;
  usuarioRegistro: string;
  numeroProcesos: number;
};

type ConsultarModulosResponse = {
  success: boolean;
  message: string;
  error: string | null;
  data: ModuloRow[];
  totalCount: number;
};

export type ViewMode = "table" | "cards";

export const columns: readonly Column[] = [
  { id: "nombre", label: "Modulo", minWidth: 200 },
  { id: "descripcion", label: "Descripcion", minWidth: 280 },
  { id: "tipo", label: "Tipo", minWidth: 140 },
  { id: "codigo", label: "Codigo", minWidth: 120 },
  { id: "icono", label: "Icon", minWidth: 190 },
  { id: "numeroProcesos", label: "Procesos", minWidth: 120 },
  { id: "fechaRegistro", label: "Registro", minWidth: 180 },
  { id: "estado", label: "Estado", minWidth: 120 },
];

export const BODY_ROW_HEIGHT = 53;
export const ACTIONS_COLUMN_WIDTH = 64;
export const TABLE_MIN_WIDTH = 1430;
export const BODY_CELL_SX = {
  height: BODY_ROW_HEIGHT,
  py: 1,
  boxSizing: "border-box",
} as const;

function getSearchableModuloValues(row: ModuloRow) {
  return [
    row.nombre,
    row.descripcion,
    row.tipo,
    row.codigo,
    row.icono,
    row.fechaRegistro,
    row.fechaActualizacion,
    row.usuarioRegistro,
    String(row.numeroProcesos),
    row.estado ? "activo" : "inactivo",
  ];
}

export function useModulosScript() {
  const navigate = useNavigate();
  const location = useLocation();
  const permiso = false;
  const isMobileView = useMediaQuery("(max-width:900px)");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [viewMode, setViewMode] = useState<ViewMode>(() => (isMobileView ? "cards" : "table"));
  const [hasManualViewModeSelection, setHasManualViewModeSelection] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [modulos, setModulos] = useState<ModuloRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestError, setRequestError] = useState("");
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedModulo, setSelectedModulo] = useState<ModuloRow | null>(null);

  const currentProcessDescription =
    getSessionUser()?.accesos?.sistemas
      ?.flatMap((module) => module.procesos)
      .find((process) => process.path === location.pathname)?.descripcion ||
    "Consulta los modulos del sistema, su descripcion funcional, el tipo asignado y la cantidad de procesos relacionados.";

  useEffect(() => {
    if (permiso) {
      navigate("/login");
    }
  }, [permiso, navigate]);

  useEffect(() => {
    if (hasManualViewModeSelection) {
      return;
    }

    setViewMode(isMobileView ? "cards" : "table");
  }, [hasManualViewModeSelection, isMobileView]);

  const resetPagination = () => {
    setPage(0);
  };

  const consultarModulos = async () => {
    setLoading(true);
    setRequestError("");

    try {
      const response = await api.get<ConsultarModulosResponse>(CONSULTAR_MODULOS_URL);

      if (!response.data.success) {
        setRequestError(response.data.message || "No fue posible consultar los modulos.");
        setModulos([]);
        return;
      }

      setModulos(response.data.data);
    } catch (error) {
      if (axios.isAxiosError<ConsultarModulosResponse>(error) && error.response) {
        setRequestError(error.response.data.message || "No fue posible consultar los modulos.");
      } else {
        setRequestError("No fue posible conectar con el servicio de modulos.");
      }
      setModulos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void consultarModulos();
  }, []);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number(event.target.value));
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

  const handleChangeViewMode = (_event: MouseEvent<HTMLElement>, nextViewMode: ViewMode | null) => {
    if (!nextViewMode) {
      return;
    }

    setHasManualViewModeSelection(true);
    setViewMode(nextViewMode);
  };

  const handleOpenDetailDialog = (row: ModuloRow) => {
    setSelectedModulo(row);
    setDetailDialogOpen(true);
  };

  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false);
    setSelectedModulo(null);
  };

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const visibleRows = modulos.filter((row) => {
    if (!normalizedSearch) {
      return true;
    }

    return getSearchableModuloValues(row).some((value) =>
      value.toLowerCase().includes(normalizedSearch)
    );
  });

  const paginatedRows = visibleRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return {
    permiso,
    page,
    rowsPerPage,
    viewMode,
    searchTerm,
    loading,
    requestError,
    currentProcessDescription,
    detailDialogOpen,
    selectedModulo,
    visibleRows,
    paginatedRows,
    consultarModulos,
    handleChangePage,
    handleChangeRowsPerPage,
    handleSearchChange,
    handleClearSearch,
    handleChangeViewMode,
    handleOpenDetailDialog,
    handleCloseDetailDialog,
  };
}