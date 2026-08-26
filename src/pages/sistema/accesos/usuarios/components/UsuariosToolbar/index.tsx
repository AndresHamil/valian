import type { ChangeEvent, MouseEvent } from "react";
import ProcessToolbar from "../../../../../../components/ProcessToolbar";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

type UsuariosToolbarProps = {
  loading: boolean;
  searchTerm: string;
  activeFiltersCount: number;
  onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
  onOpenFilters: (event: MouseEvent<HTMLElement>) => void;
  onRefresh: () => Promise<void>;
  onOpenCreate: () => void;
};

export function UsuariosToolbar({
  loading,
  searchTerm,
  activeFiltersCount,
  onSearchChange,
  onClearSearch,
  onOpenFilters,
  onRefresh,
  onOpenCreate,
}: UsuariosToolbarProps) {
  return (
    <ProcessToolbar
      loading={loading}
      searchTerm={searchTerm}
      searchPlaceholder="Buscar en los usuarios cargados"
      onSearchChange={onSearchChange}
      onClearSearch={onClearSearch}
      onRefresh={onRefresh}
      refreshTitleIdle="Actualizar usuarios"
      refreshTitleLoading="Actualizando usuarios"
      refreshAriaLabel="actualizar usuarios"
      actions={
        <>
          <Badge color="primary" badgeContent={activeFiltersCount} invisible={activeFiltersCount === 0}>
            <Tooltip title="Filtros avanzados">
              <span>
                <IconButton
                  aria-label="abrir filtros avanzados"
                  onClick={onOpenFilters}
                  disabled={loading}
                  color="primary"
                  className="process-toolbar__icon-button"
                >
                  <TuneRoundedIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Badge>
          <Tooltip title="Nuevo usuario">
            <span>
              <IconButton
                aria-label="crear nuevo usuario"
                color="primary"
                className="process-toolbar__icon-button"
                onClick={onOpenCreate}
              >
                <PersonAddAlt1RoundedIcon />
              </IconButton>
            </span>
          </Tooltip>
        </>
      }
    />
  );
}
