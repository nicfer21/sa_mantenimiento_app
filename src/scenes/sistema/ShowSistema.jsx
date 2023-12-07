/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CardActionArea,
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
import ClickImageComponent from "../../components/ClickImageComponent.jsx";

const ShowSistema = ({ payload, setOpen }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState({});

  const [useImage, setUseImage] = useState(false);
  const [useLink, setUseLink] = useState("");

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
                    Informacion del{" "}
                    <strong style={{ color: colors.greenAccent[300] }}>
                      {system.nombre + " (" + system.codigo_s + ")"}
                    </strong>
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: "flex", flexDirection: "row" }}>
                    <Box>
                      <Grid container spacing={2}>
                        <RowPerfil
                          titulo="Codigo Sistema"
                          valor={system.codigo_s}
                          tamx={3}
                          tamy={9}
                        />
                        <RowPerfil
                          titulo="Nombre"
                          valor={system.nombre}
                          tamx={3}
                          tamy={9}
                        />
                        <RowPerfil
                          titulo="Descripcion"
                          valor={system.descripcion}
                          tamx={3}
                          tamy={9}
                        />
                        <ExtraRowPerfil
                          info={system.info}
                          titulo="Datos adicionales"
                          tamx={3}
                          tamy={9}
                        />
                      </Grid>
                    </Box>
                    <Box sx={{ padding: "10px" }}>
                      <CardActionArea
                        onClick={async () => {
                          setUseLink(system.imagen);
                          setOpen(true);
                          await new Promise((resolve) =>
                            setTimeout(resolve, timeWait)
                          );
                          setUseImage(true);
                          setOpen(false);
                        }}
                      >
                        <ImageComponent
                          link={system.imagen}
                          token={data.token}
                          titulo={system.nombre}
                        />
                      </CardActionArea>
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
            );
          })}
      </Box>
      <ClickImageComponent
        link={useLink}
        useImage={useImage}
        setUseImage={setUseImage}
        token={data.token}
      />
    </Box>
  );
};

export default ShowSistema;
