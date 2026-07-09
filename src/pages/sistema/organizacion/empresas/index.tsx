import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import "./index.scss";
import { useProcessScript } from "./script";

export default function EmpresasPage() {
  const { permiso, titulo, descripcion } = useProcessScript();

  if (permiso) {
    return null;
  }

  return (
    <Box className="template-process">
      <Paper className="template-process__card">
        <Typography variant="h4" className="template-process__title">
          {titulo}
        </Typography>
        <Typography variant="body1" color="text.secondary" className="template-process__description">
          {descripcion}
        </Typography>
        <Typography variant="body2" className="template-process__body">
          Vista base del proceso de empresas del sistema.
        </Typography>
      </Paper>
    </Box>
  );
}