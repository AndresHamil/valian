import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import DeleteSweepRoundedIcon from "@mui/icons-material/DeleteSweepRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

type Column = {
  id: "codigo" | "nombre" | "categoria" | "stock" | "precio" | "estado";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number | string) => string;
};

type ProductoRow = {
  codigo: string;
  nombre: string;
  categoria: string;
  stock: number;
  precio: number;
  estado: string;
};

const columns: readonly Column[] = [
  { id: "codigo", label: "Codigo", minWidth: 110 },
  { id: "nombre", label: "Producto", minWidth: 240 },
  { id: "categoria", label: "Categoria", minWidth: 160 },
  { id: "stock", label: "Stock", minWidth: 100, align: "right" },
  {
    id: "precio",
    label: "Precio",
    minWidth: 130,
    align: "right",
    format: (value) =>
      new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
      }).format(Number(value)),
  },
  { id: "estado", label: "Estado", minWidth: 140 },
];

const PRODUCTOS_MOCK: readonly ProductoRow[] = [
  {
    codigo: "PRD-001",
    nombre: "Laptop Empresarial 14\"",
    categoria: "Computo",
    stock: 18,
    precio: 18500,
    estado: "Disponible",
  },
  {
    codigo: "PRD-002",
    nombre: "Monitor UltraWide 29\"",
    categoria: "Perifericos",
    stock: 7,
    precio: 6250,
    estado: "Disponible",
  },
  {
    codigo: "PRD-003",
    nombre: "Impresora Laser Pro",
    categoria: "Oficina",
    stock: 3,
    precio: 4980,
    estado: "Stock bajo",
  },
  {
    codigo: "PRD-004",
    nombre: "Silla Ergonomica Mesh",
    categoria: "Mobiliario",
    stock: 0,
    precio: 3450,
    estado: "Agotado",
  },
  {
    codigo: "PRD-005",
    nombre: "Teclado Mecanico Compacto",
    categoria: "Perifericos",
    stock: 24,
    precio: 1890,
    estado: "Disponible",
  },
  {
    codigo: "PRD-006",
    nombre: "Camara Web Full HD",
    categoria: "Videoconferencia",
    stock: 11,
    precio: 1320,
    estado: "Disponible",
  },
  {
    codigo: "PRD-007",
    nombre: "Disco SSD 1TB NVMe",
    categoria: "Almacenamiento",
    stock: 5,
    precio: 2140,
    estado: "Stock bajo",
  },
];

export default function Productos() {
  const navigate = useNavigate();
  const permiso = false;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (permiso) {
      navigate("/login");
    }
  }, [permiso, navigate]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredRows = PRODUCTOS_MOCK.filter((row) => {
    if (!normalizedSearch) {
      return true;
    }

    return [row.codigo, row.nombre, row.categoria, row.estado]
      .some((value) => value.toLowerCase().includes(normalizedSearch));
  });

  const paginatedRows = filteredRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (!permiso) {
    return (
      <Box sx={{ display: "grid", gap: 3, p: { xs: 2, md: 3 } }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Productos
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
          <TextField
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Buscar por codigo, producto, categoria o estado"
            size="small"
            sx={{ width: { xs: "100%", sm: 380 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <TableContainer
          component={Paper}
          sx={{
            maxHeight: 440,
            borderRadius: "10px",
          }}
        >
          <Table stickyHeader aria-label="tabla de productos simulados">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
                <TableCell align="right" style={{ minWidth: 96 }}>
                  
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.codigo}>
                  {columns.map((column) => {
                    const value = row[column.id];

                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                  <TableCell align="right">
                    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
                      <Tooltip title={`Editar ${row.codigo}`}>
                        <IconButton aria-label={`editar ${row.nombre}`} size="small" sx={{ color: "text.secondary" }}>
                          <BorderColorRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={`Eliminar ${row.codigo}`}>
                        <IconButton aria-label={`eliminar ${row.nombre}`} size="small" sx={{ color: "error.main" }}>
                          <DeleteSweepRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} align="center" sx={{ py: 5, color: "text.secondary" }}>
                    No se encontraron productos con ese filtro.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </TableContainer>
        <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: 0, boxShadow: "none", bgcolor: "transparent" }}>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Filas por pagina"
          />
        </Paper>
      </Box>
    );
  }

  return null;
}

