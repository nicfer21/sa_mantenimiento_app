/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Box } from "@mui/material";
import { tokens } from "../../theme.js";
import Header from "../../components/Header.jsx";
import { useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { getApi, getImageApi } from "../../tools/mantenimiento-api.js";

import LogoEmpresa from "../../LogoEmpresa.jpg";

import {
  Document,
  Text,
  Page,
  StyleSheet,
  Image,
  PDFDownloadLink,
  PDFViewer,
  View,
} from "@react-pdf/renderer";

import { useParams } from "react-router-dom";
import { getLocalDate } from "../../tools/extra.js";

const ShowMoreSolicitud = ({ payload, setOpen }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { id } = useParams();

  const [data, setData] = useState({});
  const [dataSolicitud, setDataSolicitud] = useState(null);

  const [imageData, setImageData] = useState(null);

  const timeWait = 1500;

  useEffect(() => {
    setOpen(false);
    setData(payload);
  }, [payload, setOpen]);

  useEffect(() => {
    const getData = async () => {
      setOpen(true);
      await new Promise((resolve) => setTimeout(resolve, timeWait));
      const rs = await getApi("/m_solicitudes/" + id, data.token);
      setDataSolicitud(rs);
      setOpen(false);
    };
    getData();
  }, [data, setOpen, id]);

  useEffect(() => {
    const getImage = async () => {
      try {
        const blob = await getImageApi(dataSolicitud.imagen, data.token);
        const imageUrl = URL.createObjectURL(blob);
        setImageData(imageUrl);
      } catch (error) {
        setImageData(null);
      }
    };
    getImage();
  }, [dataSolicitud, data]);

  return (
    <Box m="20px">
      <Header
        title={"Ver Solicitud de Mantenimiento Nro: " + id}
        subtitle="Formato de Solicitud de Mantenimiento"
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
          {dataSolicitud != null ? (
            <Document
              pdfVersion="1.7ext3"
              creator="Servicentro Avila"
              producer="Servicentro Avila"
              title={"Solicitud de mantenimiento " + id}
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
                    Solicitud de Mantenimiento Nro {id}
                  </Text>
                  <Text style={{ fontSize: 9 }}>
                    Fecha : {new Date(dataSolicitud.createdAt).toLocaleString()}
                  </Text>
                </View>
                {/* Asunto  */}
                <View style={styles.section}>
                  <Text style={styles.subtitulo}>1. Asunto </Text>
                  <Text style={styles.texto}>{dataSolicitud.asunto}</Text>
                  <Text style={styles.texto}>
                    1.1. Fecha determianda de Inspeccion o Hallazgo :{" "}
                    {getLocalDate(dataSolicitud.fecha)}
                  </Text>
                  <Text style={styles.texto}>
                    1.2. Nombre del Solicitante : {dataSolicitud.nombre}
                  </Text>
                  <Text style={styles.texto}>
                    1.3. Cargo del Solicitante : {dataSolicitud.cargo}
                  </Text>
                </View>
                {/* Descripcion */}
                <View style={styles.section}>
                  <Text style={styles.subtitulo}>2. Descripcion </Text>
                  <Text style={styles.texto}>{dataSolicitud.descripcion}</Text>
                  <Text style={styles.texto}>
                    2.1. Informacion adicional :{" "}
                  </Text>
                  {dataSolicitud.info != null
                    ? Object.entries(dataSolicitud.info).map((row, iter) => {
                        return (
                          <Text key={iter} style={styles.texto}>
                            2.1.{iter + 1}. {row[0]} = {row[1]}
                          </Text>
                        );
                      })
                    : null}
                </View>
                {/* Equipo */}
                <View style={styles.section}>
                  <Text style={styles.subtitulo}>
                    3. Informacion del Equipo/Unidad
                  </Text>
                  <Text style={styles.texto}>
                    3.1. Nombre del Equipo/Unidad :{" "}
                    {dataSolicitud.unidades_nombre}
                  </Text>
                  <Text style={styles.texto}>
                    3.2. Codigo de Equipo/Unidad : {dataSolicitud.codigo_c}
                  </Text>
                  <Text style={styles.texto}>
                    3.3. Sistema al que pertenece :{" "}
                    {dataSolicitud.sistemas_nombre}
                  </Text>
                  <Text style={styles.texto}>
                    3.4. Ubicacion del Equipo/Unidad :{" "}
                    {dataSolicitud.ubicacion_nombre}
                  </Text>
                </View>
                {/* Orden */}
                <View style={styles.section}>
                  <Text style={styles.subtitulo}>
                    4. Seguimiento de la Solicitud de Mantenimiento
                  </Text>
                  <Text style={styles.texto}>
                    4.1 Orden de mantenimiento :
                    {dataSolicitud.id_ordenes === null
                      ? "No hay Ordenes de Trabajo para el Seguimiento"
                      : "Orden de mantenimiento Nro " + dataSolicitud.id_ordenes}
                  </Text>
                </View>
                {/* Evidencia */}
                <View style={styles.section}>
                  <Text style={styles.subtitulo}>5. Evidencia</Text>
                  <View style={styles.imageContainer}>
                    <Image src={imageData} style={styles.imagen} />
                  </View>
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

export default ShowMoreSolicitud;

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
    fontSize: 10,
    textAlign: "justify",
    lineHeight: 1.5,
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
