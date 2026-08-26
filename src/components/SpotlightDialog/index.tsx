import { forwardRef } from "react";
import { keyframes } from "@emotion/react";
import "./styles.scss";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grow from "@mui/material/Grow";
import Slide from "@mui/material/Slide";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import type { DialogProps } from "@mui/material/Dialog";
import type { SxProps, Theme } from "@mui/material/styles";
import type { TransitionProps } from "@mui/material/transitions";
import type { ReactElement, ReactNode } from "react";

type SpotlightDialogProps = {
  open: boolean;
  onClose: DialogProps["onClose"];
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  icon?: ReactNode;
  maxWidth?: DialogProps["maxWidth"];
  fullWidth?: boolean;
  contentDividers?: boolean;
  paperSx?: SxProps<Theme>;
  titleSx?: SxProps<Theme>;
  contentSx?: SxProps<Theme>;
  actionsSx?: SxProps<Theme>;
};

const DialogSlideTransition = forwardRef(function DialogSlideTransition(
  props: TransitionProps & {
    children: ReactElement<unknown>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide ref={ref} {...props} direction="up" timeout={{ enter: 280, exit: 180 }} />;
});

const dialogDesktopBounceIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.94);
  }

  58% {
    opacity: 1;
    transform: translateY(-6px) scale(1.015);
  }

  78% {
    transform: translateY(2px) scale(0.995);
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const DialogDesktopTransition = forwardRef(function DialogDesktopTransition(
  props: TransitionProps & {
    children: ReactElement<unknown>;
  },
  ref: React.Ref<unknown>
) {
  return <Grow ref={ref} {...props} timeout={{ enter: 320, exit: 180 }} />;
});

export default function SpotlightDialog({
  open,
  onClose,
  title,
  children,
  actions,
  description,
  eyebrow,
  icon,
  maxWidth = "md",
  fullWidth = true,
  contentDividers = true,
  paperSx,
  titleSx,
  contentSx,
  actionsSx,
}: SpotlightDialogProps) {
  const isMobile = useMediaQuery("(max-width:600px)");
  const dialogPaperBaseSx: SxProps<Theme> = {
    transformOrigin: { xs: "center bottom", md: "center center" },
    animation: isMobile ? "none" : `${dialogDesktopBounceIn} 340ms cubic-bezier(0.22, 1, 0.36, 1)`,
    willChange: isMobile ? "auto" : "transform, opacity",
  };
  const dialogPaperSx = [
    dialogPaperBaseSx,
    ...(Array.isArray(paperSx) ? paperSx : paperSx ? [paperSx] : []),
  ] as SxProps<Theme>;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="spotlight-dialog"
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      TransitionComponent={isMobile ? DialogSlideTransition : DialogDesktopTransition}
      transitionDuration={isMobile ? { enter: 280, exit: 180 } : { enter: 320, exit: 180 }}
      slotProps={{
        backdrop: {
          className: "spotlight-dialog__backdrop",
        },
      }}
      PaperProps={{
        className: "spotlight-dialog__paper",
        sx: dialogPaperSx,
      }}
    >
      <DialogTitle
        className="spotlight-dialog__title"
        sx={titleSx}
      >
        <Box className="spotlight-dialog__header">
          {icon ? (
            <Box className="spotlight-dialog__icon">
              {icon}
            </Box>
          ) : null}
          <Box className="spotlight-dialog__copy">
            {eyebrow ? (
              <Typography variant="overline" className="spotlight-dialog__eyebrow">
                {eyebrow}
              </Typography>
            ) : null}
            <Typography
              variant="h5"
              className={[
                "spotlight-dialog__heading",
                description ? "spotlight-dialog__heading--with-description" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {title}
            </Typography>
            {description ? (
              <Typography variant="body2" color="text.secondary" className="spotlight-dialog__description">
                {description}
              </Typography>
            ) : null}
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent
        className="spotlight-dialog__content"
        dividers={contentDividers}
        sx={contentSx}
      >
        {children}
      </DialogContent>
      {actions ? (
        <DialogActions
          className="spotlight-dialog__actions"
          sx={actionsSx}
        >
          {actions}
        </DialogActions>
      ) : null}
    </Dialog>
  );
}
