import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import type { UsuarioFilters } from "../../model";

type UsuariosFiltersPopoverProps = {
  loading: boolean;
  anchorEl: HTMLElement | null;
  filters: UsuarioFilters;
  onClose: () => void;
  onFilterChange: (key: keyof UsuarioFilters, value: string | boolean | null) => void;
  onClearFilters: () => Promise<void>;
  onApplyFilters: () => Promise<void>;
};

export function UsuariosFiltersPopover({
  loading,
  anchorEl,
  filters,
  onClose,
  onFilterChange,
  onClearFilters,
  onApplyFilters,
}: UsuariosFiltersPopoverProps) {
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
