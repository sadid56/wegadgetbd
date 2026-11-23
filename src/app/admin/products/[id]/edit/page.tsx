"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { EmptyState, Skeleton } from "@/components/ui";

import { ProductForm } from "@/components/admin/product-form";
import { orpc } from "@/lib/orpc/client";

export function useAdminProductDetails(id: string) {
  return useQuery({
    ...orpc.products.adminGet.queryOptions({ input: { id } }),
    enabled: !!id,
  });
}

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useQuery({
    ...orpc.products.adminGet.queryOptions({ input: { id } }),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Skeleton variant="rounded" animation="wave" width={180} height={32} />
        <Box sx={{ bgcolor: "background.paper", borderRadius: "12px", p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
          <Skeleton variant="rounded" animation="wave" width="100%" height={42} />
          <Skeleton variant="rounded" animation="wave" width="100%" height={42} />
          <Skeleton variant="rounded" animation="wave" width="100%" height={140} />
        </Box>
      </Box>
    );
  }

  if (!data) {
    return <EmptyState title="Product not found" />;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Typography
        component='h1'
        sx={{
          fontSize: 24,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: "text.primary",
        }}
      >
        Edit Product
      </Typography>

      <Box
        sx={{
          bgcolor: "background.paper",
          borderRadius: "8px",
          border: "1px solid",
          borderColor: "divider",
          p: 3,
        }}
      >
        <ProductForm initialData={data} />
      </Box>
    </Box>
  );
}
