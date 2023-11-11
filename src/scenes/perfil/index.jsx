/* eslint-disable react/prop-types */
import { Box, useTheme, Grid } from "@mui/material";
import Header from "../../components/Header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../../theme";
import { useEffect, useState } from "react";
import { getApi } from "../../tools/mantenimiento-api";
import { getLocalDate } from "../../tools/extra";

import { ExtraRowPerfil, RowPerfil } from "../../components/GridRowText.jsx";

const PerfilScene = ({ payload }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [data, setData] = useState({});
  const [perfilData, setPerfilData] = useState({});

  useEffect(() => {
    setData(payload);
  }, [payload]);

  useEffect(() => {
    const getData = async () => {
      const rs = await getApi(
        "/m_trabajadores/" + data.id_trabajadores,
        data.token
      );
      setPerfilData(rs);
    };
    getData();
  }, [data]);

  return (
    <Box m="20px">
      <Header
        title="MI PERFIL"
        subtitle="Datos del trabajador y de la cuenta"
      />

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h3">
            Informacion del Perfil
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <RowPerfil titulo={"Nombre"} valor={perfilData.nombre} />
              <RowPerfil titulo={"cargo"} valor={perfilData.cargo} />
              <RowPerfil titulo={"d.n.i."} valor={perfilData.dni} />
              <RowPerfil
                titulo={"fecha decreacion"}
                valor={getLocalDate(perfilData.createdAt)}
              />
              <RowPerfil
                titulo={"fecha actualizacion"}
                valor={getLocalDate(perfilData.updatedAt)}
              />

              <ExtraRowPerfil titulo={"Datos extra"} info={perfilData.info} />
            </Grid>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h2">
            Informacion de la Cuenta
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default PerfilScene;
