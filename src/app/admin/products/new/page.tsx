"use client";

import { useRouter } from "next/navigation";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button } from "@/components/ui/button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { ProductForm } from "@/components/admin/product-form";

export default function CreateProductPage() {
  const router = useRouter();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <Button
          variant='text'
          disableElevation
          onClick={() => router.back()}
          aria-label='Go back'
          sx={{
            minWidth: 0,
            p: 1,
            borderRadius: "8px",
            color: "text.primary",
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          <ArrowBackIcon sx={{ fontSize: 18 }} />
        </Button>
        <Typography
          component='h1'
          sx={{
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "text.primary",
          }}
        >
          Create Product
        </Typography>
      </Box>

      <Box
        sx={{
          bgcolor: "background.paper",
          borderRadius: "8px",
          border: "1px solid",
          borderColor: "divider",
          p: 3,
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <ProductForm />
      </Box>
    </Box>
  );
}
