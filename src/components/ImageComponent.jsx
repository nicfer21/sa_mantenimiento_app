/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Box } from "@mui/material";
import { getImageApi } from "../tools/mantenimiento-api";
import { useEffect, useState } from "react";

const ImageComponent = ({
  token,
  link,
  border = "3px solid black",
  padding = "10px",
  titulo,
}) => {
  const [imageData, setImageData] = useState(null);
  useEffect(() => {
    const getImage = async () => {
      try {
        const blob = await getImageApi(link, token);
        const imageUrl = URL.createObjectURL(blob);
        setImageData(imageUrl);
      } catch (error) {
        setImageData(null);
      }
    };
    getImage();
  }, [link]);

  return (
    <>
      {!(link === "i") ? (
        <Box
          component="img"
          sx={{
            width: "100%",
            overflow: "hidden",
            resize: "both",
            padding: padding,
            border: border,
          }}
          src={imageData}
          alt={titulo}
          alignSelf="center"
        />
      ) : null}
    </>
  );
};

export default ImageComponent;
