"use server";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { getOrders } from "@/actions/orders";
import { OrdersClient } from "./_components/orders-client";
import type { OrderStatus } from "@/db/schema";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
  }>;
}

export default async function OrdersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const search = params.search || "";
  const status = params.status as OrderStatus | undefined;

  const result = await getOrders({
    page,
    limit: 10,
    search,
    status,
  });

  if (!result.success) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          textAlign: "center",
          py: 10,
        }}
      >
        <Typography
          component='h2'
          sx={{
            fontSize: 20,
            fontWeight: 600,
            color: "error.main",
            lineHeight: 1.3,
          }}
        >
          Failed to load orders
        </Typography>
        <Typography sx={{ color: "text.secondary", fontSize: 14 }}>{result.error}</Typography>
      </Box>
    );
  }

  // Explicit narrowing for TypeScript
  const orders = result.orders!;
  const metadata = result.metadata!;

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

      <OrdersClient initialOrders={orders} metadata={metadata} search={search} status={status} />
    </Box>
  );
}
