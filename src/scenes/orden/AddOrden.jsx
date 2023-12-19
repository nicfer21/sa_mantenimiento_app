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
} from "@mui/material";
import { tokens } from "../../theme.js";
import Header from "../../components/Header.jsx";

import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";

//Icons
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { postApi } from "../../tools/mantenimiento-api.js";
import ComboboxSelect from "../../components/ComboboxSelect.jsx";
import ActivityBox from "../../components/ActivityBox.jsx";

const AddOrden = ({ payload, setOpen }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [data, setData] = useState({});

  const [fechaInicio, setfechaInicio] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");

  const [comboTrabajador, setComboTrabajador] = useState(null);
  const [comboSolicitud, setComboSolicitud] = useState(null);

  const [saveAlert, setSaveAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [errorAlert1, setErrorAlert1] = useState(false);

  const [duracion, setDuracion] = useState(0);
  const [actividades, setActividades] = useState([]);

  const [change, setChange] = useState(false);

  const navigate = useNavigate();

  const timeWait = 1500;

  useEffect(() => {
    setOpen(false);
    setData(payload);
  }, [payload, setOpen]);

  useEffect(() => {
    setChange(!change);
  }, [actividades, change, comboTrabajador, comboSolicitud]);

  return (
    <Box m="20px">
      <Header
        title="Crear nueva Orden de Mantenimiento"
        subtitle="Formulario para crear nueva Orden de Mantenimiento"
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
        {/* Formulario Orden de mantenimeinto */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography color={colors.greenAccent[500]} variant="h3">
              Orden de Mantenimiento
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Formik
              onSubmit={async (values) => {
                const data = {
                  descripcion: values.descripcion,
                  id_trabajadores: comboTrabajador.value,
                  estado: false,
                  inicio_ordenes: new Date(fechaInicio).toISOString(),
                  fin_ordenes: new Date(fechaFinal).toISOString(),
                  id_solicitudes: comboSolicitud,
                  actividades: actividades,
                  duracion: duracion,
                };

                console.log(data);
              }}
              initialValues={initialValues}
              validationSchema={checkoutSchema}
            >
              {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
              }) => {
                return (
                  <Box component="form" noValidate onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                      {/* Combobox Trabajador*/}
                      <Grid item xs={12}>
                        {data.token ? (
                          <ComboboxSelect
                            token={data.token}
                            url={"/m_trabajadores/combobox/"}
                            setComboValue={setComboTrabajador}
                            titulo={"Seleccione al encargado"}
                          />
                        ) : null}
                      </Grid>

                      {/* Descripcion*/}
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          type="text"
                          label="Descripcion de la Orden de Mantenimiento"
                          multiline
                          rows={5}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.descripcion}
                          name="descripcion"
                          error={!!touched.descripcion && !!errors.descripcion}
                          helperText={touched.descripcion && errors.descripcion}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        {data.token && (
                          <ActivityBox
                            colors={colors}
                            token={data.token}
                            setOpen={setOpen}
                            setActividades={setActividades}
                            setDuracion={setDuracion}
                            setChangeUp={setChange}
                          />
                        )}
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="h5">
                          Modifique la Fecha y hora del{" "}
                          <strong>Inicio y Fin </strong> de la Orden de
                          Mantenimiento
                        </Typography>
                        <br />
                        <TextField
                          fullWidth
                          variant="outlined"
                          type="datetime-local"
                          onChange={(event) => {
                            const fecha = event.target.value;
                            setfechaInicio(fecha);

                            const fechaOpen = new Date(fecha);
                            const fechaModificada = new Date(
                              fechaOpen.getTime() +
                                duracion * 60000 -
                                5 * 60 * 60000
                            );

                            const fechaF = fechaModificada
                              .toISOString()
                              .slice(0, 16);
                            setFechaFinal(fechaF);
                          }}
                          value={fechaInicio}
                          name="fechaInicio"
                          sx={{ width: "45%", marginLeft: "2.5%" }}
                          label="Fin de Pronosticada del Mantenimiento"
                        />
                        <TextField
                          fullWidth
                          variant="outlined"
                          type="datetime-local"
                          onClick={(event) => {
                            event.preventDefault();
                          }}
                          value={fechaFinal}
                          name="fechaFinal"
                          sx={{ width: "45%", marginLeft: "5%" }}
                          label="Fin de Pronosticada del Mantenimiento"
                        />
                      </Grid>

                      {/* Combobox Solicitud*/}
                      <Grid item xs={12}>
                        {data.token ? (
                          <ComboboxSelect
                            token={data.token}
                            url={"/m_solicitudes/combobox/"}
                            setComboValue={setComboSolicitud}
                            titulo={
                              "Seleccione la Solicitud de Mantenimiento para el Seguimiento (Opcional)"
                            }
                          />
                        ) : null}
                      </Grid>

                      <Grid item xs={3} />
                      <Grid item xs={6}>
                        <Button
                          fullWidth
                          type="submit"
                          color="success"
                          variant="contained"
                        >
                          Generar Orden de Mantenimiento
                        </Button>
                      </Grid>
                      <Grid item xs={3} />
                    </Grid>
                  </Box>
                );
              }}
            </Formik>
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
          Error al Enviar —{" "}
          <strong>
            Para enviar la solicitud es necesario rellenar todos los datos a
            excepcion de las variables
          </strong>
        </Alert>
      </Dialog>
      <Dialog
        open={errorAlert1}
        onClose={() => {
          setErrorAlert1(false);
        }}
      >
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          Error al Enviar — <strong>Envie de nuevo la actividad</strong>
        </Alert>
      </Dialog>
      <Dialog
        open={saveAlert}
        onClose={() => {
          setSaveAlert(false);
        }}
      >
        <Alert severity="success">
          <AlertTitle>Guardado</AlertTitle>
          La Actividad fue registrada
          <strong>Se le redireccionara a la lista de actividades</strong>
        </Alert>
      </Dialog>
    </Box>
  );
};

export default AddOrden;

const checkoutSchema = yup.object().shape({
  descripcion: yup.string().required("La descripcion es necesaria"),
});
const initialValues = {
  descripcion: "",
};
