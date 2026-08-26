import { useEffect, useRef, useState } from "react";
import "./index.scss";
import TableRowsRoundedIcon from "@mui/icons-material/TableRowsRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import ViewModuleRoundedIcon from "@mui/icons-material/ViewModuleRounded";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import type { TypographyProps } from "@mui/material/Typography";
import ProcessToolbar from "../../../../components/ProcessToolbar";
import ProcessHeader from "../../../../components/ProcessHeader";
import { resolveNavigationIcon } from "../../../../components/ThemeProvider/icons";
import {
  ACTIONS_COLUMN_WIDTH,
  BODY_CELL_SX,
  BODY_ROW_HEIGHT,
  TABLE_MIN_WIDTH,
  columns,
  type ModuloRow,
  type ViewMode,
  useModulosScript,
} from "./script";

type ViewModeToggleProps = {
  viewMode: ViewMode;
  description: string;
  onChange: (event: React.MouseEvent<HTMLElement>, value: ViewMode | null) => void;
};

type ToolbarProps = {
  loading: boolean;
  searchTerm: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
  onRefresh: () => Promise<void>;
};

type TableSectionProps = {
  loading: boolean;
  rowsPerPage: number;
  paginatedRows: ModuloRow[];
  onOpenDetail: (row: ModuloRow) => void;
};

type CardsSectionProps = TableSectionProps;

type OverflowFadeTextProps = TypographyProps & {
  lineClassName?: string;
};

type DetailDialogProps = {
  open: boolean;
  modulo: ModuloRow | null;
  onClose: () => void;
};

function getModuloInitials(nombre: string, codigo: string) {
  if (codigo.trim()) {
    return codigo.trim().slice(0, 3).toUpperCase();
  }

  return nombre
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

function ModulosHeader({ viewMode, description, onChange }: ViewModeToggleProps) {
  return (
    <ProcessHeader
      title="Modulos"
      description={description}
      actions={
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
      }
    />
  );
}

function ModulosErrorBanner({ message }: { message: string }) {
  if (!message) {
    return null;
  }

  return (
    <Paper sx={{ p: 2, color: "error.main", borderRadius: 2 }}>
      <Typography variant="body2">{message}</Typography>
    </Paper>
  );
}

function ModulosToolbar({ loading, searchTerm, onSearchChange, onClearSearch, onRefresh }: ToolbarProps) {
  return (
    <ProcessToolbar
      loading={loading}
      searchTerm={searchTerm}
      searchPlaceholder="Buscar en los modulos cargados"
      onSearchChange={onSearchChange}
      onClearSearch={onClearSearch}
      onRefresh={onRefresh}
      refreshTitleIdle="Actualizar modulos"
      refreshTitleLoading="Actualizando modulos"
      refreshAriaLabel="actualizar modulos"
    />
  );
}

function ModulosTableSection({ loading, rowsPerPage, paginatedRows, onOpenDetail }: TableSectionProps) {
  return (
    <TableContainer component={Paper} className="records-view__table">
      <Table
        stickyHeader
        aria-label="tabla de modulos"
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
          {loading ? <ModulosTableSkeleton rowsPerPage={rowsPerPage} /> : null}
          {!loading
            ? paginatedRows.map((row) => (
                <TableRow hover tabIndex={-1} key={row.id} sx={{ height: BODY_ROW_HEIGHT }}>
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

                    if (column.id === "descripcion") {
                      return (
                        <TableCell key={column.id} sx={BODY_CELL_SX}>
                          <OverflowFadeText variant="body2" lineClassName="records-view__item-line--value">
                            {row.descripcion}
                          </OverflowFadeText>
                        </TableCell>
                      );
                    }

                    if (column.id === "nombre") {
                      return (
                        <TableCell key={column.id} sx={BODY_CELL_SX}>
                          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1.25, minWidth: 0 }}>
                            <Box sx={{ display: "inline-flex", alignItems: "center", color: "primary.main", flexShrink: 0 }}>
                              {resolveNavigationIcon(row.icono, row.nombre)}
                            </Box>
                            <OverflowFadeText variant="body2" lineClassName="records-view__item-line--value">
                              {row.nombre}
                            </OverflowFadeText>
                          </Box>
                        </TableCell>
                      );
                    }

                    if (column.id === "icono") {
                      return (
                        <TableCell key={column.id} sx={BODY_CELL_SX}>
                          <OverflowFadeText variant="body2" lineClassName="records-view__item-line--value">
                            {row.icono || "Sin icono"}
                          </OverflowFadeText>
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
                    <Tooltip title={`Visualizar ${row.nombre}`}>
                      <IconButton
                        aria-label={`visualizar ${row.nombre}`}
                        size="small"
                        sx={{ color: "text.secondary" }}
                        onClick={() => onOpenDetail(row)}
                      >
                        <VisibilityRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            : null}
          {!loading && paginatedRows.length === 0 ? <ModulosEmptyState /> : null}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function ModulosTableSkeleton({ rowsPerPage }: { rowsPerPage: number }) {
  return Array.from({ length: rowsPerPage }).map((_, index) => (
    <TableRow key={`modulos-skeleton-${index}`} sx={{ height: BODY_ROW_HEIGHT }}>
      {columns.map((column) => (
        <TableCell key={`${column.id}-${index}`} sx={BODY_CELL_SX}>
          {column.id === "estado" ? (
            <Skeleton variant="rounded" animation="wave" width={82} height={20} sx={{ borderRadius: 999 }} />
          ) : (
            <Skeleton
              variant="text"
              animation="wave"
              width={column.id === "descripcion" ? "94%" : column.id === "nombre" ? "78%" : "64%"}
              height={24}
            />
          )}
        </TableCell>
      ))}
      <TableCell align="right" sx={{ ...BODY_CELL_SX, width: ACTIONS_COLUMN_WIDTH }}>
        <Skeleton variant="circular" animation="wave" width={28} height={28} sx={{ ml: "auto" }} />
      </TableCell>
    </TableRow>
  ));
}

function ModulosCardsSection({ loading, rowsPerPage, paginatedRows, onOpenDetail }: CardsSectionProps) {
  return (
    <Box className="records-view__grid">
      {loading ? <ModulosCardsSkeleton rowsPerPage={rowsPerPage} /> : null}
      {!loading ? paginatedRows.map((row) => <ModuloCard key={row.id} row={row} onOpenDetail={onOpenDetail} />) : null}
      {!loading && paginatedRows.length === 0 ? <ModulosCardsEmptyState /> : null}
    </Box>
  );
}

function ModulosCardsSkeleton({ rowsPerPage }: { rowsPerPage: number }) {
  return Array.from({ length: rowsPerPage }).map((_, index) => (
    <Paper key={`modulos-card-skeleton-${index}`} className="records-view__item records-view__item--skeleton">
      <Box className="records-view__item-header">
        <Skeleton variant="circular" animation="wave" width={56} height={56} />
        <Box className="records-view__item-summary">
          <Box className="records-view__item-identity records-view__item-identity--skeleton">
            <Skeleton variant="text" animation="wave" width="58%" height={28} />
            <Skeleton variant="text" animation="wave" width="34%" height={20} />
            <Skeleton variant="text" animation="wave" width="82%" height={20} />
          </Box>
        </Box>
      </Box>
      <Box className="records-view__item-status">
        <Skeleton variant="rounded" animation="wave" width={80} height={24} sx={{ borderRadius: 999 }} />
        <Skeleton variant="rounded" animation="wave" width={90} height={24} sx={{ borderRadius: 999 }} />
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

function ModuloCard({ row, onOpenDetail }: { row: ModuloRow; onOpenDetail: (row: ModuloRow) => void }) {
  const initials = getModuloInitials(row.nombre, row.codigo);

  return (
    <Paper
      className="records-view__item records-view__item--interactive"
      role="button"
      tabIndex={0}
      onClick={() => onOpenDetail(row)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpenDetail(row);
        }
      }}
    >
      <Box className="records-view__item-header">
        <Box className={`records-view__item-avatar-wrap${row.estado ? " records-view__item-avatar-wrap--active" : " records-view__item-avatar-wrap--inactive"}`}>
          <Avatar className="records-view__item-avatar">{initials}</Avatar>
        </Box>
        <Box className="records-view__item-summary">
          <Box className="records-view__item-identity">
            <OverflowFadeText
              variant="h6"
              lineClassName="records-view__item-line--title"
              sx={{ fontSize: "1rem", fontWeight: 700, lineHeight: 1.2 }}
            >
              {row.nombre}
            </OverflowFadeText>
            <OverflowFadeText variant="body2" color="text.secondary" sx={{ fontSize: "0.88rem" }}>
              {row.tipo}
            </OverflowFadeText>
            <OverflowFadeText variant="body2" color="text.secondary" lineClassName="records-view__item-subtitle">
              {row.descripcion}
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
          label={`${row.numeroProcesos} procesos`}
          size="small"
          color="info"
          variant="outlined"
        />
      </Box>

      <Box className="records-view__item-details">
        <Box className="records-view__item-detail">
          <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.3 }}>
            Codigo
          </Typography>
          <OverflowFadeText variant="body2" lineClassName="records-view__item-line--value" sx={{ fontWeight: 600 }}>
            {row.codigo}
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
        <Box className="records-view__item-detail">
          <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.3 }}>
            Usuario registro
          </Typography>
          <OverflowFadeText variant="body2" lineClassName="records-view__item-line--value" sx={{ fontWeight: 600 }}>
            {row.usuarioRegistro}
          </OverflowFadeText>
        </Box>
      </Box>
    </Paper>
  );
}

function ModuloDetailDialog({ open, modulo, onClose }: DetailDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Detalle del modulo
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Consulta la informacion principal del modulo seleccionado.
          </Typography>
        </Box>
        <Chip
          label={modulo?.estado ? "Activo" : "Inactivo"}
          size="small"
          color={modulo?.estado ? "success" : "default"}
          variant={modulo?.estado ? "filled" : "outlined"}
        />
      </DialogTitle>
      <DialogContent dividers>
        {modulo ? (
          <Box className="records-view__profile" sx={{ pt: 1 }}>
            <Box className="records-view__profile-hero records-view__item">
              <Box className="records-view__item-header records-view__profile-header">
                <Box className={`records-view__item-avatar-wrap${modulo.estado ? " records-view__item-avatar-wrap--active" : " records-view__item-avatar-wrap--inactive"}`}>
                  <Avatar className="records-view__item-avatar records-view__profile-avatar">
                    {getModuloInitials(modulo.nombre, modulo.codigo)}
                  </Avatar>
                </Box>
                <Box className="records-view__item-summary records-view__profile-summary">
                  <Box className="records-view__item-identity records-view__profile-identity">
                    <Typography className="records-view__profile-title" variant="h3">
                      {modulo.nombre}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {modulo.tipo}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {modulo.descripcion}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box className="records-view__item-status records-view__profile-status">
                <Chip label={`${modulo.numeroProcesos} procesos`} size="small" color="info" variant="filled" />
                <Chip label={modulo.icono || "Sin icono"} size="small" color="default" variant="outlined" />
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
                    <Typography variant="body1">{modulo.id}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Codigo</Typography>
                    <Typography variant="body1">{modulo.codigo}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Tipo</Typography>
                    <Typography variant="body1">{modulo.tipo}</Typography>
                  </Box>
                </Box>
              </Box>

              <Box className="records-view__profile-panel records-view__item-detail">
                <Typography variant="overline" className="records-view__profile-label">
                  Trazabilidad
                </Typography>
                <Box className="records-view__profile-values">
                  <Box>
                    <Typography variant="caption" color="text.secondary">Usuario registro</Typography>
                    <Typography variant="body1">{modulo.usuarioRegistro}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Fecha de registro</Typography>
                    <Typography variant="body1">{modulo.fechaRegistro}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Ultima actualizacion</Typography>
                    <Typography variant="body1">{modulo.fechaActualizacion}</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}

function ModulosEmptyState() {
  return (
    <TableRow>
      <TableCell colSpan={columns.length + 1} align="center" sx={{ py: 5, color: "text.secondary" }}>
        No se encontraron modulos con ese filtro.
      </TableCell>
    </TableRow>
  );
}

function ModulosCardsEmptyState() {
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
      No se encontraron modulos con ese filtro.
    </Paper>
  );
}

export default function Modulos() {
  const {
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
  } = useModulosScript();

  if (!permiso) {
    return (
      <Box className="records-view">
        <ModulosHeader viewMode={viewMode} description={currentProcessDescription} onChange={handleChangeViewMode} />
        <ModulosErrorBanner message={requestError} />
        <ModulosToolbar
          loading={loading}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onClearSearch={handleClearSearch}
          onRefresh={consultarModulos}
        />

        <Box key={viewMode} className={`records-view__surface records-view__surface--${viewMode}`}>
          {viewMode === "table" ? (
            <ModulosTableSection
              loading={loading}
              rowsPerPage={rowsPerPage}
              paginatedRows={paginatedRows}
              onOpenDetail={handleOpenDetailDialog}
            />
          ) : (
            <ModulosCardsSection
              loading={loading}
              rowsPerPage={rowsPerPage}
              paginatedRows={paginatedRows}
              onOpenDetail={handleOpenDetailDialog}
            />
          )}
        </Box>

        <ModuloDetailDialog open={detailDialogOpen} modulo={selectedModulo} onClose={handleCloseDetailDialog} />

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

