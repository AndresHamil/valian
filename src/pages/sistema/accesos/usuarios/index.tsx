import "./index.scss";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import { UsuarioCreateDialog } from "./components/dialogs";
import { UsuariosCardsSection } from "./components/UsuariosCardsSection";
import { UsuariosErrorBanner } from "./components/UsuariosErrorBanner";
import { UsuariosFiltersPopover } from "./components/UsuariosFiltersPopover";
import { UsuariosHeader } from "./components/UsuariosHeader";
import { UsuariosTableSection } from "./components/UsuariosTableSection";
import { UsuariosToolbar } from "./components/UsuariosToolbar";
import { useUsuariosScript } from "./script";

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
  } = useUsuariosScript();

  if (!permiso) {
    return (
      <Box className={`records-view records-view--${viewMode}`}>
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
            rowsPerPageOptions={[20, 50, 100]}
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