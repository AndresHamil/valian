import type { MouseEvent } from "react";
import TableRowsRoundedIcon from "@mui/icons-material/TableRowsRounded";
import ViewModuleRoundedIcon from "@mui/icons-material/ViewModuleRounded";
import ProcessHeader from "../../../../../../components/ProcessHeader";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import type { ViewMode } from "../../model";

type UsuariosHeaderProps = {
  title: string;
  description: string;
  viewMode: ViewMode;
  onChange: (event: MouseEvent<HTMLElement>, value: ViewMode | null) => void;
};

export function UsuariosHeader({ title, description, viewMode, onChange }: UsuariosHeaderProps) {
  return (
    <ProcessHeader
      title={title}
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
