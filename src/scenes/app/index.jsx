/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import Topbar from "../global/TopbarComp";
import Sidebar from "../global/SidebarComp";

import Dashboard from "../dashboard";

//Propios
import PerfilScene from "../perfil";
import TrabajadorScene from "../trabajador/ShowTrabajador.jsx";
import WorkerAdd from "../trabajador/AddTrabajador.jsx";
import WorkerUpdate from "../trabajador/UpdateTrabajador.jsx";
import ShowSistema from "../sistema/ShowSistema.jsx";
import ShowUnidad from "../unidad/ShowUnidad.jsx";
import ShowMoreUnidad from "../unidad/ShowMoreUnidad.jsx";
import SolicitudAdd from "../solicitud/AddSolicitud.jsx";
import SolicitudShow from "../solicitud/ShowSolicitud.jsx";
import SolicitudShowMore from "../solicitud/ShowMoreSolicitud.jsx";
import ActividadAdd from "../actividad/AddActividad.jsx";
import ActividadShow from "../actividad/ShowActividad.jsx";
import ActividadShowMore from "../actividad/ShowMoreActividad.jsx";
import OrdenAdd from "../orden/AddOrden.jsx";
import OrdenShow from "../orden/ShowOrden.jsx";
import OrdenShowMore from "../orden/ShowMoreOrden.jsx";
import Calendario from "../calendario/index.jsx";
import ReporteAdd from "../reporte/AddReporte.jsx";
import ReporteShow from "../reporte/ShowReporte.jsx";
import ReporteShowMore from "../reporte/ShowMoreReporte.jsx";

import {
  CssBaseline,
  ThemeProvider,
  Backdrop,
  CircularProgress,
} from "@mui/material";

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

  //Librerar para produccion

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
              <Route
                path="/"
                element={<Dashboard payload={payload} setOpen={setOpen} />}
              />

              {/* All routes */}

              <Route
                path="/myprofile/"
                element={<PerfilScene payload={payload} setOpen={setOpen} />}
              />

              <Route
                path="/system/"
                element={<ShowSistema payload={payload} setOpen={setOpen} />}
              />

              <Route
                path="/equipment/list/"
                element={<ShowUnidad payload={payload} setOpen={setOpen} />}
              />

              <Route
                path="/equipment/show/:id"
                element={<ShowMoreUnidad payload={payload} setOpen={setOpen} />}
              />

              <Route
                path="/maintenance/request/create/"
                element={<SolicitudAdd payload={payload} setOpen={setOpen} />}
              />

              <Route
                path="/maintenance/request/show/"
                element={<SolicitudShow payload={payload} setOpen={setOpen} />}
              />

              <Route
                path="/maintenance/request/show/:id"
                element={
                  <SolicitudShowMore payload={payload} setOpen={setOpen} />
                }
              />

              <Route
                path="/maintenance/activity/create/"
                element={<ActividadAdd payload={payload} setOpen={setOpen} />}
              />

              <Route
                path="/maintenance/activity/show/"
                element={<ActividadShow payload={payload} setOpen={setOpen} />}
              />

              <Route
                path="/maintenance/activity/show/:id"
                element={
                  <ActividadShowMore payload={payload} setOpen={setOpen} />
                }
              />

              <Route
                path="/maintenance/order/show/"
                element={<OrdenShow payload={payload} setOpen={setOpen} />}
              />
              <Route
                path="/maintenance/order/show/:id"
                element={<OrdenShowMore payload={payload} setOpen={setOpen} />}
              />

              <Route
                path="/calendar/"
                element={<Calendario payload={payload} setOpen={setOpen} />}
              />

              <Route
                path="/maintenance/report/create/"
                element={<ReporteAdd payload={payload} setOpen={setOpen} />}
              />

              <Route
                path="/maintenance/report/show/"
                element={<ReporteShow payload={payload} setOpen={setOpen} />}
              />
              <Route
                path="/maintenance/report/show/:id"
                element={
                  <ReporteShowMore payload={payload} setOpen={setOpen} />
                }
              />

              {payload &&
                /* Evitar acceder a los Ejecutores */
                (payload.nivel != 3 ? (
                  <>
                    <Route
                      path="/worker/list/"
                      element={
                        <TrabajadorScene payload={payload} setOpen={setOpen} />
                      }
                    />

                    <Route
                      path="/maintenance/order/create/"
                      element={<OrdenAdd payload={payload} setOpen={setOpen} />}
                    />

                    {payload &&
                      /* Evita acceder a los supervisores */
                      (payload.nivel != 2 ? (
                        <>
                          <Route
                            path="/worker/add/"
                            element={
                              <WorkerAdd payload={payload} setOpen={setOpen} />
                            }
                          />
                          <Route
                            path="/worker/update/:id"
                            element={
                              <WorkerUpdate
                                payload={payload}
                                setOpen={setOpen}
                              />
                            }
                          />
                        </>
                      ) : null)}
                  </>
                ) : null)}

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
