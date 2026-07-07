import { useEffect, useRef, useState } from "react";
import "./index.scss";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import TableRowsRoundedIcon from "@mui/icons-material/TableRowsRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import ViewModuleRoundedIcon from "@mui/icons-material/ViewModuleRounded";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import Skeleton from "@mui/material/Skeleton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import type { TypographyProps } from "@mui/material/Typography";
import {
  ACTIONS_COLUMN_WIDTH,
  BODY_CELL_SX,
  BODY_ROW_HEIGHT,
  TABLE_MIN_WIDTH,
  type EditUsuarioForm,
  type UsuarioFilters,
  type UsuarioRow,
  type ViewMode,
  columns,
  useUsuariosScript,
} from "./script";

type ViewModeToggleProps = {
  viewMode: ViewMode;
  onChange: (event: React.MouseEvent<HTMLElement>, value: ViewMode | null) => void;
};

type ToolbarProps = {
  loading: boolean;
  searchTerm: string;
  activeFiltersCount: number;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
  onOpenFilters: (event: React.MouseEvent<HTMLElement>) => void;
  onRefresh: () => Promise<void>;
};

type FiltersPopoverProps = {
  loading: boolean;
  anchorEl: HTMLElement | null;
  filters: UsuarioFilters;
  onClose: () => void;
  onFilterChange: (key: keyof UsuarioFilters, value: string | boolean | null) => void;
  onClearFilters: () => Promise<void>;
  onApplyFilters: () => Promise<void>;
};

type TableSectionProps = {
  loading: boolean;
  rowsPerPage: number;
  paginatedRows: UsuarioRow[];
  onOpenEdit: (row: UsuarioRow) => void;
};

type CardsSectionProps = {
  loading: boolean;
  rowsPerPage: number;
  paginatedRows: UsuarioRow[];
  onOpenEdit: (row: UsuarioRow) => void;
};

type OverflowFadeTextProps = TypographyProps & {
  lineClassName?: string;
};

type EditDialogProps = {
  open: boolean;
  loading: boolean;
  submitting: boolean;
  error: string;
  form: EditUsuarioForm | null;
  onClose: () => void;
  onChange: <K extends keyof EditUsuarioForm>(key: K, value: EditUsuarioForm[K]) => void;
  onSubmit: () => Promise<void>;
};

function getUsuarioInitials(nombreCompleto: string) {
  return nombreCompleto
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((segmento) => segmento.charAt(0).toUpperCase())
    .join("");
}

function OverflowFadeText({ children, className, lineClassName, ...props }: OverflowFadeTextProps) {
  const contentRef = useRef<HTMLSpanElement | null>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const node = contentRef.current;

    if (!node) {
      return;
    }

    const checkOverflow = () => {
      setIsOverflowing(node.scrollWidth > node.clientWidth + 1);
    };

    checkOverflow();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", checkOverflow);

      return () => window.removeEventListener("resize", checkOverflow);
    }

    const observer = new ResizeObserver(checkOverflow);
    observer.observe(node);

    return () => observer.disconnect();
  }, [children]);

  return (
    <Typography
      {...props}
      className={["records-view__item-text", className].filter(Boolean).join(" ")}
    >
      <span
        ref={contentRef}
        className={[
          "records-view__item-line",
          lineClassName,
          isOverflowing ? "records-view__item-line--overflowing" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </span>
    </Typography>
  );
}

function UsuariosHeader({ viewMode, onChange }: ViewModeToggleProps) {
  return (
    <Box>
      <Box className="records-view__header">
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Usuarios
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gestiona el catalogo de usuarios del sistema y supervisa su informacion general, estatus y actividad de acceso.
          </Typography>
        </Box>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={onChange}
          size="small"
          aria-label="modo de visualizacion"
          className="records-view__toggle"
        >
          <ToggleButton value="table" aria-label="ver como tabla" color="primary">
            <TableRowsRoundedIcon fontSize="small" />
          </ToggleButton>
          <ToggleButton value="cards" aria-label="ver como cards" color="primary">
            <ViewModuleRoundedIcon fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Box>
  );
}

function UsuariosErrorBanner({ message }: { message: string }) {
  if (!message) {
    return null;
  }

  return (
    <Paper sx={{ p: 2, color: "error.main", borderRadius: 2 }}>
      <Typography variant="body2">{message}</Typography>
    </Paper>
  );
}

function UsuariosToolbar({
  loading,
  searchTerm,
  activeFiltersCount,
  onSearchChange,
  onClearSearch,
  onOpenFilters,
  onRefresh,
}: ToolbarProps) {
  return (
    <Box className="records-view__toolbar">
      <TextField
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="Buscar en los usuarios cargados"
        size="small"
        disabled={loading}
        sx={{ flex: "1 1 320px", minWidth: 260 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchRoundedIcon fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: searchTerm ? (
            <InputAdornment position="end">
              <Tooltip title="Limpiar busqueda">
                <IconButton
                  aria-label="limpiar busqueda"
                  edge="end"
                  size="small"
                  onClick={onClearSearch}
                >
                  <CloseRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ) : null,
        }}
      />
      <Badge color="primary" badgeContent={activeFiltersCount} invisible={activeFiltersCount === 0}>
        <Tooltip title="Filtros avanzados">
          <span>
            <IconButton
              aria-label="abrir filtros avanzados"
              onClick={onOpenFilters}
              disabled={loading}
              color="primary"
              className="records-view__icon-button"
            >
              <TuneRoundedIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Badge>
      <Tooltip title={loading ? "Actualizando usuarios" : "Actualizar usuarios"}>
        <span>
          <IconButton
            aria-label="actualizar usuarios"
            onClick={onRefresh}
            disabled={loading}
            color="primary"
            className={`records-view__refresh-button${loading ? " records-view__refresh-button--loading" : ""}`}
          >
            <RefreshRoundedIcon className="records-view__refresh-icon" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Nuevo usuario">
        <span>
          <IconButton
            aria-label="crear nuevo usuario"
            color="primary"
            className="records-view__icon-button"
          >
            <PersonAddAlt1RoundedIcon />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
}

function UsuariosFiltersPopover({
  loading,
  anchorEl,
  filters,
  onClose,
  onFilterChange,
  onClearFilters,
  onApplyFilters,
}: FiltersPopoverProps) {
  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      PaperProps={{ sx: { p: 2, width: { xs: 320, sm: 400 }, maxWidth: "calc(100vw - 32px)" } }}
    >
      <Box sx={{ display: "grid", gap: 1.5, width: { xs: 280, sm: 380 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FilterListRoundedIcon fontSize="small" />
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Filtros avanzados
          </Typography>
        </Box>
        <TextField
          value={filters.nombre ?? ""}
          onChange={(event) => onFilterChange("nombre", event.target.value)}
          label="Nombre"
          size="small"
          disabled={loading}
        />
        <TextField
          value={filters.usuario ?? ""}
          onChange={(event) => onFilterChange("usuario", event.target.value)}
          label="Usuario"
          size="small"
          disabled={loading}
        />
        <TextField
          value={filters.email ?? ""}
          onChange={(event) => onFilterChange("email", event.target.value)}
          label="Correo"
          size="small"
          disabled={loading}
        />
        <TextField
          value={filters.telefono ?? ""}
          onChange={(event) => onFilterChange("telefono", event.target.value)}
          label="Telefono"
          size="small"
          disabled={loading}
        />
        <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: "1fr 1fr" }}>
          <TextField
            select
            value={filters.estado === null ? "" : filters.estado ? "true" : "false"}
            onChange={(event) =>
              onFilterChange(
                "estado",
                event.target.value === "" ? null : event.target.value === "true"
              )
            }
            label="Estado"
            size="small"
            disabled={loading}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="true">Activo</MenuItem>
            <MenuItem value="false">Inactivo</MenuItem>
          </TextField>
          <TextField
            select
            value={filters.sesion === null ? "" : filters.sesion ? "true" : "false"}
            onChange={(event) =>
              onFilterChange(
                "sesion",
                event.target.value === "" ? null : event.target.value === "true"
              )
            }
            label="Sesion"
            size="small"
            disabled={loading}
          >
            <MenuItem value="">Todas</MenuItem>
            <MenuItem value="true">Abierta</MenuItem>
            <MenuItem value="false">Cerrada</MenuItem>
          </TextField>
        </Box>
        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end", pt: 0.5 }}>
          <Button variant="text" onClick={onClearFilters} disabled={loading}>
            Limpiar
          </Button>
          <Button variant="contained" onClick={onApplyFilters} disabled={loading}>
            Aplicar
          </Button>
        </Box>
      </Box>
    </Popover>
  );
}

function UsuariosTableSection({ loading, rowsPerPage, paginatedRows, onOpenEdit }: TableSectionProps) {
  return (
    <TableContainer component={Paper} className="records-view__table">
      <Table
        stickyHeader
        aria-label="tabla de usuarios"
        sx={{
          minWidth: TABLE_MIN_WIDTH,
          tableLayout: { xs: "auto", md: "fixed" },
        }}
      >
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.id} style={{ minWidth: column.minWidth }}>
                {column.label}
              </TableCell>
            ))}
            <TableCell align="right" style={{ minWidth: ACTIONS_COLUMN_WIDTH }} />
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? <UsuariosTableSkeleton rowsPerPage={rowsPerPage} /> : null}
          {!loading
            ? paginatedRows.map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id} sx={{ height: BODY_ROW_HEIGHT }}>
                  {columns.map((column) => {
                    if (column.id === "estado") {
                      return (
                        <TableCell key={column.id} sx={BODY_CELL_SX}>
                          <Chip
                            label={row.estado ? "Activo" : "Inactivo"}
                            size="small"
                            color={row.estado ? "success" : "default"}
                            variant={row.estado ? "filled" : "outlined"}
                          />
                        </TableCell>
                      );
                    }

                    if (column.id === "sesion") {
                      return (
                        <TableCell key={column.id} sx={BODY_CELL_SX}>
                          <Chip
                            label={row.sesion ? "Abierta" : "Cerrada"}
                            size="small"
                            color={row.sesion ? "info" : "default"}
                            variant={row.sesion ? "filled" : "outlined"}
                          />
                        </TableCell>
                      );
                    }

                    return (
                      <TableCell key={column.id} sx={BODY_CELL_SX}>
                        {row[column.id]}
                      </TableCell>
                    );
                  })}
                  <TableCell align="right" sx={BODY_CELL_SX}>
                    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
                      <Tooltip title={`Visualizar ${row.nombreCompleto}`}>
                        <IconButton
                          aria-label={`visualizar ${row.nombreCompleto}`}
                          size="small"
                          sx={{ color: "text.secondary" }}
                          onClick={() => onOpenEdit(row)}
                        >
                          <VisibilityRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            : null}
          {!loading && paginatedRows.length === 0 ? <UsuariosEmptyState /> : null}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function UsuariosTableSkeleton({ rowsPerPage }: { rowsPerPage: number }) {
  return Array.from({ length: rowsPerPage }).map((_, index) => (
    <TableRow key={`usuarios-skeleton-${index}`} sx={{ height: BODY_ROW_HEIGHT }}>
      {columns.map((column) => (
        <TableCell key={`${column.id}-${index}`} sx={BODY_CELL_SX}>
          {column.id === "estado" || column.id === "sesion" ? (
            <Skeleton
              variant="rounded"
              animation="wave"
              width={82}
              height={20}
              sx={{ borderRadius: 999 }}
            />
          ) : (
            <Skeleton
              variant="text"
              animation="wave"
              width={column.id === "nombreCompleto" ? "88%" : column.id === "email" ? "92%" : "72%"}
              height={24}
            />
          )}
        </TableCell>
      ))}
      <TableCell align="right" sx={{ ...BODY_CELL_SX, width: ACTIONS_COLUMN_WIDTH }}>
        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}>
          <Skeleton variant="circular" animation="wave" width={28} height={28} />
        </Box>
      </TableCell>
    </TableRow>
  ));
}

function UsuariosCardsSection({ loading, rowsPerPage, paginatedRows, onOpenEdit }: CardsSectionProps) {
  return (
    <Box className="records-view__grid">
      {loading ? <UsuariosCardsSkeleton rowsPerPage={rowsPerPage} /> : null}
      {!loading ? paginatedRows.map((row) => <UsuarioCard key={row.id} row={row} onOpenEdit={onOpenEdit} />) : null}
      {!loading && paginatedRows.length === 0 ? <UsuariosCardsEmptyState /> : null}
    </Box>
  );
}

function UsuariosCardsSkeleton({ rowsPerPage }: { rowsPerPage: number }) {
  return Array.from({ length: rowsPerPage }).map((_, index) => (
    <Paper
      key={`usuarios-card-skeleton-${index}`}
      className="records-view__item records-view__item--skeleton"
    >
      <Box className="records-view__item-header">
        <Skeleton variant="circular" animation="wave" width={56} height={56} />
        <Box className="records-view__item-summary">
          <Box className="records-view__item-identity records-view__item-identity--skeleton">
            <Skeleton variant="text" animation="wave" width="68%" height={28} />
            <Skeleton variant="text" animation="wave" width="36%" height={20} />
            <Skeleton variant="text" animation="wave" width="78%" height={20} />
          </Box>
        </Box>
      </Box>
      <Box className="records-view__item-status">
        <Skeleton variant="rounded" animation="wave" width={80} height={24} sx={{ borderRadius: 999 }} />
        <Skeleton variant="rounded" animation="wave" width={84} height={24} sx={{ borderRadius: 999 }} />
      </Box>
      <Box className="records-view__item-details">
        <Box className="records-view__item-detail records-view__item-detail--skeleton">
          <Skeleton variant="text" animation="wave" width="30%" height={18} />
          <Skeleton variant="text" animation="wave" width="74%" height={24} />
        </Box>
        <Box className="records-view__item-detail records-view__item-detail--skeleton">
          <Skeleton variant="text" animation="wave" width="34%" height={18} />
          <Skeleton variant="text" animation="wave" width="66%" height={24} />
        </Box>
        <Box className="records-view__item-detail records-view__item-detail--skeleton">
          <Skeleton variant="text" animation="wave" width="28%" height={18} />
          <Skeleton variant="text" animation="wave" width="58%" height={24} />
        </Box>
      </Box>
    </Paper>
  ));
}

function UsuarioCard({ row, onOpenEdit }: { row: UsuarioRow; onOpenEdit: (row: UsuarioRow) => void }) {
  const initials = getUsuarioInitials(row.nombreCompleto);

  return (
    <Paper
      className="records-view__item records-view__item--interactive"
      role="button"
      tabIndex={0}
      onClick={() => onOpenEdit(row)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpenEdit(row);
        }
      }}
    >
      <Box className="records-view__item-header">
        <Box
          className={`records-view__item-avatar-wrap${row.estado ? " records-view__item-avatar-wrap--active" : " records-view__item-avatar-wrap--inactive"}`}
        >
          <Avatar className="records-view__item-avatar">{initials}</Avatar>
        </Box>
        <Box className="records-view__item-summary">
          <Box className="records-view__item-identity">
            <OverflowFadeText
              variant="h6"
              lineClassName="records-view__item-line--title"
              sx={{
                fontSize: "1rem",
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              {row.nombreCompleto}
            </OverflowFadeText>
            <OverflowFadeText
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: "0.88rem" }}
            >
              @{row.usuario}
            </OverflowFadeText>
            <OverflowFadeText
              variant="body2"
              color="text.secondary"
              lineClassName="records-view__item-subtitle"
            >
              {row.email}
            </OverflowFadeText>
          </Box>
        </Box>
      </Box>

      <Box className="records-view__item-status">
        <Chip
          label={row.estado ? "Activo" : "Inactivo"}
          size="small"
          color={row.estado ? "success" : "default"}
          variant={row.estado ? "filled" : "outlined"}
        />
        <Chip
          label={row.sesion ? "Abierta" : "Cerrada"}
          size="small"
          color={row.sesion ? "info" : "default"}
          variant={row.sesion ? "filled" : "outlined"}
        />
      </Box>

      <Box className="records-view__item-details">
        <Box className="records-view__item-detail">
          <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.3 }}>
            Usuario
          </Typography>
          <OverflowFadeText variant="body2" lineClassName="records-view__item-line--value" sx={{ fontWeight: 600 }}>
            @{row.usuario}
          </OverflowFadeText>
        </Box>
        <Box className="records-view__item-detail">
          <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.3 }}>
            Telefono
          </Typography>
          <OverflowFadeText variant="body2" lineClassName="records-view__item-line--value" sx={{ fontWeight: 600 }}>
            {row.telefono}
          </OverflowFadeText>
        </Box>
        <Box className="records-view__item-detail">
          <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.3 }}>
            Registro
          </Typography>
          <OverflowFadeText variant="body2" lineClassName="records-view__item-line--value" sx={{ fontWeight: 600 }}>
            {row.fechaRegistro}
          </OverflowFadeText>
        </Box>
      </Box>
    </Paper>
  );
}

function UsuarioProfileView({ form }: { form: EditUsuarioForm }) {
  const perfilNombre = [form.nombre, form.apellido].filter(Boolean).join(" ") || "Usuario";

  return (
    <Box className="records-view__profile">
      <Box className="records-view__profile-hero records-view__item">
        <Box className="records-view__item-header records-view__profile-header">
          <Box
            className={`records-view__item-avatar-wrap${form.estado ? " records-view__item-avatar-wrap--active" : " records-view__item-avatar-wrap--inactive"}`}
          >
            <Avatar className="records-view__item-avatar records-view__profile-avatar">
              {getUsuarioInitials(perfilNombre)}
            </Avatar>
          </Box>
          <Box className="records-view__item-summary records-view__profile-summary">
            <Box className="records-view__item-identity records-view__profile-identity">
              <Typography className="records-view__profile-title" variant="h3">
                {perfilNombre}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                @{form.usuario}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {form.email || "Sin correo registrado"}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box className="records-view__item-status records-view__profile-status">
          <Chip
            label={form.estado ? "Activo" : "Inactivo"}
            size="small"
            color={form.estado ? "success" : "default"}
            variant={form.estado ? "filled" : "outlined"}
          />
          <Chip
            label={form.sesion ? "Sesion abierta" : "Sesion cerrada"}
            size="small"
            color={form.sesion ? "info" : "default"}
            variant={form.sesion ? "filled" : "outlined"}
          />
        </Box>
      </Box>

      <Box className="records-view__profile-grid">
        <Box className="records-view__profile-panel records-view__item-detail">
          <Typography variant="overline" className="records-view__profile-label">
            Identidad
          </Typography>
          <Box className="records-view__profile-values">
            <Box>
              <Typography variant="caption" color="text.secondary">ID</Typography>
              <Typography variant="body1">{form.id}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Usuario</Typography>
              <Typography variant="body1">@{form.usuario}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Apellido</Typography>
              <Typography variant="body1">{form.apellido || "Sin apellido"}</Typography>
            </Box>
          </Box>
        </Box>

        <Box className="records-view__profile-panel records-view__item-detail">
          <Typography variant="overline" className="records-view__profile-label">
            Contacto
          </Typography>
          <Box className="records-view__profile-values">
            <Box>
              <Typography variant="caption" color="text.secondary">Correo</Typography>
              <Typography variant="body1">{form.email || "Sin correo"}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Telefono</Typography>
              <Typography variant="body1">{form.telefono || "Sin telefono"}</Typography>
            </Box>
          </Box>
        </Box>

        <Box className="records-view__profile-panel records-view__item-detail">
          <Typography variant="overline" className="records-view__profile-label">
            Trazabilidad
          </Typography>
          <Box className="records-view__profile-values">
            <Box>
              <Typography variant="caption" color="text.secondary">Fecha de registro</Typography>
              <Typography variant="body1">{form.fechaRegistro}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Ultima actualizacion</Typography>
              <Typography variant="body1">{form.fechaActualizacion}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function UsuarioEditDialog({ open, loading, submitting, error, form, onClose, onChange, onSubmit }: EditDialogProps) {
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!open) {
      setIsEditing(false);
      return;
    }

    if (!loading && form) {
      setIsEditing(false);
    }
  }, [form, loading, open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={false}
      PaperProps={{
        sx: {
          width: { xs: "calc(100vw - 32px)", md: "calc(100vw - 48px)" },
          maxWidth: "none",
          height: { xs: "calc(100vh - 88px)", md: "calc(100vh - 112px)" },
          maxHeight: "none",
          mt: { xs: "72px", md: "88px" },
          mb: { xs: 2, md: 3 },
          mx: { xs: 2, md: 3 },
          borderRadius: { xs: 1.5, md: 2 },
          border: "1px solid",
          borderColor: "divider",
          boxShadow: 24,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          px: { xs: 2.5, md: 3 },
          py: { xs: 2, md: 2.5 },
          borderBottom: "1px solid",
          borderColor: "divider",
          background: `linear-gradient(
            135deg,
            color-mix(in srgb, var(--mui-palette-background-paper, #fff) 90%, var(--mui-palette-primary-main, #1976d2) 10%) 0%,
            color-mix(in srgb, var(--mui-palette-background-paper, #fff) 96%, var(--mui-palette-secondary-main, #0f766e) 4%) 100%
          )`,
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {isEditing ? "Editar usuario" : "Perfil de usuario"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isEditing ? "Actualiza los campos necesarios." : "Consulta la informacion completa antes de editar."}
          </Typography>
        </Box>
        {!loading && form ? (
          <Tooltip title={isEditing ? "Cancelar edicion" : "Editar usuario"}>
            <span>
              <IconButton
                color="primary"
                onClick={() => setIsEditing((current) => !current)}
                disabled={submitting}
                sx={{
                  backgroundColor: "color-mix(in srgb, var(--mui-palette-primary-main, #1976d2) 10%, transparent)",
                  border: "1px solid",
                  borderColor: "color-mix(in srgb, var(--mui-palette-primary-main, #1976d2) 18%, transparent)",
                  '&:hover': {
                    backgroundColor: "color-mix(in srgb, var(--mui-palette-primary-main, #1976d2) 16%, transparent)",
                  },
                }}
              >
                <EditRoundedIcon />
              </IconButton>
            </span>
          </Tooltip>
        ) : null}
      </DialogTitle>
      <DialogContent dividers sx={{ flex: 1 }}>
        <Box sx={{ display: "grid", gap: 2, pt: 0.5, height: "100%" }}>
          {error ? (
            <Typography variant="body2" color="error.main">
              {error}
            </Typography>
          ) : null}
          {loading ? (
            <Box sx={{ display: "grid", gap: 2 }}>
              <Skeleton variant="rounded" height={120} />
              <Skeleton variant="rounded" height={180} />
              <Skeleton variant="rounded" height={180} />
            </Box>
          ) : null}
          {!loading && form && !isEditing ? (
            <UsuarioProfileView form={form} />
          ) : null}
          {!loading && form && isEditing ? (
            <Box sx={{ display: "grid", gap: 2 }}>
              <TextField label="ID" value={form.id} size="small" disabled />
              <TextField label="Usuario" value={form.usuario} size="small" disabled />
              <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
                <TextField
                  label="Nombre"
                  value={form.nombre}
                  onChange={(event) => onChange("nombre", event.target.value)}
                  size="small"
                  disabled={submitting}
                  required
                />
                <TextField
                  label="Apellido"
                  value={form.apellido ?? ""}
                  onChange={(event) => onChange("apellido", event.target.value)}
                  size="small"
                  disabled={submitting}
                />
              </Box>
              <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
                <TextField
                  label="Correo"
                  value={form.email ?? ""}
                  onChange={(event) => onChange("email", event.target.value)}
                  size="small"
                  disabled={submitting}
                />
                <TextField
                  label="Telefono"
                  value={form.telefono ?? ""}
                  onChange={(event) => onChange("telefono", event.target.value)}
                  size="small"
                  disabled={submitting}
                />
              </Box>
              <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
                <TextField
                  label="Password actual"
                  type="password"
                  value={form.passwordactual ?? ""}
                  onChange={(event) => onChange("passwordactual", event.target.value)}
                  size="small"
                  disabled={submitting}
                />
                <TextField
                  label="Password nueva"
                  type="password"
                  value={form.passworNueva ?? ""}
                  onChange={(event) => onChange("passworNueva", event.target.value)}
                  size="small"
                  disabled={submitting}
                />
              </Box>
              <TextField
                select
                label="Estado"
                value={form.estado === null ? "" : form.estado ? "true" : "false"}
                onChange={(event) => onChange("estado", event.target.value === "" ? null : event.target.value === "true")}
                size="small"
                disabled={submitting}
              >
                <MenuItem value="">Sin definir</MenuItem>
                <MenuItem value="true">Activo</MenuItem>
                <MenuItem value="false">Inactivo</MenuItem>
              </TextField>
            </Box>
          ) : null}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting || loading}>
          Cancelar
        </Button>
        {isEditing ? (
          <Button variant="contained" onClick={onSubmit} disabled={submitting || loading || !form}>
            {submitting ? "Guardando..." : "Guardar cambios"}
          </Button>
        ) : null}
      </DialogActions>
    </Dialog>
  );
}

function UsuariosEmptyState() {
  return (
    <TableRow>
      <TableCell colSpan={columns.length + 1} align="center" sx={{ py: 5, color: "text.secondary" }}>
        No se encontraron usuarios con ese filtro.
      </TableCell>
    </TableRow>
  );
}

function UsuariosCardsEmptyState() {
  return (
    <Paper
      sx={{
        gridColumn: "1 / -1",
        py: 5,
        px: 3,
        textAlign: "center",
        color: "text.secondary",
        borderRadius: 3,
      }}
    >
      No se encontraron usuarios con ese filtro.
    </Paper>
  );
}

export default function Usuarios() {
  const {
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
  } = useUsuariosScript();

  if (!permiso) {
    return (
      <Box className="records-view">
        <UsuariosHeader viewMode={viewMode} onChange={handleChangeViewMode} />
        <UsuariosErrorBanner message={requestError} />
        <UsuariosToolbar
          loading={loading}
          searchTerm={searchTerm}
          activeFiltersCount={activeFiltersCount}
          onSearchChange={handleSearchChange}
          onClearSearch={handleClearSearch}
          onOpenFilters={handleOpenFilters}
          onRefresh={consultarUsuarios}
        />
        <UsuariosFiltersPopover
          loading={loading}
          anchorEl={filtersAnchorEl}
          filters={filters}
          onClose={handleCloseFilters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          onApplyFilters={handleApplyFilters}
        />

        <Box key={viewMode} className={`records-view__surface records-view__surface--${viewMode}`}>
          {viewMode === "table" ? (
            <UsuariosTableSection
              loading={loading}
              rowsPerPage={rowsPerPage}
              paginatedRows={paginatedRows}
              onOpenEdit={handleOpenEditDialog}
            />
          ) : (
            <UsuariosCardsSection
              loading={loading}
              rowsPerPage={rowsPerPage}
              paginatedRows={paginatedRows}
              onOpenEdit={handleOpenEditDialog}
            />
          )}
        </Box>

        <UsuarioEditDialog
          open={editDialogOpen}
          loading={editDialogLoading}
          submitting={editDialogSubmitting}
          error={editDialogError}
          form={editForm}
          onClose={handleCloseEditDialog}
          onChange={handleEditFormChange}
          onSubmit={handleSubmitEditDialog}
        />

        <Paper className="records-view__pagination">
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={visibleRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Filas por pagina"
            disabled={loading}
          />
        </Paper>
      </Box>
    );
  }

  return null;
}

