/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
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
import Geography from "../geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Calendar from "../calendar/calendar";
import { ColorModeContext, useMode } from "../../theme.js";
import { useEffect } from "react";
import { getCookie, getSession, setSession } from "../../tools/cookies.js";
import ErrorScreen from "../error";
import { decodeToken, isExpired } from "react-jwt";

const AppScreen = () => {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const navigate = useNavigate();
  const token = getCookie();
  const payload = decodeToken(token);

  useEffect(() => {
    if (getCookie() === null && getSession() === null) {
      navigate("/login/");
    } else if (getSession() === null) {
      setSession(token);
      setSession(isExpired(token), "exp");
      console.log(payload.id_trabajadores);
      
    }
  }, []);

/* {id_trabajadores: 1, dni: '71852111', nombre: 'Nicolas Fernando Palomino Boncun', cargo: 'Ingeniero de Mantenimiento', info: {…}, …}
cargo
: 
"Ingeniero de Mantenimiento"
correo
: 
"ferboncun@gmail.com"
createdAt
: 
"2023-11-08T05:23:43.840Z"
dni
: 
"71852111"
exp
: 
1700107271
iat
: 
1699502471
id_trabajadores
: 
1
id_usuarios
: 
1
info
: 
{titulo: 'Ingeniero Industrial', nacimiento: '2001-03-05'}
nivel
: 
1
nombre
: 
"Nicolas Fernando Palomino Boncun"
updatedAt
: 
"2023-11-08T05:27:30.774Z" */

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
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
              {/* Ruta comodin con "*" */}
              <Route path="*" element={<ErrorScreen />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default AppScreen;
