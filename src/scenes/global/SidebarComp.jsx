/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Box, IconButton, Skeleton, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { tokens } from "../../theme";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import EngineeringIcon from "@mui/icons-material/EngineeringOutlined";
import {
  AccountTreeOutlined,
  BallotOutlined,
  BentoOutlined,
  CalendarToday,
  DashboardOutlined,
  DocumentScannerOutlined,
  FeaturedPlayListOutlined,
  ListAltOutlined,
  ListOutlined,
  PeopleAltOutlined,
  PostAddOutlined,
  WysiwygOutlined,
} from "@mui/icons-material";
import ImageComponent from "../../components/ImageComponent";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const rute = "/app" + to;
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => {
        setSelected(title);
        navigate(rute);
      }}
      icon={icon}
    >
      <Typography>{title}</Typography>
    </MenuItem>
  );
};

const SidebarComp = ({ payload }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  const [data, setData] = useState({});

  useEffect(() => {
    setData(payload);
  }, [payload]);

  return (
    <Box>
      <Sidebar
        collapsed={isCollapsed}
        backgroundColor={`${colors.primary[400]} !important`}
        style={{ height: "100vh" }}
      >
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[500],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  {" "}
                  MANTENIMIENTO
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {/* Carta de la info del usuario */}
          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <Box
                  width="100px"
                  style={{ cursor: "pointer", borderRadius: "40%" }}
                >
                  {data.token ? (
                    <ImageComponent
                      token={data.token}
                      link={"userImg.png"}
                      titulo={"Imagen de usuario"}
                      border=""
                      padding=""
                    />
                  ) : (
                    <Skeleton width="100px" height="100px" />
                  )}
                </Box>
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h3"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {data.nombre}
                </Typography>
                <Typography
                  variant="h5"
                  color={colors.greenAccent[500]}
                  sx={{ mt: "10px" }}
                >
                  {data.cargo}
                </Typography>
              </Box>
            </Box>
          )}

          <Box
            paddingLeft={isCollapsed ? undefined : "10%"}
            style={{ overflowY: "auto" }}
          >
            <Item
              title="Dashboard"
              to="/"
              icon={<DashboardOutlined />}
              selected={selected}
              setSelected={setSelected}
            />

            <SubMenu label="Solicitudes" icon={<FeaturedPlayListOutlined />}>
              <Item
                title="Crear Solicitud"
                to="/maintenance/request/create/"
                icon={<PostAddOutlined />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Ver Solicitud"
                to="/maintenance/request/show/"
                icon={<ListAltOutlined />}
                selected={selected}
                setSelected={setSelected}
              />
            </SubMenu>

            <SubMenu label="Actividades" icon={<EngineeringIcon />}>
              <Item
                title="Crear Actividad"
                to="#"
                icon={<PostAddOutlined />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Ver Actividad"
                to="#"
                icon={<ListAltOutlined />}
                selected={selected}
                setSelected={setSelected}
              />
            </SubMenu>

            <SubMenu label="Ordenes" icon={<BallotOutlined />}>
              <Item
                title="Crear Ordenes"
                to="#"
                icon={<PostAddOutlined />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Ver Ordenes"
                to="#"
                icon={<ListAltOutlined />}
                selected={selected}
                setSelected={setSelected}
              />
            </SubMenu>

            <SubMenu label="Reportes" icon={<DocumentScannerOutlined />}>
              <Item
                title="Crear Reporte"
                to="#"
                icon={<PostAddOutlined />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Ver Reporte"
                to="#"
                icon={<ListAltOutlined />}
                selected={selected}
                setSelected={setSelected}
              />
            </SubMenu>

            <Item
              title="Calendario"
              to="#"
              icon={<CalendarToday />}
              selected={selected}
              setSelected={setSelected}
            />

            <SubMenu label="Informacion Tecnica" icon={<WysiwygOutlined />}>
              <Item
                title="Sistemas"
                to="/system/"
                icon={<AccountTreeOutlined />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Equipos"
                to="/equipment/list/"
                icon={<BentoOutlined />}
                selected={selected}
                setSelected={setSelected}
              />
            </SubMenu>

            {payload &&
              (payload.nivel != 3 ? (
                <SubMenu
                  label="Gestion de Personal"
                  icon={<PeopleAltOutlined />}
                >
                  {payload &&
                    (payload.nivel != 2 ? (
                      <Item
                        title="Crear Trabajadores"
                        to="/worker/add/"
                        icon={<ListAltOutlined />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                    ) : null)}

                  <Item
                    title="Ver Trabjadores"
                    to="/worker/list/"
                    icon={<ListOutlined />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                </SubMenu>
              ) : null)}

            <SubMenu
              label="Inventarios"
              icon={<DocumentScannerOutlined />}
            ></SubMenu>

            <Item
              title="Mi Perfil"
              to="/myprofile/"
              icon={<PersonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </Sidebar>
    </Box>
  );
};

export default SidebarComp;
