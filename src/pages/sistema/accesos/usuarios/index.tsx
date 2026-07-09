import { forwardRef, useEffect, useRef, useState } from "react";
import "./index.scss";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import AlternateEmailRoundedIcon from "@mui/icons-material/AlternateEmailRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import CakeRoundedIcon from "@mui/icons-material/CakeRounded";
import FingerprintRoundedIcon from "@mui/icons-material/FingerprintRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import TableRowsRoundedIcon from "@mui/icons-material/TableRowsRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import ViewModuleRoundedIcon from "@mui/icons-material/ViewModuleRounded";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
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
import SpotlightDialog from "../../../../components/SpotlightDialog";
import {
  SpotlightCreateIcon,
  SpotlightEditIcon,
  SpotlightViewIcon,
} from "../../../../components/SpotlightDialog/icons";
import {
  ACTIONS_COLUMN_WIDTH,
  BODY_CELL_SX,
  BODY_ROW_HEIGHT,
  TABLE_MIN_WIDTH,
  type CreateUsuarioForm,
  type EditUsuarioForm,
  type UsuarioFilters,
  type UsuarioRow,
  type ViewMode,
  columns,
  useUsuariosScript,
} from "./script";

type ViewModeToggleProps = {
  title: string;
  description: string;
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
  onOpenCreate: () => void;
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

type CreateDialogProps = {
  open: boolean;
  submitting: boolean;
  error: string;
  form: CreateUsuarioForm;
  onClose: () => void;
  onChange: <K extends keyof CreateUsuarioForm>(key: K, value: CreateUsuarioForm[K]) => void;
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

function UsuariosHeader({ title, description, viewMode, onChange }: ViewModeToggleProps) {
  return (
    <Box>
      <Box className="records-view__header">
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {description}
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
  onOpenCreate,
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
            onClick={onOpenCreate}
          >
            <PersonAddAlt1RoundedIcon />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
}

function UsuarioCreateDialog({ open, submitting, error, form, onClose, onChange, onSubmit }: CreateDialogProps) {
  return (
    <SpotlightDialog
      open={open}
      onClose={onClose}
      title="Registrar usuario"
      eyebrow="Nuevo acceso"
      description="Captura los datos personales, credenciales iniciales y la asignacion principal para dar de alta al usuario sin salir de esta vista."
      icon={<SpotlightCreateIcon />}
      actions={
        <>
          <Button onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={onSubmit}
            disabled={submitting}
            startIcon={<PersonAddAlt1RoundedIcon />}
            sx={{
              minWidth: 190,
              borderRadius: 1.75,
              px: 2.75,
              py: 1.15,
              fontWeight: 700,
              boxShadow: "0 14px 28px rgba(25, 118, 210, 0.28)",
            }}
          >
            {submitting ? "Registrando..." : "Registrar usuario"}
          </Button>
        </>
      }
    >
        <Box sx={{ display: "grid", gap: 2.5, pt: 0.5 }}>
          {error ? (
            <Box
              sx={{
                px: 2,
                py: 1.5,
                borderRadius: 1.5,
                border: "1px solid",
                borderColor: "error.light",
                backgroundColor: "color-mix(in srgb, var(--mui-palette-error-main, #d32f2f) 10%, var(--mui-palette-background-paper, #fff))",
              }}
            >
              <Typography variant="body2" color="error.main" sx={{ fontWeight: 600 }}>
                {error}
              </Typography>
            </Box>
          ) : null}

          <Box
            sx={{
              display: "grid",
              gap: 2,
              p: { xs: 2, md: 2.5 },
              borderRadius: 1.5,
              border: "1px solid",
              borderColor: "divider",
              backgroundColor:
                "color-mix(in srgb, var(--mui-palette-background-paper, #fff) 94%, transparent)",
              background: `linear-gradient(
                180deg,
                color-mix(in srgb, var(--mui-palette-background-paper, #fff) 96%, var(--mui-palette-primary-main, #1976d2) 4%) 0%,
                color-mix(in srgb, var(--mui-palette-background-paper, #fff) 91%, transparent) 100%
              )`,
              boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
            }}
          >
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                Datos personales
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Informacion visible y de contacto del usuario.
              </Typography>
            </Box>
            <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
              <TextField
                label="Nombre"
                value={form.nombre}
                onChange={(event) => onChange("nombre", event.target.value)}
                size="small"
                disabled={submitting}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeRoundedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Apellido"
                value={form.apellido}
                onChange={(event) => onChange("apellido", event.target.value)}
                size="small"
                disabled={submitting}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeRoundedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
              <TextField
                label="Fecha de nacimiento"
                type="date"
                value={form.fechaNacimiento}
                onChange={(event) => onChange("fechaNacimiento", event.target.value)}
                size="small"
                disabled={submitting}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CakeRoundedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Telefono"
                value={form.telefono}
                onChange={(event) => onChange("telefono", event.target.value)}
                size="small"
                disabled={submitting}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneRoundedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <TextField
              label="Correo"
              type="email"
              value={form.email}
              onChange={(event) => onChange("email", event.target.value)}
              size="small"
              disabled={submitting}
              required
              helperText="Se usara para identificar al usuario y validar duplicados."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AlternateEmailRoundedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box
            sx={{
              display: "grid",
              gap: 2,
              p: { xs: 2, md: 2.5 },
              borderRadius: 1.5,
              border: "1px solid",
              borderColor: "divider",
              backgroundColor:
                "color-mix(in srgb, var(--mui-palette-background-paper, #fff) 94%, transparent)",
              background: `linear-gradient(
                180deg,
                color-mix(in srgb, var(--mui-palette-background-paper, #fff) 96%, var(--mui-palette-secondary-main, #0f766e) 4%) 0%,
                color-mix(in srgb, var(--mui-palette-background-paper, #fff) 91%, transparent) 100%
              )`,
              boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
            }}
          >
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                Credenciales iniciales
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Define la clave temporal con la que nacera el acceso del usuario.
              </Typography>
            </Box>
            <TextField
              label="Password"
              type="password"
              value={form.password}
              onChange={(event) => onChange("password", event.target.value)}
              size="small"
              disabled={submitting}
              required
              helperText="Usa una clave segura. El backend se encargara del registro final."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockRoundedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box
            sx={{
              display: "grid",
              gap: 2,
              p: { xs: 2, md: 2.5 },
              borderRadius: 1.5,
              border: "1px solid",
              borderColor: "divider",
              backgroundColor:
                "color-mix(in srgb, var(--mui-palette-background-paper, #fff) 94%, transparent)",
              background: `linear-gradient(
                180deg,
                color-mix(in srgb, var(--mui-palette-background-paper, #fff) 96%, var(--mui-palette-primary-main, #1976d2) 3%) 0%,
                color-mix(in srgb, var(--mui-palette-background-paper, #fff) 91%, transparent) 100%
              )`,
              boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
            }}
          >
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                Asignacion principal
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Relaciona el nuevo usuario con su empresa, sucursal, departamento y perfil inicial.
              </Typography>
            </Box>
            <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
              <TextField
                label="Empresa ID"
                value={form.empresaId}
                onChange={(event) => onChange("empresaId", event.target.value)}
                size="small"
                disabled={submitting}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BusinessRoundedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Sucursal ID"
                value={form.sucursalId}
                onChange={(event) => onChange("sucursalId", event.target.value)}
                size="small"
                disabled={submitting}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BusinessRoundedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
              <TextField
                label="Departamento ID"
                value={form.departamentoId}
                onChange={(event) => onChange("departamentoId", event.target.value)}
                size="small"
                disabled={submitting}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BusinessRoundedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Perfil ID"
                value={form.perfilId}
                onChange={(event) => onChange("perfilId", event.target.value)}
                size="small"
                disabled={submitting}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FingerprintRoundedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <TextField
              label="Usuario registro ID"
              value={form.usuarioRegistroId}
              onChange={(event) => onChange("usuarioRegistroId", event.target.value)}
              size="small"
              disabled={submitting}
              required
              helperText="Se envia como referencia del usuario que realiza el alta."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FingerprintRoundedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>
    </SpotlightDialog>
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
    <SpotlightDialog
      open={open}
      onClose={onClose}
      title={isEditing ? "Editar usuario" : "Perfil de usuario"}
      eyebrow={isEditing ? "Edicion controlada" : "Consulta detallada"}
      description={
        isEditing
          ? "Actualiza los datos personales, de contacto y estado del usuario dentro de una experiencia consistente con el resto del modulo."
          : "Consulta la informacion completa antes de editar y cambia al modo de captura solo cuando necesites aplicar ajustes."
      }
      icon={isEditing ? <SpotlightEditIcon /> : <SpotlightViewIcon />}
      fullWidth
      maxWidth={false}
      paperSx={{
        width: { xs: "calc(100vw - 32px)", md: "calc(100vw - 48px)" },
        maxWidth: "none",
        height: { xs: "calc(100vh - 88px)", md: "calc(100vh - 112px)" },
        maxHeight: "none",
        mt: { xs: "72px", md: "88px" },
        mb: { xs: 2, md: 3 },
        mx: { xs: 2, md: 3 },
        display: "flex",
        flexDirection: "column",
      }}
      contentSx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
      actions={
        <>
          <Button onClick={onClose} disabled={submitting || loading}>
            Cancelar
          </Button>
          {!loading && form ? (
            <Button
              variant={isEditing ? "outlined" : "text"}
              color="primary"
              onClick={() => setIsEditing((current) => !current)}
              disabled={submitting}
              startIcon={isEditing ? <VisibilityRoundedIcon /> : <EditRoundedIcon />}
            >
              {isEditing ? "Ver perfil" : "Editar usuario"}
            </Button>
          ) : null}
          {isEditing ? (
            <Button
              variant="contained"
              onClick={onSubmit}
              disabled={submitting || loading || !form}
              startIcon={<EditRoundedIcon />}
              sx={{
                minWidth: 190,
                borderRadius: 1.75,
                px: 2.75,
                py: 1.15,
                fontWeight: 700,
                boxShadow: "0 14px 28px rgba(25, 118, 210, 0.28)",
              }}
            >
              {submitting ? "Guardando..." : "Guardar cambios"}
            </Button>
          ) : null}
        </>
      }
    >
      <Box sx={{ display: "grid", gap: 2.5, pt: 0.5, height: "100%" }}>
        {error ? (
          <Box
            sx={{
              px: 2,
              py: 1.5,
              borderRadius: 1.5,
              border: "1px solid",
              borderColor: "error.light",
              backgroundColor:
                "color-mix(in srgb, var(--mui-palette-error-main, #d32f2f) 10%, var(--mui-palette-background-paper, #fff))",
            }}
          >
            <Typography variant="body2" color="error.main" sx={{ fontWeight: 600 }}>
              {error}
            </Typography>
          </Box>
        ) : null}
        {loading ? (
          <Box sx={{ display: "grid", gap: 2 }}>
            <Skeleton variant="rounded" height={120} />
            <Skeleton variant="rounded" height={180} />
            <Skeleton variant="rounded" height={180} />
          </Box>
        ) : null}
        {!loading && form && !isEditing ? (
          <Box
            sx={{
              display: "grid",
              gap: 2,
              minHeight: 0,
              p: { xs: 2, md: 2.5 },
              borderRadius: 1.5,
              border: "1px solid",
              borderColor: "divider",
              background: `linear-gradient(
                180deg,
                color-mix(in srgb, var(--mui-palette-background-paper, #fff) 96%, var(--mui-palette-primary-main, #1976d2) 4%) 0%,
                color-mix(in srgb, var(--mui-palette-background-paper, #fff) 91%, transparent) 100%
              )`,
              boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
            }}
          >
            <UsuarioProfileView form={form} />
          </Box>
        ) : null}
        {!loading && form && isEditing ? (
          <Box sx={{ display: "grid", gap: 2.5 }}>
            <Box
              sx={{
                display: "grid",
                gap: 2,
                p: { xs: 2, md: 2.5 },
                borderRadius: 1.5,
                border: "1px solid",
                borderColor: "divider",
                background: `linear-gradient(
                  180deg,
                  color-mix(in srgb, var(--mui-palette-background-paper, #fff) 96%, var(--mui-palette-primary-main, #1976d2) 4%) 0%,
                  color-mix(in srgb, var(--mui-palette-background-paper, #fff) 91%, transparent) 100%
                )`,
                boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
              }}
            >
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                  Identidad base
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Campos de identificacion y nombre principal del acceso.
                </Typography>
              </Box>
              <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
                <TextField
                  label="ID"
                  value={form.id}
                  size="small"
                  disabled
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FingerprintRoundedIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Usuario"
                  value={form.usuario}
                  size="small"
                  disabled
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeRoundedIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
                <TextField
                  label="Nombre"
                  value={form.nombre}
                  onChange={(event) => onChange("nombre", event.target.value)}
                  size="small"
                  disabled={submitting}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeRoundedIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Apellido"
                  value={form.apellido ?? ""}
                  onChange={(event) => onChange("apellido", event.target.value)}
                  size="small"
                  disabled={submitting}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeRoundedIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Box>

            <Box
              sx={{
                display: "grid",
                gap: 2,
                p: { xs: 2, md: 2.5 },
                borderRadius: 1.5,
                border: "1px solid",
                borderColor: "divider",
                background: `linear-gradient(
                  180deg,
                  color-mix(in srgb, var(--mui-palette-background-paper, #fff) 96%, var(--mui-palette-secondary-main, #0f766e) 4%) 0%,
                  color-mix(in srgb, var(--mui-palette-background-paper, #fff) 91%, transparent) 100%
                )`,
                boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
              }}
            >
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                  Contacto y acceso
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ajusta el correo y telefono asociados al usuario.
                </Typography>
              </Box>
              <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
                <TextField
                  label="Correo"
                  value={form.email ?? ""}
                  onChange={(event) => onChange("email", event.target.value)}
                  size="small"
                  disabled={submitting}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AlternateEmailRoundedIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Telefono"
                  value={form.telefono ?? ""}
                  onChange={(event) => onChange("telefono", event.target.value)}
                  size="small"
                  disabled={submitting}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneRoundedIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Box>

            <Box
              sx={{
                display: "grid",
                gap: 2,
                p: { xs: 2, md: 2.5 },
                borderRadius: 1.5,
                border: "1px solid",
                borderColor: "divider",
                background: `linear-gradient(
                  180deg,
                  color-mix(in srgb, var(--mui-palette-background-paper, #fff) 96%, var(--mui-palette-primary-main, #1976d2) 3%) 0%,
                  color-mix(in srgb, var(--mui-palette-background-paper, #fff) 91%, transparent) 100%
                )`,
                boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
              }}
            >
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                  Seguridad y estado
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Actualiza password y condicion operativa del usuario cuando aplique.
                </Typography>
              </Box>
              <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
                <TextField
                  label="Password actual"
                  type="password"
                  value={form.passwordactual ?? ""}
                  onChange={(event) => onChange("passwordactual", event.target.value)}
                  size="small"
                  disabled={submitting}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockRoundedIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Password nueva"
                  type="password"
                  value={form.passworNueva ?? ""}
                  onChange={(event) => onChange("passworNueva", event.target.value)}
                  size="small"
                  disabled={submitting}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockRoundedIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
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
          </Box>
        ) : null}
      </Box>
    </SpotlightDialog>
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
    editDialogOpen,
    editDialogLoading,
    editDialogSubmitting,
    editDialogError,
    editForm,
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
    handleCloseEditDialog,
    handleEditFormChange,
    handleSubmitEditDialog,
    handleOpenCreateDialog,
    handleCloseCreateDialog,
    handleCreateFormChange,
    handleSubmitCreateDialog,
    handleApplyFilters,
    handleClearFilters,
  } = useUsuariosScript();

  if (!permiso) {
    return (
      <Box className="records-view">
        <UsuariosHeader
          title={titulo}
          description={descripcion}
          viewMode={viewMode}
          onChange={handleChangeViewMode}
        />
        <UsuariosErrorBanner message={requestError} />
        <UsuariosToolbar
          loading={loading}
          searchTerm={searchTerm}
          activeFiltersCount={activeFiltersCount}
          onSearchChange={handleSearchChange}
          onClearSearch={handleClearSearch}
          onOpenFilters={handleOpenFilters}
          onRefresh={consultarUsuarios}
          onOpenCreate={handleOpenCreateDialog}
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

        <UsuarioCreateDialog
          open={createDialogOpen}
          submitting={createDialogSubmitting}
          error={createDialogError}
          form={createForm}
          onClose={handleCloseCreateDialog}
          onChange={handleCreateFormChange}
          onSubmit={handleSubmitCreateDialog}
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

