// React y hooks
import * as React from "react";
import { useState } from "react";

// Navegación
import { useNavigate } from "react-router-dom";

// Tipos y utilidades de MUI Theme
import {
  styled,
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";
import type { CSSObject } from "@mui/material/styles";

// Componentes principales de MUI
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import type { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import Collapse from "@mui/material/Collapse";

// Elementos de lista y navegación
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

// Iconos generales de MUI
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import MoreVertIcon from "@mui/icons-material/MoreVert";

// Iconos de módulos y procesos
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import SellIcon from "@mui/icons-material/Sell";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ApartmentIcon from "@mui/icons-material/Apartment";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ShieldIcon from "@mui/icons-material/Shield";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import DnsIcon from "@mui/icons-material/Dns";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import WebStoriesIcon from "@mui/icons-material/WebStories";

const drawerWidth = 320;

const MODULOS = {
  independientes: [
    {
      title: "Dashboard",
      icon: <DashboardIcon />,
      path: "/dashboard",
    },
    {
      title: "Inventario",
      icon: <InventoryIcon />,
      children: [
        {
          title: "Productos",
          icon: <SellIcon />,
          path: "/inventario/productos",
        },
        {
          title: "Catalogos",
          icon: <AddCircleIcon />,
          path: "/inventario/catalogos",
        }
      ],
    },
  ],
  sistema: [
    {
      title: "Organizacion",
      icon: <ApartmentIcon />,
      children: [
        {
          title: "Usuarios",
          icon: <PeopleAltIcon />,
          path: "/organizacion/usuarios",
        },
        {
          title: "Departamentos",
          icon: <CorporateFareIcon />,
          path: "/organizacion/departamentos",
        },
        {
          title: "Sucursal",
          icon: <AccountBalanceIcon />,
          path: "/organizacion/sucursal",
        }
      ],
    },
    {
      title: "Seguridad",
      icon: <ShieldIcon />,
      children: [
        {
          title: "Accesos",
          icon: <VpnKeyIcon />,
          path: "/seguridad/accesos",
        },
        {
          title: "Perfiles",
          icon: <RecentActorsIcon />,
          path: "/seguridad/perfiles",
        },
      ],
    },
    {
      title: "Sistema",
      icon: <DnsIcon />,
      children: [
        {
          title: "Modulos",
          icon: <ViewModuleIcon />,
          path: "/sistema/modulos",
        },
        {
          title: "Procesos",
          icon: <WebStoriesIcon />,
          path: "/sistema/procesos",
        },
      ],
    },
  ],
};

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar)<AppBarProps>(() => ({
  zIndex: 1300,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function MiniDrawer({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [popoverMenu, setPopoverMenu] = useState<string | null>(null);

  // Menú de perfil
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);

  // Persistencia del tema en localStorage
  const [mode, setMode] = useState<"light" | "dark">(
    () => (localStorage.getItem("themeMode") as "light" | "dark") || "light"
  );
  React.useEffect(() => {
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  const navigate = useNavigate();

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light"
            ? {
                primary: { main: "#1976d2" },
                background: { default: "#f0f0f0", paper: "#fff" },
                text: { primary: "#222", secondary: "#555" },
              }
            : {
                primary: { main: "#22223b" },
                background: { default: "#181826", paper: "#22223b" },
                text: { primary: "#fff", secondary: "#bfc7d5" },
              }),
        },
      }),
    [mode]
  );

  // Submenu expand/collapse
  const handleSubmenuToggle = (title: string) => {
    setSubmenuOpen((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  // Perfil menú handlers
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuAnchor(event.currentTarget);
  };
  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  // Popover handlers SOLO con clic
  const handlePopoverOpen = (
    event: React.MouseEvent<HTMLElement>,
    title: string
  ) => {
    setAnchorEl(event.currentTarget);
    setPopoverMenu(title);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
    setPopoverMenu(null);
  };

  // Función logout
  const logout = () => {
    alert("Saliendo");
  };

  return (
    <MuiThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          bgcolor: "background.default",
          minHeight: "100vh",
          overflow: "hidden",
        }}
      >
        <CssBaseline />
        <AppBar position="fixed" color="primary">
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label={open ? "close drawer" : "open drawer"}
              onClick={() => setOpen(!open)}
              edge="start"
              sx={{ marginRight: 2 }}
            >
              {open ? <MenuOpenIcon /> : <MenuIcon />}
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1 }}
            >
              Mi ERP - Dashboard
            </Typography>
            <IconButton
              sx={{ ml: 1 }}
              onClick={() => setMode(mode === "light" ? "dark" : "light")}
              color="inherit"
            >
              {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          open={open}
          slotProps={{
            paper: {
              sx: {
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                overflow: 'hidden',
              },
            },
          }}
        >
          <DrawerHeader>
            <IconButton onClick={() => setOpen(!open)}>
              {open ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List sx={{ flex: 1, overflowY: 'none' }}>
            {Object.entries(MODULOS).map(([seccion, items], idx, arr) => (
              <React.Fragment key={seccion}>
                {items.map((item) => (
                  <React.Fragment key={item.title}>
                    <ListItem
                      disablePadding
                      sx={{ display: "block" }}
                    >
                      <ListItemButton
                        sx={{
                          minHeight: 48,
                          justifyContent: open ? "initial" : "center",
                          px: 2.5,
                        }}
                        onClick={(e) =>
                          item.children
                            ? open
                              ? handleSubmenuToggle(item.title)
                              : handlePopoverOpen(e, item.title)
                            : item.path
                            ? navigate(item.path)
                            : undefined
                        }
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 3 : "auto",
                            justifyContent: "center",
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.title}
                          sx={{ opacity: open ? 1 : 0 }}
                        />
                        {item.children && open ? (
                          submenuOpen[item.title] ? (
                            <ExpandLess />
                          ) : (
                            <ExpandMore />
                          )
                        ) : null}
                      </ListItemButton>
                      {/* Submenú expandible cuando está abierto */}
                      {item.children && (
                        <Collapse
                          in={submenuOpen[item.title] && open}
                          timeout="auto"
                          unmountOnExit
                        >
                          <List component="div" disablePadding>
                            {item.children.map((subitem) => (
                              <ListItemButton
                                key={subitem.title}
                                sx={{
                                  pl: open ? 6 : 2.5,
                                  justifyContent: open ? "initial" : "center",
                                }}
                                onClick={() => navigate(subitem.path)}
                              >
                                <ListItemIcon
                                  sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : "auto",
                                    justifyContent: "center",
                                  }}
                                >
                                  {subitem.icon}
                                </ListItemIcon>
                                <ListItemText
                                  primary={subitem.title}
                                  sx={{ opacity: open ? 1 : 0 }}
                                />
                              </ListItemButton>
                            ))}
                          </List>
                        </Collapse>
                      )}
                      {/* Submenú flotante cuando está minimizado */}
                      {item.children && (
                        <Popover
                          open={
                            popoverMenu === item.title &&
                            Boolean(anchorEl) &&
                            !open
                          }
                          anchorEl={anchorEl}
                          onClose={handlePopoverClose}
                          anchorOrigin={{
                            vertical: "top",
                            horizontal: "right",
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "left",
                          }}
                          PaperProps={{
                            sx: { ml: 1, mt: 1, minWidth: 180 },
                          }}
                          disableRestoreFocus
                        >
                          <List component="div" disablePadding>
                            {item.children.map((subitem) => (
                              <ListItemButton
                                key={subitem.title}
                                onClick={() => {
                                  navigate(subitem.path);
                                  handlePopoverClose();
                                }}
                              >
                                <ListItemIcon>{subitem.icon}</ListItemIcon>
                                <ListItemText primary={subitem.title} />
                              </ListItemButton>
                            ))}
                          </List>
                        </Popover>
                      )}
                    </ListItem>
                  </React.Fragment>
                ))}
                {idx < arr.length - 1 && <Divider sx={{ my: 1 }} />}
              </React.Fragment>
            ))}
          </List>
          <Box
            sx={{
              px: open ? 2 : 0,
              py: 2,
              display: "flex",
              flexDirection: open ? "row" : "column",
              alignItems: "center",
              justifyContent: open ? "flex-start" : "center",
              width: "100%",
              gap: 2,
              bgcolor: "background.paper",
              borderTop: 1,
              borderColor: "divider",
              flexShrink: 0,
            }}
          >
            <Avatar
              src="https://avatars.githubusercontent.com/u/19550456"
              alt="Bharat Kashyap"
              sx={{ width: 40, height: 40, fontSize: "1rem", cursor: "pointer" }}
              onClick={handleProfileMenuOpen}
            >
              B
            </Avatar>
            {open && (
              <>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body1" fontWeight={500} noWrap>
                    Luis Andres Rodriguez
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    luis.rodriguez@outlook.com
                  </Typography>
                </Box>
                <IconButton size="small" onClick={handleProfileMenuOpen}>
                  <MoreVertIcon />
                </IconButton>
              </>
            )}
            <Menu
              anchorEl={profileMenuAnchor}
              open={Boolean(profileMenuAnchor)}
              onClose={handleProfileMenuClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem
                onClick={() => {
                  handleProfileMenuClose();
                  navigate("/configuraciones");
                }}
              >
                Configuraciones
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleProfileMenuClose();
                  logout();
                }}
              >
                Logout
              </MenuItem>
            </Menu>
          </Box>
          <Divider />
        </Drawer>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            bgcolor: "background.default",
            color: "text.primary",
            overflow: "hidden",
          }}
        >
          <DrawerHeader />
          {children}
        </Box>
      </Box>
    </MuiThemeProvider>
  );
}