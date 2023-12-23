/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import { formatDate } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import Header from "../../components/Header.jsx";
import { tokens } from "../../theme.js";
import { getApi } from "../../tools/mantenimiento-api.js";
import { getLocalDate, getLocalHora } from "../../tools/extra.js";
import { useNavigate } from "react-router-dom";

const Calendario = ({ payload, setOpen }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentEvents, setCurrentEvents] = useState([]);

  const [data, setData] = useState({});
  const [eventos, setEventos] = useState([]);
  const [todayEvent, setTodayEvent] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    setOpen(false);
    setData(payload);
  }, [payload]);

  useEffect(() => {
    const getDate = async () => {
      setOpen(true);
      const today = new Date();
      const todayToApi =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      const rs1 = await getApi("/calendario/", data.token);

      const newDatos =
        rs1[0] &&
        rs1.map((row) => {
          const match = row.id.match(/^([a-zA-Z])(\d+)$/); // Utilizar una expresión regular para hacer el match

          let title = "";

          let estado = "";

          let tipo = "";
          let tipo_id = "";
          let date = row.fecha;

          let backgroundColor = "";
          let borderColor = "";

          if (match) {
            tipo = match[1]; // Obtener la primera letra
            tipo_id = match[2]; // Obtener el resto de la cadena (los dígitos)

            if (tipo === "s") {
              title = "Solicitud " + tipo_id;
              estado = row.estado ? "Activo" : "Inactivo"; // Asignar un valor a 'estado' basado en 'row.estado'
              backgroundColor = !row.estado
                ? colors.redAccent[500]
                : colors.grey[500];
              console.log();
            } else if (tipo === "o") {
              title = "Orden " + tipo_id;
              estado = row.estado ? "Activo" : "Inactivo"; // Asignar un valor a 'estado' basado en 'row.estado'

              backgroundColor = !row.estado
                ? colors.greenAccent[500]
                : colors.grey[500];
            }
          }

          return {
            ...row,
            title,
            estado,
            tipo,
            tipo_id,
            date,
            backgroundColor,
            borderColor,
          };
        });
      console.log(newDatos);

      setEventos(newDatos);

      const rs2 = await getApi("/calendario/" + todayToApi, data.token);
      setTodayEvent(rs2);

      setOpen(false);
    };
    getDate();
  }, [data, payload]);

  const handleEventClick = (selected) => {
    const idCalendar = selected.event.id;

    const match = idCalendar.match(/^([a-zA-Z])(\d+)$/); //
    if (match) {
      const tipo = match[1]; // Obtener la primera letra
      const tipo_id = match[2]; // Obtener el resto de la cadena (los dígitos)

      if (tipo === "s") {
        if (
          window.confirm(
            `¿Quiere ir a la Solicitud de Mantenimiento nro '${tipo_id} ?'`
          )
        ) {
          navigate(`/app/maintenance/request/show/${tipo_id}`);
        }
      } else if (tipo === "o") {
        if (
          window.confirm(
            `¿Quiere ir a la Orden de Mantenimiento nro '${tipo_id} ?'`
          )
        ) {
          navigate(`/app/maintenance/order/show/${tipo_id}`);
        }
      }
    }
  };

  return (
    <Box m="20px">
      <Header
        title="Calendario"
        subtitle="Ordenes y Solicitudes de Mantenimiento"
      />

      {data.token && (
        <Box display="flex" justifyContent="space-between">
          {/* CALENDAR SIDEBAR */}
          <Box
            flex="1 1 20%"
            backgroundColor={colors.primary[400]}
            p="15px"
            borderRadius="4px"
          >
            <Typography variant="h5">
              Lista de hoy : {new Date().toLocaleDateString()}
            </Typography>
            <List>
              {todayEvent[0] &&
                todayEvent.map((row, iter) => {
                  const match = row.id.match(/^([a-zA-Z])(\d+)$/); // Utilizar una expresión regular para hacer el match
                  let styles = {};
                  let estado = "";
                  let tituloA = "";

                  if (match) {
                    const tipo = match[1]; // Obtener la primera letra
                    const tipo_id = match[2]; // Obtener el resto de la cadena (los dígitos)

                    if (tipo === "s") {
                      styles = {
                        border: "5px solid" + colors.redAccent[500],
                        margin: "5px 0",
                        borderRadius: "3px",
                      };
                      estado = row.estado
                        ? "Con seguimiento"
                        : "Sin seguimiento";
                      tituloA = "Solicitud nro " + tipo_id;
                    } else if (tipo === "o") {
                      styles = {
                        border: "5px solid" + colors.blueAccent[500],
                        margin: "10px 0",
                        borderRadius: "2px",
                      };
                      estado = row.estado ? "Completado" : "Incompleto";
                      tituloA = "Orden nro " + tipo_id;
                    }
                  }

                  return (
                    <ListItem key={iter} sx={styles}>
                      <ListItemText
                        primary={tituloA}
                        secondary={
                          <>
                            <Typography variant="h6">
                              <strong>{estado}</strong>
                            </Typography>
                            <Typography variant="body1">
                              {getLocalHora(row.fecha)}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  );
                })}
            </List>
          </Box>

          {/* CALENDAR */}
          {
            <Box flex="1 1 100%" ml="15px">
              <FullCalendar
                height="75vh"
                plugins={[
                  dayGridPlugin,
                  timeGridPlugin,
                  interactionPlugin,
                  listPlugin,
                ]}
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
                }}
                initialView="dayGridMonth"
                selectMirror={true}
                dayMaxEvents={true}
                eventClick={handleEventClick}
                eventsSet={(events) => setCurrentEvents(events)}
                events={eventos}
              />
            </Box>
          }
        </Box>
      )}
    </Box>
  );
};

export default Calendario;
