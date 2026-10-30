"use client";

import { Suspense } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { CircularProgress } from "@/components/ui/spinner";
import { OrdersClient } from "./_components/orders-client";

export default function OrdersPage() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box>
        <Typography
          component='h1'
          sx={{
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "text.primary",
            lineHeight: 1.3,
          }}
        >
          Order Management
        </Typography>
        <Typography
          sx={{
            fontSize: 14,
            color: "text.secondary",
            mt: 0.5,
            lineHeight: 1.5,
          }}
        >
          Manage and track all customer checkout attempts.
        </Typography>
      </Box>

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
