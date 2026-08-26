import "./index.scss";
import { useEffect, useRef, useState } from "react";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import Avatar from "@mui/material/Avatar";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import Paper from "@mui/material/Paper";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import type { TypographyProps } from "@mui/material/Typography";
import type { UsuarioRow } from "../../model";

type UsuariosCardsSectionProps = {
  loading: boolean;
  rowsPerPage: number;
  paginatedRows: UsuarioRow[];
  onOpenEdit: (row: UsuarioRow) => void;
};

type OverflowFadeTextProps = TypographyProps & {
  lineClassName?: string;
};

function getUsuarioInitials(nombreCompleto: string) {
  return nombreCompleto
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((segmento) => segmento.charAt(0).toUpperCase())
    .join("");
}

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

function UsuariosCardsSkeleton({ rowsPerPage }: { rowsPerPage: number }) {
  return Array.from({ length: rowsPerPage }).map((_, index) => (
    <Paper
      key={`usuarios-card-skeleton-${index}`}
      className="records-view__item records-view__item--skeleton"
    >
      <Box className="records-view__item-header">
        <Skeleton variant="circular" animation="wave" width={56} height={56} />
        <Box className="records-view__item-summary">
          <Box className="records-view__item-identity records-view__item-identity--skeleton">
            <Skeleton variant="text" animation="wave" width="68%" height={28} />
            <Skeleton variant="text" animation="wave" width="36%" height={20} />
            <Skeleton variant="text" animation="wave" width="78%" height={20} />
            <Skeleton variant="rounded" animation="wave" width="58%" height={28} sx={{ borderRadius: 999 }} />
          </Box>
        </Box>
        <Skeleton variant="circular" animation="wave" width={34} height={34} />
      </Box>
      <Box className="records-view__item-status">
        <Skeleton variant="rounded" animation="wave" width={80} height={24} sx={{ borderRadius: 999 }} />
        <Skeleton variant="rounded" animation="wave" width={84} height={24} sx={{ borderRadius: 999 }} />
      </Box>
      <Box className="records-view__item-details">
        <Box className="records-view__item-detail records-view__item-detail--skeleton records-view__item-detail--hero">
          <Skeleton variant="text" animation="wave" width="30%" height={18} />
          <Skeleton variant="text" animation="wave" width="74%" height={24} />
        </Box>
        <Box className="records-view__item-detail records-view__item-detail--skeleton">
          <Skeleton variant="text" animation="wave" width="34%" height={18} />
          <Skeleton variant="text" animation="wave" width="66%" height={24} />
        </Box>
        <Box className="records-view__item-detail records-view__item-detail--skeleton">
          <Skeleton variant="text" animation="wave" width="28%" height={18} />
          <Skeleton variant="text" animation="wave" width="58%" height={24} />
        </Box>
      </Box>
    </Paper>
  ));
}

function UsuarioCard({ row, onOpenEdit }: { row: UsuarioRow; onOpenEdit: (row: UsuarioRow) => void }) {
  const initials = getUsuarioInitials(row.nombreCompleto);

  return (
    <Paper
      className="records-view__item records-view__item--interactive"
      role="button"
      tabIndex={0}
      onClick={() => onOpenEdit(row)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpenEdit(row);
        }
      }}
    >
      <Box className="records-view__item-header">
        <Box
          className={`records-view__item-avatar-wrap${row.estado ? " records-view__item-avatar-wrap--active" : " records-view__item-avatar-wrap--inactive"}`}
        >
          <Avatar className="records-view__item-avatar">{initials}</Avatar>
        </Box>
        <Box className="records-view__item-summary">
          <Box className="records-view__item-identity">
            <OverflowFadeText
              variant="h6"
              lineClassName="records-view__item-line--title"
              sx={{
                fontSize: "1rem",
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              {row.nombreCompleto}
            </OverflowFadeText>
            <OverflowFadeText variant="body2" color="text.secondary" sx={{ fontSize: "0.88rem" }}>
              @{row.usuario}
            </OverflowFadeText>
            <OverflowFadeText
              variant="body2"
              color="text.secondary"
              lineClassName="records-view__item-subtitle"
            >
              {row.email}
            </OverflowFadeText>
            <Box className="records-view__item-meta-pill">
              <ApartmentRoundedIcon fontSize="inherit" />
              <OverflowFadeText variant="caption" lineClassName="records-view__item-line--meta-pill">
                {row.empresa || "Sin empresa"}
              </OverflowFadeText>
            </Box>
          </Box>
        </Box>
        <Box className="records-view__item-spotlight">
          <VisibilityRoundedIcon fontSize="small" />
        </Box>
      </Box>

      <Box className="records-view__item-status">
        <Chip
          label={row.estado ? "Activo" : "Inactivo"}
          size="small"
          color={row.estado ? "success" : "default"}
          variant={row.estado ? "filled" : "outlined"}
        />
        <Chip
          label={row.sesion ? "Abierta" : "Cerrada"}
          size="small"
          color={row.sesion ? "info" : "default"}
          variant={row.sesion ? "filled" : "outlined"}
        />
      </Box>

      <Box className="records-view__item-details">
        <Box className="records-view__item-detail records-view__item-detail--hero">
          <Box className="records-view__item-detail-icon records-view__item-detail-icon--primary">
            <BadgeRoundedIcon fontSize="small" />
          </Box>
          <Box className="records-view__item-detail-content">
            <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.3 }}>
              Usuario
            </Typography>
            <OverflowFadeText variant="body2" lineClassName="records-view__item-line--value" sx={{ fontWeight: 700 }}>
              @{row.usuario}
            </OverflowFadeText>
          </Box>
        </Box>
        <Box className="records-view__item-detail">
          <Box className="records-view__item-detail-icon records-view__item-detail-icon--secondary">
            <VerifiedUserRoundedIcon fontSize="small" />
          </Box>
          <Box className="records-view__item-detail-content">
            <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.3 }}>
              Perfil principal
            </Typography>
            <OverflowFadeText variant="body2" lineClassName="records-view__item-line--value" sx={{ fontWeight: 600 }}>
              {row.perfil || "Sin perfil"}
            </OverflowFadeText>
          </Box>
        </Box>
        <Box className="records-view__item-detail">
          <Box className="records-view__item-detail-icon records-view__item-detail-icon--neutral">
            <HistoryRoundedIcon fontSize="small" />
          </Box>
          <Box className="records-view__item-detail-content">
            <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.3 }}>
              Sucursal / Departamento
            </Typography>
            <OverflowFadeText variant="body2" lineClassName="records-view__item-line--value" sx={{ fontWeight: 600 }}>
              {[row.sucursal, row.departamento].filter(Boolean).join(" / ") || "Sin asignacion"}
            </OverflowFadeText>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

function UsuariosCardsEmptyState() {
  return (
    <Paper
      sx={{
        gridColumn: "1 / -1",
        py: 5,
        px: 3,
        textAlign: "center",
        color: "text.secondary",
        borderRadius: 3,
      }}
    >
      No se encontraron usuarios con ese filtro.
    </Paper>
  );
}

export function UsuariosCardsSection({
  loading,
  rowsPerPage,
  paginatedRows,
  onOpenEdit,
}: UsuariosCardsSectionProps) {
  return (
    <Box className="records-view__grid">
      {loading ? <UsuariosCardsSkeleton rowsPerPage={rowsPerPage} /> : null}
      {!loading ? paginatedRows.map((row) => <UsuarioCard key={row.id} row={row} onOpenEdit={onOpenEdit} />) : null}
      {!loading && paginatedRows.length === 0 ? <UsuariosCardsEmptyState /> : null}
    </Box>
  );
}
