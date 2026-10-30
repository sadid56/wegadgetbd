"use client";

import NextLink from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import StarIcon from "@mui/icons-material/Star";

import { tokens } from "@/theme/theme";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { SectionContainer } from "@/components/common/SectionContainer";

interface ProductItem {
  id: string | number;
  badge?: string;
  badgeVariant?: "default" | "new" | "sale" | "gaming";
  brand: string;
  title: string;
  rating: string | number;
  reviewCount: string | number;
  price: number;
  originalPrice?: number;
  image: string;
  slug: string;
}

const DEFAULT_LATEST: ProductItem[] = [
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
  const { addItem } = useCart();

  const displayList = products.length >= 4 ? products.slice(0, 4).map((p, i) => ({
    id: p.id,
    badge: i === 0 ? "Best Seller" : i === 1 ? "New" : i === 2 ? "Sale" : "GAMING",
    badgeVariant: i === 0 ? "default" : i === 1 ? "new" : i === 2 ? "sale" : "gaming",
    brand: p.category?.name || "GADGET",
    title: p.title || p.name,
    rating: (4.7 + (i * 0.05)).toFixed(1),
    reviewCount: `${500 + i * 150}+`,
    price: Number(p.salePrice || p.price),
    originalPrice: p.salePrice ? Number(p.price) : undefined,
    image: p.thumbnail || p.images?.[0] || DEFAULT_LATEST[i % DEFAULT_LATEST.length].image,
    slug: p.slug || `product-${p.id}`,
  })) : DEFAULT_LATEST;

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
          <Box
            key={item.id}
            sx={{
              bgcolor: tokens.bgPanel,
              borderRadius: "20px",
              border: `1px solid ${tokens.borderDefault}`,
              p: { xs: 1.5, sm: 2 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
              transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: tokens.shadowLg,
                borderColor: tokens.primaryBorder,
              },
            }}
          >
            {/* Top row: Badge & Heart */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                minHeight: 24,
                mb: 1,
              }}
            >
              {item.badge ? (
                <Badge
                  variant={item.badgeVariant as any || "default"}
                  label={item.badge}
                  sx={{ fontSize: 10, fontWeight: 700, height: 22 }}
                />
              ) : (
                <Box />
              )}
              <IconButton
                size="small"
                sx={{
                  color: tokens.textMuted,
                  p: 0.5,
                  "&:hover": { color: tokens.danger, bgcolor: tokens.dangerSubtle },
                }}
              >
                <FavoriteBorderIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>

            {/* Product Image */}
            <Box
              component={NextLink}
              href={`/products/${item.slug}`}
              sx={{
                width: "100%",
                height: { xs: 130, sm: 160, md: 175 },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                borderRadius: "14px",
                bgcolor: tokens.bgSubtle,
                p: 1.5,
                mb: 1.5,
                textDecoration: "none",
              }}
            >
              <Box
                component="img"
                src={item.image}
                alt={item.title}
                sx={{
                  maxHeight: "100%",
                  maxWidth: "100%",
                  objectFit: "contain",
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "scale(1.08)" },
                }}
              />
            </Box>

            {/* Content Details */}
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <Typography
                sx={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: tokens.textMuted,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  mb: 0.25,
                }}
              >
                {item.brand}
              </Typography>

              <Typography
                component={NextLink}
                href={`/products/${item.slug}`}
                sx={{
                  fontSize: { xs: 13, sm: 14 },
                  fontWeight: 700,
                  color: tokens.textPrimary,
                  textDecoration: "none",
                  lineHeight: 1.3,
                  mb: 0.75,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  minHeight: 36,
                  "&:hover": { color: tokens.primary },
                }}
              >
                {item.title}
              </Typography>

              {/* Rating */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1.5 }}>
                <StarIcon sx={{ color: tokens.warning, fontSize: 14 }} />
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: tokens.textPrimary }}>
                  {item.rating}
                </Typography>
                <Typography sx={{ fontSize: 11, color: tokens.textMuted }}>
                  ({item.reviewCount})
                </Typography>
              </Box>

              {/* Bottom: Price & Bag Button */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: "auto",
                  pt: 0.5,
                }}
              >
                <Box>
                  <Typography sx={{ fontSize: { xs: 15, sm: 17 }, fontWeight: 800, color: tokens.textPrimary }}>
                    ৳{item.price.toLocaleString()}
                  </Typography>
                  {item.originalPrice && (
                    <Typography
                      sx={{
                        fontSize: 11.5,
                        color: tokens.textDisabled,
                        textDecoration: "line-through",
                      }}
                    >
                      ৳{item.originalPrice.toLocaleString()}
                    </Typography>
                  )}
                </Box>

                {/* Round Mint Bag Button */}
                <IconButton
                  onClick={() => addItem({
                    id: String(item.id),
                    name: item.title,
                    price: item.price,
                    image: item.image,
                    stock: 10,
                  } as any)}
                  sx={{
                    bgcolor: tokens.primaryLight,
                    color: tokens.primary,
                    border: `1px solid ${tokens.primaryBorder}`,
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: tokens.primary,
                      color: tokens.textWhite,
                      transform: "scale(1.08)",
                    },
                  }}
                  aria-label="Add to cart"
                >
                  <ShoppingBagOutlinedIcon sx={{ fontSize: 17 }} />
                </IconButton>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </SectionContainer>
  );
}

export default LatestArrivalsSection;
