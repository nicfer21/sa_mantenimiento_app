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
  Autocomplete,
} from "@mui/material";
import { tokens } from "../../theme.js";
import Header from "../../components/Header.jsx";
import KeyValueBox from "../../components/KeyValueBox.jsx";

import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";

//Icons
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { postApi } from "../../tools/mantenimiento-api.js";
import ComboboxSelect from "../../components/ComboboxSelect.jsx";

const AddActividad = ({ payload, setOpen }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [data, setData] = useState({});

  const [comboTipo, setComboTipo] = useState(null);
  const [comboPrioridad, setComboPrioridad] = useState(null);
  const [comboPartes, setComboPartes] = useState(null);
  const [rows, setRows] = useState({});

  const [saveAlert, setSaveAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [errorAlert1, setErrorAlert1] = useState(false);

  const navigate = useNavigate();

  const timeWait = 1500;

  const tipo = [
    {
      value: "1",
      label: "Mantenimiento correctivo",
    },
    {
      value: "2",
      label: "Mantenimiento preventivo con base en el tiempo",
    },
    {
      value: "3",
      label: "Mantenimiento preventivo con base en el uso",
    },
    {
      value: "4",
      label: "Mantenimiento predictivo",
    },
    {
      value: "5",
      label: "Mantenimiento de oportunidad",
    },
    {
      value: "6",
      label: "Detección de fallas",
    },
    {
      value: "7",
      label: "Modificación del diseño",
    },
    {
      value: "8",
      label: "Reparación General",
    },
    {
      value: "9",
      label: "Reemplazo",
    },
  ];

  const prioridad = [
    {
      value: "1",
      label: "Emergencia",
    },
    {
      value: "2",
      label: "Urgencia",
    },
    {
      value: "3",
      label: "Normal",
    },
    {
      value: "4",
      label: "Programada",
    },
  ];

  const handleTipoComboboxChange = (event, newValue) => {
    setComboTipo(newValue);
  };
  const handlePrioridadComboboxChange = (event, newValue) => {
    setComboPrioridad(newValue);
  };

  useEffect(() => {
    setOpen(false);
    setData(payload);
  }, [payload, setOpen]);

  return (
    <Box m="20px">
      <Header
        title="Crear nueva Actividad de Mantenimiento"
        subtitle="Formulario para crear nueva Actividad de Mantenimiento"
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
              Solicitud de mantenimiento
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Formik
              onSubmit={async (values) => {
                if (
                  comboPartes != null &&
                  comboPrioridad != null &&
                  ComboboxSelect != null
                ) {
                  const dataForm = {
                    titulo: values.titulo,
                    id_partes: comboPartes.value,
                    tipo: comboTipo.value,
                    prioridad: comboPrioridad.value,
                    duracion: values.duracion,
                    procedimiento: values.procedimiento,
                    variables: rows,
                  };

                  setOpen(true);
                  const rs = await postApi(
                    "/m_actividades/",
                    dataForm,
                    data.token
                  );
                  await new Promise((resolve) => setTimeout(resolve, timeWait));
                  setOpen(false);
                  if (rs.messege === 1) {
                    setSaveAlert(true);
                    await new Promise((resolve) =>
                      setTimeout(resolve, timeWait)
                    );
                    navigate("/app/maintenance/activity/show/");
                  } else {
                    setErrorAlert1(true);
                  }
                } else {
                  setErrorAlert(true);
                }
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
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          type="text"
                          label="Titulo de la Actividad"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.titulo}
                          name="titulo"
                          error={!!touched.titulo && !!errors.titulo}
                          helperText={touched.titulo && errors.titulo}
                        />
                      </Grid>

                      {/* Combobox partes */}
                      <Grid item xs={12}>
                        {data.token ? (
                          <ComboboxSelect
                            token={data.token}
                            url={"/e_partes/combobox/"}
                            setComboValue={setComboPartes}
                            titulo={"Seleccione la Parte correspondiente"}
                          />
                        ) : null}
                      </Grid>

                      {/* Tipo de mantenimiento */}
                      <Grid item xs={12}>
                        <Autocomplete
                          id="tipo"
                          options={tipo}
                          getOptionLabel={(option) => option.label}
                          value={comboTipo}
                          onChange={handleTipoComboboxChange}
                          isOptionEqualToValue={(option, value) =>
                            option.value === value.value
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Tipo de Mantenimiento"
                            />
                          )}
                        />
                      </Grid>

                      {/* Prioridad de Mantenimiento */}
                      <Grid item xs={12}>
                        <Autocomplete
                          id="tipo"
                          options={prioridad}
                          getOptionLabel={(option) => option.label}
                          value={comboPrioridad}
                          onChange={handlePrioridadComboboxChange}
                          isOptionEqualToValue={(option, value) =>
                            option.value === value.value
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Prioridad de Mantenimiento"
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          type="number"
                          label="Duracion aproximada en minutos de la Actividad"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.duracion}
                          name="duracion"
                          error={!!touched.duracion && !!errors.duracion}
                          helperText={touched.duracion && errors.duracion}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          type="text"
                          multiline
                          rows={5}
                          label="Descripcion del procedimiento"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.procedimiento}
                          name="procedimiento"
                          error={
                            !!touched.procedimiento && !!errors.procedimiento
                          }
                          helperText={
                            touched.procedimiento && errors.procedimiento
                          }
                        />
                      </Grid>

                      {/* Informacion extra */}
                      <Grid item xs={12}>
                        <KeyValueBox
                          dataRow={rows}
                          setDataRow={setRows}
                          colors={colors}
                          subtitulo="Agregar Variables de Seguimiento (Opcional)"
                          nombreLlave="Nombre de la Variable"
                          nombreValor="Descripcion de la Variable"
                          labelBoton="Agregar Variable"
                        />
                      </Grid>

                      <Grid item xs={3} />
                      <Grid item xs={6}>
                        <Button
                          fullWidth
                          type="submit"
                          color="success"
                          variant="contained"
                        >
                          Enviar Solicitud de mantenimiento
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

export default AddActividad;

const checkoutSchema = yup.object().shape({
  titulo: yup.string().required("El titulo es obligatorio"),
  procedimiento: yup.string().required("El procedimiento es obligatorio"),
  duracion: yup
    .number()
    .required(
      "Es necesario determinar la duracion de la Actividad de Mantenimiento"
    ),
});
const initialValues = {
  titulo: "",
  procedimiento: "",
  duracion: "",
};
