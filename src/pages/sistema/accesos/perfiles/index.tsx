import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import "./index.scss";
import { useProcessScript } from "./script";

// Plantilla base:
// 1. Renombra la carpeta test2 por el nombre real del proceso.
// 2. Renombra este componente segun la pantalla real.
// 3. Sustituye el contenido base por la UI del proceso.
export default function PerfilesPage() {
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
          Contenido base del proceso.
        </Typography>
      </Paper>
    </Box>
  );
}