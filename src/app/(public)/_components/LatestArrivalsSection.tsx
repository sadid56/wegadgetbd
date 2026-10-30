"use client";

import NextLink from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { tokens } from "@/theme/theme";
import { SectionContainer } from "@/components/common/SectionContainer";
import { ProductCard, type ProductCardItem } from "./ProductCard";

const DEFAULT_LATEST: ProductCardItem[] = [
  {
    id: "latest-1",
    badge: "Best Seller",
    badgeVariant: "default",
    brand: "APPLE",
    title: "MacBook Pro 14 (M3)",
    rating: "4.9",
    reviewCount: "1200+",
    price: 149999,
    originalPrice: 159999,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop",
    slug: "macbook-pro-14-m3",
  },
  {
    id: "latest-2",
    badge: "New",
    badgeVariant: "new",
    brand: "APPLE",
    title: "AirPods Pro 2",
    rating: "4.8",
    reviewCount: "589+",
    price: 24999,
    originalPrice: 27999,
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=800&auto=format&fit=crop",
    slug: "airpods-pro-2",
  },
  {
    id: "latest-3",
    badge: "Sale",
    badgeVariant: "sale",
    brand: "SAMSUNG",
    title: "Galaxy S24 Ultra",
    rating: "4.7",
    reviewCount: "650+",
    price: 129999,
    originalPrice: 139999,
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=800&auto=format&fit=crop",
    slug: "galaxy-s24-ultra",
  },
  {
    id: "latest-4",
    badge: "GAMING",
    badgeVariant: "gaming",
    brand: "GAMING",
    title: "ASUS ROG Strix G16",
    rating: "4.9",
    reviewCount: "1100+",
    price: 159999,
    originalPrice: 179999,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=800&auto=format&fit=crop",
    slug: "asus-rog-strix-g16",
  },
];

export function LatestArrivalsSection({ products = [] }: { products?: any[] }) {
  const displayList: ProductCardItem[] =
    products.length >= 4
      ? products.slice(0, 4).map((p, i) => ({
          id: p.id,
          badge: i === 0 ? "Best Seller" : i === 1 ? "New" : i === 2 ? "Sale" : "GAMING",
          badgeVariant: i === 0 ? "default" : i === 1 ? "new" : i === 2 ? "sale" : "gaming",
          brand: p.category?.name || "GADGET",
          title: p.title || p.name,
          rating: (4.7 + i * 0.05).toFixed(1),
          reviewCount: `${500 + i * 150}+`,
          price: Number(p.salePrice || p.price),
          originalPrice: p.salePrice ? Number(p.price) : undefined,
          image: p.thumbnail || p.images?.[0] || DEFAULT_LATEST[i % DEFAULT_LATEST.length].image,
          slug: p.slug || `product-${p.id}`,
        }))
      : DEFAULT_LATEST;

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
            component="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1.5rem", sm: "1.85rem", md: "2.1rem" },
              color: tokens.textPrimary,
              letterSpacing: "-0.02em",
            }}
          >
            Latest Arrivals
          </Typography>
          <Typography sx={{ fontSize: 13.5, color: tokens.textMuted, mt: 0.5 }}>
            Be the first to get your hands on the newest tech.
          </Typography>
        </Box>

        <Box
          component={NextLink}
          href="/products?sort=newest"
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
          View All <ArrowForwardIcon sx={{ fontSize: 16 }} />
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

export default LatestArrivalsSection;
