"use client";

import type { Navigation } from "@toolpad/core/AppProvider";

import SpaceDashboardOutlinedIcon from "@mui/icons-material/SpaceDashboardOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import HistoryIcon from "@mui/icons-material/History";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";

export const NAVIGATION: Navigation = [
  {
    kind: "header",
    title: "Main items",
  },
  {
    segment: "admin",
    title: "Overview",
    icon: <SpaceDashboardOutlinedIcon />,
  },
  {
    segment: "admin/products",
    title: "Products",
    icon: <Inventory2OutlinedIcon />,
  },
  {
    segment: "admin/categories",
    title: "Categories",
    icon: <LayersOutlinedIcon />,
  },
  {
    segment: "admin/orders",
    title: "Orders",
    icon: <LocalMallOutlinedIcon />,
  },
  {
    segment: "admin/users",
    title: "Users",
    icon: <PeopleOutlinedIcon />,
  },
  {
    segment: "admin/reviews",
    title: "Reviews",
    icon: <StarBorderIcon />,
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Finance & Analytics",
  },
  {
    segment: "admin/sales",
    title: "Sale's report",
    icon: <BarChartOutlinedIcon />,
  },
  {
    segment: "admin/expenses",
    title: "Expense summary",
    icon: <TrendingDownIcon />,
  },
  {
    segment: "admin/payments",
    title: "Payment history",
    icon: <CreditCardOutlinedIcon />,
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "System & Security",
  },
  {
    segment: "admin/sessions",
    title: "Sessions",
    icon: <HistoryIcon />,
  },
  {
    segment: "admin/audit-logs",
    title: "Audit logs",
    icon: <AssignmentOutlinedIcon />,
  },
];

export const sidebarItems = [
  { href: "/admin", label: "Overview", icon: SpaceDashboardOutlinedIcon },
  { href: "/admin/products", label: "Products", icon: Inventory2OutlinedIcon },
  { href: "/admin/categories", label: "Categories", icon: LayersOutlinedIcon },
  { href: "/admin/users", label: "Users", icon: PeopleOutlinedIcon },
  { href: "/admin/orders", label: "Orders", icon: LocalMallOutlinedIcon },
  { href: "/admin/reviews", label: "Reviews", icon: StarBorderIcon },
  { href: "/admin/sessions", label: "Sessions", icon: HistoryIcon },
  { href: "/admin/sales", label: "Sale's report", icon: BarChartOutlinedIcon },
  { href: "/admin/expenses", label: "Expense summary", icon: TrendingDownIcon },
  { href: "/admin/payments", label: "Payment history", icon: CreditCardOutlinedIcon },
  { href: "/admin/audit-logs", label: "Audit logs", icon: AssignmentOutlinedIcon },
];

export function SidebarContent(_props: { onItemClick?: () => void }) {
  return null;
}

export function Sidebar() {
  return null;
}
