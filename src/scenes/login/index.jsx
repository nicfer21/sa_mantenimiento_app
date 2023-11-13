/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import {
  Divider,
  Avatar,
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Paper,
  Box,
  Grid,
  Dialog,
  Alert,
  AlertTitle,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import { ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as yup from "yup";
import { ColorModeContext, useMode } from "../../theme.js";
import { postApi } from "../../tools/mantenimiento-api.js";
import {
  getCookie,
  getSession,
  setCookie,
  setSession,
} from "../../tools/cookies.js";
import md5 from "md5";

import { useState } from "react";
import { useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();
  const [theme, colorMode] = useMode();
  const [open, setOpen] = useState(false);
  const [remember, setRemember] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);

  const handleFormSubmit = async (values) => {
    //Inicia la carga
    setOpen(true);
    const data = {
      username: values.username,
      password: md5(values.password),
    };
    //Envia la peticion
    const { messege, token } = await postApi("/login", data);
    //Recive la peticion en caso que haya un timeout se cancela y termina por default en 5s despues de 2s mas se termina
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setOpen(false);

    if (messege) {
      //Crear la session
      setSession(token);
      //Crear la cookie si es necesario
      remember ? setCookie(token) : null;
      await new Promise((resolve) => setTimeout(resolve, 200));
      navigate("/app/");
    } else {
      setErrorAlert(true);
    }
  };

  useEffect(() => {
    if (getCookie() !== null || getSession() !== null) {
      navigate("/app/");
    }
  }, []);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <Grid container component="main" sx={{ height: "100vh" }}>
          <CssBaseline />
          <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              backgroundImage: "url(/public/login2.png)",
              backgroundRepeat: "no-repeat",
              backgroundColor: (t) =>
                t.palette.mode === "light"
                  ? t.palette.grey[50]
                  : t.palette.grey[900],
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <Grid
            item
            xs={12}
            sm={8}
            md={5}
            component={Paper}
            elevation={6}
            square
          >
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography component="h1" variant="h1">
                SERVICENTRO AVILA
                <Divider />
              </Typography>
              <Typography component="h1" variant="h2">
                MANTENIMIENTO APP
                <Divider />
              </Typography>
              <Avatar sx={{ m: 4, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Inicio de Sesión
              </Typography>
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
                      sx={{ mt: 1 }}
                    >
                      <TextField
                        fullWidth
                        variant="standard"
                        type="text"
                        label="Codigo de usuario"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.username}
                        name="username"
                        error={!!touched.username && !!errors.username}
                        helperText={touched.username && errors.username}
                        sx={{ mt: "10px" }}
                      />
                      <TextField
                        fullWidth
                        variant="standard"
                        type="password"
                        label="Contraseña"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.password}
                        name="password"
                        error={!!touched.password && !!errors.password}
                        helperText={touched.password && errors.password}
                        sx={{ mt: "10px", mb: "10px" }}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="remember"
                            color="primary"
                            onChange={() => {
                              setRemember(!remember);
                            }}
                          />
                        }
                        label="Recordarme"
                      />
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                      >
                        Ingresar
                      </Button>
                    </Box>
                  );
                }}
              </Formik>
            </Box>
          </Grid>
        </Grid>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
        >
          <CircularProgress color="inherit" />
        </Backdrop>

        <Dialog
          open={errorAlert}
          onClose={() => {
            setErrorAlert(false);
          }}
        >
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            Error al ingresar — <strong>Usuario o contraseña invalida</strong>
          </Alert>
        </Dialog>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default Login;

const checkoutSchema = yup.object().shape({
  username: yup.string().required("Complete el codigo de usuario"),
  password: yup.string().required("Complete su contraseña"),
});
const initialValues = {
  username: "",
  password: "",
};
