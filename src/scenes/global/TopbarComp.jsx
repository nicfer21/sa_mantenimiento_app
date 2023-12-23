import { Box, IconButton } from "@mui/material";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";

import { useNavigate } from "react-router-dom";
import { CalendarMonthOutlined } from "@mui/icons-material";

const Topbar = () => {
  const navigate = useNavigate();

  return (
    <Box display="flex" justifyContent="end" m={2}>
      {/* ICONS */}
      <Box display="flex">
        <IconButton
          onClick={() => {
            navigate("/app/calendar/");
          }}
        >
          <CalendarMonthOutlined />
        </IconButton>
        <IconButton
          onClick={() => {
            navigate("/app/myprofile/");
          }}
        >
          <PersonOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;
