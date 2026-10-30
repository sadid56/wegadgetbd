"use client";

import NextLink from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import StarIcon from "@mui/icons-material/Star";

import { tokens } from "@/theme/theme";
import { IconButton } from "@/components/ui/icon-button";
import { useCart } from "@/hooks/useCart";

export interface ProductCardItem {
  id: string | number;
  badge?: string;
  tag?: string;
  badgeVariant?: string;
  tagVariant?: string;
  brand?: string | null;
  title?: string;
  name?: string;
  rating?: string | number;
  reviewCount?: string | number;
  readTime?: string;
  price?: number | string;
  originalPrice?: number | string;
  salePrice?: number | string | null;
  image?: string;
  thumbnail?: string | null;
  images?: string[];
  slug?: string;
  link?: string;
  category?: { name?: string } | null;
}

const DOT_COLORS: Record<string, string> = {
  default: tokens.primary,
  guide: tokens.primary,
  new: tokens.badgeNew,
  review: tokens.badgeNew,
  sale: tokens.badgeSale,
  tips: tokens.badgeSale,
  gaming: tokens.badgeGaming,
};

export function ProductCard({ product }: { product: ProductCardItem }) {
  const { addItem } = useCart();

  const title = product.title || product.name || "Product";
  const brand = product.brand || product.category?.name || product.tag || "GADGET";
  const badge = product.badge || product.tag;
  const dotColor = DOT_COLORS[product.badgeVariant || product.tagVariant || "default"] || tokens.primary;
  const image = product.image || product.thumbnail || product.images?.[0] || "/images/default.png";
  const href = product.link || `/products/${product.slug || product.id}`;
  const price = Number(product.salePrice || product.price || 0);
  const originalPrice = product.originalPrice ? Number(product.originalPrice) : undefined;

  return (
    <Box
      sx={{
        bgcolor: tokens.bgPanel,
        borderRadius: "20px",
        border: `1px solid ${tokens.borderDefault}`,
        boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
        p: 1.5,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        "&:hover .product-thumb": {
          transform: "scale(1.05)",
        },
      }}
    >
      {/* Thumbnail */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: { xs: 155, sm: 185, md: 200 },
          borderRadius: "14px",
          bgcolor: tokens.bgCanvas,
          overflow: "hidden",
        }}
      >
        <Box component={NextLink} href={href} sx={{ display: "block", width: "100%", height: "100%" }}>
          <Box
            component="img"
            className="product-thumb"
            src={image}
            alt={title}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transition: "transform 0.4s ease",
            }}
          />
        </Box>

        {badge && (
          <Box
            sx={{
              position: "absolute",
              top: 10,
              left: 10,
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
              bgcolor: "rgba(255, 255, 255, 0.92)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(15, 23, 42, 0.06)",
              borderRadius: "999px",
              px: 1.15,
              py: 0.35,
            }}
          >
            <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: dotColor }} />
            <Typography sx={{ fontSize: 10.5, fontWeight: 700, color: tokens.textPrimary }}>
              {badge}
            </Typography>
          </Box>
        )}

        <IconButton
          disableRipple
          size="small"
          aria-label="Wishlist"
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            width: 30,
            height: 30,
            bgcolor: "rgba(255, 255, 255, 0.92)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(15, 23, 42, 0.06)",
            color: tokens.textSecondary,
            "&:hover": { bgcolor: "rgba(255, 255, 255, 0.92)" },
          }}
        >
          <FavoriteBorderIcon sx={{ fontSize: 15 }} />
        </IconButton>
      </Box>

      {/* Details */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", px: 0.5, pt: 1.75, pb: 0.25 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.6 }}>
          <Typography
            sx={{
              fontSize: 10.5,
              fontWeight: 700,
              color: tokens.textMuted,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {brand}
          </Typography>

          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.4 }}>
            <StarIcon sx={{ color: tokens.warning, fontSize: 13 }} />
            <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: tokens.textPrimary }}>
              {product.rating ?? "4.8"}
            </Typography>
            <Typography sx={{ fontSize: 11, color: tokens.textMuted }}>
              ({product.reviewCount || product.readTime || "120+"})
            </Typography>
          </Box>
        </Box>

        <Typography
          component={NextLink}
          href={href}
          sx={{
            fontSize: { xs: 13.5, sm: 15 },
            fontWeight: 700,
            color: tokens.textPrimary,
            textDecoration: "none",
            lineHeight: 1.35,
            mb: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {title}
        </Typography>

        {/* Footer */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: "auto",
            pt: 1.25,
            borderTop: `1px solid ${tokens.borderSubtle}`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.75 }}>
            <Typography sx={{ fontSize: { xs: 15.5, sm: 17.5 }, fontWeight: 800, color: tokens.textPrimary }}>
              {price ? `৳${price.toLocaleString()}` : product.readTime || "Read More"}
            </Typography>
            {originalPrice && (
              <Typography sx={{ fontSize: 11.5, color: tokens.textDisabled, textDecoration: "line-through" }}>
                ৳{originalPrice.toLocaleString()}
              </Typography>
            )}
          </Box>

          <IconButton
            disableRipple
            onClick={() =>
              price &&
              addItem({
                id: String(product.id),
                name: title,
                price,
                image,
                stock: 10,
              } as any)
            }
            sx={{
              bgcolor: tokens.bgDark,
              color: tokens.textWhite,
              width: 34,
              height: 34,
              borderRadius: "10px",
              "&:hover": { bgcolor: tokens.bgDark, color: tokens.textWhite },
            }}
            aria-label="Add to cart"
          >
            <ShoppingBagOutlinedIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}

export default ProductCard;
