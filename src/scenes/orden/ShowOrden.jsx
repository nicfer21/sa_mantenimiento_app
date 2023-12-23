/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Box, Button } from "@mui/material";
import { DataGrid, GridToolbar, esES } from "@mui/x-data-grid";
import { tokens } from "../../theme.js";
import Header from "../../components/Header.jsx";
import { useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { getApi } from "../../tools/mantenimiento-api.js";
import {
  CheckCircleOutline,
  ErrorOutline,
  SearchOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const ShowOrden = ({ payload, setOpen }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState({});
  const [rows, setRows] = useState([]);

  const timeWait = 1250;

  const navigate = useNavigate();

  const getRowId = (row) => {
    return row.id_ordenes;
  };

  useEffect(() => {
    setOpen(false);
    setData(payload);
  }, [payload]);

  useEffect(() => {
    const getData = async () => {
      setOpen(true);

      await new Promise((resolve) => setTimeout(resolve, timeWait));
      const rs = await getApi("/m_ordenes/list/", data.token);
      setRows(rs);
      await new Promise((resolve) => setTimeout(resolve, timeWait));
      setOpen(false);
    };
    getData();
  }, [data]);

  const columns = [
    {
      field: "id_ordenes",
      headerName: "ID",
      headerAlign: "center",
      contentAling: "center",
    },
    {
      field: "nombre",
      headerName: "Encargado",
      flex: 1,
      cellClassName: "name-column--cell",
      headerAlign: "center",
    },
    {
      field: "inicio_ordenes",
      headerName: "Inicio de la Orden",
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => {
        const fecha = new Date(params.value);
        return fecha.toLocaleString();
      },
    },
    {
      field: "estado",
      headerName: "Estado de la Orden",
      flex: 1,
      renderCell: (params) => {
        if (params.value) {
          return (
            <Button fullWidth variant="contained" type="button" color="success">
              <CheckCircleOutline />
              Completado
            </Button>
          );
        } else {
          return (
            <Button fullWidth variant="contained" type="button" color="error">
              <ErrorOutline />
              {"  "}Incompleto
            </Button>
          );
        }
      },
    },

    {
      field: "action",
      headerName: "Mostrar más",
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => {
        let permiso = payload.nombre != params.row.nombre ? true : false;

        permiso = payload.nivel === 1 ? false : permiso;
        permiso = payload.nivel === 2 ? false : permiso;

        return (
          <Button
            type="button"
            variant="contained"
            fullWidth
            disabled={permiso}
            size="small"
            color="info"
            onClick={() => {
              navigate("/app/maintenance/order/show/" + params.id);
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
        title="Lista de Ordenes de Mantenimiento"
        subtitle="Tabla con la lista de Ordenes de Mantenimiento"
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

export default ShowOrden;
