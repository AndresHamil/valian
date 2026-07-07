import { useEffect, useRef, useState } from "react";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import type { TypographyProps } from "@mui/material/Typography";
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
		<Typography
			{...props}
			className={["records-view__item-text", className].filter(Boolean).join(" ")}
		>
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
							Telefono
						</Typography>
						<OverflowFadeText variant="body2" lineClassName="records-view__item-line--value" sx={{ fontWeight: 600 }}>
							{form.telefono || "Sin telefono"}
						</OverflowFadeText>
					</Box>
					<Box className="records-view__item-detail">
						<Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.3 }}>
							Registro
						</Typography>
						<Typography variant="body2" sx={{ fontWeight: 600 }}>
							{form.fechaRegistro}
						</Typography>
					</Box>
					<Box className="records-view__item-detail">
						<Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.3 }}>
							Actualizacion
						</Typography>
						<Typography variant="body2" sx={{ fontWeight: 600 }}>
							{form.fechaActualizacion}
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

export default function UsuarioDetalle() {
	const {
		loading,
		submitting,
		error,
		isEditing,
		form,
		perfilNombre,
		handleBack,
		handleEditFormChange,
		handleStartEdit,
		handleCancelEdit,
		handleSubmit,
	} = useUsuarioDetalleScript();

	return (
		<Box className="records-view records-view__detail-page">
			<Box
				sx={{
					display: "flex",
					alignItems: { xs: "flex-start", md: "center" },
					justifyContent: "space-between",
					gap: 2,
					flexWrap: "wrap",
					mb: 3,
				}}
			>
				<Box sx={{ display: "flex", alignItems: { xs: "flex-start", md: "center" }, gap: 1.5 }}>
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
					<Box>
						<Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
							{loading ? "Detalle de usuario" : perfilNombre}
						</Typography>
						<Typography variant="body1" color="text.secondary">
							Vista individual del usuario con consulta y edicion directa por ruta.
						</Typography>
					</Box>
				</Box>

				{!loading && form ? (
					<Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
						{isEditing ? (
							<>
								<Button variant="text" onClick={handleCancelEdit} disabled={submitting}>
									Cancelar edicion
								</Button>
								<Button variant="contained" onClick={handleSubmit} disabled={submitting}>
									{submitting ? "Guardando..." : "Guardar cambios"}
								</Button>
							</>
						) : (
							<Tooltip title="Editar usuario">
								<span>
									<Button
										variant="contained"
										startIcon={<EditRoundedIcon />}
										onClick={handleStartEdit}
									>
										Editar usuario
									</Button>
								</span>
							</Tooltip>
						)}
					</Box>
				) : null}
			</Box>

			{error ? (
				<Paper sx={{ p: 2, mb: 2, color: "error.main", borderRadius: 2 }}>
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

			{!loading && form && !isEditing ? <UsuarioProfileView form={form} /> : null}

			{!loading && form && isEditing ? (
				<Paper
					className="records-view__item records-view__detail-form"
					sx={{
						display: "grid",
						gap: 2,
						p: { xs: 2, md: 3 },
					}}
				>
					<TextField label="ID" value={form.id} size="small" disabled />
					<TextField label="Usuario" value={form.usuario} size="small" disabled />
					<Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
						<TextField
							label="Nombre"
							value={form.nombre}
							onChange={(event) => handleEditFormChange("nombre", event.target.value)}
							size="small"
							disabled={submitting}
							required
						/>
						<TextField
							label="Apellido"
							value={form.apellido ?? ""}
							onChange={(event) => handleEditFormChange("apellido", event.target.value)}
							size="small"
							disabled={submitting}
						/>
					</Box>
					<Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
						<TextField
							label="Correo"
							value={form.email ?? ""}
							onChange={(event) => handleEditFormChange("email", event.target.value)}
							size="small"
							disabled={submitting}
						/>
						<TextField
							label="Telefono"
							value={form.telefono ?? ""}
							onChange={(event) => handleEditFormChange("telefono", event.target.value)}
							size="small"
							disabled={submitting}
						/>
					</Box>
					<Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
						<TextField
							label="Password actual"
							type="password"
							value={form.passwordactual ?? ""}
							onChange={(event) => handleEditFormChange("passwordactual", event.target.value)}
							size="small"
							disabled={submitting}
						/>
						<TextField
							label="Password nueva"
							type="password"
							value={form.passworNueva ?? ""}
							onChange={(event) => handleEditFormChange("passworNueva", event.target.value)}
							size="small"
							disabled={submitting}
						/>
					</Box>
					<TextField
						select
						label="Estado"
						value={form.estado === null ? "" : form.estado ? "true" : "false"}
						onChange={(event) => handleEditFormChange("estado", event.target.value === "" ? null : event.target.value === "true")}
						size="small"
						disabled={submitting}
					>
						<MenuItem value="">Sin definir</MenuItem>
						<MenuItem value="true">Activo</MenuItem>
						<MenuItem value="false">Inactivo</MenuItem>
					</TextField>
				</Paper>
			) : null}
		</Box>
	);
}