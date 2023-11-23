/* eslint-disable react/prop-types */
import { Box, Typography, TextField, Button } from "@mui/material";

import { useEffect, useState } from "react";

//Icons
import {
  AddBoxOutlined,
  DeleteOutline,
  EditOutlined,
} from "@mui/icons-material";

const KeyValueBox = ({ dataRow, colors, setDataRow }) => {
  const [rows, setRows] = useState({});

  const colorsTheme = colors;

  const [key, setKey] = useState("");
  const [valor, setValor] = useState("");
  const [change, setChange] = useState(false);

  useEffect(() => {
    if (dataRow === undefined || dataRow === null) {
      setRows(rows);
    } else {
      setRows(dataRow);
    }
  }, [rows, dataRow, change]);

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
      <Typography>Agregar Informacion necesaria</Typography>
      <Box sx={{ m: "3px", p: "3px", width: "100%" }}>
        <TextField
          size="small"
          sx={{ marginRight: "15px" }}
          variant="outlined"
          type="text"
          label="Nombre de la llave"
          name="key"
          value={key}
          onChange={(value) => {
            setKey(value.target.value);
          }}
        />
        <TextField
          size="small"
          sx={{ marginRight: "15px", width: "500px" }}
          variant="outlined"
          type="text"
          label="Valor de la llave"
          name="valor"
          value={valor}
          onChange={(value) => {
            setValor(value.target.value);
          }}
        />
        <Button
          type="button"
          color="success"
          variant="text"
          onClick={() => {
            if (key != "" && valor != "") {
              var objeto = rows;
              objeto[key] = valor;
              setValor("");
              setKey("");
              setDataRow(rows);
            }
          }}
        >
          <AddBoxOutlined />
          <Typography variant="h6"> Agregar Fila</Typography>
        </Button>
      </Box>
      <Box sx={{ m: "3px", p: "3px", width: "100%", marginTop: "25px" }}>
        {Object.entries(rows).map((row, iter) => {
          return (
            <Box key={iter} sx={{ marginTop: "8px" }}>
              <TextField
                size="small"
                sx={{ marginRight: "15px" }}
                variant="outlined"
                type="text"
                value={row[0]}
                disabled
              />
              <TextField
                size="small"
                sx={{ marginRight: "15px", width: "500px" }}
                variant="outlined"
                type="text"
                value={row[1]}
                disabled
              />
              <Button
                type="button"
                sx={{ marginRight: "10px" }}
                variant="contained"
                color="warning"
                onClick={() => {
                  setKey(row[0]);
                  setValor(row[1]);
                }}
              >
                <EditOutlined />
              </Button>
              <Button
                type="button"
                sx={{ marginRight: "10px" }}
                variant="contained"
                color="error"
                onClick={() => {
                  var objeto = rows;
                  delete objeto[row[0]];
                  setChange(!change);
                  setDataRow(rows);
                }}
              >
                <DeleteOutline />
              </Button>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default KeyValueBox;
