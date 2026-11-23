"use client";

import Box from "@mui/material/Box";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
  gap: { xs: 1.25, sm: 2.5 },
  gridTemplateColumns: {
    xs: "repeat(2, minmax(0, 1fr))",
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
      <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 2.5, sm: 3 }, pb: { xs: 6, sm: 8, md: 10 } }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Skeleton variant="rounded" animation="wave" width={160} height={32} />
            <Skeleton variant="rounded" animation="wave" width={260} height={18} />
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Skeleton variant="rounded" animation="wave" width={110} height={34} sx={{ borderRadius: "999px" }} />
            <Skeleton variant="rounded" animation="wave" width={110} height={34} sx={{ borderRadius: "999px" }} />
          </Box>
        </Box>
        <Box sx={statGridSx}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} sx={{ p: { xs: 1.75, sm: 2.5 }, display: "flex", flexDirection: "column", gap: 1 }}>
              <Skeleton variant="rounded" animation="wave" width="60%" height={16} />
              <Skeleton variant="rounded" animation="wave" width="45%" height={30} />
              <Skeleton variant="rounded" animation="wave" width="75%" height={14} />
            </Card>
          ))}
        </Box>
        <Box sx={sevenColGridSx}>
          <Card sx={{ gridColumn: { md: "span 2", lg: "span 4" }, p: 2.5 }}>
            <Skeleton variant="rounded" animation="wave" width="40%" height={22} sx={{ mb: 2 }} />
            <Skeleton variant="rounded" animation="wave" width="100%" height={240} />
          </Card>
          <Card sx={{ gridColumn: { md: "span 2", lg: "span 3" }, p: 2.5 }}>
            <Skeleton variant="rounded" animation="wave" width="45%" height={22} sx={{ mb: 2 }} />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} variant="rounded" animation="wave" width="100%" height={44} />
              ))}
            </Box>
          </Card>
        </Box>
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: { xs: 0.65, sm: 1.25 },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <Button
              component={NextLink}
              href='/admin/products/new'
              variant='primary'
              size='sm'
              startIcon={<AddIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />}
              sx={{
                whiteSpace: "nowrap",
                px: { xs: 1.1, sm: 2 },
                py: { xs: 0.55, sm: 0.75 },
                minHeight: { xs: 32, sm: 36 },
                fontSize: { xs: "0.72rem", sm: "0.8125rem" },
                "& .MuiButton-startIcon": { mr: { xs: 0.4, sm: 0.75 }, ml: 0 },
              }}
            >
              Add Product
            </Button>
            <Button
              component={NextLink}
              href='/admin/orders'
              variant='outline'
              size='sm'
              endIcon={<ArrowForwardIcon sx={{ fontSize: { xs: 13, sm: 14 } }} />}
              sx={{
                whiteSpace: "nowrap",
                px: { xs: 1.1, sm: 2 },
                py: { xs: 0.55, sm: 0.75 },
                minHeight: { xs: 32, sm: 36 },
                fontSize: { xs: "0.72rem", sm: "0.8125rem" },
                "& .MuiButton-endIcon": { ml: { xs: 0.4, sm: 0.75 }, mr: 0 },
              }}
            >
              View Orders
            </Button>
            <Button
              component={NextLink}
              href='/admin/categories'
              variant='outline'
              size='sm'
              endIcon={<ArrowForwardIcon sx={{ fontSize: { xs: 13, sm: 14 } }} />}
              sx={{
                whiteSpace: "nowrap",
                px: { xs: 1.1, sm: 2 },
                py: { xs: 0.55, sm: 0.75 },
                minHeight: { xs: 32, sm: 36 },
                fontSize: { xs: "0.72rem", sm: "0.8125rem" },
                "& .MuiButton-endIcon": { ml: { xs: 0.4, sm: 0.75 }, mr: 0 },
              }}
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
