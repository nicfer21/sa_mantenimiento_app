/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import AppScreen from "./scenes/app";
import LoginScreen from "./scenes/login";
import ErrorScreen from "./scenes/error";

import { Box, Typography } from "@mui/material";
import { getCookie, getSession } from "./tools/cookies";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeApp />} />
      <Route path="/login/" element={<LoginScreen />} />
      <Route path="/app/*" element={<AppScreen />} />
      {/* Ruta comodin con "*" */}
      <Route path="*" element={<ErrorScreen />} />
      
    </Routes>
  );
}

export default App;

const HomeApp = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (getCookie() === null && getSession() === null) {
      navigate("/login/");
    } else {
      navigate("/app/");
    }
  }, []);
  return (
    <Box>
      <Typography variant="h4">Redireccionando ...</Typography>
    </Box>
  );
};
