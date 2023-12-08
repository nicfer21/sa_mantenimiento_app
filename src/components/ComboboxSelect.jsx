/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { getApi } from "../tools/mantenimiento-api";

const ComboboxSelect = ({
  token,
  url,
  setComboValue,
  disabled = false,
  size = "medium",
  titulo,
}) => {
  const [data, setData] = useState([]);

  const handleChange = (event, newValue) => {
    setComboValue(newValue);
  };

  useEffect(() => {
    const getData = async () => {
      const rs = await getApi(url, token);
      setData(rs);
    };
    getData();
  }, [token, url]);

  return (
    <Autocomplete
      options={data}
      disabled={disabled}
      size={size}
      renderInput={(params) => <TextField {...params} label={titulo} />}
      onChange={handleChange}
      isOptionEqualToValue={(option, value) => option.value === value.value}
    />
  );
};

export default ComboboxSelect;
