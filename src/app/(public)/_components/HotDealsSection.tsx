"use client";

import NextLink from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
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
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LocalFireDepartmentIcon sx={{ fontSize: 24, color: "#ff7319" }} />
          <Typography
            component='h2'
            className='bricolage'
            sx={{
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "text.primary",
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
            color: "#ff7319",
            borderColor: "divider",
            borderRadius: "6px",
            textTransform: "none",
            px: 2,
            py: 0.6,
            minWidth: 0,
            transition: "all 200ms",
            "&:hover": {
              borderColor: "#ff7319",
              bgcolor: "#ff7319",
              color: "#fff",
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
