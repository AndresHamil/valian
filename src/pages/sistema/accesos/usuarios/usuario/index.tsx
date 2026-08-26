import { useEffect, useRef, useState } from "react";
import AlternateEmailRoundedIcon from "@mui/icons-material/AlternateEmailRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import FingerprintRoundedIcon from "@mui/icons-material/FingerprintRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import type { TypographyProps } from "@mui/material/Typography";
import SpotlightDialog from "../../../../../components/SpotlightDialog";
import { SpotlightEditIcon } from "../../../../../components/SpotlightDialog/icons";
import {
  createSpotlightSectionSx,
  spotlightDialogContentSx,
  spotlightDialogGridSx,
  spotlightDialogPaperSx,
  spotlightErrorBannerSx,
  spotlightPrimaryActionSx,
  spotlightSectionFieldsSx,
} from "../components/dialog-styles";
import { getUsuarioProfileInitial, useUsuarioDetalleScript, type EditUsuarioForm } from "./script";
import "./index.scss";

type OverflowFadeTextProps = TypographyProps & {
  lineClassName?: string;
};

function OverflowFadeText({ children, className, lineClassName, ...props }: OverflowFadeTextProps) {
  const contentRef = useRef<HTMLSpanElement | null>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const node = contentRef.current;

    if (!node) {
      return;
    }

    const checkOverflow = () => {
      setIsOverflowing(node.scrollWidth > node.clientWidth + 1);
    };

    checkOverflow();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", checkOverflow);
      return () => window.removeEventListener("resize", checkOverflow);
    }

    const observer = new ResizeObserver(checkOverflow);
    observer.observe(node);
    return () => observer.disconnect();
  }, [children]);

  return (
    <Typography {...props} className={["records-view__item-text", className].filter(Boolean).join(" ")}>
      <span
        ref={contentRef}
        className={[
          "records-view__item-line",
          lineClassName,
          isOverflowing ? "records-view__item-line--overflowing" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </span>
    </Typography>
  );
}

function UsuarioProfileView({ form }: { form: EditUsuarioForm }) {
  const perfilNombre = [form.nombre, form.apellido].filter(Boolean).join(" ") || "Usuario";
  const profileInitial = getUsuarioProfileInitial(perfilNombre);

  return (
    <Box className="records-view__detail-layout">
      <Paper className="records-view__item records-view__detail-hero">
        <Box className="records-view__item-header records-view__profile-header">
          <Box
            className={`records-view__item-avatar-wrap${form.estado ? " records-view__item-avatar-wrap--active" : " records-view__item-avatar-wrap--inactive"}`}
          >
            <Avatar className="records-view__item-avatar records-view__profile-avatar">
              <span className="records-view__profile-avatar-glyph">{profileInitial}</span>
            </Avatar>
          </Box>
          <Box className="records-view__item-summary records-view__profile-summary">
            <Box className="records-view__item-identity records-view__profile-identity">
              <Typography className="records-view__profile-title" variant="h3">
                {perfilNombre}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                @{form.usuario}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {form.email || "Sin correo registrado"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {[form.empresa, form.sucursal].filter(Boolean).join(" / ") || "Sin asignacion principal"}
              </Typography>
              <Box className="records-view__item-status records-view__profile-status">
                <Chip
                  label={form.estado ? "Activo" : "Inactivo"}
                  size="small"
                  color={form.estado ? "success" : "default"}
                  variant={form.estado ? "filled" : "outlined"}
                />
                <Chip
                  label={form.sesion ? "Sesion abierta" : "Sesion cerrada"}
                  size="small"
                  color={form.sesion ? "info" : "default"}
                  variant={form.sesion ? "filled" : "outlined"}
                />
              </Box>
            </Box>
          </Box>
        </Box>

        <Box className="records-view__item-details records-view__detail-hero-details">
          <Box className="records-view__item-detail">
            <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.3 }}>
              Usuario
            </Typography>
            <OverflowFadeText variant="body2" lineClassName="records-view__item-line--value" sx={{ fontWeight: 600 }}>
              @{form.usuario}
            </OverflowFadeText>
          </Box>
          <Box className="records-view__item-detail">
            <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.3 }}>
              Perfil
            </Typography>
            <OverflowFadeText variant="body2" lineClassName="records-view__item-line--value" sx={{ fontWeight: 600 }}>
              {form.perfil || "Sin perfil"}
            </OverflowFadeText>
          </Box>
          <Box className="records-view__item-detail">
            <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.3 }}>
              Sesiones activas
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {form.sesionesActivas}
            </Typography>
          </Box>
          <Box className="records-view__item-detail">
            <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.3 }}>
              Registro
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {form.fechaRegistro}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Box className="records-view__detail-grid">
        <Paper className="records-view__item records-view__detail-card">
          <Box className="records-view__item-header records-view__detail-card-header">
            <Box className="records-view__item-identity records-view__detail-card-identity">
              <Typography variant="overline" className="records-view__profile-label">
                Identidad
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.15 }}>
                Base del usuario
              </Typography>
            </Box>
          </Box>
          <Box className="records-view__item-details">
            <Box className="records-view__item-detail">
              <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.3 }}>
                ID
              </Typography>
              <OverflowFadeText variant="body2" lineClassName="records-view__item-line--value" sx={{ fontWeight: 600 }}>
                {form.id}
              </OverflowFadeText>
            </Box>
            <Box className="records-view__item-detail">
              <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.3 }}>
                Nombre
              </Typography>
              <OverflowFadeText variant="body2" lineClassName="records-view__item-line--value" sx={{ fontWeight: 600 }}>
                {form.nombre}
              </OverflowFadeText>
            </Box>
            <Box className="records-view__item-detail">
              <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.3 }}>
                Apellido
              </Typography>
              <OverflowFadeText variant="body2" lineClassName="records-view__item-line--value" sx={{ fontWeight: 600 }}>
                {form.apellido || "Sin apellido"}
              </OverflowFadeText>
            </Box>
            <Box className="records-view__item-detail">
              <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.3 }}>
                Fecha de nacimiento
              </Typography>
              <OverflowFadeText variant="body2" lineClassName="records-view__item-line--value" sx={{ fontWeight: 600 }}>
                {form.fechaNacimiento || "Sin fecha"}
              </OverflowFadeText>
            </Box>
          </Box>
        </Paper>

        <Paper className="records-view__item records-view__detail-card">
          <Box className="records-view__item-header records-view__detail-card-header">
            <Box className="records-view__item-identity records-view__detail-card-identity">
              <Typography variant="overline" className="records-view__profile-label">
                Contacto
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.15 }}>
                Canales principales
              </Typography>
            </Box>
          </Box>
          <Box className="records-view__item-details">
            <Box className="records-view__item-detail">
              <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.3 }}>
                Correo
              </Typography>
              <OverflowFadeText variant="body2" lineClassName="records-view__item-line--value" sx={{ fontWeight: 600 }}>
                {form.email || "Sin correo"}
              </OverflowFadeText>
            </Box>
            <Box className="records-view__item-detail">
              <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.3 }}>
                Telefono
              </Typography>
              <OverflowFadeText variant="body2" lineClassName="records-view__item-line--value" sx={{ fontWeight: 600 }}>
                {form.telefono || "Sin telefono"}
              </OverflowFadeText>
            </Box>
          </Box>
        </Paper>

        <Paper className="records-view__item records-view__detail-card">
          <Box className="records-view__item-header records-view__detail-card-header">
            <Box className="records-view__item-identity records-view__detail-card-identity">
              <Typography variant="overline" className="records-view__profile-label">
                Organizacion
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.15 }}>
                Asignacion principal
              </Typography>
            </Box>
          </Box>
          <Box className="records-view__item-details">
            <Box className="records-view__item-detail">
              <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.3 }}>
                Empresa
              </Typography>
              <OverflowFadeText variant="body2" lineClassName="records-view__item-line--value" sx={{ fontWeight: 600 }}>
                {form.empresa || "Sin empresa"}
              </OverflowFadeText>
            </Box>
            <Box className="records-view__item-detail">
              <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.3 }}>
                Sucursal
              </Typography>
              <OverflowFadeText variant="body2" lineClassName="records-view__item-line--value" sx={{ fontWeight: 600 }}>
                {form.sucursal || "Sin sucursal"}
              </OverflowFadeText>
            </Box>
            <Box className="records-view__item-detail">
              <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.3 }}>
                Departamento
              </Typography>
              <OverflowFadeText variant="body2" lineClassName="records-view__item-line--value" sx={{ fontWeight: 600 }}>
                {form.departamento || "Sin departamento"}
              </OverflowFadeText>
            </Box>
            <Box className="records-view__item-detail">
              <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.3 }}>
                Perfil
              </Typography>
              <OverflowFadeText variant="body2" lineClassName="records-view__item-line--value" sx={{ fontWeight: 600 }}>
                {form.perfil || "Sin perfil"}
              </OverflowFadeText>
            </Box>
          </Box>
        </Paper>

        <Paper className="records-view__item records-view__detail-card">
          <Box className="records-view__item-header records-view__detail-card-header">
            <Box className="records-view__item-identity records-view__detail-card-identity">
              <Typography variant="overline" className="records-view__profile-label">
                Trazabilidad
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.15 }}>
                Actividad registrada
              </Typography>
            </Box>
          </Box>
          <Box className="records-view__item-details">
            <Box className="records-view__item-detail">
              <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.3 }}>
                Usuario registro
              </Typography>
              <OverflowFadeText variant="body2" lineClassName="records-view__item-line--value" sx={{ fontWeight: 600 }}>
                {form.usuarioRegistro || "Sin registro"}
              </OverflowFadeText>
            </Box>
            <Box className="records-view__item-detail">
              <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.3 }}>
                Sesiones activas
              </Typography>
              <OverflowFadeText variant="body2" lineClassName="records-view__item-line--value" sx={{ fontWeight: 600 }}>
                {String(form.sesionesActivas)}
              </OverflowFadeText>
            </Box>
            <Box className="records-view__item-detail">
              <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.3 }}>
                Registro
              </Typography>
              <OverflowFadeText variant="body2" lineClassName="records-view__item-line--value" sx={{ fontWeight: 600 }}>
                {form.fechaRegistro}
              </OverflowFadeText>
            </Box>
            <Box className="records-view__item-detail">
              <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.3 }}>
                Actualizacion
              </Typography>
              <OverflowFadeText variant="body2" lineClassName="records-view__item-line--value" sx={{ fontWeight: 600 }}>
                {form.fechaActualizacion}
              </OverflowFadeText>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

function UsuarioEditRouteDialog({
  open,
  submitting,
  error,
  form,
  onClose,
  onChange,
  onSubmit,
}: {
  open: boolean;
  submitting: boolean;
  error: string;
  form: EditUsuarioForm | null;
  onClose: () => void;
  onChange: <K extends keyof EditUsuarioForm>(key: K, value: EditUsuarioForm[K]) => void;
  onSubmit: () => Promise<void>;
}) {
  const primaryAccent = "var(--mui-palette-primary-main, #1976d2)";
  const secondaryAccent = "var(--mui-palette-secondary-main, #0f766e)";

  return (
    <SpotlightDialog
      open={open}
      onClose={(_event, reason) => {
        if (submitting && (reason === "backdropClick" || reason === "escapeKeyDown")) {
          return;
        }

        onClose();
      }}
      title={form ? `Editar ${[form.nombre, form.apellido].filter(Boolean).join(" ") || "usuario"}` : "Editar usuario"}
      eyebrow="Edicion directa"
      description="Actualiza identidad, contacto, credenciales y estado desde un dialog completo del proceso."
      icon={<SpotlightEditIcon />}
      fullWidth
      maxWidth={false}
      paperSx={spotlightDialogPaperSx}
      contentSx={spotlightDialogContentSx}
      actions={
        <>
          <Button onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={() => void onSubmit()}
            disabled={submitting || !form}
            sx={spotlightPrimaryActionSx}
          >
            {submitting ? "Guardando..." : "Guardar cambios"}
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

        {form ? (
          <>
            <Box sx={createSpotlightSectionSx(primaryAccent, 4)}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                  Acceso base
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Campos de referencia visibles para identificar el registro antes de actualizarlo.
                </Typography>
              </Box>
              <Box sx={spotlightSectionFieldsSx}>
                <TextField
                  label="ID"
                  value={form.id}
                  size="small"
                  disabled
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FingerprintRoundedIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Usuario"
                  value={form.usuario}
                  size="small"
                  disabled
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeRoundedIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Box>

            <Box sx={createSpotlightSectionSx(primaryAccent, 4)}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                  Datos personales
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ajusta la identidad visible del usuario dentro del sistema.
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
                  value={form.apellido ?? ""}
                  onChange={(event) => onChange("apellido", event.target.value)}
                  size="small"
                  disabled={submitting}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeRoundedIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Box>

            <Box sx={createSpotlightSectionSx(secondaryAccent, 4)}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                  Contacto principal
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Actualiza correo y telefono para mantener vigente el canal operativo.
                </Typography>
              </Box>
              <Box sx={spotlightSectionFieldsSx}>
                <TextField
                  label="Correo"
                  type="email"
                  value={form.email ?? ""}
                  onChange={(event) => onChange("email", event.target.value)}
                  size="small"
                  disabled={submitting}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AlternateEmailRoundedIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Telefono"
                  value={form.telefono ?? ""}
                  onChange={(event) => onChange("telefono", event.target.value)}
                  size="small"
                  disabled={submitting}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneRoundedIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Box>

            <Box sx={createSpotlightSectionSx(secondaryAccent, 5)}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                  Credenciales y estado
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Usa el password actual para autorizar un cambio de clave y ajusta el estado operativo del acceso.
                </Typography>
              </Box>
              <Box sx={spotlightSectionFieldsSx}>
                <TextField
                  label="Password actual"
                  type="password"
                  value={form.passwordActual ?? ""}
                  onChange={(event) => onChange("passwordActual", event.target.value)}
                  size="small"
                  disabled={submitting}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockRoundedIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Password nueva"
                  type="password"
                  value={form.passwordNueva ?? ""}
                  onChange={(event) => onChange("passwordNueva", event.target.value)}
                  size="small"
                  disabled={submitting}
                  helperText="Si capturas una nueva clave, tambien debes indicar la actual."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockRoundedIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <TextField
                select
                label="Estado"
                value={form.estado === null ? "" : form.estado ? "true" : "false"}
                onChange={(event) => onChange("estado", event.target.value === "" ? null : event.target.value === "true")}
                size="small"
                disabled={submitting}
              >
                <MenuItem value="">Sin definir</MenuItem>
                <MenuItem value="true">Activo</MenuItem>
                <MenuItem value="false">Inactivo</MenuItem>
              </TextField>
            </Box>
          </>
        ) : null}
      </Box>
    </SpotlightDialog>
  );
}

export default function UsuarioDetalle() {
  const {
    loading,
    submitting,
    error,
    isEditing,
    form,
    handleBack,
    handleEditFormChange,
    handleStartEdit,
    handleCancelEdit,
    handleSubmit,
  } = useUsuarioDetalleScript();

  return (
    <Box className="usuario-detail">
      <Box className="records-view records-view__detail-page">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
          mb: 1,
        }}
      >
        <IconButton
          aria-label="volver a usuarios"
          color="primary"
          onClick={handleBack}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            backgroundColor: "background.paper",
          }}
        >
          <ArrowBackRoundedIcon />
        </IconButton>

        {!loading && form ? (
          <Tooltip title="Editar usuario">
            <span>
              <IconButton
                aria-label="editar usuario"
                color="primary"
                onClick={handleStartEdit}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  backgroundColor: "background.paper",
                }}
              >
                <EditRoundedIcon />
              </IconButton>
            </span>
          </Tooltip>
        ) : null}
      </Box>

      {error && !isEditing ? (
        <Paper sx={{ p: 2, mb: 2, borderRadius: 2, border: "1px solid", borderColor: "error.light", color: "error.main" }}>
          <Typography variant="body2">{error}</Typography>
        </Paper>
      ) : null}

      {loading ? (
        <Box sx={{ display: "grid", gap: 2 }}>
          <Skeleton variant="rounded" height={220} />
          <Skeleton variant="rounded" height={180} />
          <Skeleton variant="rounded" height={180} />
        </Box>
      ) : null}

      {!loading && form ? <UsuarioProfileView form={form} /> : null}

      <UsuarioEditRouteDialog
        open={isEditing}
        submitting={submitting}
        error={error}
        form={form}
        onClose={handleCancelEdit}
        onChange={handleEditFormChange}
        onSubmit={handleSubmit}
      />
      </Box>
    </Box>
  );
}
