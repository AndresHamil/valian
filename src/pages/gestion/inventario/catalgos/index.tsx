import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useProcessScript } from "./script";


export default function Catalagos() {
  const { permiso, titulo, descripcion } = useProcessScript();

  if (!permiso) {
    return (
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 4, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            {titulo}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {descripcion}
          </Typography>
          <Typography variant="body2">Hola mundo</Typography>
        </Paper>
      </Box>
    );
  }

  return null;
}


