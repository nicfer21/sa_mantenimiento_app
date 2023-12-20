/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Box, Button, Typography } from "@mui/material";
import { DataGrid, GridToolbar, esES } from "@mui/x-data-grid";
import { tokens } from "../../theme.js";
import Header from "../../components/Header.jsx";
import { useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { getApi } from "../../tools/mantenimiento-api.js";
import {
  CancelOutlined,
  CheckCircleOutline,
  SearchOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const ShowSolicitud = ({ payload, setOpen }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState({});
  const [rows, setRows] = useState([]);

  const timeWait = 1250;

  const navigate = useNavigate();

  const getRowId = (row) => {
    return row.id_solicitudes;
  };

  useEffect(() => {
    setOpen(false);
    setData(payload);
  }, [payload]);

  useEffect(() => {
    const getData = async () => {
      setOpen(true);

      await new Promise((resolve) => setTimeout(resolve, timeWait));
      const rs = await getApi("/m_solicitudes/list/", data.token);
      setRows(rs);
      await new Promise((resolve) => setTimeout(resolve, timeWait));
      setOpen(false);
    };
    getData();
  }, [data]);

  const columns = [
    { field: "id_solicitudes", headerName: "ID", aling: "center" },
    {
      field: "codigo_c",
      headerName: "Codigo Equipo/Unidad",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "unidades_nombre",
      headerName: "Equipo/Unidad",
      flex: 1,
    },
    { field: "asunto", headerName: "Asunto", flex: 1 },
    {
      field: "nombre",
      headerName: "Solicitante",
      flex: 1,
    },
    {
      field: "fecha",
      headerName: "Fecha del Suceso",
      flex: 1,
      renderCell: (params) => {
        const fecha = new Date(params.value).toLocaleString();
        return fecha;
      },
    },
    {
      field: "id_ordenes",
      headerName: "Seguimiento",
      flex: 1,
      renderCell: (params) => {
        const orden = params.value;
        const titulo = orden === null ? "Sin Seguimiento" : "Seguido";
        return (
          <Box
            width="100%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            alignItems="center"
            backgroundColor={
              orden === null ? colors.redAccent[400] : colors.greenAccent[500]
            }
            borderRadius="4px"
          >
            {orden === null && <CancelOutlined />}
            {orden != null && <CheckCircleOutline />}
            <Typography
              variant="caption"
              color={colors.grey[100]}
              sx={{ ml: "5px" }}
            >
              <strong>{titulo}</strong>
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "action",
      headerName: "Mostrar más",
      flex: 1,
      renderCell: (params) => {
        const permiso = payload.nivel != 1 ? true : false;
        return (
          <Button
            type="button"
            variant="contained"
            disabled={permiso}
            size="small"
            color="info"
            onClick={() => {
              navigate("/app/maintenance/request/show/" + params.id);
            }}
          >
            <SearchOutlined />
          </Button>
        );
      },
    },
  ];

  // /maintenance/request/show/

  return (
    <Box m="20px">
      <Header
        title="Lista de Solicitudes de Mantenimiento"
        subtitle="Tabla con la lista de las Solicitudes de Mantenimiento y seguimiento de Orden de mantenimiento"
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

export default ShowSolicitud;
