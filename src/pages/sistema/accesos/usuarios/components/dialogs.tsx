import AlternateEmailRoundedIcon from "@mui/icons-material/AlternateEmailRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import CakeRoundedIcon from "@mui/icons-material/CakeRounded";
import FingerprintRoundedIcon from "@mui/icons-material/FingerprintRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import SpotlightDialog from "../../../../../components/SpotlightDialog";
import { SpotlightCreateIcon } from "../../../../../components/SpotlightDialog/icons";
import type { CreateUsuarioForm } from "../model";
import {
  createSpotlightSectionSx,
  spotlightDialogGridSx,
  spotlightErrorBannerSx,
  spotlightPrimaryActionSx,
  spotlightSectionFieldsSx,
} from "./dialog-styles";

type CreateDialogProps = {
  open: boolean;
  submitting: boolean;
  error: string;
  form: CreateUsuarioForm;
  onClose: () => void;
  onChange: <K extends keyof CreateUsuarioForm>(key: K, value: CreateUsuarioForm[K]) => void;
  onSubmit: () => Promise<void>;
};

const primaryAccent = "var(--mui-palette-primary-main, #1976d2)";
const secondaryAccent = "var(--mui-palette-secondary-main, #0f766e)";

export function UsuarioCreateDialog({ open, submitting, error, form, onClose, onChange, onSubmit }: CreateDialogProps) {
  return (
    <SpotlightDialog
      open={open}
      onClose={onClose}
      title="Registrar usuario"
      eyebrow="Nuevo acceso"
      description="Captura los datos personales, credenciales iniciales y la asignacion principal para dar de alta al usuario sin salir de esta vista."
      icon={<SpotlightCreateIcon />}
      actions={
        <>
          <Button onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={onSubmit}
            disabled={submitting}
            startIcon={<PersonAddAlt1RoundedIcon />}
            sx={spotlightPrimaryActionSx}
          >
            {submitting ? "Registrando..." : "Registrar usuario"}
          </Button>
        </>
      }
    >
      <Box sx={spotlightDialogGridSx}>
        {error ? (
          <Box sx={spotlightErrorBannerSx}>
            <Typography variant="body2" color="error.main" sx={{ fontWeight: 600 }}>
              {error}
            </Typography>
          </Box>
        ) : null}

        <Box sx={createSpotlightSectionSx(primaryAccent, 4)}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
              Datos personales
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Informacion visible y de contacto del usuario.
            </Typography>
          </Box>
          <Box sx={spotlightSectionFieldsSx}>
            <TextField
              label="Nombre"
              value={form.nombre}
              onChange={(event) => onChange("nombre", event.target.value)}
              size="small"
              disabled={submitting}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeRoundedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Apellido"
              value={form.apellido}
              onChange={(event) => onChange("apellido", event.target.value)}
              size="small"
              disabled={submitting}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeRoundedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box sx={spotlightSectionFieldsSx}>
            <TextField
              label="Fecha de nacimiento"
              type="date"
              value={form.fechaNacimiento}
              onChange={(event) => onChange("fechaNacimiento", event.target.value)}
              size="small"
              disabled={submitting}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CakeRoundedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Telefono"
              value={form.telefono}
              onChange={(event) => onChange("telefono", event.target.value)}
              size="small"
              disabled={submitting}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneRoundedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <TextField
            label="Correo"
            type="email"
            value={form.email}
            onChange={(event) => onChange("email", event.target.value)}
            size="small"
            disabled={submitting}
            required
            helperText="Se usara para identificar al usuario y validar duplicados."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AlternateEmailRoundedIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box sx={createSpotlightSectionSx(secondaryAccent, 4)}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
              Credenciales iniciales
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Define la clave temporal con la que nacera el acceso del usuario.
            </Typography>
          </Box>
          <TextField
            label="Password"
            type="password"
            value={form.password}
            onChange={(event) => onChange("password", event.target.value)}
            size="small"
            disabled={submitting}
            required
            helperText="Usa una clave segura. El backend se encargara del registro final."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockRoundedIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box sx={createSpotlightSectionSx(primaryAccent, 3)}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
              Asignacion principal
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Relaciona el nuevo usuario con su empresa, sucursal, departamento y perfil inicial.
            </Typography>
          </Box>
          <Box sx={spotlightSectionFieldsSx}>
            <TextField
              label="Empresa ID"
              value={form.empresaId}
              onChange={(event) => onChange("empresaId", event.target.value)}
              size="small"
              disabled={submitting}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BusinessRoundedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Sucursal ID"
              value={form.sucursalId}
              onChange={(event) => onChange("sucursalId", event.target.value)}
              size="small"
              disabled={submitting}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BusinessRoundedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box sx={spotlightSectionFieldsSx}>
            <TextField
              label="Departamento ID"
              value={form.departamentoId}
              onChange={(event) => onChange("departamentoId", event.target.value)}
              size="small"
              disabled={submitting}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BusinessRoundedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Perfil ID"
              value={form.perfilId}
              onChange={(event) => onChange("perfilId", event.target.value)}
              size="small"
              disabled={submitting}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FingerprintRoundedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <TextField
            label="Usuario registro ID"
            value={form.usuarioRegistroId}
            onChange={(event) => onChange("usuarioRegistroId", event.target.value)}
            size="small"
            disabled={submitting}
            required
            helperText="Se envia como referencia del usuario que realiza el alta."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FingerprintRoundedIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>
    </SpotlightDialog>
  );
}
