"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

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
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress size={32} sx={{ color: "primary.main" }} />
      </Box>
    );
  }

  if (!data) {
    return <Box sx={{ py: 6, textAlign: "center", color: "text.secondary", fontSize: 14 }}>Product not found</Box>;
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
