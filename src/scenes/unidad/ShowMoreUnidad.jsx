/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  TextField,
  Button,
  Dialog,
  Alert,
  AlertTitle,
  Select,
  MenuItem,
  Skeleton,
} from "@mui/material";
import { tokens } from "../../theme.js";
import Header from "../../components/Header.jsx";
import KeyValueBox from "../../components/KeyValueBox.jsx";

import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "@mui/material";
import { useEffect, useState } from "react";

//Icons
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getApi, postApi, putApi } from "../../tools/mantenimiento-api.js";
import { ExtraRowPerfil, RowPerfil } from "../../components/GridRowText.jsx";

const ShowMoreUnidad = ({ payload, setOpen }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState({});

  const [dataCodeUsuario, setDataCodeUsuario] = useState({});

  const { id } = useParams();
  const timeWait = 1500;

  useEffect(() => {
    setOpen(false);
    setData(payload);
  }, [payload]);

  useEffect(() => {
    const getData = async () => {
      setOpen(true);
      await new Promise((resolve) => setTimeout(resolve, timeWait));
      const rs = await getApi("/e_unidades/code/" + id, data.token);
      setDataCodeUsuario(rs);
      await new Promise((resolve) => setTimeout(resolve, timeWait));
      setOpen(false);
    };
    getData();
  }, [data, setDataCodeUsuario]);

  return (
    <Box m="20px">
      <Header
        title={
          dataCodeUsuario.unidades_nombre ? (
            "Informacion de " + dataCodeUsuario.unidades_nombre
          ) : (
            <Skeleton animation={"wave"} variant="h5" />
          )
        }
        subtitle="Pagina de informacion de la Unidad/Equipo"
      />

      {/* Informaciond del sistema */}
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ borderBottom: `3px solid ${colors.primary[900]}` }}
        >
          <Typography color={colors.greenAccent[500]} variant="h3">
            Informacion del {" "}
            {dataCodeUsuario.sistemas_nombre ? (
              <strong style={{ color: colors.greenAccent[300] }}>
                {dataCodeUsuario.sistemas_nombre}
              </strong>
            ) : (
              <Skeleton animation={"wave"} variant="h6" />
            )}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ flexGrow: 1 }}>
            {/* <Grid container spacing={2}>
              <RowPerfil
                titulo={"ID Trabajador"}
                valor={
                  perfilData.id_trabajadores ? (
                    perfilData.id_trabajadores
                  ) : (
                    <Skeleton animation={"wave"} width={"250px"} />
                  )
                }
              />
              <RowPerfil
                titulo={"Nombre"}
                valor={
                  perfilData.nombre ? (
                    perfilData.nombre
                  ) : (
                    <Skeleton animation={"wave"} width={"250px"} />
                  )
                }
              />

              <ExtraRowPerfil titulo={"Datos extra"} info={perfilData.info} />
            </Grid> */}
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default ShowMoreUnidad;
