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

// Gestion > Inventario
import InventoryIcon from "@mui/icons-material/Inventory";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import SellIcon from "@mui/icons-material/Sell";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import WarehouseRoundedIcon from "@mui/icons-material/WarehouseRounded";

// Sistema > Organizacion
import ApartmentIcon from "@mui/icons-material/Apartment";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

// Gestion > Seguridad
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import LinkedCameraRoundedIcon from "@mui/icons-material/LinkedCameraRounded";

// Sistema
import DesktopMacRoundedIcon from "@mui/icons-material/DesktopMacRounded";
import DesktopWindowsRoundedIcon from "@mui/icons-material/DesktopWindowsRounded";
import ViewModuleRoundedIcon from "@mui/icons-material/ViewModuleRounded";
import KeyRoundedIcon from "@mui/icons-material/KeyRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import CorporateFareRoundedIcon from "@mui/icons-material/CorporateFareRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import SafetyDividerRoundedIcon from "@mui/icons-material/SafetyDividerRounded";

// Compatibilidad y vistas generales
import ShieldIcon from "@mui/icons-material/Shield";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import DnsIcon from "@mui/icons-material/Dns";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import WebStoriesIcon from "@mui/icons-material/WebStories";
import ShowChartIcon from "@mui/icons-material/ShowChart";

function normalizeIconKey(value?: string | null) {
  return (value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s_-]+/g, "")
    .replace(/[_\s]+/g, "-");
}

function registerIconAliases(icon: ReactNode, aliases: string[]) {
  return Object.fromEntries(aliases.map((alias) => [normalizeIconKey(alias), icon]));
}

const iconMap: Record<string, ReactNode> = {
  // Gestion
  ...registerIconAliases(<SecurityRoundedIcon />, ["security-rounded"]),
  ...registerIconAliases(<LinkedCameraRoundedIcon />, ["linked-camera-rounded"]),

  // Sistema
  ...registerIconAliases(<DesktopMacRoundedIcon />, ["desktop-mac-rounded"]),
  ...registerIconAliases(<DesktopWindowsRoundedIcon />, ["desktop-windows-rounded-icon"]),
  ...registerIconAliases(<ViewModuleRoundedIcon />, ["view-module-rounded-icon"]),
  ...registerIconAliases(<KeyRoundedIcon />, ["key-rounded"]),
  ...registerIconAliases(<PeopleAltRoundedIcon />, ["people-alt-rounded"]),
  ...registerIconAliases(<BadgeRoundedIcon />, ["badge-rounded"]),
  ...registerIconAliases(<CorporateFareRoundedIcon />, ["corporate-fare-rounded"]),
  ...registerIconAliases(<WorkRoundedIcon />, ["work-rounded"]),
  ...registerIconAliases(<ApartmentRoundedIcon />, ["apartment-rounded"]),
  ...registerIconAliases(<SafetyDividerRoundedIcon />, ["safety-divider-rounded"]),

  // Base compartida
  ...registerIconAliases(<DashboardIcon />, ["dashboard-icon"]),
  ...registerIconAliases(<BuildIcon />, ["build-icon"]),

  // Gestion > Inventario
  ...registerIconAliases(<InventoryIcon />, ["inventory-icon"]),
  ...registerIconAliases(<Inventory2RoundedIcon />, ["inventory-2-rounded"]),
  ...registerIconAliases(<SellIcon />, ["sell-icon", "products-icon"]),
  ...registerIconAliases(<AddCircleIcon />, ["add-circle-icon", "catalog-icon"]),
  ...registerIconAliases(<WarehouseRoundedIcon />, ["warehouse-rounded", "ware-house-rounded"]),

  // Sistema > Organizacion
  ...registerIconAliases(<ApartmentIcon />, ["apartment-icon", "organization-icon"]),
  ...registerIconAliases(<PeopleAltIcon />, ["people-icon", "users-icon"]),
  ...registerIconAliases(<CorporateFareIcon />, ["corporate-fare-icon", "department-icon"]),
  ...registerIconAliases(<AccountBalanceIcon />, ["account-balance-icon", "branch-icon"]),

  // Compatibilidad
  ...registerIconAliases(<ShieldIcon />, ["shield-icon", "security-icon"]),
  ...registerIconAliases(<VpnKeyIcon />, ["vpn-key-icon", "access-icon"]),
  ...registerIconAliases(<RecentActorsIcon />, ["recent-actors-icon", "profile-icon"]),
  ...registerIconAliases(<DnsIcon />, ["dns-icon", "pc-icon", "system-icon"]),
  ...registerIconAliases(<ViewModuleIcon />, ["view-module-icon", "module-icon"]),
  ...registerIconAliases(<WebStoriesIcon />, ["web-stories-icon", "process-icon"]),
  ...registerIconAliases(<ShowChartIcon />, ["show-chart-icon"]),
};

export function resolveNavigationIcon(iconKey?: string | null, fallbackLabel?: string) {
  const normalizedKey = normalizeIconKey(iconKey);
  const normalizedLabel = normalizeIconKey(fallbackLabel);

  return iconMap[normalizedKey] || iconMap[normalizedLabel] || <SettingsSuggestIcon />;
}

export { DashboardIcon };