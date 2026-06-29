import "./index.scss";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import TableRowsRoundedIcon from "@mui/icons-material/TableRowsRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import ViewModuleRoundedIcon from "@mui/icons-material/ViewModuleRounded";
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
import {
  ACTIONS_COLUMN_WIDTH,
  BODY_CELL_SX,
  BODY_ROW_HEIGHT,
  TABLE_MIN_WIDTH,
  columns,
  useUsuariosScript,
} from "./script";

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
  } = useUsuariosScript();

  if (!permiso) {
    return (
      <Box className="usuarios-view">
        <Box>
          <Box className="usuarios-view__header">
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
              onChange={handleChangeViewMode}
              size="small"
              aria-label="modo de visualizacion"
              className="usuarios-view__toggle"
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

        {requestError ? (
          <Paper sx={{ p: 2, color: "error.main", borderRadius: 2 }}>
            <Typography variant="body2">{requestError}</Typography>
          </Paper>
        ) : null}

        <Box className="usuarios-view__toolbar">
          <TextField
            value={searchTerm}
            onChange={handleSearchChange}
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
                      onClick={handleClearSearch}
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
                  onClick={handleOpenFilters}
                  disabled={loading}
                  color="primary"
                  className="usuarios-view__icon-button"
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
                onClick={consultarUsuarios}
                disabled={loading}
                color="primary"
                className={`usuarios-view__refresh-button${loading ? " usuarios-view__refresh-button--loading" : ""}`}
              >
                <RefreshRoundedIcon className="usuarios-view__refresh-icon" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Nuevo usuario">
            <span>
              <IconButton
                aria-label="crear nuevo usuario"
                color="primary"
                className="usuarios-view__icon-button"
              >
                <PersonAddAlt1RoundedIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>

        <Popover
          open={Boolean(filtersAnchorEl)}
          anchorEl={filtersAnchorEl}
          onClose={handleCloseFilters}
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
              onChange={(event) => handleFilterChange("nombre", event.target.value)}
              label="Nombre"
              size="small"
              disabled={loading}
            />
            <TextField
              value={filters.usuario ?? ""}
              onChange={(event) => handleFilterChange("usuario", event.target.value)}
              label="Usuario"
              size="small"
              disabled={loading}
            />
            <TextField
              value={filters.email ?? ""}
              onChange={(event) => handleFilterChange("email", event.target.value)}
              label="Correo"
              size="small"
              disabled={loading}
            />
            <TextField
              value={filters.telefono ?? ""}
              onChange={(event) => handleFilterChange("telefono", event.target.value)}
              label="Telefono"
              size="small"
              disabled={loading}
            />
            <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: "1fr 1fr" }}>
              <TextField
                select
                value={filters.estado === null ? "" : filters.estado ? "true" : "false"}
                onChange={(event) =>
                  handleFilterChange(
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
                  handleFilterChange(
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
              <Button variant="text" onClick={handleClearFilters} disabled={loading}>
                Limpiar
              </Button>
              <Button variant="contained" onClick={handleApplyFilters} disabled={loading}>
                Aplicar
              </Button>
            </Box>
          </Box>
        </Popover>

        {viewMode === "table" ? (
          <TableContainer
            component={Paper}
            className="usuarios-view__table"
          >
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
                  <TableCell align="right" style={{ minWidth: ACTIONS_COLUMN_WIDTH }}>
                    
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  Array.from({ length: rowsPerPage }).map((_, index) => (
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
                  ))
                ) : null}
                {!loading ? paginatedRows.map((row) => (
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
                          <IconButton aria-label={`visualizar ${row.nombreCompleto}`} size="small" sx={{ color: "text.secondary" }}>
                            <VisibilityRoundedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                )) : null}
                {!loading && paginatedRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length + 1} align="center" sx={{ py: 5, color: "text.secondary" }}>
                      No se encontraron usuarios con ese filtro.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box
            className="usuarios-view__cards"
          >
            {loading
              ? Array.from({ length: rowsPerPage }).map((_, index) => (
                  <Paper
                    key={`usuarios-card-skeleton-${index}`}
                    className="usuarios-view__card usuarios-view__card--skeleton"
                  >
                    <Box className="usuarios-view__card-top">
                      <Box sx={{ flex: 1 }}>
                        <Skeleton variant="text" animation="wave" width="64%" height={30} />
                        <Skeleton variant="text" animation="wave" width="42%" height={22} />
                      </Box>
                      <Box className="usuarios-view__card-actions">
                        <Skeleton variant="circular" animation="wave" width={30} height={30} />
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      <Skeleton variant="rounded" animation="wave" width={80} height={24} sx={{ borderRadius: 999 }} />
                      <Skeleton variant="rounded" animation="wave" width={84} height={24} sx={{ borderRadius: 999 }} />
                    </Box>
                    <Skeleton variant="rounded" animation="wave" width="100%" height={48} sx={{ borderRadius: 1.5 }} />
                    <Skeleton variant="rounded" animation="wave" width="100%" height={48} sx={{ borderRadius: 1.5 }} />
                    <Skeleton variant="rounded" animation="wave" width="100%" height={44} sx={{ borderRadius: 1.5 }} />
                  </Paper>
                ))
              : null}
            {!loading
              ? paginatedRows.map((row) => (
                  <Paper
                    key={row.id}
                    className="usuarios-view__card"
                  >
                    <Box className="usuarios-view__card-top">
                      <Box className="usuarios-view__card-title">
                        <Typography
                          variant="h6"
                          sx={{
                            fontSize: "0.98rem",
                            fontWeight: 700,
                            lineHeight: 1.2,
                            wordBreak: "break-word",
                            mb: 0.5,
                          }}
                        >
                          {row.nombreCompleto}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ wordBreak: "break-word", fontSize: "0.88rem" }}
                        >
                          @{row.usuario}
                        </Typography>
                      </Box>
                      <Box className="usuarios-view__card-actions">
                        <Tooltip title={`Visualizar ${row.nombreCompleto}`}>
                          <IconButton aria-label={`visualizar ${row.nombreCompleto}`} size="small" sx={{ color: "text.secondary" }}>
                            <VisibilityRoundedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>

                    <Box className="usuarios-view__card-meta">
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

                    <Box className="usuarios-view__card-details">
                      <Box className="usuarios-view__card-detail">
                        <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.3 }}>
                          Correo
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, wordBreak: "break-word" }}>
                          {row.email}
                        </Typography>
                      </Box>
                      <Box className="usuarios-view__card-detail">
                        <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.3 }}>
                          Telefono
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, wordBreak: "break-word" }}>
                          {row.telefono}
                        </Typography>
                      </Box>
                      <Box className="usuarios-view__card-detail">
                        <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.3 }}>
                          Registro
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {row.fechaRegistro}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                ))
              : null}
            {!loading && paginatedRows.length === 0 ? (
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
            ) : null}
          </Box>
        )}
        <Paper className="usuarios-view__pagination">
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

