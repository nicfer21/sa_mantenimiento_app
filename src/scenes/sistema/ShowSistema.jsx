/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../../theme.js";
import Header from "../../components/Header.jsx";
import { useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { getApi, getImageApi } from "../../tools/mantenimiento-api.js";
import { ExtraRowPerfil, RowPerfil } from "../../components/GridRowText.jsx";
import ImageComponent from "../../components/ImageComponent.jsx";

const ShowSistema = ({ payload, setOpen }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState({});

  const [systemData, setSystemData] = useState([]);

  const timeWait = 1500;

  useEffect(() => {
    setOpen(false);
    setData(payload);
  }, [payload, setOpen]);

  useEffect(() => {
    const getData = async () => {
      setOpen(true);
      await new Promise((resolve) => setTimeout(resolve, timeWait));
      const rs = await getApi("/e_sistemas/", data.token);
      setSystemData(rs);
      await new Promise((resolve) => setTimeout(resolve, timeWait));
      setOpen(false);
    };
    getData();
  }, [data]);

  return (
    <Box m="20px">
      <Header
        title="Sistemas identificados"
        subtitle="Tabla con la lista de sistemas"
      />
      <Box
        m="10px 0 0 0"
        height="100%"
        p="15px"
        borderRadius={3}
        bgcolor={colors.primary[900]}
      >
        {systemData[0] &&
          systemData.map((system, iter) => {
            return (
              <Accordion defaultExpanded key={iter}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ borderBottom: `3px solid ${colors.primary[900]}` }}
                >
                  <Typography color={colors.greenAccent[500]} variant="h3">
                    Informacion del {" "}
                    <strong style={{ color: colors.greenAccent[300] }}>
                      {system.nombre}
                    </strong>
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2}>
                      <RowPerfil
                        titulo="ID"
                        valor={system.id_sistemas}
                        tamx={2}
                        tamy={10}
                      />
                      <RowPerfil
                        titulo="Nombre"
                        valor={system.nombre}
                        tamx={2}
                        tamy={10}
                      />
                      <RowPerfil
                        titulo="Codigo"
                        valor={system.codigo_s}
                        tamx={2}
                        tamy={10}
                      />
                      <RowPerfil
                        titulo="Descripcion"
                        valor={system.descripcion}
                        tamx={2}
                        tamy={10}
                      />
                      <ExtraRowPerfil
                        info={system.info}
                        titulo="Datos adicionales"
                        tamx={2}
                        tamy={10}
                      />
                      <Grid item xs={12}>
                        <ImageComponent
                          link={system.imagen}
                          token={data.token}
                          titulo={system.nombre}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </AccordionDetails>
              </Accordion>
            );
          })}
      </Box>
    </Box>
  );
};

export default ShowSistema;
