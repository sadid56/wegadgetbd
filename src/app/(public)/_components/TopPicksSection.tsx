"use client";

import NextLink from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { tokens } from "@/theme/theme";
import { SectionContainer } from "@/components/common/SectionContainer";
import { ProductCard, type ProductCardItem } from "./ProductCard";

const DEFAULT_TOP_PICKS: ProductCardItem[] = [
  {
    id: "top-1",
    badge: "Best Seller",
    badgeVariant: "default",
    brand: "APPLE",
    title: "MacBook Air M3 (13-inch)",
    rating: "4.9",
    reviewCount: "1200+",
    price: 109999,
    originalPrice: 129999,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop",
    slug: "macbook-air-m3",
  },
  {
    id: "top-2",
    badge: "New",
    badgeVariant: "new",
    brand: "APPLE",
    title: "iPhone 15 Pro 256GB",
    rating: "4.8",
    reviewCount: "950+",
    price: 99999,
    originalPrice: 109999,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop",
    slug: "iphone-15-pro",
  },
  {
    id: "top-3",
    badge: "Sale",
    badgeVariant: "sale",
    brand: "APPLE",
    title: "Apple Watch Series 10",
    rating: "4.7",
    reviewCount: "850+",
    price: 39999,
    originalPrice: 44999,
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=800&auto=format&fit=crop",
    slug: "apple-watch-series-10",
  },
  {
    id: "top-4",
    brand: "APPLE",
    title: "AirPods Pro 2 USB-C",
    rating: "4.9",
    reviewCount: "1500+",
    price: 24999,
    originalPrice: 27999,
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=800&auto=format&fit=crop",
    slug: "airpods-pro-2",
  },
];

export function TopPicksSection({ products = [] }: { products?: any[] }) {
  const displayList: ProductCardItem[] =
    products.length >= 4
      ? products.slice(0, 4).map((p, i) => ({
          id: p.id,
          badge: i === 0 ? "Best Seller" : i === 1 ? "New" : i === 2 ? "Sale" : undefined,
          badgeVariant: i === 0 ? "default" : i === 1 ? "new" : i === 2 ? "sale" : undefined,
          brand: p.category?.name || "APPLE",
          title: p.title || p.name,
          rating: (4.6 + i * 0.1).toFixed(1),
          reviewCount: `${800 + i * 200}+`,
          price: Number(p.salePrice || p.price),
          originalPrice: p.salePrice ? Number(p.price) : undefined,
          image: p.thumbnail || p.images?.[0] || DEFAULT_TOP_PICKS[i % DEFAULT_TOP_PICKS.length].image,
          slug: p.slug || `product-${p.id}`,
        }))
      : DEFAULT_TOP_PICKS;

  return (
    <SectionContainer
      sx={{
        py: { xs: 3, md: 5 },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          mb: { xs: 2.5, md: 3.5 },
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 700,
              color: tokens.textMuted,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              mb: 0.5,
            }}
          >
            — FEATURED PRODUCTS
          </Typography>
          <Typography
            component="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1.5rem", sm: "1.85rem", md: "2.1rem" },
              color: tokens.textPrimary,
              letterSpacing: "-0.02em",
            }}
          >
            Top Picks for You
          </Typography>
        </Box>

        <Box
          component={NextLink}
          href="/products"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.75,
            fontSize: 13.5,
            fontWeight: 700,
            color: tokens.textPrimary,
            textDecoration: "none",
            transition: "color 0.2s ease, transform 0.2s ease",
            "&:hover": {
              color: tokens.primary,
              transform: "translateX(3px)",
            },
          }}
        >
          View All Products <ArrowForwardIcon sx={{ fontSize: 16 }} />
        </Box>
      </Box>

      {/* 4 Cards Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: { xs: 1.5, sm: 2, md: 2.5 },
        }}
      >
        {displayList.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </Box>
    </SectionContainer>
  );
}

export default TopPicksSection;
