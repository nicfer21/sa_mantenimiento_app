import { Typography, Button, Container } from "@mui/material";
import { Link } from "react-router-dom";

function PaginaError404() {
  return (
    <Container>
      <Typography variant="h3" component="div" gutterBottom>
        ¡Error 404 - Página no encontrada!
      </Typography>
      <Typography variant="body1" gutterBottom>
        Lo sentimos, la página que buscas no existe.
      </Typography>
      <Button variant="contained" component={Link} to="/" color="primary">
        Volver a la página de inicio
      </Button>
    </Container>
  );
}

export default PaginaError404;
