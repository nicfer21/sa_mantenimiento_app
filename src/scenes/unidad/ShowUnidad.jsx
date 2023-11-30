/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Box, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme.js";
import Header from "../../components/Header.jsx";
import { useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { getApi } from "../../tools/mantenimiento-api.js";
import { SearchOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const ShowUnidad = ({ payload, setOpen }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState({});
  const [rows, setRows] = useState([]);

  const timeWait = 1250;

  const navigate = useNavigate();

  const getRowId = (row) => {
    return row.id_unidades;
  };

  useEffect(() => {
    setOpen(false);
    setData(payload);
  }, [payload]);

  useEffect(() => {
    const getData = async () => {
      setOpen(true);

      await new Promise((resolve) => setTimeout(resolve, timeWait));
      const rs = await getApi("/e_unidades/list/", data.token);
      setRows(rs);
      await new Promise((resolve) => setTimeout(resolve, timeWait));
      setOpen(false);
    };
    getData();
  }, [data]);

  const columns = [
    { field: "id_unidades", headerName: "ID", aling: "center" },
    { field: "codigo_c", headerName: "CODIGO" },
    {
      field: "unidades_nombre",
      headerName: "Unidad/Equipo",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "sistemas_nombre",
      headerName: "Sistema",
      flex: 1,
    },
    {
      field: "ubicacion_nombre",
      headerName: "Ubicacion",
      flex: 1,
    },

    {
      field: "action",
      headerName: "Informacion",
      flex: 1,
      width: 50,
      renderCell: (params) => {
        return (
          <Button
            type="button"
            variant="contained"
            size="small"
            color="info"
            onClick={() => {
              navigate("/app/equipment/show/" + params.row.codigo_c);
            }}
          >
            <SearchOutlined />
          </Button>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="Lista de Equipos/Unidades"
        subtitle="Tabla con la lista de Equipos y"
      />
      <Box
        m="10px 0 0 0"
        height="100%"
        p="15px"
        borderRadius={3}
        bgcolor={colors.primary[900]}
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={getRowId}
          density="compact"
        />
      </Box>
    </Box>
  );
};

export default ShowUnidad;
