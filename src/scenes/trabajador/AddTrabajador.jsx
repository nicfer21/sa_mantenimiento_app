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

import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import md5 from "md5";

//Icons
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { postApi } from "../../tools/mantenimiento-api.js";

const WorkerAdd = ({ payload, setOpen }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [data, setData] = useState({});
  const [saveAlert, setSaveAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [rows, setRows] = useState({});

  const navigate = useNavigate();

  const handleFormSubmit = async (values) => {
    setOpen(true);
    const dataValues = {
      acceso: md5(values.acceso),
      cargo: values.cargo,
      correo: values.correo,
      dni: values.dni,
      nivel: values.nivel,
      nombre: values.nombre,
      info: rows,
    };

    const rs = await postApi("/c_usuarios/worker/", dataValues, data.token);
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

  const currencies = [
    {
      value: "1",
      label: "Administrador",
    },
    {
      value: "2",
      label: "Supervisor",
    },
    {
      value: "3",
      label: "Ejecutor",
    },
  ];

  useEffect(() => {
    setOpen(false);
    setData(payload);
  }, [payload]);

  return (
    <Box m="20px">
      <Header
        title="Agregar nuevos Trabajadores"
        subtitle="Formulario para ingresar nuevos trabajadores"
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
            <Formik
              onSubmit={(values) => {
                handleFormSubmit(values);
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
                      <Grid item xs={7}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          type="text"
                          label="DNI del trabajador"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.dni}
                          name="dni"
                          error={!!touched.dni && !!errors.dni}
                          helperText={touched.dni && errors.dni}
                        />
                      </Grid>
                      <Grid item xs={7}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          type="text"
                          label="Nombre del trabajador"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.nombre}
                          name="nombre"
                          error={!!touched.nombre && !!errors.nombre}
                          helperText={touched.nombre && errors.nombre}
                        />
                      </Grid>
                      <Grid item xs={7}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          type="text"
                          label="Cargo del trabajador"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.cargo}
                          name="cargo"
                          error={!!touched.cargo && !!errors.cargo}
                          helperText={touched.cargo && errors.cargo}
                        />
                      </Grid>
                      <Grid item xs={7}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          type="email"
                          label="Correo del trabajador"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.correo}
                          name="correo"
                          error={!!touched.correo && !!errors.correo}
                          helperText={touched.correo && errors.correo}
                        />
                      </Grid>
                      <Grid item xs={7}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          type="password"
                          label="Contraseña del trabajador"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.acceso}
                          name="acceso"
                          error={!!touched.acceso && !!errors.acceso}
                          helperText={touched.acceso && errors.acceso}
                        />
                      </Grid>
                      <Grid item xs={7}>
                        <TextField
                          fullWidth
                          id="outlined-select-currency"
                          select
                          label="Nivel del acceso del trabajador"
                          defaultValue="3"
                        >
                          {currencies.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={12}>
                        <KeyValueBox
                          dataRow={rows}
                          setDataRow={setRows}
                          colors={colors}
                        />
                      </Grid>
                      <Grid item xs={7}>
                        <Button
                          fullWidth
                          type="submit"
                          color="success"
                          variant="contained"
                        >
                          Agregar nuevo Trabajador
                        </Button>
                      </Grid>
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
          Error al guardar —{" "}
          <strong>Compruebe que el DNI sea diferente a los registrados</strong>
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

export default WorkerAdd;

const checkoutSchema = yup.object().shape({
  dni: yup
    .string()
    .matches(/^\d{8}$/, "El D.N.I. debe tener exactamente 8 dígitos")
    .required("El D.N.I. es obligatorio"),
  nombre: yup.string().required("El nombre del trabajador es necesario"),
  cargo: yup.string().required("Es necesario poner el cargo del trabajador"),
  acceso: yup
    .string()
    .required("Es necesario completar la contraseña")
    .min(8, "La contraseña debe tener minimo 8 caracteres"),
  correo: yup
    .string()
    .email("El formato del correo es invalido")
    .required("El correo es obligatorio"),
  nivel: yup.string().required("Es necesario elegir un nivel"),
});
const initialValues = {
  dni: "",
  nombre: "",
  cargo: "",
  acceso: "",
  correo: "",
  nivel: "3",
};
