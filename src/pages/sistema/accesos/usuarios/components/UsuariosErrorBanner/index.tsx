import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

type UsuariosErrorBannerProps = {
  message: string;
};

export function UsuariosErrorBanner({ message }: UsuariosErrorBannerProps) {
  if (!message) {
    return null;
  }

  return (
    <Paper sx={{ p: 2, color: "error.main", borderRadius: 2 }}>
      <Typography variant="body2">{message}</Typography>
    </Paper>
  );
}
