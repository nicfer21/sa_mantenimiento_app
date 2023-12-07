/* eslint-disable react/prop-types */
import { Typography, Box, useTheme, TextField, Button } from "@mui/material";
import { tokens } from "../theme";
import { SearchRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Header = ({
  title,
  subtitle,
  search = false,
  titulo = "",
  placeholder = "",
  link = "",
  setChange = null,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [text, setText] = useState("");

  const navigate = useNavigate();
  return (
    <Box mb="30px" display="flex" justify-content="flex-end">
      <Box sx={{ alignSelf: "flex-end" }}>
        <Typography
          variant="h2"
          color={colors.grey[100]}
          fontWeight="bold"
          sx={{ m: "0 0 5px 0" }}
        >
          {title}
        </Typography>
        <Typography variant="h5" color={colors.greenAccent[400]}>
          {subtitle}
        </Typography>
      </Box>
      {search ? (
        <Box sx={{ alignSelf: "", marginLeft: "auto" }}>
          <Box sx={{ m: "0 0 5px 0" }}>
            <TextField
              label={titulo}
              size="small"
              placeholder={placeholder}
              value={text}
              onChange={(event) => {
                setText(event.target.value);
              }}
            />{" "}
            <Button
              type="button"
              onClick={() => {
                if (text != "") {
                  const url = link + text;
                  navigate(url);
                  setChange((prev) => !prev);
                }
              }}
            >
              <SearchRounded />
            </Button>
          </Box>
        </Box>
      ) : null}
    </Box>
  );
};

export default Header;
