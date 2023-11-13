import { Box, IconButton } from "@mui/material";

import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";

import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const navigate = useNavigate();

  return (
    <Box display="flex" justifyContent="end" p={1}>
      {/* ICONS */}
      <Box display="flex">
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon />
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
