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
  Skeleton,
  CardActionArea,
} from "@mui/material";
import { tokens } from "../../theme.js";
import Header from "../../components/Header.jsx";

import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "@mui/material";
import { useEffect, useState } from "react";

//Icons
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getApi } from "../../tools/mantenimiento-api.js";
import { ExtraRowPerfil, RowPerfil } from "../../components/GridRowText.jsx";
import ImageComponent from "../../components/ImageComponent.jsx";
import ClickImageComponent from "../../components/ClickImageComponent.jsx";

const ShowSubParts = ({ idParte, token, colors, timeWait }) => {
  const [dataSubpartes, setDataSubpartes] = useState([]);

  useEffect(() => {
    const getData = async () => {
      await new Promise((resolve) => setTimeout(resolve, timeWait));
      const rs = await getApi("/e_subpartes/partsub/" + idParte, token);
      setDataSubpartes(rs);
      await new Promise((resolve) => setTimeout(resolve, timeWait));
    };

    getData();
  }, [idParte]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: "5px",
        border: "1px solid " + colors.blueAccent[900],
      }}
    >
      <Typography variant="h5" padding={"3px"}>
        <strong>Lista de Subpartes</strong>
      </Typography>
      {dataSubpartes[0] ? (
        dataSubpartes.map((subpartes, iter) => {
          return (
            <Box
              sx={{
                padding: "2px",
                margin: "2px",
                flexDirection: "row",
                display: "flex",
              }}
              key={iter}
            >
              <Typography variant="h6" padding={"3px"}>
                <strong>{subpartes.codigo_c}</strong> {" " + subpartes.nombre}
              </Typography>
            </Box>
          );
        })
      ) : (
        <Typography variant="h6" padding={"3px"}>
          <strong>No hay registro de Subpartes</strong>
        </Typography>
      )}
    </Box>
  );
};

const ShowMoreUnidad = ({ payload, setOpen }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState({});

  const [useImage, setUseImage] = useState(false);
  const [useLink, setUseLink] = useState("");

  const [change, setChange] = useState(false);

  const [dataCodeUsuario, setDataCodeUsuario] = useState({});

  const [dataSistemas, setDataSistemas] = useState({});
  const [dataUnidad, setDataUnidad] = useState({});
  const [dataPartes, setDataPartes] = useState({});

  const { id } = useParams();
  const timeWait = 1750;

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
  }, [data, change]);

  useEffect(() => {
    const getData = async () => {
      const rsSistemas = await getApi(
        "/e_sistemas/" + dataCodeUsuario.id_sistemas,
        data.token
      );
      setDataSistemas(rsSistemas);
    };
    getData();
  }, [dataCodeUsuario]);

  useEffect(() => {
    const getData = async () => {
      const rsUnidad = await getApi(
        "/e_unidades/" + dataCodeUsuario.id_unidades,
        data.token
      );
      setDataUnidad(rsUnidad);
      console.log(rsUnidad);
    };

    getData();
  }, [dataCodeUsuario]);

  useEffect(() => {
    const getData = async () => {
      const rsPartes = await getApi(
        "/e_partes/unipart/" + dataCodeUsuario.id_unidades,
        data.token
      );
      setDataPartes(rsPartes);
    };
    getData();
  }, [dataCodeUsuario]);

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
        search={true}
        link="/app/equipment/show/"
        titulo="Buscar por codigo"
        placeholder="SSG-BD1"
        setChange={setChange}
      />

      {/* Informaciond del sistema */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ borderBottom: `3px solid ${colors.primary[900]}` }}
        >
          <Typography color={colors.greenAccent[500]} variant="h3">
            Informacion del{" "}
            <strong style={{ color: colors.greenAccent[300] }}>
              {dataSistemas.nombre}
            </strong>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: "flex", flexDirection: "rowF" }}>
            <Box>
              <Grid container spacing={2}>
                <RowPerfil
                  titulo="Codigo Sistema"
                  valor={dataSistemas.codigo_s}
                  tamx={3}
                  tamy={9}
                />
                <RowPerfil
                  titulo="Nombre"
                  valor={dataSistemas.nombre}
                  tamx={3}
                  tamy={9}
                />
                <RowPerfil
                  titulo="Descripcion"
                  valor={dataSistemas.descripcion}
                  tamx={3}
                  tamy={9}
                />
                <ExtraRowPerfil
                  info={dataSistemas.info}
                  titulo="Datos adicionales"
                  tamx={3}
                  tamy={9}
                />
              </Grid>
            </Box>
            <Box>
              <CardActionArea
                onClick={async () => {
                  setUseLink(dataSistemas.imagen);
                  setOpen(true);
                  await new Promise((resolve) => setTimeout(resolve, timeWait));
                  setUseImage(true);
                  setOpen(false);
                }}
              >
                <ImageComponent
                  link={dataSistemas.imagen}
                  token={data.token}
                  titulo={dataSistemas.nombre}
                  border=""
                  padding="5px"
                />
              </CardActionArea>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Informaciond del unidad/equipos*/}

      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ borderBottom: `3px solid ${colors.primary[900]}` }}
        >
          <Typography color={colors.greenAccent[500]} variant="h3">
            Informacion del Unidad/Equipo{" "}
            <strong style={{ color: colors.greenAccent[300] }}>
              {dataUnidad.nombre}
            </strong>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: "flex", flexDirection: "rowF" }}>
            <Box>
              <Grid container spacing={2}>
                <RowPerfil
                  titulo="Codigo Unidad"
                  valor={dataUnidad.codigo_c}
                  tamx={3}
                  tamy={9}
                />
                <RowPerfil
                  titulo="Nombre"
                  valor={dataUnidad.nombre}
                  tamx={3}
                  tamy={9}
                />
                <RowPerfil
                  titulo="Descripcion"
                  valor={dataUnidad.descripcion}
                  tamx={3}
                  tamy={9}
                />
                <ExtraRowPerfil
                  info={dataUnidad.info}
                  titulo="Datos adicionales"
                  tamx={3}
                  tamy={9}
                />
              </Grid>
            </Box>
            <Box width={"100%"}>
              <CardActionArea
                onClick={async () => {
                  setUseLink(dataUnidad.imagen);
                  setOpen(true);
                  await new Promise((resolve) => setTimeout(resolve, timeWait));
                  setUseImage(true);
                  setOpen(false);
                }}
              >
                <ImageComponent
                  link={dataUnidad.imagen}
                  token={data.token}
                  titulo={dataUnidad.nombre}
                  border=""
                  padding="5px"
                />
              </CardActionArea>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Informaciond del las partes y subpartes */}
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ borderBottom: `3px solid ${colors.primary[900]}` }}
        >
          <Typography color={colors.greenAccent[500]} variant="h3">
            Partes y Subpartes del Unidad/Equipo{" "}
            {dataCodeUsuario.unidades_nombre ? (
              <strong style={{ color: colors.greenAccent[300] }}>
                {dataCodeUsuario.unidades_nombre}
              </strong>
            ) : (
              <Skeleton animation={"wave"} variant="h6" />
            )}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {dataPartes[0] &&
            dataPartes.map((partes, iter) => {
              return (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    padding: "10px",
                    margin: "10px",
                    border: "2px solid" + colors.blueAccent[800],
                  }}
                  key={iter}
                >
                  <Box width={"100%"}>
                    <Grid container spacing={2}>
                      <RowPerfil
                        titulo="Codigo Parte"
                        valor={partes.codigo_c}
                        tamx={3}
                        tamy={9}
                      />
                      <RowPerfil
                        titulo="Nombre"
                        valor={partes.nombre}
                        tamx={3}
                        tamy={9}
                      />

                      <RowPerfil
                        titulo="Descripcion"
                        valor={partes.descripcion}
                        tamx={3}
                        tamy={9}
                      />
                      <ExtraRowPerfil
                        info={partes.info}
                        titulo="Datos adicionales"
                        tamx={3}
                        tamy={9}
                      />
                      <Grid item xs={12}>
                        <ShowSubParts
                          colors={colors}
                          idParte={partes.id_partes}
                          timeWait={timeWait}
                          token={data.token}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                  <Box>
                    <CardActionArea
                      onClick={async () => {
                        setUseLink(partes.imagen);
                        setOpen(true);
                        await new Promise((resolve) =>
                          setTimeout(resolve, timeWait)
                        );
                        setUseImage(true);
                        setOpen(false);
                      }}
                    >
                      <ImageComponent
                        link={partes.imagen}
                        token={data.token}
                        titulo={partes.nombre}
                        border=""
                        padding="5px"
                      />
                    </CardActionArea>
                  </Box>
                </Box>
              );
            })}
        </AccordionDetails>
      </Accordion>

      <ClickImageComponent
        link={useLink}
        useImage={useImage}
        setUseImage={setUseImage}
        token={data.token}
      />
    </Box>
  );
};

export default ShowMoreUnidad;
