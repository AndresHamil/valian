import "./styles.scss";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

type ProcessHeaderProps = {
  title: string;
  description: ReactNode;
  actions?: ReactNode;
};

export default function ProcessHeader({ title, description, actions }: ProcessHeaderProps) {
  return (
    <Box className="module-header">
      <Box className="module-header__copy">
        <Typography variant="h4" className="module-header__title">
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary" className="module-header__description">
          {description}
        </Typography>
      </Box>
      {actions ? <Box className="module-header__actions">{actions}</Box> : null}
    </Box>
  );
}
