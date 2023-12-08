/* eslint-disable react/prop-types */
import { Box } from "@mui/material";
import { tokens } from "../../theme.js";
import Header from "../../components/Header.jsx";
import { useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { getApi } from "../../tools/mantenimiento-api.js";

import LogoEmpresa from "../../LogoEmpresa.jpg";

import {
  Document,
  Text,
  Page,
  StyleSheet,
  Image,
  PDFViewer,
  View,
} from "@react-pdf/renderer";

import { useParams } from "react-router-dom";

const ShowMoreActividad = ({ payload, setOpen }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { id } = useParams();

  const [data, setData] = useState({});

  const [dataActividad, setDataActividad] = useState(null);
  const [dataSubpartes, setDataSubpartes] = useState([]);

  const timeWait = 1500;

  useEffect(() => {
    setOpen(false);
    setData(payload);
  }, [payload, setOpen]);

  useEffect(() => {
    const getData = async () => {
      setOpen(true);
      await new Promise((resolve) => setTimeout(resolve, timeWait));
      const rs = await getApi("/m_actividades/" + id, data.token);
      setDataActividad(rs);
      setOpen(false);
    };
    getData();
  }, [data, setOpen, id]);

  useEffect(() => {
    const getData = async () => {
      await new Promise((resolve) => setTimeout(resolve, timeWait));
      const rs = await getApi(
        "/e_subpartes/partsub/" + dataActividad.id_partes,
        data.token
      );
      console.log(rs);
      setDataSubpartes(rs);
    };
    getData();
  }, [dataActividad, data]);

  return (
    <Box m="20px">
      <Header
        title={"Ver Actividad de Mantenimiento Nro: " + id}
        subtitle="Formato de Actividad de Mantenimiento"
      />
      <Box
        m="10px 0 0 0"
        height="70vh"
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
        <PDFViewer width="100%" height="100%" showToolbar>
          {dataActividad != null ? (
            <Document
              pdfVersion="1.7ext3"
              creator="Servicentro Avila"
              producer="Servicentro Avila"
              title={"Actividad de mantenimiento " + id}
            >
              <Page size={"A4"} style={styles.page} fixed>
                {/* Cabecera */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    border: "1px solid black",
                    padding: 5,
                    marginBottom: 15,
                  }}
                >
                  <Image
                    src={LogoEmpresa}
                    style={{ width: 100, border: "3px solid black" }}
                  />
                  <Text style={styles.title}>
                    Actividad de Mantenimiento Nro {id}
                  </Text>
                  <Text style={{ fontSize: 9 }}>
                    Fecha : {new Date().toLocaleString()}
                  </Text>
                </View>

                {/* Informacion en General  */}
                <View style={styles.section}>
                  <Text style={styles.subtitulo}>
                    1. Informacion de la Actividad{" "}
                  </Text>
                  <Text style={styles.texto}>
                    1.1. Titulo : {dataActividad.titulo}
                  </Text>
                  <Text style={styles.texto}>
                    1.2. Duracion : {dataActividad.duracion} minutos
                  </Text>
                  <Text style={styles.texto}>
                    1.3. Tipo : {dataActividad.tipo}
                  </Text>
                  <Text style={styles.texto}>
                    1.4. Prioridad : {dataActividad.prioridad}
                  </Text>
                  <Text style={styles.texto}>
                    1.5. Procedimiento : {dataActividad.procedimiento}
                  </Text>
                  <Text style={styles.texto}>
                    1.6. Variables a tomar en consideracion:
                  </Text>
                  {dataActividad.variables != null
                    ? Object.entries(dataActividad.variables).map(
                        (row, iter) => {
                          return (
                            <Text key={iter} style={styles.textoP}>
                              1.6.{iter + 1}. {row[0]} : {row[1]}
                            </Text>
                          );
                        }
                      )
                    : null}
                </View>

                {/* Ubicacion, Equipo, Sistemas */}
                <View style={styles.section}>
                  <Text style={styles.subtitulo}>
                    2. Sistema, Equipo/Unidad, Parte, Subpartes
                  </Text>
                  <Text style={styles.texto}>
                    2.1. Sistema al que pertenece :{" "}
                    {dataActividad.sistemas_nombre}
                  </Text>
                  <Text style={styles.texto}>
                    2.2. Nombre del Equipo/Unidad :{" "}
                    {dataActividad.unidades_nombre}
                  </Text>
                  <Text style={styles.texto}>
                    2.3. Codigo de Equipo/Unidad :{" "}
                    {dataActividad.codigo_unidades}
                  </Text>
                  <Text style={styles.texto}>
                    2.4. Ubicacion del Equipo/Unidad :{" "}
                    {dataActividad.ubicacion_nombre}
                  </Text>
                  <Text style={styles.texto}>
                    2.5. Nombre de la Parte : {dataActividad.partes_nombre}
                  </Text>
                  <Text style={styles.texto}>
                    2.6. Codigo de la Parte : {dataActividad.codigo_partes}
                  </Text>
                  <Text style={styles.texto}>2.7. Subpartes : </Text>
                  {dataSubpartes &&
                    (dataSubpartes.length === 0
                      ? "No tiene Subpartes"
                      : Object.entries(dataSubpartes).map((row, iter) => {
                          return (
                            <Text key={iter} style={styles.textoP}>
                              2.6.{iter + 1}. {row[1].nombre} (Codigo :{" "}
                              {row[1].codigo_c} )
                            </Text>
                          );
                        }))}
                </View>

                <View style={styles.pageNumber}>
                  <Text
                    render={({ pageNumber, totalPages }) =>
                      `${pageNumber}/${totalPages}`
                    }
                  />
                </View>
              </Page>
            </Document>
          ) : null}
        </PDFViewer>
      </Box>
    </Box>
  );
};

export default ShowMoreActividad;

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    padding: 25,
    display: "flex",
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  section: {
    marginTop: 10,
    padding: 5,
    border: "1px solid black",
  },
  subtitulo: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "justify",
    textTransform: "uppercase",
    lineHeight: 1.5,
  },
  texto: {
    fontSize: 11,
    textAlign: "justify",
    lineHeight: 1.5,
    marginLeft: 10,
  },
  textoP: {
    fontSize: 9,
    textAlign: "justify",
    lineHeight: 1.5,
    marginLeft: 25,
  },
  imageContainer: {
    width: "250px",
    height: "250px",
    alignSelf: "center",
  },
  imagen: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
});
