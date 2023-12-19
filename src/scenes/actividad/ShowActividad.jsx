/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Box, Button } from "@mui/material";
import { DataGrid, GridToolbar, esES } from "@mui/x-data-grid";
import { tokens } from "../../theme.js";
import Header from "../../components/Header.jsx";
import { useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { getApi } from "../../tools/mantenimiento-api.js";
import { SearchOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { searchArray } from "../../tools/extra.js";

const ShowActividad = ({ payload, setOpen }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState({});
  const [rows, setRows] = useState([]);

  const timeWait = 1250;

  const navigate = useNavigate();

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

  const getRowId = (row) => {
    return row.id_actividades;
  };

  useEffect(() => {
    setOpen(false);
    setData(payload);
  }, [payload]);

  useEffect(() => {
    const getData = async () => {
      setOpen(true);

      await new Promise((resolve) => setTimeout(resolve, timeWait));
      const rs = await getApi("/m_actividades/list/", data.token);
      setRows(rs);
      await new Promise((resolve) => setTimeout(resolve, timeWait));
      setOpen(false);
    };
    getData();
  }, [data]);

  const columns = [
    {
      field: "id_actividades",
      headerName: "ID",
      headerAlign: "center",
    },
    {
      field: "titulo",
      headerName: "Actividad",
      flex: 1,
      cellClassName: "name-column--cell",
      headerAlign: "center",
    },
    {
      field: "parte",
      headerName: "Parte",
      flex: 1,
      headerAlign: "center",
    },
    { field: "unidad", headerName: "Equipo/Unidad", flex: 1 },
    {
      field: "tipo",
      headerName: "Tipo de Actividad",
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => {
        return <>{searchArray(params.value, tipo)}</>;
      },
    },
    {
      field: "prioridad",
      headerName: "Prioridad",
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => {
        return <>{searchArray(params.value, prioridad)}</>;
      },
    },

    {
      field: "action",
      headerName: "Mostrar más",
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => {
        const permiso = payload.nivel != 1 ? true : false;
        return (
          <Button
            type="button"
            variant="contained"
            fullWidth
            disabled={permiso}
            size="small"
            color="info"
            onClick={() => {
              navigate("/app/maintenance/activity/show/" + params.id);
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
        title="Lista de Actividades de Mantenimiento"
        subtitle="Tabla con la lista de las Actividades de Mantenimiento"
      />
      <Box
        m="10px 0 0 0"
        height="650px"
        width="100%"
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
          getRowId={getRowId}
          density="compact"
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          components={{
            Toolbar: GridToolbar,
          }}
        />
      </Box>
    </Box>
  );
};

export default ShowActividad;
