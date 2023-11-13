/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Topbar from "../global/TopbarComp";
import Sidebar from "../global/SidebarComp";
import Dashboard from "../dashboard";
import Team from "../team";
import Invoices from "../invoices";
import Contacts from "../contacts";
import Bar from "../bar";
import Form from "../form";
import Line from "../line";
import Pie from "../pie";
import FAQ from "../faq";

//Propios
import PerfilScene from "../perfil";
import TrabajadorScene from "../trabajador";

import Geography from "../geography";
import {
  CssBaseline,
  ThemeProvider,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import Calendar from "../calendar/calendar";
import { ColorModeContext, useMode } from "../../theme.js";
import ErrorScreen from "../error";
import { decodeToken } from "react-jwt";
import {
  clearSession,
  deleteCookie,
  getCookie,
  getSession,
  setSession,
} from "../../tools/cookies.js";
import { getApi } from "../../tools/mantenimiento-api.js";

const AppScreen = () => {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const navigate = useNavigate();
  const [payload, setPayload] = useState({});
  const [open, setOpen] = useState(false);
  const cookieData = getCookie();
  const sessionData = getSession();

  useEffect(() => {
    const inicioApp = async () => {
      if (cookieData === null && sessionData === null) {
        navigate("/login/");
      }
      if (cookieData !== null && sessionData === null) {
        setSession(cookieData);
        //Toma de la cookie
        const {
          id_trabajadores,
          dni,
          nombre,
          cargo,
          id_usuarios,
          nivel,
          info,
        } = await decodeToken(cookieData);
        setPayload({
          id_trabajadores: id_trabajadores,
          dni: dni,
          nombre: nombre,
          cargo: cargo,
          id_usuarios: id_usuarios,
          nivel: nivel,
          info: info,
          token: cookieData,
        });
      }
      if (
        (cookieData === null && sessionData !== null) ||
        (cookieData !== null && sessionData !== null)
      ) {
        //Toma de sessionStorage
        const {
          id_trabajadores,
          dni,
          nombre,
          cargo,
          id_usuarios,
          nivel,
          info,
        } = await decodeToken(sessionData);
        setPayload({
          id_trabajadores: id_trabajadores,
          dni: dni,
          nombre: nombre,
          cargo: cargo,
          id_usuarios: id_usuarios,
          nivel: nivel,
          info: info,
          token: sessionData,
        });
      }
    };

    inicioApp();
  }, [sessionData]);

  useEffect(() => {
    const prueba = async () => {
      setSession(payload, "payload");
      const dataRes = await getApi("/prueba/", sessionData);
      if (!dataRes.type) {
        clearSession();
        deleteCookie();
        navigate("/login/");
        alert(dataRes.message);
      }
    };
    prueba();

    //Funcion ping para validar el token
    const pingFun = setInterval(() => {
      console.log("ping");
      prueba();
    }, 60000);

    return () => {
      clearInterval(pingFun);
    };
  }, [payload]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} payload={payload} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/team/" element={<Team />} />
              <Route path="/contacts/" element={<Contacts />} />
              <Route path="/invoices/" element={<Invoices />} />
              <Route path="/form/" element={<Form />} />
              <Route path="/bar/" element={<Bar />} />
              <Route path="/pie/" element={<Pie />} />
              <Route path="/line/" element={<Line />} />
              <Route path="/faq/" element={<FAQ />} />
              <Route path="/calendar/" element={<Calendar />} />
              <Route path="/geography/" element={<Geography />} />
              <Route
                path="/myprofile/"
                element={<PerfilScene payload={payload} setOpen={setOpen} />}
              />
              <Route
                path="/worker/"
                element={
                  <TrabajadorScene payload={payload} setOpen={setOpen} />
                }
              />
              {/* Ruta comodin con "*" */}
              <Route path="*" element={<ErrorScreen />} />
            </Routes>
          </main>
        </div>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default AppScreen;
