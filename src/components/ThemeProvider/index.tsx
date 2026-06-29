// React y hooks
import * as React from "react";
import { useState } from "react";
import "./index.css";

// Navegación
import { useLocation, useNavigate } from "react-router-dom";

// Tipos y utilidades de MUI Theme
import {
  alpha,
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
import {
  clearSession,
  getSessionUser,
  getUserFullName,
  getUserInitials,
  hasValidSession,
} from "../../session/auth";

const drawerWidth = 320;
const APP_BOOT_SPLASH_TOTAL_MS = 5700;
const APP_LOGOUT_SPLASH_TOTAL_MS = 2850;
const APP_BOOT_SPLASH_VARIANT = "aperture";
const APP_ASIDE_ICON_CASCADE_MS = 1200;
const APP_SUBMENU_COLLAPSE_MS = 220;
const APP_DRAWER_CLOSE_MS = 180;
const APP_DRAWER_OPEN_MS = 220;

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
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    duration: APP_DRAWER_OPEN_MS,
  }),
  overflowX: "hidden",
  willChange: "width",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    duration: APP_DRAWER_CLOSE_MS,
  }),
  overflowX: "hidden",
  willChange: "width",
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
    "& .MuiDrawer-paper": {
      ...openedMixin(theme),
      willChange: "width",
    },
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": {
      ...closedMixin(theme),
      willChange: "width",
    },
  }),
}));

export default function MiniDrawer({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = getSessionUser();
  const [showBootSplash, setShowBootSplash] = useState(true);
  const [animateAsideIcons, setAnimateAsideIcons] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
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
    () => (localStorage.getItem("themeMode") as "light" | "dark") || "dark"
  );
  React.useEffect(() => {
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const isPathActive = React.useCallback(
    (path?: string) => Boolean(path) && currentPath === path,
    [currentPath]
  );

  const isModuleActive = React.useCallback(
    (item: { path?: string; children?: { path: string }[] }) => {
      if (item.path && isPathActive(item.path)) {
        return true;
      }

      return item.children?.some((child) => isPathActive(child.path)) ?? false;
    },
    [isPathActive]
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light"
            ? {
                primary: { main: "#2563eb", light: "#60a5fa", dark: "#1d4ed8" },
                secondary: { main: "#0f766e", light: "#2dd4bf", dark: "#115e59" },
                background: {
                  default: "#eef2f7",
                  paper: "#ffffff",
                },
                text: { primary: "#0f172a", secondary: "#475569" },
                divider: "rgba(148, 163, 184, 0.22)",
              }
            : {
                primary: { main: "#94a3b8", light: "#cbd5e1", dark: "#64748b" },
                secondary: { main: "#475569", light: "#64748b", dark: "#334155" },
                background: {
                  default: "#0f172a",
                  paper: "#111827",
                },
                text: { primary: "#f8fafc", secondary: "#94a3b8" },
                divider: "rgba(148, 163, 184, 0.16)",
              }),
        },
        shape: {
          borderRadius: 18,
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                background:
                  mode === "light"
                    ? "linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)"
                    : "linear-gradient(180deg, #0f172a 0%, #111827 100%)",
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                background:
                  mode === "light"
                    ? "linear-gradient(135deg, rgba(15, 23, 42, 0.96) 0%, rgba(29, 78, 216, 0.94) 100%)"
                    : "linear-gradient(180deg, #111827 0%, #0f172a 100%)",
                boxShadow:
                  mode === "light"
                    ? "0 18px 40px rgba(15, 23, 42, 0.16)"
                    : "0 18px 40px rgba(2, 6, 23, 0.28)",
                backdropFilter: "blur(16px)",
                borderBottom: mode === "light"
                  ? "1px solid rgba(148, 163, 184, 0.14)"
                  : "1px solid rgba(148, 163, 184, 0.12)",
              },
            },
          },
          MuiDrawer: {
            styleOverrides: {
              paper: {
                background:
                  mode === "light"
                    ? "linear-gradient(180deg, rgba(248, 251, 255, 0.96) 0%, rgba(237, 244, 255, 0.9) 100%)"
                    : "linear-gradient(180deg, #111827 0%, #0f172a 100%)",
                color: mode === "light" ? "#0f172a" : "#e2e8f0",
                borderRight: mode === "light"
                  ? "1px solid rgba(148, 163, 184, 0.16)"
                  : "1px solid rgba(148, 163, 184, 0.12)",
                boxShadow:
                  mode === "light"
                    ? "20px 0 40px rgba(15, 23, 42, 0.08)"
                    : "20px 0 40px rgba(2, 6, 23, 0.22)",
                backdropFilter: "blur(10px)",
                transition: `width ${open ? APP_DRAWER_OPEN_MS : APP_DRAWER_CLOSE_MS}ms ${open ? "cubic-bezier(0.22, 1, 0.36, 1)" : "cubic-bezier(0.4, 0, 0.2, 1)"}`,
              },
            },
          },
          MuiListItemButton: {
            styleOverrides: {
              root: {
                borderRadius: 16,
                margin: "4px 10px",
                transition: "background-color 180ms ease, transform 180ms ease, box-shadow 180ms ease",
                "&.Mui-selected": {
                  backgroundColor:
                    mode === "light"
                      ? alpha("#2563eb", 0.12)
                      : alpha("#94a3b8", 0.16),
                  boxShadow:
                    mode === "light"
                      ? `inset 0 0 0 1px ${alpha("#2563eb", 0.12)}`
                      : `inset 0 0 0 1px ${alpha("#cbd5e1", 0.1)}`,
                  transform: "translateX(2px)",
                },
                "&.Mui-selected:hover": {
                  backgroundColor:
                    mode === "light"
                      ? alpha("#2563eb", 0.16)
                      : alpha("#94a3b8", 0.2),
                },
                '&:hover': {
                  backgroundColor:
                    mode === "light"
                      ? "rgba(37, 99, 235, 0.08)"
                      : "rgba(148, 163, 184, 0.12)",
                  transform: "translateX(2px)",
                },
              },
            },
          },
          MuiListItemIcon: {
            styleOverrides: {
              root: {
                color: mode === "light" ? "#2563eb" : "#cbd5e1",
              },
            },
          },
          MuiDivider: {
            styleOverrides: {
              root: {
                borderColor: mode === "light" ? "rgba(148, 163, 184, 0.16)" : "rgba(148, 163, 184, 0.14)",
              },
            },
          },
          MuiMenu: {
            styleOverrides: {
              paper: {
                background:
                  mode === "light"
                    ? "linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(241, 245, 249, 0.92) 100%)"
                    : "linear-gradient(180deg, #111827 0%, #0f172a 100%)",
                backdropFilter: "blur(16px)",
                border: mode === "light"
                  ? "1px solid rgba(148, 163, 184, 0.16)"
                  : "1px solid rgba(148, 163, 184, 0.12)",
                boxShadow:
                  mode === "light"
                    ? "0 22px 50px rgba(15, 23, 42, 0.12)"
                    : "0 22px 50px rgba(2, 6, 23, 0.3)",
              },
            },
          },
          MuiAvatar: {
            styleOverrides: {
              root: {
                background: "linear-gradient(135deg, #2563eb 0%, #14b8a6 100%)",
                color: "#eff6ff",
                boxShadow: "0 10px 24px rgba(37, 99, 235, 0.22)",
              },
            },
          },
        },
      }),
    [mode, open]
  );

  React.useEffect(() => {
    if (!open) {
      return;
    }

    const activeParent = [...MODULOS.independientes, ...MODULOS.sistema].find(
      (item) => item.children?.some((child) => isPathActive(child.path))
    );

    if (!activeParent) {
      return;
    }

    setSubmenuOpen((prev) => {
      if (prev[activeParent.title]) {
        return prev;
      }

      return { ...prev, [activeParent.title]: true };
    });
  }, [open, isPathActive]);

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

  const navigateToRoute = (path: string) => {
    handlePopoverClose();

    if (!open) {
      navigate(path);
      return;
    }

    const hasExpandedSubmenu = Object.values(submenuOpen).some(Boolean);

    if (hasExpandedSubmenu) {
      setSubmenuOpen({});

      window.setTimeout(() => {
        setOpen(false);

        window.setTimeout(() => {
          navigate(path);
        }, APP_DRAWER_CLOSE_MS);
      }, APP_SUBMENU_COLLAPSE_MS);

      return;
    }

    setOpen(false);

    window.setTimeout(() => {
      navigate(path);
    }, APP_DRAWER_CLOSE_MS);
  };

  // Función logout
  const logout = () => {
    if (isLoggingOut) {
      return;
    }

    handleProfileMenuClose();
    handlePopoverClose();
    setIsLoggingOut(true);

    window.setTimeout(() => {
      clearSession();
      navigate("/login");
    }, APP_LOGOUT_SPLASH_TOTAL_MS);
  };

  React.useEffect(() => {
    if (!hasValidSession()) {
      navigate("/login");
    }
  }, [navigate]);

  React.useEffect(() => {
    if (!showBootSplash) {
      return;
    }

    const timerId = window.setTimeout(() => {
      setShowBootSplash(false);
      setAnimateAsideIcons(true);
    }, APP_BOOT_SPLASH_TOTAL_MS);

    return () => window.clearTimeout(timerId);
  }, [showBootSplash]);

  React.useEffect(() => {
    if (!animateAsideIcons) {
      return;
    }

    const timerId = window.setTimeout(() => {
      setAnimateAsideIcons(false);
    }, APP_ASIDE_ICON_CASCADE_MS);

    return () => window.clearTimeout(timerId);
  }, [animateAsideIcons]);

  const activeSplashMode = isLoggingOut ? "logout" : showBootSplash ? "boot" : null;
  const navigationActiveReady = !showBootSplash && !animateAsideIcons;
  let navAnimationIndex = 0;

  return (
    <MuiThemeProvider theme={theme}>
      <Box
        className={`theme-layout ${showBootSplash ? "theme-layout--booting" : ""} ${isLoggingOut ? "theme-layout--logging-out" : ""}`}
        sx={{
          display: "flex",
          bgcolor: "background.default",
          height: "100vh",
          minHeight: "100vh",
          overflow: "hidden",
        }}
      >
        <CssBaseline />
        {activeSplashMode ? (
          <div
            className={`theme-layout__splash theme-layout__splash--${mode} ${activeSplashMode === "logout" ? "theme-layout__splash--logout" : ""}`}
            aria-hidden="true"
          >
            {activeSplashMode === "logout" ? (
              <>
                <div className="theme-layout__splash-glow theme-layout__splash-glow--left" />
                <div className="theme-layout__splash-glow theme-layout__splash-glow--right" />
                <div className="theme-layout__shutdown-stage">
                  <span className="theme-layout__shutdown-halo" />
                  <div className="theme-layout__shutdown-rail">
                    <span className="theme-layout__shutdown-progress" />
                    <span className="theme-layout__shutdown-core" />
                  </div>
                  <div className="theme-layout__shutdown-gates" aria-hidden="true">
                    <span className="theme-layout__shutdown-gate theme-layout__shutdown-gate--left" />
                    <span className="theme-layout__shutdown-gate theme-layout__shutdown-gate--right" />
                  </div>
                </div>
              </>
            ) : activeSplashMode === "boot" && APP_BOOT_SPLASH_VARIANT === "aperture" ? (
              <>
                <div className="theme-layout__splash-glow theme-layout__splash-glow--left" />
                <div className="theme-layout__splash-glow theme-layout__splash-glow--right" />
                <div className="theme-layout__aperture-stage">
                  <span className="theme-layout__aperture-halo" />
                  <div className="theme-layout__aperture-rail">
                    <span className="theme-layout__aperture-progress" />
                    <span className="theme-layout__aperture-core" />
                  </div>
                  <div className="theme-layout__aperture-gates" aria-hidden="true">
                    <span className="theme-layout__aperture-gate theme-layout__aperture-gate--left" />
                    <span className="theme-layout__aperture-gate theme-layout__aperture-gate--right" />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="theme-layout__splash-glow theme-layout__splash-glow--left" />
                <div className="theme-layout__splash-glow theme-layout__splash-glow--right" />
                <div className="theme-layout__splash-stage">
                  <div className="theme-layout__splash-track">
                    <span className="theme-layout__splash-progress" />
                    <span className="theme-layout__splash-node" />
                  </div>
                  <span className="theme-layout__splash-pulse" />
                </div>
              </>
            )}
          </div>
        ) : null}
        <AppBar position="fixed" color="primary" className="theme-layout__appbar">
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
          className="theme-layout__drawer"
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
          <List className="theme-layout__nav-scroll" sx={{ flex: 1 }}>
            {Object.entries(MODULOS).map(([seccion, items], idx, arr) => (
              <React.Fragment key={seccion}>
                {items.map((item) => {
                  const itemAnimationIndex = navAnimationIndex;
                  const itemIsActive = isModuleActive(item);
                  navAnimationIndex += 1;

                  return (
                  <React.Fragment key={item.title}>
                    <ListItem
                      disablePadding
                      sx={{ display: "block" }}
                    >
                      <ListItemButton
                        selected={navigationActiveReady && itemIsActive}
                        sx={{
                          minHeight: 48,
                          justifyContent: open ? "initial" : "center",
                          px: 2.5,
                          color: "text.primary",
                        }}
                        onClick={(e) =>
                          item.children
                            ? open
                              ? handleSubmenuToggle(item.title)
                              : handlePopoverOpen(e, item.title)
                            : item.path
                            ? navigateToRoute(item.path)
                            : undefined
                        }
                      >
                        <ListItemIcon
                          className={`theme-layout__nav-icon ${animateAsideIcons ? "theme-layout__nav-icon--cascade" : ""}`}
                          sx={{
                            minWidth: 0,
                            mr: open ? 3 : "auto",
                            justifyContent: "center",
                            "--theme-nav-delay": `${itemAnimationIndex * 90}ms`,
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.title}
                          sx={{
                            opacity: open ? 1 : 0,
                            transition: `opacity ${open ? 140 : 90}ms ease`,
                          }}
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
                                selected={navigationActiveReady && isPathActive(subitem.path)}
                                sx={{
                                  pl: open ? 6 : 2.5,
                                  justifyContent: open ? "initial" : "center",
                                  color: "text.primary",
                                }}
                                onClick={() => navigateToRoute(subitem.path)}
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
                                  sx={{
                                    opacity: open ? 1 : 0,
                                    transition: `opacity ${open ? 140 : 90}ms ease`,
                                  }}
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
                                selected={navigationActiveReady && isPathActive(subitem.path)}
                                onClick={() => navigateToRoute(subitem.path)}
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
                )})}
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
              alt={getUserFullName(user)}
              sx={{ width: 40, height: 40, fontSize: "1rem", cursor: "pointer" }}
              onClick={handleProfileMenuOpen}
            >
              {getUserInitials(user)}
            </Avatar>
            {open && (
              <>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body1" fontWeight={500} noWrap>
                    {getUserFullName(user)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {user?.email || "Sin correo"}
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
          className="theme-layout__main"
          component="main"
          sx={{
            flexGrow: 1,
            minWidth: 0,
            minHeight: 0,
            bgcolor: "background.default",
            color: "text.primary",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            background:
              mode === "light"
                ? "linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)"
                : "linear-gradient(180deg, #0f172a 0%, #111827 100%)",
          }}
        >
          <DrawerHeader />
          <Box className="theme-layout__content">
            {children}
          </Box>
        </Box>
      </Box>
    </MuiThemeProvider>
  );
}