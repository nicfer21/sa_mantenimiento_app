/* eslint-disable react/prop-types */
import { Grid, Typography } from "@mui/material";
import { useState, useEffect } from "react";

export const RowPerfil = ({ titulo, valor, tamx = 4, tamy = 8 }) => {
  return (
    <>
      <Grid item xs={tamx}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            textTransform: "uppercase",
            textAlign: "center",
          }}
        >
          {titulo}
        </Typography>
      </Grid>
      <Grid item xs={tamy}>
        <Typography variant="h6">{valor}</Typography>
      </Grid>
    </>
  );
};

export const ExtraRowPerfil = ({ titulo, info, tamx = 4, tamy = 8 }) => {
  const [extra, setExtra] = useState([]);

  useEffect(() => {
    try {
      const value = Object.entries(info);
      setExtra(value);
    } catch (error) {
      return;
    }
  }, [info]);
  return (
    <>
      <Grid item xs={tamx}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            textTransform: "uppercase",
            textAlign: "center",
          }}
        >
          {titulo}
        </Typography>
      </Grid>
      <Grid item xs={tamy}>
        {extra.map(([key, value]) => {
          return (
            <Typography
              variant="h6"
              sx={{ textTransform: "uppercase" }}
              key={key}
            >{`${key} : ${value}`}</Typography>
          );
        })}
      </Grid>
    </>
  );
};
