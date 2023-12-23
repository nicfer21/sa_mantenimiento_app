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
import { getApi, postApi } from "../../tools/mantenimiento-api.js";
import ComboboxSelect from "../../components/ComboboxSelect.jsx";
import ReportActivityBox from "../../components/ReportActivityBox.jsx";

const AddReporte = ({ payload, setOpen }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [data, setData] = useState({});

  const [disableComboOrden, setDisableComboOrden] = useState(false);
  const [dataOrden, setDataOrden] = useState([]);

  const [dataEstado, setDataEstado] = useState([]);
  const [dataVariable, setDataVariable] = useState([]);

  const [comboOrden, setComboOrden] = useState(null);
  const [bloquearBusqueda, setBloquearBusqueda] = useState(false);

  const [saveAlert, setSaveAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [errorAlert1, setErrorAlert1] = useState(false);

  const navigate = useNavigate();

  const timeWait = 1000;

  useEffect(() => {
    setOpen(false);
    setData(payload);
  }, [payload]);

  useEffect(() => {
    const getData = async () => {
      if (comboOrden != null) {
        setOpen(true);
        const rs = await getApi(
          `/m_ordenes/oneforreport/${comboOrden.value}`,
          data.token
        );
        await new Promise((resolve) => setTimeout(resolve, timeWait));
        setDataOrden(rs);
        setOpen(false);
      }
    };
    getData();
  }, [payload, disableComboOrden]);

  return (
    <Box m="20px">
      <Header
        title="Crear nuevo Reporte de Mantenimiento"
        subtitle="Formulario para crear nueva Reporte de Mantenimiento"
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
              Reporte de Mantenimiento
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Formik
              onSubmit={async (values) => {
                setOpen(true);

                const prueba = dataEstado.some((row) => row === true);
                await new Promise((resolve) => setTimeout(resolve, timeWait));
                if (prueba) {
                  const duracion =
                    (new Date(values.fin_reportes).getTime() -
                      new Date(values.inicio_reportes).getTime()) /
                    (1000 * 60);

                  const dataForm = {
                    inicio_reportes: new Date(
                      values.inicio_reportes
                    ).toISOString(),
                    fin_reportes: new Date(values.fin_reportes).toISOString(),
                    descripcion: values.descripcion,
                    id_ordenes: comboOrden.value,
                    dataVariable: dataVariable,
                    dataEstado: dataEstado,
                    duracion: duracion,
                  };

                  const rs = await postApi(
                    "/m_reportes/",
                    dataForm,
                    data.token
                  );

                  if (rs.messege) {
                    setOpen(false);
                    setSaveAlert(true);
                    await new Promise((resolve) =>
                      setTimeout(resolve, timeWait * 2)
                    );
                    navigate("/app/maintenance/order/show/");
                  } else {
                    setOpen(false);
                    setErrorAlert1(true);
                  }
                } else {
                  setOpen(false);
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
                      {/* Combobox Trabajador*/}
                      <Grid item xs={10}>
                        {data.token ? (
                          <ComboboxSelect
                            token={data.token}
                            url={`/m_ordenes/combobox/${data.id_trabajadores}`}
                            setComboValue={setComboOrden}
                            titulo={"Seleccione la Orden de Mantenimiento"}
                            disabled={disableComboOrden}
                          />
                        ) : null}
                      </Grid>
                      <Grid item xs={2}>
                        <Button
                          fullWidth
                          type="button"
                          color="info"
                          variant="contained"
                          disabled={disableComboOrden}
                          onClick={() => {
                            if (comboOrden != null) {
                              setDisableComboOrden((prev) => !prev);
                              setBloquearBusqueda((prev) => !prev);
                            }
                          }}
                        >
                          Buscar Orden de Trabajo
                        </Button>
                      </Grid>

                      {bloquearBusqueda ? (
                        <>
                          {/* Inicio*/}
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              variant="outlined"
                              type="datetime-local"
                              label="Inicio del Mantenimiento"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.inicio_reportes}
                              name="inicio_reportes"
                              error={
                                !!touched.inicio_reportes &&
                                !!errors.inicio_reportes
                              }
                              helperText={
                                touched.inicio_reportes &&
                                errors.inicio_reportes
                              }
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              variant="outlined"
                              type="datetime-local"
                              label="Fin del Mantenimiento"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.fin_reportes}
                              name="fin_reportes"
                              error={
                                !!touched.fin_reportes && !!errors.fin_reportes
                              }
                              helperText={
                                touched.fin_reportes && errors.fin_reportes
                              }
                            />
                          </Grid>

                          {/* Actividades */}
                          <Grid xs={12}>
                            {dataOrden[0] != undefined ? (
                              <ReportActivityBox
                                data={dataOrden}
                                setEstado={setDataEstado}
                                setVariable={setDataVariable}
                              />
                            ) : null}
                          </Grid>

                          {/* Descripcion*/}
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              variant="outlined"
                              type="text"
                              label="Descripcion del Reporte de Mantenimiento"
                              multiline
                              rows={5}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.descripcion}
                              name="descripcion"
                              error={
                                !!touched.descripcion && !!errors.descripcion
                              }
                              helperText={
                                touched.descripcion && errors.descripcion
                              }
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
                              Generar Reporte de Mantenimiento
                            </Button>
                          </Grid>
                          <Grid item xs={3} />
                        </>
                      ) : null}
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
            Para enviar el Reporte es necesario rellenar todos los datos a
            excepcion de los Opcionales
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
          Error al Enviar — <strong>Envie de nuevo el Reporte</strong>
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
          El Reporte fue registrao
          <strong> Se le redireccionara a la lista de Ordenes</strong>
        </Alert>
      </Dialog>
    </Box>
  );
};

export default AddReporte;

const checkoutSchema = yup.object().shape({
  descripcion: yup.string().required("La descripcion del Reporte es necesaria"),
  inicio_reportes: yup.date().required("Marque la fecha y hora de Inicio"),
  fin_reportes: yup
    .date()
    .required("Marque la fecha y hora de termino")
    .test(
      "fecha-mayor",
      "La fecha de Fin debe ser mayor a la fecha de Inicio",
      function (value) {
        const inicio_reportes = this.parent.inicio_reportes;
        return inicio_reportes && value && inicio_reportes < value;
      }
    ),
});
const initialValues = {
  descripcion: "",
  inicio_reportes: "",
  fin_reportes: "",
};
