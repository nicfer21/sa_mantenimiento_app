/* eslint-disable react/prop-types */
import { Box, Dialog, Skeleton } from "@mui/material";
import ImageComponent from "./ImageComponent";
import { useEffect, useState } from "react";

const ClickImageComponent = ({
  useImage,
  setUseImage,
  token,
  link,
  maxWidth = "xl",
}) => {
  const [useLink, setUseLink] = useState("");
  useEffect(() => {
    const getData = () => {
      setUseLink(link);
    };
    getData();
  }, [link]);

  return (
    <Dialog
      open={useImage}
      onClose={() => {
        setUseImage(false);
      }}
      fullWidth={true}
      maxWidth={maxWidth}
    >
      <Box sx={{ width: "100%" }}>
        {useLink ? (
          <ImageComponent link={useLink} token={token} border="" padding="" />
        ) : (
          <Skeleton  />
        )}
      </Box>
    </Dialog>
  );
};

export default ClickImageComponent;
