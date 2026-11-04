"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button } from "@/components/ui/button";
import { CircularProgress } from "@/components/ui/spinner";
import NextLink from "next/link";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useDashboardStats } from "@/query-client/admin/dashboard";
import { DashboardHeader } from "@/components/admin/dashboard-header";
import { SalesChart } from "./_components/sales-chart";
import { RecentUsers } from "./_components/recent-users";
import { RecentPayments } from "./_components/recent-payments";
import { StatsCard } from "@/components/common/StatsCard";

const statGridSx = {
  display: "grid",
  gap: { xs: 2, sm: 2.5 },
  gridTemplateColumns: {
    xs: "1fr",
    sm: "repeat(2, minmax(0, 1fr))",
    lg: "repeat(4, minmax(0, 1fr))",
  },
} as const;

const sevenColGridSx = {
  display: "grid",
  gap: { xs: 2, sm: 2.5 },
  gridTemplateColumns: {
    xs: "1fr",
    md: "repeat(2, minmax(0, 1fr))",
    lg: "repeat(7, minmax(0, 1fr))",
  },
} as const;

export default function AdminDashboard() {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <CircularProgress size={36} sx={{ color: "primary.main" }} />
        <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
          Loading dashboard metrics...
        </Typography>
      </Box>
    );
  }

  const revenue = Number(stats?.totalRevenue ?? 0);
  const totalOrders = Number(stats?.totalOrders ?? 0);
  const totalProducts = Number(stats?.totalProducts ?? 0);
  const activeProducts = Number(stats?.activeProducts ?? 0);
  const pendingProducts = Number(stats?.pendingProducts ?? 0);
  const totalUsers = Number(stats?.totalUsers ?? 0);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 2.5, sm: 3 }, pb: { xs: 6, sm: 8, md: 10 } }}>
      {/* Dashboard Top Header */}
      <DashboardHeader
        title='Dashboard'
        description='Welcome to We Gadget BD admin overview and real-time business metrics.'
        action={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, flexWrap: "wrap" }}>
            <Button
              component={NextLink}
              href='/admin/products/new'
              variant='primary'
              size='sm'
              startIcon={<AddIcon sx={{ fontSize: 16 }} />}
            >
              Add Product
            </Button>
            <Button
              component={NextLink}
              href='/admin/orders'
              variant='outline'
              size='sm'
              endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
            >
              View Orders
            </Button>
            <Button
              component={NextLink}
              href='/admin/categories'
              variant='outline'
              size='sm'
              endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
            >
              Categories
            </Button>
          </Box>
        }
      />

      {/* 4 Stats Cards */}
      <Box sx={statGridSx}>
        <StatsCard
          title='Total Revenue'
          value={`৳${revenue.toLocaleString()}`}
          icon={AccountBalanceWalletOutlinedIcon}
          description='All-time store revenue'
        />
        <StatsCard
          title='Total Orders'
          value={totalOrders.toLocaleString()}
          icon={LocalMallOutlinedIcon}
          description='Lifetime customer orders'
        />
        <StatsCard
          title='Products'
          value={totalProducts.toLocaleString()}
          icon={Inventory2OutlinedIcon}
          description={`${activeProducts} active, ${pendingProducts} pending`}
        />
        <StatsCard
          title='Total Customers'
          value={totalUsers.toLocaleString()}
          icon={PeopleOutlinedIcon}
          description='Registered user accounts'
        />
      </Box>

      {/* Sales Chart + Recent users */}
      <Box sx={sevenColGridSx}>
        <Box sx={{ gridColumn: { xs: "1 / -1", md: "1 / -1", lg: "span 4" }, minWidth: 0 }}>
          <SalesChart data={stats?.salesChartData || []} />
        </Box>
        <Box sx={{ gridColumn: { xs: "1 / -1", md: "1 / -1", lg: "span 3" }, minWidth: 0 }}>
          <RecentUsers users={stats?.recentUsers || []} />
        </Box>
      </Box>

      {/* Recent payments */}
      <Box sx={sevenColGridSx}>
        <Box sx={{ gridColumn: "1 / -1", minWidth: 0 }}>
          <RecentPayments payments={stats?.recentPayments || []} />
        </Box>
      </Box>
    </Box>
  );
}
