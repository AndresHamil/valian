import { useEffect, useState } from "react";
import type { ChangeEvent, MouseEvent } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useLocation, useNavigate } from "react-router-dom";
import { getSessionProcessByPath, getSessionToken, getSessionUser } from "../../../../session/auth";
import {
  requestConsultarUsuarios,
  requestConsultarUsuariosFiltrados,
  requestRegistrarUsuario,
  resolveRequestMessage,
} from "./api";
import {
  EMPTY_FILTERS,
  USUARIOS_ROUTE,
  buildCreateUsuarioPayload,
  buildInitialCreateUsuarioForm,
  getSearchableUsuarioValues,
  mapUsuarios,
  validateCreateUsuarioForm,
  type ConsultarUsuariosResponse,
  type CreateUsuarioForm,
  type RegistrarUsuarioResponse,
  type UsuarioFilters,
  type UsuarioRow,
  type ViewMode,
} from "./model";

export function useUsuariosScript() {
  const navigate = useNavigate();
  const location = useLocation();
  const permiso = false;
  const sessionUser = getSessionUser();
  const activeAssignment =
    sessionUser?.asignaciones?.find((assignment) => assignment.principal && assignment.estado) ||
    sessionUser?.asignaciones?.find((assignment) => assignment.estado) ||
    null;
  const currentProcess = getSessionProcessByPath(location.pathname);
  const titulo = currentProcess?.nombre || "Usuarios";
  const descripcion =
    currentProcess?.descripcion ||
    "Gestiona el catalogo de usuarios del sistema y supervisa su informacion general, estatus y actividad de acceso.";
  const isMobileView = useMediaQuery("(max-width:900px)");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [viewMode, setViewMode] = useState<ViewMode>(() => (isMobileView ? "cards" : "table"));
  const [hasManualViewModeSelection, setHasManualViewModeSelection] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<UsuarioFilters>(EMPTY_FILTERS);
  const [usuarios, setUsuarios] = useState<UsuarioRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestError, setRequestError] = useState("");
  const [filtersAnchorEl, setFiltersAnchorEl] = useState<null | HTMLElement>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createDialogSubmitting, setCreateDialogSubmitting] = useState(false);
  const [createDialogError, setCreateDialogError] = useState("");
  const [createForm, setCreateForm] = useState<CreateUsuarioForm>(
    buildInitialCreateUsuarioForm(activeAssignment, sessionUser?.id)
  );

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

  const consultarUsuarios = async (options?: { skipLoadingState?: boolean; isActive?: () => boolean }) => {
    const token = ensureSessionToken({ stopLoadingOnFail: true });

    if (!token) {
      return;
    }

    if (!options?.skipLoadingState) {
      startRequest();
    }

    try {
      const payload = await requestConsultarUsuarios(token);

      if (options?.isActive && !options.isActive()) {
        return;
      }

      applyUsuariosPayload(payload, "No fue posible consultar los usuarios.");
    } catch (error) {
      if (options?.isActive && !options.isActive()) {
        return;
      }

      clearUsuariosWithError(
        resolveRequestMessage<ConsultarUsuariosResponse>(
          error,
          "No fue posible consultar los usuarios.",
          "No fue posible conectar con el servicio de usuarios."
        )
      );
    } finally {
      if (!options?.skipLoadingState && (!options?.isActive || options.isActive())) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    let isActive = true;

    void consultarUsuarios({ isActive: () => isActive });

    return () => {
      isActive = false;
    };
  }, []);

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

  const resetCreateForm = () => {
    setCreateForm(buildInitialCreateUsuarioForm(activeAssignment, sessionUser?.id));
  };

  const handleOpenCreateDialog = () => {
    resetCreateForm();
    setCreateDialogError("");
    setCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    if (createDialogSubmitting) {
      return;
    }

    setCreateDialogOpen(false);
    setCreateDialogError("");
  };

  const handleCreateFormChange = <K extends keyof CreateUsuarioForm>(
    key: K,
    value: CreateUsuarioForm[K]
  ) => {
    setCreateForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleSubmitCreateDialog = async () => {
    const token = ensureSessionToken();

    if (!token) {
      return;
    }

    const validationResult = validateCreateUsuarioForm(createForm);

    if (!validationResult.isValid) {
      setCreateDialogError(validationResult.message || "No fue posible validar el alta del usuario.");
      return;
    }

    const payload = buildCreateUsuarioPayload(createForm);

    setCreateDialogSubmitting(true);
    setCreateDialogError("");

    try {
      const response = await requestRegistrarUsuario(token, payload);

      if (!response.success) {
        setCreateDialogError(response.message || "No fue posible registrar el usuario.");
        return;
      }

      setCreateDialogOpen(false);
      resetCreateForm();
      await consultarUsuarios();
    } catch (error) {
      setCreateDialogError(
        resolveRequestMessage<RegistrarUsuarioResponse>(
          error,
          "No fue posible registrar el usuario.",
          "No fue posible conectar con el servicio de registro de usuarios."
        )
      );
    } finally {
      setCreateDialogSubmitting(false);
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
      const response = await requestConsultarUsuariosFiltrados(token, filters);

      const requestSucceeded = applyUsuariosPayload(
        response,
        "No fue posible filtrar los usuarios."
      );

      if (requestSucceeded) {
        handleCloseFilters();
      }
    } catch (error) {
      clearUsuariosWithError(
        resolveRequestMessage<ConsultarUsuariosResponse>(
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
    titulo,
    descripcion,
    page,
    rowsPerPage,
    viewMode,
    searchTerm,
    filters,
    loading,
    requestError,
    filtersAnchorEl,
    createDialogOpen,
    createDialogSubmitting,
    createDialogError,
    createForm,
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
    handleOpenCreateDialog,
    handleCloseCreateDialog,
    handleCreateFormChange,
    handleSubmitCreateDialog,
    handleApplyFilters,
    handleClearFilters,
  };
}