/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";

import Header from "../../components/Header";

import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";

import { useEffect } from "react";
import { useState } from "react";
import { getApi } from "../../tools/mantenimiento-api";
import { useNavigate } from "react-router-dom";
import {
  AccessTimeOutlined,
  ChromeReaderModeOutlined,
  EmailOutlined,
} from "@mui/icons-material";

const Dashboard = ({ payload, setOpen }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const navigate = useNavigate();

  const timeWait = 1000;

  const [data, setData] = useState({});
  const [dataDashboard, setDataDashboard] = useState({});
  const [propiusData, setPropiusData] = useState({});

  const mesAct =
    "Informacion del actual mes " +
    (new Date().getMonth() + 1) +
    " del año " +
    new Date().getFullYear();

  const goOrden = (orden) => {
    const link = "/app/maintenance/order/show/" + orden;
    navigate(link);
  };

  useEffect(() => {
    setOpen(false);
    setData(payload);
  }, [payload]);

  useEffect(() => {
    const getData = async () => {
      setOpen(true);
      await new Promise((resolve) => setTimeout(resolve, timeWait));
      const rs = await getApi("/dashboard/", data.token);
      if (data.nivel === 3) {
        const rs1 = await getApi(
          `/dashboard/${data.id_trabajadores}`,
          data.token
        );
        setPropiusData(rs1);
      }
      setDataDashboard(rs);
      await new Promise((resolve) => setTimeout(resolve, timeWait));
      setOpen(false);
    };

    getData();
  }, [data]);

  return (
    <Box m="20px">
      <Header title="DASHBOARD" subtitle={mesAct} />

      {dataDashboard.recSolicitudes != undefined ? (
        <Box
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          gridAutoRows="140px"
          gap="20px"
        >
          {data.nivel != 3 ? (
            <>
              {/* Card Resumen Avance Orden de Mantenimiento */}
              <Box
                gridColumn="span 4"
                backgroundColor={colors.primary[400]}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <StatBox
                  title={
                    dataDashboard.countOrdenToday > 0
                      ? dataDashboard.countOrdenToday
                      : "No hay Ordenes"
                  }
                  subtitle="Ordenes de Mantenimiento Hoy"
                  progress={
                    dataDashboard.countOrdenToday > 0
                      ? parseInt(dataDashboard.countReportToday) /
                        parseInt(dataDashboard.countOrdenToday)
                      : "-"
                  }
                  increase={
                    (dataDashboard.countOrdenToday > 0
                      ? (parseInt(dataDashboard.countReportToday) /
                          parseInt(dataDashboard.countOrdenToday)) *
                        100
                      : "-") + "%"
                  }
                  icon={
                    <EmailOutlined
                      sx={{ color: colors.greenAccent[300], fontSize: "26px" }}
                    />
                  }
                />
              </Box>

              {/* Card Carga de Trabajo */}
              <Box
                gridColumn="span 4"
                backgroundColor={colors.primary[400]}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <StatBox
                  title={
                    (dataDashboard.duracionOrdenToday > 0
                      ? dataDashboard.duracionOrdenToday
                      : "No hay Carga para Hoy") + " minutos"
                  }
                  subtitle="Carga de Trabajo Hoy"
                  progress={
                    dataDashboard.duracionOrdenToday > 0
                      ? parseInt(dataDashboard.duracionReportToday) /
                        parseInt(dataDashboard.duracionOrdenToday)
                      : "-"
                  }
                  increase={
                    (dataDashboard.duracionOrdenToday > 0
                      ? (parseInt(dataDashboard.duracionReportToday) /
                          parseInt(dataDashboard.duracionOrdenToday)) *
                        100
                      : "-") + "%"
                  }
                  icon={
                    <AccessTimeOutlined
                      sx={{ color: colors.greenAccent[300], fontSize: "26px" }}
                    />
                  }
                />
              </Box>

              {/* Avance de la planificacion */}
              <Box
                gridColumn="span 4"
                backgroundColor={colors.primary[400]}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <StatBox
                  title={
                    (dataDashboard.countOrdenMonth > 0
                      ? (parseInt(dataDashboard.countReportMonth) /
                          parseInt(dataDashboard.countOrdenMonth)) *
                        100
                      : "-") + " %"
                  }
                  subtitle="Avance del Plan Mensual"
                  progress={
                    dataDashboard.countOrdenMonth > 0
                      ? parseInt(dataDashboard.countReportMonth) /
                        parseInt(dataDashboard.countOrdenMonth)
                      : "-"
                  }
                  increase={""}
                  icon={
                    <ChromeReaderModeOutlined
                      sx={{ color: colors.greenAccent[300], fontSize: "26px" }}
                    />
                  }
                />
              </Box>

              {/* Ordenes de mantenimiento para hoy*/}
              <Box
                gridColumn="span 12"
                gridRow="span 2"
                backgroundColor={colors.primary[400]}
                overflow="auto"
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  borderBottom={`4px solid ${colors.primary[500]}`}
                  colors={colors.grey[100]}
                  p="15px"
                >
                  <Typography
                    color={colors.grey[100]}
                    variant="h5"
                    fontWeight="600"
                  >
                    Ordenes de Mantenimiento para el día de hoy :{" "}
                    {new Date().toLocaleDateString()}
                  </Typography>
                </Box>
                {dataDashboard.recOrdenesHoy.map((row, i) => (
                  <Box
                    key={i}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    borderBottom={"4px solid " + colors.primary[500]}
                    p="15px"
                  >
                    <Box>
                      <Typography color={colors.grey[100]}>
                        {row.titulo}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography color={colors.grey[100]}>
                        {new Date(row.fecha).toLocaleTimeString()}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography color={colors.grey[100]}>
                        {row.nombre}
                      </Typography>
                    </Box>

                    {row.estado ? (
                      <Box
                        backgroundColor={colors.greenAccent[500]}
                        p="5px 10px"
                        borderRadius="4px"
                      >
                        <Button
                          size="small"
                          onClick={() => {
                            goOrden(row.jump);
                          }}
                        >
                          Completado
                        </Button>
                      </Box>
                    ) : (
                      <Box
                        backgroundColor={colors.redAccent[500]}
                        p="5px 10px"
                        borderRadius="4px"
                        onClick={() => {
                          goOrden(row.jump);
                        }}
                      >
                        <Button size="small">Incompleto</Button>
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>

              {/* BarChart Cantidad de Actividades de las Ordenes */}
              <Box
                gridColumn="span 12"
                gridRow="span 2"
                backgroundColor={colors.primary[400]}
              >
                <Typography
                  variant="h5"
                  fontWeight="600"
                  sx={{ padding: "30px 30px 0 30px" }}
                >
                  Cantidad de Actividades de Mantenimiento en el actual mes
                </Typography>
                <Box height="250px" mt="-20px">
                  <BarChart
                    isDashboard={true}
                    dataBar={dataDashboard.cantidadActividades}
                    keysBar={["Nro Actividades"]}
                    indexBar={"Tipo"}
                  />
                </Box>
              </Box>

              {/* Recuento de Solicitudes por mes */}
              <Box
                gridColumn="span 4"
                gridRow="span 2"
                backgroundColor={colors.primary[400]}
                overflow="auto"
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  borderBottom={`4px solid ${colors.primary[500]}`}
                  colors={colors.grey[100]}
                  p="15px"
                >
                  <Typography
                    color={colors.grey[100]}
                    variant="h5"
                    fontWeight="600"
                  >
                    Recuento de Solicitudes de Mantenimiento del actual mes
                  </Typography>
                </Box>
                {dataDashboard.recSolicitudes.map((row, i) => (
                  <Box
                    key={`${row.txId}-${i}`}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    borderBottom={`4px solid ${colors.primary[500]}`}
                    p="15px"
                  >
                    <Box>
                      <Typography color={colors.grey[100]}>
                        {row.unidad}
                      </Typography>
                    </Box>

                    <Box
                      backgroundColor={colors.redAccent[500]}
                      p="5px 10px"
                      borderRadius="4px"
                    >
                      {row.cantidad}
                    </Box>
                  </Box>
                ))}
              </Box>

              {/* BarChart Cantidad de SOlicitudes por Equipo/Unidad */}
              <Box
                gridColumn="span 8"
                gridRow="span 2"
                backgroundColor={colors.primary[400]}
              >
                <Typography
                  variant="h5"
                  fontWeight="600"
                  sx={{ padding: "30px 30px 0 30px" }}
                >
                  Cantidad de Solicitudes por Equipo/Unidad
                </Typography>
                <Box height="250px" mt="-20px">
                  <BarChart
                    isDashboard={true}
                    dataBar={dataDashboard.recSolicitudesAll}
                    keysBar={["cantidad"]}
                    indexBar={"unidad"}
                  />
                </Box>
              </Box>
            </>
          ) : (
            <>
              {/* Card Resumen Avance Orden de Mantenimiento */}
              <Box
                gridColumn="span 4"
                backgroundColor={colors.primary[400]}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <StatBox
                  title={
                    propiusData.countOrdenToday > 0
                      ? propiusData.countOrdenToday
                      : "No hay Ordenes"
                  }
                  subtitle="Ordenes de Mantenimiento Hoy"
                  progress={
                    propiusData.countOrdenToday > 0
                      ? parseInt(propiusData.countReportToday) /
                        parseInt(propiusData.countOrdenToday)
                      : "-"
                  }
                  increase={
                    (propiusData.countOrdenToday > 0
                      ? (parseInt(propiusData.countReportToday) /
                          parseInt(propiusData.countOrdenToday)) *
                        100
                      : "-") + "%"
                  }
                  icon={
                    <EmailOutlined
                      sx={{ color: colors.greenAccent[300], fontSize: "26px" }}
                    />
                  }
                />
              </Box>

              {/* Card Carga de Trabajo */}
              <Box
                gridColumn="span 4"
                backgroundColor={colors.primary[400]}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <StatBox
                  title={
                    (propiusData.duracionOrdenToday > 0
                      ? propiusData.duracionOrdenToday
                      : "No hay Carga para Hoy") + " minutos"
                  }
                  subtitle="Carga de Trabajo Hoy"
                  progress={
                    propiusData.duracionOrdenToday > 0
                      ? parseInt(propiusData.duracionReportToday) /
                        parseInt(propiusData.duracionOrdenToday)
                      : "-"
                  }
                  increase={
                    (propiusData.duracionOrdenToday > 0
                      ? (parseInt(propiusData.duracionReportToday) /
                          parseInt(propiusData.duracionOrdenToday)) *
                        100
                      : "-") + "%"
                  }
                  icon={
                    <AccessTimeOutlined
                      sx={{ color: colors.greenAccent[300], fontSize: "26px" }}
                    />
                  }
                />
              </Box>

              {/* Avance de la planificacion */}
              <Box
                gridColumn="span 4"
                backgroundColor={colors.primary[400]}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <StatBox
                  title={
                    (propiusData.countOrdenMonth > 0
                      ? (parseInt(propiusData.countReportMonth) /
                          parseInt(propiusData.countOrdenMonth)) *
                        100
                      : "-") + " %"
                  }
                  subtitle="Avance del Plan Mensual"
                  progress={
                    propiusData.countOrdenMonth > 0
                      ? parseInt(propiusData.countReportMonth) /
                        parseInt(propiusData.countOrdenMonth)
                      : "-"
                  }
                  increase={""}
                  icon={
                    <ChromeReaderModeOutlined
                      sx={{ color: colors.greenAccent[300], fontSize: "26px" }}
                    />
                  }
                />
              </Box>

              {/* Ordenes de mantenimiento para hoy*/}
              <Box
                gridColumn="span 12"
                gridRow="span 2"
                backgroundColor={colors.primary[400]}
                overflow="auto"
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  borderBottom={`4px solid ${colors.primary[500]}`}
                  colors={colors.grey[100]}
                  p="15px"
                >
                  <Typography
                    color={colors.grey[100]}
                    variant="h5"
                    fontWeight="600"
                  >
                    Ordenes de Mantenimiento para el día de hoy :{" "}
                    {new Date().toLocaleDateString()}
                  </Typography>
                </Box>
                {propiusData.recOrdenesHoy.map((row, i) => (
                  <Box
                    key={i}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    borderBottom={"4px solid " + colors.primary[500]}
                    p="15px"
                  >
                    <Box>
                      <Typography color={colors.grey[100]}>
                        {row.titulo}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography color={colors.grey[100]}>
                        {new Date(row.fecha).toLocaleTimeString()}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography color={colors.grey[100]}>
                        {row.nombre}
                      </Typography>
                    </Box>

                    {row.estado ? (
                      <Box
                        backgroundColor={colors.greenAccent[500]}
                        p="5px 10px"
                        borderRadius="4px"
                      >
                        <Button
                          size="small"
                          onClick={() => {
                            goOrden(row.jump);
                          }}
                        >
                          Completado
                        </Button>
                      </Box>
                    ) : (
                      <Box
                        backgroundColor={colors.redAccent[500]}
                        p="5px 10px"
                        borderRadius="4px"
                        onClick={() => {
                          goOrden(row.jump);
                        }}
                      >
                        <Button size="small">Incompleto</Button>
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            </>
          )}
        </Box>
      ) : null}
    </Box>
  );
};

export default Dashboard;
