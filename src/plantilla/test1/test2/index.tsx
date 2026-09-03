import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import "./index.scss";
import { useProcessScript } from "./script";

// Copia este archivo al proceso real y cambia Test2Page por el nombre de tu pantalla.
export default function Test2Page() {
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
          Hola mundo.
        </Typography>
      </Paper>
    </Box>
  );
}