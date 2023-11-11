/* eslint-disable react/prop-types */
import { Grid, Typography } from "@mui/material";
import { useState, useEffect } from "react";

export const RowPerfil = ({ titulo, valor }) => {
  return (
    <>
      <Grid item xs={4}>
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
      <Grid item xs={8}>
        <Typography variant="h6">{valor}</Typography>
      </Grid>
    </>
  );
};

export const ExtraRowPerfil = ({ titulo, info }) => {
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
      <Grid item xs={4}>
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
      <Grid item xs={8}>
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
