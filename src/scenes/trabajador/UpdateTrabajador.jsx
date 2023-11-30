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

const WorkerAdd = ({ payload, setOpen }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { id } = useParams();

  const [data, setData] = useState({});
  const [saveAlert, setSaveAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);

  const [dataWorker, setDataWorker] = useState({});

  const [id_trabajadores, setId_trabajadores] = useState("");
  const [id_usuarios, setId_usuarios] = useState("");
  const [dni, setDni] = useState("");
  const [nombre, setNombre] = useState("");
  const [cargo, setCargo] = useState("");
  const [correo, setCorreo] = useState("");
  const [nivel, setNivel] = useState("");
  const [rows, setRows] = useState({});

  const navigate = useNavigate();

  const timeWait = 1250;

  const handleFormSubmit = async () => {
    setOpen(true);
    const dataValues = {
      dni: dni,
      nombre: nombre,
      cargo: cargo,
      info: rows,
      correo: correo,
      nivel: nivel,
      id_usuarios: id_usuarios,
      id_trabajadores: id_trabajadores,
    };

    const rs = await putApi("/c_usuarios/worker/", dataValues, data.token);
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
    setOpen(false);
    if (!rs.messege) {
      setErrorAlert(true);
    } else {
      setSaveAlert(true);
      await new Promise((resolve) => {
        setTimeout(resolve, 2000);
      });
      navigate("/app/worker/list/");
    }
  };

  useEffect(() => {
    setOpen(false);
    setData(payload);
  }, [payload]);

  useEffect(() => {
    const getData = async () => {
      setOpen(true);

      await new Promise((resolve) => setTimeout(resolve, timeWait));
      const rs = await getApi("/c_usuarios/worker/" + id, data.token);
      await new Promise((resolve) => setTimeout(resolve, timeWait));
      setDataWorker(rs);
      setOpen(false);
    };
    getData();
  }, [data]);

  useEffect(() => {
    setId_trabajadores(dataWorker.id_trabajadores);
    setId_usuarios(dataWorker.id_usuarios);
    setDni(dataWorker.dni);
    setNombre(dataWorker.nombre);
    setCargo(dataWorker.cargo);
    setCorreo(dataWorker.correo);
    setNivel(dataWorker.nivel);

    setRows(dataWorker.info);
  }, [dataWorker]);

  return (
    <Box m="20px">
      <Header
        title="Actualizar al Trabajador"
        subtitle="Formulario para actualizar al trabajador"
      />
      <Box
        m="10px 0 0 0"
        height="100%"
        p="15px"
        borderRadius={3}
        bgcolor={colors.primary[900]}
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        {/* Informaciond del trabajador */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography color={colors.greenAccent[500]} variant="h3">
              Formulario para nuevo trabajador
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    label="ID trabajador"
                    disabled
                    value={id_trabajadores}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    label="ID usuario"
                    disabled
                    value={id_usuarios}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    label="DNI del trabajador"
                    disabled
                    value={dni}
                  />
                </Grid>

                <Grid item xs={7}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    label="Nombre del trabajador"
                    value={nombre}
                    onChange={(event) => {
                      setNombre(event.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={7}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    label="Cargo del trabajador"
                    value={cargo}
                    onChange={(event) => {
                      setCargo(event.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={7}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="email"
                    label="Correo del trabajador"
                    value={correo}
                    onChange={(event) => {
                      setCorreo(event.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={7}>
                  <TextField
                    fullWidth
                    id="outlined-select-currency"
                    select
                    label="Nivel del acceso del trabajador"
                    value={nivel ? nivel : 3}
                    onChange={(event) => {
                      setNivel(event.target.value);
                    }}
                  >
                    <MenuItem value="1">{"Administrador"}</MenuItem>
                    <MenuItem value="2">{"Supervisor"}</MenuItem>
                    <MenuItem value="3">{"Ejecutor"}</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <KeyValueBox
                    dataRow={rows}
                    setDataRow={setRows}
                    colors={colors}
                  />
                </Grid>
                <Grid item xs={3}>
                  <Button
                    fullWidth
                    type="button"
                    color="warning"
                    variant="contained"
                    onClick={async () => {
                      await handleFormSubmit();
                    }}
                  >
                    Actualizar al Trabajador
                  </Button>
                </Grid>
                <Grid item xs={3}>
                  <Button
                    fullWidth
                    type="button"
                    color="secondary"
                    variant="contained"
                    onClick={() => {
                      navigate("/app/worker/list/");
                    }}
                  >
                    Cancelar
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>

      <Dialog
        open={errorAlert}
        onClose={() => {
          setErrorAlert(false);
        }}
      >
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          Error al guardar — <strong>Error al Actualizar los datos</strong>
        </Alert>
      </Dialog>
      <Dialog
        open={saveAlert}
        onClose={() => {
          setSaveAlert(false);
        }}
      >
        <Alert severity="success">
          <AlertTitle>Guardo</AlertTitle>
          El trabajador fue Actualizado
          <strong>Se le redireccionara a la lista de trabajadores</strong>
        </Alert>
      </Dialog>
    </Box>
  );
};

export default WorkerAdd;
