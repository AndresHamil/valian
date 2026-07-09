import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

export default function Almacen() {
  return (
    <Box sx={{ p: 3 }}>
      <Paper
        sx={{
          p: 4,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Almacen
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Hola mundo
        </Typography>
      </Paper>
    </Box>
  );
}