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
  Skeleton,
} from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { useEffect, useState } from "react";
import { getApi, putApi } from "../../tools/mantenimiento-api";
import { getLocalDate } from "../../tools/extra";
import { clearSession, deleteCookie } from "../../tools/cookies.js";
import { Formik } from "formik";
import * as yup from "yup";
import md5 from "md5";
import { ExtraRowPerfil, RowPerfil } from "../../components/GridRowText.jsx";
import { useNavigate } from "react-router-dom";

//Icons
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const PerfilScene = ({ payload, setOpen }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [data, setData] = useState({});
  const [perfilData, setPerfilData] = useState({});
  const [usuarioData, setUsuarioData] = useState({});

  const [saveAlert, setSaveAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const navigate = useNavigate();

  const [reload, setReload] = useState(false);

  const timeWait = 1250;

  const handleFormSubmit = async (values) => {
    setOpen(true);
    await new Promise((resolve) => {
      setTimeout(resolve, timeWait);
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
      await new Promise((resolve) => setTimeout(resolve, timeWait));
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
      await new Promise((resolve) => setTimeout(resolve, timeWait));
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

      <Box
        m="10px 0 0 0"
        height="100%"
        p="15px"
        borderRadius={3}
        bgcolor={colors.primary[900]}
      >
        {/* Informaciond del trabajador */}
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ borderBottom: `3px solid ${colors.primary[900]}` }}
          >
            <Typography color={colors.greenAccent[500]} variant="h3">
              Informacion del Perfil
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
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
                <RowPerfil
                  titulo={"cargo"}
                  valor={
                    perfilData.cargo ? (
                      perfilData.cargo
                    ) : (
                      <Skeleton animation={"wave"} width={"250px"} />
                    )
                  }
                />
                <RowPerfil
                  titulo={"d.n.i."}
                  valor={
                    perfilData.dni ? (
                      perfilData.dni
                    ) : (
                      <Skeleton animation={"wave"} width={"250px"} />
                    )
                  }
                />
                <RowPerfil
                  titulo={"fecha decreacion"}
                  valor={
                    perfilData.createdAt ? (
                      getLocalDate(perfilData.createdAt)
                    ) : (
                      <Skeleton animation={"wave"} width={"250px"} />
                    )
                  }
                />
                <RowPerfil
                  titulo={"fecha actualizacion"}
                  valor={
                    perfilData.updatedAt ? (
                      getLocalDate(perfilData.updatedAt)
                    ) : (
                      <Skeleton animation={"wave"} width={"250px"} />
                    )
                  }
                />

                <ExtraRowPerfil titulo={"Datos extra"} info={perfilData.info} />
              </Grid>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Informaciond de la cuenta */}
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ borderBottom: `3px solid ${colors.primary[900]}` }}
          >
            <Typography color={colors.greenAccent[500]} variant="h3">
              Informacion de la Cuenta
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                <RowPerfil
                  titulo={"ID Usuario"}
                  valor={
                    usuarioData.id_usuarios ? (
                      usuarioData.id_usuarios
                    ) : (
                      <Skeleton animation={"wave"} width={"250px"} />
                    )
                  }
                />
                <RowPerfil
                  titulo={"Correo"}
                  valor={
                    usuarioData.correo ? (
                      usuarioData.correo
                    ) : (
                      <Skeleton animation={"wave"} width={"250px"} />
                    )
                  }
                />
                <RowPerfil
                  titulo={"Nivel de acceso"}
                  valor={
                    usuarioData.nivel ? (
                      usuarioData.nivel === 1 ? (
                        "Admin"
                      ) : usuarioData.nivel === 2 ? (
                        "Supervisor"
                      ) : (
                        "Ejecutor"
                      )
                    ) : (
                      <Skeleton animation={"wave"} width={"250px"} />
                    )
                  }
                />
                <RowPerfil
                  titulo={"fecha decreacion"}
                  valor={
                    usuarioData.createdAt ? (
                      getLocalDate(usuarioData.createdAt)
                    ) : (
                      <Skeleton animation={"wave"} width={"250px"} />
                    )
                  }
                />
                <RowPerfil
                  titulo={"fecha actualizacion"}
                  valor={
                    usuarioData.updatedAt ? (
                      getLocalDate(usuarioData.updatedAt)
                    ) : (
                      <Skeleton animation={"wave"} width={"250px"} />
                    )
                  }
                />
              </Grid>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Cambio de contraseña */}
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ borderBottom: `3px solid ${colors.primary[900]}` }}
          >
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
                      fullWidth
                      type="submit"
                      color="warning"
                      variant="contained"
                      sx={{ m: "10px" }}
                    >
                      Cambiar de contraseña
                    </Button>
                  </Box>
                );
              }}
            </Formik>
          </AccordionDetails>
        </Accordion>

        {/* Boton para cerrar sesion */}
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ borderBottom: `3px solid ${colors.primary[900]}` }}
          >
            <Typography color={colors.greenAccent[500]} variant="h3">
              Opciones
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ flexGrow: 1, m: 1, width: "250px" }}>
              <Button
                fullWidth
                variant="contained"
                color="error"
                onClick={() => {
                  deleteCookie();
                  clearSession();
                  navigate("/");
                }}
              >
                Cerras Sesion
              </Button>
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
