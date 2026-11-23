"use client";

import { Suspense } from "react";
import Box from "@mui/material/Box";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/admin/dashboard-header";
import { OrdersClient } from "./_components/orders-client";

export default function OrdersPage() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <DashboardHeader
        title='Orders'
        description='Manage and track all customer checkout attempts.'
      />

      <Suspense
        fallback={
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Skeleton variant="rounded" animation="wave" width="100%" height={44} />
            <Skeleton variant="rounded" animation="wave" width="100%" height={260} />
          </Box>
        }
      >
        <OrdersClient />
      </Suspense>
    </Box>
  );
}
