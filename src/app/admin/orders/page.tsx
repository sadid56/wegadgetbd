"use client";

import { Suspense } from "react";
import Box from "@mui/material/Box";
import { CircularProgress } from "@/components/ui/spinner";
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
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress />
          </Box>
        }
      >
        <OrdersClient />
      </Suspense>
    </Box>
  );
}
