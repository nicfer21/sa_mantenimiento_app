import { Box, TextField, Typography, Checkbox } from "@mui/material";
import { useEffect, useState } from "react";
import { searchArray } from "../tools/extra";

const ReportActivityBox = ({ data, setVariable, setEstado }) => {
  const dataOrden = data;

  const [variableData, setVariableData] = useState([]);
  const [estadoData, setEstadoData] = useState([]);

  const tipo = [
    {
      value: "1",
      label: "Mantenimiento correctivo",
    },
    {
      value: "2",
      label: "Mantenimiento preventivo con base en el tiempo",
    },
    {
      value: "3",
      label: "Mantenimiento preventivo con base en el uso",
    },
    {
      value: "4",
      label: "Mantenimiento predictivo",
    },
    {
      value: "5",
      label: "Mantenimiento de oportunidad",
    },
    {
      value: "6",
      label: "Detección de fallas",
    },
    {
      value: "7",
      label: "Modificación del diseño",
    },
    {
      value: "8",
      label: "Reparación General",
    },
    {
      value: "9",
      label: "Reemplazo",
    },
  ];

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

  useEffect(() => {
    let initVariables = [];
    dataOrden.map((row, iter) => {
      if (!initVariables[iter]) {
        initVariables[iter] = [];
      }

      Object.keys(row.variables).map((acc, key) => {
        if (!initVariables[iter][key]) {
          initVariables[iter][key] = 0.0;
        }
      });
      console.log(initVariables);
    });

    setVariableData(initVariables);
    setVariable(initVariables);
  }, [dataOrden]);

  useEffect(() => {
    let initEstado = [];
    dataOrden.map((row, iter) => {
      if (!initEstado[iter]) {
        initEstado[iter] = false;
      }
    });

    setEstadoData(initEstado);
    setEstado(initEstado);
  }, [dataOrden]);

  return (
    <>
      {dataOrden.map((row, iter) => {
        console.log(row);
        return (
          <Box
            key={iter}
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              padding: "10px",
              margin: "12px",
              border: "4px solid #b3b3b3",
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Checkbox
                color="success"
                checked={estadoData[iter]}
                onChange={(event) => {
                  const newEstado = [...estadoData];
                  newEstado[iter] = event.target.checked;

                  setEstadoData(newEstado);
                  setEstado(newEstado);
                }}
                size="medium"
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  textAlign: "left",
                }}
              >
                {iter + 1} ) Actividad : {row.titulo}
              </Typography>
            </Box>

            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                textTransform: "uppercase",
                textAlign: "left",
                marginBottom: "5px",
              }}
            >
              {iter + 1}.1) Duracion : {row.duracion} minutos
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                textTransform: "uppercase",
                textAlign: "left",
                marginBottom: "5px",
              }}
            >
              {iter + 1}.2) Tipo de Mantenimeinto :{" "}
              {searchArray(row.tipo, tipo)}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                textTransform: "uppercase",
                textAlign: "left",
                marginBottom: "5px",
              }}
            >
              {iter + 1}.3) Prioridad de Mantenimeinto :{" "}
              {searchArray(row.prioridad, prioridad)}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                textTransform: "uppercase",
                textAlign: "left",
                marginBottom: "5px",
              }}
            >
              {iter + 1}.4) Variables de Mantenimeinto :{" "}
            </Typography>
            {variableData[0] != undefined
              ? Object.entries(row.variables).map((vari, iterVari) => {
                  return (
                    <TextField
                      key={iterVari}
                      fullWidth
                      style={{ marginTop: "20px" }}
                      variant="outlined"
                      type="number"
                      InputProps={{ inputProps: { step: 0.01 } }}
                      label={`Variable :  ${vari[0]}`}
                      size={"small"}
                      sx={{ marginTop: "5px" }}
                      value={variableData[iter][iterVari]}
                      onChange={(event) => {
                        const newData = [...variableData];
                        newData[iter][iterVari] = event.target.value;
                        setVariableData(newData);
                        setVariable(newData);
                      }}
                    />
                  );
                })
              : null}
          </Box>
        );
      })}
    </>
  );
};

export default ReportActivityBox;
