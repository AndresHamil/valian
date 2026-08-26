import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import {
  ACTIONS_COLUMN_WIDTH,
  BODY_CELL_SX,
  BODY_ROW_HEIGHT,
  formatUsuarioBirthDate,
  TABLE_MIN_WIDTH,
  type UsuarioRow,
  columns,
} from "../../model";

type UsuariosTableSectionProps = {
  loading: boolean;
  rowsPerPage: number;
  paginatedRows: UsuarioRow[];
  onOpenEdit: (row: UsuarioRow) => void;
};

const EMPTY_CELL_LABELS: Partial<Record<(typeof columns)[number]["id"], string>> = {
  nombreCompleto: "Nombre pendiente",
  email: "Sin correo",
  telefono: "Sin telefono",
  fechaNacimiento: "Sin capturar",
  usuario: "Sin usuario",
  perfil: "Sin asignar",
  departamento: "Sin departamento",
  sucursal: "Sin sucursal",
  empresa: "Sin empresa",
  usuarioRegistro: "Sin registro",
  fechaRegistro: "Sin registrar",
  fechaActualizacion: "Sin actualizar",
};

function getSkeletonWidth(columnId: (typeof columns)[number]["id"]) {
  switch (columnId) {
    case "nombreCompleto":
      return 180;
    case "email":
      return 220;
    case "usuario":
      return 200;
    case "usuarioRegistro":
      return 190;
    case "empresa":
    case "departamento":
    case "perfil":
      return 150;
    case "sucursal":
      return 120;
    case "telefono":
    case "fechaNacimiento":
    case "fechaRegistro":
    case "fechaActualizacion":
      return 130;
    case "sesionesActivas":
      return 70;
    default:
      return 82;
  }
}

function renderOptionalCellValue(
  columnId: (typeof columns)[number]["id"],
  value: string | number | null | undefined
) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    return value;
  }

  return (
    <Typography
      component="span"
      sx={{
        fontSize: "inherit",
        lineHeight: "inherit",
        fontStyle: "italic",
        color: "text.secondary",
        opacity: 0.9,
      }}
    >
      {EMPTY_CELL_LABELS[columnId] ?? "No disponible"}
    </Typography>
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
              width={getSkeletonWidth(column.id)}
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

function UsuariosEmptyState() {
  return (
    <TableRow>
      <TableCell colSpan={columns.length + 1} align="center" sx={{ py: 5, color: "text.secondary" }}>
        No se encontraron usuarios con ese filtro.
      </TableCell>
    </TableRow>
  );
}

export function UsuariosTableSection({
  loading,
  rowsPerPage,
  paginatedRows,
  onOpenEdit,
}: UsuariosTableSectionProps) {
  return (
    <TableContainer component={Paper} className="records-view__table">
      <Table
        stickyHeader
        aria-label="tabla de usuarios"
        sx={{
          minWidth: TABLE_MIN_WIDTH,
          width: "max-content",
          tableLayout: "auto",
        }}
      >
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.id} sx={{ whiteSpace: "nowrap", width: "1%" }}>
                {column.label}
              </TableCell>
            ))}
            <TableCell align="right" sx={{ whiteSpace: "nowrap", width: ACTIONS_COLUMN_WIDTH }} />
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

                    if (column.id === "fechaNacimiento") {
                      return (
                        <TableCell key={column.id} sx={BODY_CELL_SX}>
                          {renderOptionalCellValue(
                            column.id,
                            row.fechaNacimiento ? formatUsuarioBirthDate(row.fechaNacimiento) : null
                          )}
                        </TableCell>
                      );
                    }

                    return (
                      <TableCell key={column.id} sx={BODY_CELL_SX}>
                        {renderOptionalCellValue(column.id, row[column.id])}
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
