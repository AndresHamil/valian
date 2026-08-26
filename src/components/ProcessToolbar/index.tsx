import "./styles.scss";
import type { ChangeEvent, ReactNode } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";

type ProcessToolbarProps = {
  loading: boolean;
  searchTerm: string;
  searchPlaceholder: string;
  onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
  onRefresh: () => Promise<void>;
  refreshTitleIdle: string;
  refreshTitleLoading: string;
  refreshAriaLabel: string;
  actions?: ReactNode;
};

export default function ProcessToolbar({
  loading,
  searchTerm,
  searchPlaceholder,
  onSearchChange,
  onClearSearch,
  onRefresh,
  refreshTitleIdle,
  refreshTitleLoading,
  refreshAriaLabel,
  actions,
}: ProcessToolbarProps) {
  return (
    <Box className="process-toolbar">
      <TextField
        value={searchTerm}
        onChange={onSearchChange}
        placeholder={searchPlaceholder}
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

      {actions ? <Box className="process-toolbar__actions">{actions}</Box> : null}

      <Tooltip title={loading ? refreshTitleLoading : refreshTitleIdle}>
        <span>
          <IconButton
            aria-label={refreshAriaLabel}
            onClick={onRefresh}
            disabled={loading}
            color="primary"
            className={`process-toolbar__refresh-button${loading ? " process-toolbar__refresh-button--loading" : ""}`}
          >
            <RefreshRoundedIcon className="process-toolbar__refresh-icon" />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
}