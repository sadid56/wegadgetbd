"use client";

import NextLink from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import { Button } from "@/components/ui/button";
import { tokens } from "@/theme/theme";
import { ProductCard } from "./ProductCard";
import { useProducts } from "@/query-client/products";

export function HotDealsSection() {
  const { data } = useProducts({ featured: true, limit: 8 });
  const products = data?.products ?? [];

  if (products.length === 0) return null;

  return (
    <Box component='section' sx={{ width: "100%", py: 1.5 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1.5,
          pb: 1.5,
          borderBottom: 1,
          borderColor: tokens.borderDefault,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LocalFireDepartmentIcon sx={{ fontSize: 24, color: tokens.primary }} />
          <Typography
            component='h2'
            className='bricolage'
            sx={{
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: tokens.textPrimary,
              fontSize: { xs: "1.25rem", md: "1.5rem" },
              lineHeight: 1.2,
            }}
          >
            Hot Deals
          </Typography>
        </Box>

        <Button
          component={NextLink}
          href='/products'
          size='small'
          variant='outlined'
          sx={{
            fontWeight: 600,
            fontSize: "0.85rem",
            color: tokens.primary,
            borderColor: tokens.borderDefault,
            borderRadius: "6px",
            textTransform: "none",
            px: 2,
            py: 0.6,
            minWidth: 0,
            transition: "all 200ms",
            "&:hover": {
              borderColor: tokens.primary,
              bgcolor: tokens.primary,
              color: tokens.textWhite,
            },
          }}
        >
          View All
        </Button>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            sm: "repeat(3, minmax(0, 1fr))",
            md: "repeat(4, minmax(0, 1fr))",
          },
          gap: { xs: 1, md: 2 },
        }}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </Box>
    </Box>
  );
}
