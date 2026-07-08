import type { ReactNode } from "react";

// Alta de iconos:
// 1. Busca el icono en la documentacion de MUI Icons y copia su import oficial.
// 2. Pega aqui el import del componente, por ejemplo:
//    import ShowChartIcon from "@mui/icons-material/ShowChart";
// 3. En el sistema/backend guarda un alias estable en formato slug, por ejemplo:
//    show-chart-icon
// 4. Agrega ese alias en iconMap y ligalo con el componente importado.
// 5. La UI recibe ese alias desde backend y resolveNavigationIcon lo traduce al icono visual.

// Base compartida
import BuildIcon from "@mui/icons-material/Build";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";

// Inventario
import InventoryIcon from "@mui/icons-material/Inventory";
import SellIcon from "@mui/icons-material/Sell";
import AddCircleIcon from "@mui/icons-material/AddCircle";

// Organizacion
import ApartmentIcon from "@mui/icons-material/Apartment";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

// Seguridad
import ShieldIcon from "@mui/icons-material/Shield";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import RecentActorsIcon from "@mui/icons-material/RecentActors";

// Sistema
import DnsIcon from "@mui/icons-material/Dns";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import WebStoriesIcon from "@mui/icons-material/WebStories";
import ShowChartIcon from "@mui/icons-material/ShowChart";

// Sistema > Modulos y procesos especificos
import DesktopWindowsRoundedIcon from "@mui/icons-material/DesktopWindowsRounded";
import ViewModuleRoundedIcon from "@mui/icons-material/ViewModuleRounded";


function normalizeIconKey(value?: string | null) {
  return (value || "")
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-");
}

// iconMap conecta el alias guardado en backend con el componente real de MUI.
// Si backend manda un alias que no exista aqui, la UI usara SettingsSuggestIcon como fallback.
const iconMap: Record<string, ReactNode> = {
  // Base compartida
  "dashboard-icon": <DashboardIcon />,

  // Inventario
  "inventory-icon": <InventoryIcon />,
  "sell-icon": <SellIcon />,
  "products-icon": <SellIcon />,
  "add-circle-icon": <AddCircleIcon />,
  "catalog-icon": <AddCircleIcon />,

  // Organizacion
  "apartment-icon": <ApartmentIcon />,
  "organization-icon": <ApartmentIcon />,
  "people-icon": <PeopleAltIcon />,
  "users-icon": <PeopleAltIcon />,
  "corporate-fare-icon": <CorporateFareIcon />,
  "department-icon": <CorporateFareIcon />,
  "account-balance-icon": <AccountBalanceIcon />,
  "branch-icon": <AccountBalanceIcon />,

  // Seguridad
  "shield-icon": <ShieldIcon />,
  "security-icon": <ShieldIcon />,
  "vpn-key-icon": <VpnKeyIcon />,
  "access-icon": <VpnKeyIcon />,
  "recent-actors-icon": <RecentActorsIcon />,
  "profile-icon": <RecentActorsIcon />,

  // Sistema
  "pc-icon": <DnsIcon />,
  "dns-icon": <DnsIcon />,
  "system-icon": <DnsIcon />,
  "view-module-icon": <ViewModuleIcon />,
  "module-icon": <ViewModuleIcon />,
  "build-icon": <BuildIcon />,
  "process-icon": <WebStoriesIcon />,
  "web-stories-icon": <WebStoriesIcon />,
  "show-chart-icon": <ShowChartIcon />,

  // Sistema > Modulos
  "desktop-windows-rounded-icon": <DesktopWindowsRoundedIcon />,

  // Sistema > Procesos
  "view-module-rounded-icon": <ViewModuleRoundedIcon />,
};

export function resolveNavigationIcon(iconKey?: string | null, fallbackLabel?: string) {
  const normalizedKey = normalizeIconKey(iconKey);
  const normalizedLabel = normalizeIconKey(fallbackLabel);

  return iconMap[normalizedKey] || iconMap[normalizedLabel] || <SettingsSuggestIcon />;
}

export { DashboardIcon };