/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import {
  Box,
  useTheme,
  Grid,
  TextField,
  Button,
  Alert,
  AlertTitle,
  Dialog,
} from "@mui/material";
import Header from "../../components/Header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../../theme";
import { useEffect, useState } from "react";
import { getApi, putApi } from "../../tools/mantenimiento-api";
import { getLocalDate } from "../../tools/extra";
import { Formik } from "formik";
import * as yup from "yup";
import md5 from "md5";

import { ExtraRowPerfil, RowPerfil } from "../../components/GridRowText.jsx";

const PerfilScene = ({ payload, setOpen }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [data, setData] = useState({});
  const [perfilData, setPerfilData] = useState({});
  const [usuarioData, setUsuarioData] = useState({});

  const [saveAlert, setSaveAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);

  const [reload, setReload] = useState(false);

  const handleFormSubmit = async (values) => {
    setOpen(true);
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
    const rs = await putApi(
      "/c_usuarios/" + usuarioData.id_usuarios,
      {
        acceso: md5(values.password1),
      },
      data.token
    );
    setOpen(false);
    if (rs.messege) {
      setSaveAlert(true);
      setReload(!reload);
    } else {
      setErrorAlert(true);
    }
  };

  useEffect(() => {
    setData(payload);
    setOpen(false);
  }, [payload, reload]);

  useEffect(() => {
    const getData = async () => {
      setOpen(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const rs = await getApi(
        "/m_trabajadores/" + data.id_trabajadores,
        data.token
      );
      setPerfilData(rs);
      setOpen(false);
    };
    getData();
  }, [data, reload]);

  useEffect(() => {
    const getData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const rs = await getApi("/c_usuarios/" + data.id_usuarios, data.token);
      setUsuarioData(rs);
    };
    getData();
  }, [data, reload]);

  return (
    <Box m="20px">
      <Header
        title="MI PERFIL"
        subtitle="Datos del trabajador y de la cuenta"
      />

      {/* Informaciond del trabajador */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h3">
            Informacion del Perfil
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <RowPerfil
                titulo={"ID Trabajador"}
                valor={perfilData.id_trabajadores}
              />
              <RowPerfil titulo={"Nombre"} valor={perfilData.nombre} />
              <RowPerfil titulo={"cargo"} valor={perfilData.cargo} />
              <RowPerfil titulo={"d.n.i."} valor={perfilData.dni} />
              <RowPerfil
                titulo={"fecha decreacion"}
                valor={getLocalDate(perfilData.createdAt)}
              />
              <RowPerfil
                titulo={"fecha actualizacion"}
                valor={getLocalDate(perfilData.updatedAt)}
              />

              <ExtraRowPerfil titulo={"Datos extra"} info={perfilData.info} />
            </Grid>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Informaciond de la cuenta */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h3">
            Informacion de la Cuenta
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <RowPerfil
                titulo={"ID Usuario"}
                valor={usuarioData.id_usuarios}
              />
              <RowPerfil titulo={"Correo"} valor={usuarioData.correo} />
              <RowPerfil titulo={"Nivel de acceso"} valor={usuarioData.nivel} />
              <RowPerfil
                titulo={"fecha decreacion"}
                valor={getLocalDate(usuarioData.createdAt)}
              />
              <RowPerfil
                titulo={"fecha actualizacion"}
                valor={getLocalDate(usuarioData.updatedAt)}
              />
            </Grid>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Cambio de contraseña */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h3">
            Cambio de contraseña
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Formik
            onSubmit={async (values, { resetForm }) => {
              await handleFormSubmit(values);
              resetForm();
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
                <Box
                  component="form"
                  noValidate
                  onSubmit={handleSubmit}
                  sx={{ mt: 1, width: "500px" }}
                >
                  <TextField
                    fullWidth
                    variant="filled"
                    type="password"
                    label="Escriba la nueva contraseña"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password1}
                    name="password1"
                    error={!!touched.password1 && !!errors.password1}
                    helperText={touched.password1 && errors.password1}
                    sx={{ m: "10px" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="password"
                    label="Escriba de nuevo la nueva contraseña"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password2}
                    name="password2"
                    error={!!touched.password2 && !!errors.password2}
                    helperText={touched.password2 && errors.password2}
                    sx={{ m: "10px" }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ m: "10px" }}
                  >
                    Ingresar
                  </Button>
                </Box>
              );
            }}
          </Formik>
        </AccordionDetails>
      </Accordion>

      <Dialog
        open={errorAlert}
        onClose={() => {
          setErrorAlert(false);
        }}
      >
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          Error al actualizar —{" "}
          <strong>Verifique que las contraseñas sean identicas</strong>
        </Alert>
      </Dialog>
      <Dialog
        open={saveAlert}
        onClose={() => {
          setSaveAlert(false);
        }}
      >
        <Alert severity="success">
          <AlertTitle>Actualizado</AlertTitle>
          Las contraseñas fueron actualizadas —{" "}
          <strong>Se le recomienda cerrar sesion e ingresar de nuevo</strong>
        </Alert>
      </Dialog>
    </Box>
  );
};

export default PerfilScene;

const checkoutSchema = yup.object().shape({
  password1: yup
    .string()
    .required("Complete el codigo de usuario")
    .min(8, "La contraseña debe tener minimo 8 caracteres"),
  password2: yup
    .string()
    .required("Complete su contraseña")
    .oneOf([yup.ref("password1"), null], "Las contraseñas deben coincidir"),
});
const initialValues = {
  password1: "",
  password2: "",
};
