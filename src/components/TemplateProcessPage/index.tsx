import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

type TemplateProcessPageProps = {
  title: string;
  description: string;
  body: string;
};

export default function TemplateProcessPage({ title, description, body }: TemplateProcessPageProps) {
  return (
    <Box className="template-process">
      <Paper className="template-process__card">
        <Typography variant="h4" className="template-process__title">
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary" className="template-process__description">
          {description}
        </Typography>
        <Typography variant="body2" className="template-process__body">
          {body}
        </Typography>
      </Paper>
    </Box>
  );
}