"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import { useDashboardStats } from "@/query-client/admin/dashboard";
import { SalesChart } from "./_components/sales-chart";
import { RecentUsers } from "./_components/recent-users";
import { RecentPayments } from "./_components/recent-payments";
import { StatsCard } from "@/components/common/StatsCard";

const statGridSx = {
  display: "grid",
  gap: 2,
  gridTemplateColumns: {
    xs: "1fr",
    md: "repeat(2, minmax(0, 1fr))",
    lg: "repeat(4, minmax(0, 1fr))",
  },
} as const;

const sevenColGridSx = {
  display: "grid",
  gap: 2,
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
          minHeight: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={32} sx={{ color: "primary.main" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Typography
          component='h1'
          sx={{
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "text.primary",
            lineHeight: 1.2,
          }}
        >
          Dashboard
        </Typography>
      </Box>

      {/* Stats cards */}
      <Box sx={statGridSx}>
        <StatsCard title='Total Users' value={stats?.totalUsers || 0} icon={GroupOutlinedIcon} />
        <StatsCard
          title='Active Products'
          value={stats?.activeProducts || 0}
          icon={Inventory2OutlinedIcon}
          description={`of ${stats?.totalProducts ?? 0} total`}
        />
        <StatsCard title='Pending Products' value={stats?.pendingProducts || 0} icon={TrendingUpIcon} />
      </Box>

      {/* Chart + Recent users */}
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
