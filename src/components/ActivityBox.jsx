/* eslint-disable react/prop-types */
import { Box, Typography, Button, Grid } from "@mui/material";

import { useEffect, useState } from "react";

//Icons
import { AddBoxOutlined } from "@mui/icons-material";
import { getApi } from "../tools/mantenimiento-api";
import ComboboxSelect from "./ComboboxSelect";
import { searchArray } from "../tools/extra";

const ActivityBox = ({
  token,
  colors,
  setOpen,
  setActividades,
  setDuracion,
  setChangeUp,
}) => {
  const colorsTheme = colors;

  const prioridad = [
    {
      value: "1",
      label: "Emergencia",
    },
    {
      value: "2",
      label: "Urgencia",
    },
    {
      value: "3",
      label: "Normal",
    },
    {
      value: "4",
      label: "Programada",
    },
  ];

  const [rowsArray, setRowsArray] = useState([]);
  const [comboActividades, setComboActividades] = useState(null);

  const [change, setChange] = useState(false);

  useEffect(() => {
    let sumar = 0.0;
    rowsArray.map((row) => {
      sumar = sumar + parseFloat(row.duracion);
    });
    setDuracion(sumar);
  }, [rowsArray, change, setDuracion]);

  return (
    <Box
      sx={{
        p: "12px",
        margin: "2px",
        border: "5px solid " + colorsTheme.grey[600],
        borderRadius: "10px",
        width: "100%",
        flex: 1,
        flexDirection: "row",
      }}
    >
      <Typography>Seleccionar las Actividades </Typography>
      <Box
        sx={{
          m: "3px",
          p: "3px",
          width: "100%",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Box width={"80%"}>
          <ComboboxSelect
            url="/m_actividades/combobox/"
            setComboValue={setComboActividades}
            token={token}
            size="small"
            titulo="Actividades"
          />
        </Box>
        <Button
          type="button"
          variant="outlined"
          color="info"
          sx={{ marginLeft: "20px", width: "20%" }}
          onClick={async () => {
            if (comboActividades != null) {
              setOpen(true);
              const rs = await getApi(
                "/m_actividades/" + comboActividades.value,
                token
              );
              setRowsArray((prev) => [...prev, rs]);
              setChange(!change);
              setChangeUp((prev) => !prev);
              setOpen(false);
              setActividades(rowsArray);
            }
          }}
        >
          {<AddBoxOutlined />}
          {" Agregar Actividad"}
        </Button>
      </Box>
      <Box sx={{ m: "3px", p: "3px", width: "100%", marginTop: "25px" }}>
        <Grid container spacing={3}>
          {rowsArray.map((row, iter) => {
            const bajar = iter + 1 < rowsArray.length ? false : true;
            const subir = iter > 0 ? false : true;

            return (
              <Grid
                item
                xs={12}
                key={iter}
                sx={{
                  paddingRight: "10px",
                  paddingLeft: "10px",
                  marginLeft: "10px",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ width: "80%" }}>
                  <Typography variant="body1">
                    <strong>
                      {iter + 1}
                      {" ) "}
                    </strong>
                    <strong>{row.titulo}</strong>
                    {"-"}
                    <strong>{row.codigo_partes}</strong> [Duracion (min){" "}
                    {row.duracion}]
                    <strong>*{searchArray(row.prioridad, prioridad)}*</strong>
                  </Typography>
                </Box>
                <Box
                  sx={{ width: "20%", display: "flex", flexDirection: "row" }}
                >
                  <Button
                    disabled={subir}
                    onClick={() => {
                      const actual = rowsArray[iter];
                      const encima = rowsArray[iter - 1];
                      rowsArray[iter] = encima;
                      rowsArray[iter - 1] = actual;
                      setChangeUp((prev) => !prev);
                      setChange(!change);
                    }}
                  >
                    Subir
                  </Button>
                  <Button
                    disabled={bajar}
                    onClick={() => {
                      const actual = rowsArray[iter];
                      const debajo = rowsArray[iter + 1];
                      rowsArray[iter] = debajo;
                      rowsArray[iter + 1] = actual;
                      setChangeUp((prev) => !prev);
                      setChange(!change);
                    }}
                  >
                    Bajar
                  </Button>
                  <Button
                    onClick={() => {
                      rowsArray.splice(iter, 1);
                      setActividades(rowsArray);
                      setChangeUp((prev) => !prev);
                      setChange(!change);
                    }}
                  >
                    Eliminar
                  </Button>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
};

export default ActivityBox;
