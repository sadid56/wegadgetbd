"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

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

interface SidebarContentProps {
  onItemClick?: () => void;
}

export function SidebarContent({ onItemClick }: SidebarContentProps) {
  const pathname = usePathname();

  return (
    <Box
      component='nav'
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        gap: 0.5,
        px: { xs: 1, lg: 2 },
        fontSize: 14,
        fontWeight: 500,
      }}
    >
      {sidebarItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Box
            key={item.href}
            component={NextLink}
            href={item.href}
            onClick={onItemClick}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              px: 1.5,
              py: 1,
              borderRadius: "8px",
              textDecoration: "none",
              color: isActive ? "primary.main" : "text.secondary",
              bgcolor: isActive ? "action.hover" : "transparent",
              transition: "all 150ms",
              "&:hover": {
                color: "primary.main",
                bgcolor: isActive ? "action.hover" : "action.hover",
              },
            }}
          >
            <Icon sx={{ fontSize: 16 }} />
            <Box component='span'>{item.label}</Box>
          </Box>
        );
      })}
    </Box>
  );
}

export function Sidebar() {
  return (
    <Box
      component='aside'
      sx={{
        display: { xs: "none", md: "block" },
        width: 256,
        borderRight: "1px solid",
        borderColor: "divider",
        bgcolor: "action.hover",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          height: "100%",
          maxHeight: "100vh",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            height: { xs: 56, lg: 60 },
            borderBottom: "1px solid",
            borderColor: "divider",
            px: { xs: 2, lg: 3 },
          }}
        >
          <Box
            component={NextLink}
            href='/'
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontWeight: 600,
              textDecoration: "none",
              color: "text.primary",
            }}
          >
            <Inventory2OutlinedIcon sx={{ fontSize: 24 }} />
            <Typography component='span' sx={{ fontSize: 15, fontWeight: 600, color: "text.primary" }}>
              Bongo Admin
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flex: 1, py: 1 }}>
          <SidebarContent />
        </Box>
      </Box>
    </Box>
  );
}
