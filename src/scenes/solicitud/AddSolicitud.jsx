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
import { getApi, postApi, postApiFile } from "../../tools/mantenimiento-api.js";
import ComboboxSelect from "../../components/ComboboxSelect.jsx";

const AddSolicitud = ({ payload, setOpen }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [data, setData] = useState({});

  const [comboValue, setComboValue] = useState(null);

  const [saveAlert, setSaveAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [errorAlert1, setErrorAlert1] = useState(false);

  const [rows, setRows] = useState({});

  const navigate = useNavigate();

  const timeWait = 1500;

  const [image, setImage] = useState(null);

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  useEffect(() => {
    setOpen(false);
    setData(payload);
  }, [payload, setOpen]);

  return (
    <Box m="20px">
      <Header
        title="Crear nueva solicitud"
        subtitle="Formulario para redactar nueva solicitud"
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
                if (image != null && comboValue != null) {
                  const formData = new FormData();
                  setOpen(true);

                  const isoDate = new Date(values.fecha).toISOString();

                  formData.append("asunto", values.asunto);
                  formData.append("descripcion", values.descripcion);
                  formData.append("file", image);
                  formData.append("info", JSON.stringify(rows));
                  formData.append("id_trabajadores", data.id_trabajadores);
                  formData.append("id_unidades", comboValue.value);
                  formData.append("fecha", isoDate);

                  const rs = await postApiFile(
                    "/m_solicitudes/",
                    formData,
                    data.token
                  );

                  await new Promise((resolve) => setTimeout(resolve, timeWait));
                  setOpen(false);
                  rs.messege === 1;
                  if (rs.messege === 1) {
                    setSaveAlert(true);
                    await new Promise((resolve) =>
                      setTimeout(resolve, timeWait)
                    );
                    navigate("/app/maintenance/request/show/");
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
                          label="Asunto de la Solicitud"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.asunto}
                          name="asunto"
                          error={!!touched.asunto && !!errors.asunto}
                          helperText={touched.asunto && errors.asunto}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        {data.token ? (
                          <ComboboxSelect
                            token={data.token}
                            url={"/e_unidades/combobox/"}
                            setComboValue={setComboValue}
                          />
                        ) : null}
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          type="text"
                          multiline
                          rows={5}
                          label="Descripcion de la solicitud"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.descripcion}
                          name="descripcion"
                          error={!!touched.descripcion && !!errors.descripcion}
                          helperText={touched.descripcion && errors.descripcion}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="h5">
                          Fecha y hora de la Inspeccion o Descubrimiento
                        </Typography>
                        <br />
                        <TextField
                          fullWidth
                          variant="outlined"
                          type="datetime-local"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.fecha}
                          name="fecha"
                          error={!!touched.fecha && !!errors.fecha}
                          helperText={touched.fecha && errors.fecha}
                        />
                      </Grid>

                      {/* Informacion extra */}
                      <Grid item xs={12}>
                        <KeyValueBox
                          dataRow={rows}
                          setDataRow={setRows}
                          colors={colors}
                        />
                      </Grid>

                      {/* Para Subir imagen */}
                      <Grid item xs={4}>
                        <Typography variant="h5">
                          Seleccione la Evidencia para la Solicitud
                        </Typography>
                        <br />
                        <input
                          type="file"
                          accept="image/jpeg, image/png"
                          onChange={onImageChange}
                          className="filetype"
                        />
                      </Grid>
                      <Grid
                        item
                        xs={8}
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Box
                          sx={{
                            width: "500px",
                            height: "400px",
                            border: "1px solid black",
                            borderRadius: "20px",
                          }}
                        >
                          {image ? (
                            <img
                              alt="Evidencia"
                              src={URL.createObjectURL(image)}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                              }}
                            />
                          ) : null}
                        </Box>
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
            Para enviar la solicitud es necesario rellenar todos los datos
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
          Error al Enviar — <strong>Envie de nuevo la solicitud</strong>
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
          El trabajador fue registrado
          <strong>Se le redireccionara a la lista de trabajadores</strong>
        </Alert>
      </Dialog>
    </Box>
  );
};

export default AddSolicitud;

const checkoutSchema = yup.object().shape({
  asunto: yup.string().required("El asunto es obligatorio"),
  descripcion: yup.string().required("La descripcion es obligatoria"),
  fecha: yup.date().required("La Fecha y Hora son necesarios"),
});
const initialValues = {
  asunto: "",
  descripcion: "",
  fecha: "",
};
