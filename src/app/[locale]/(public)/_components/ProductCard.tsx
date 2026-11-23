"use client";

import { Link, useRouter } from "@/i18n/routing";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useLocale, useTranslations } from "next-intl";

import { IconButton } from "@/components/ui/icon-button";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/i18n-utils";
import { getAssetUrl } from "@/lib/storage";
import { tokens } from "@/theme/theme";

export interface ProductCardItem {
  id: string | number;
  badge?: string | null;
  tag?: string | null;
  badgeVariant?: string | null;
  tagVariant?: string | null;
  brand?: string | null;
  title?: string;
  name?: string;
  rating?: string | number;
  reviewCount?: string | number;
  reviewsCount?: number;
  readTime?: string;
  price?: number | string;
  originalPrice?: number | string | null;
  salePrice?: number | string | null;
  image?: string | null;
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
  const t = useTranslations("products");
  const locale = useLocale();
  const { addItem, cart } = useCart();
  const router = useRouter();

  const isInCart = cart.some((item) => String(item.id) === String(product.id));

  const title = product.title || product.name || "Product";
  const brand =
    product.brand || product.category?.name || product.tag || "GADGET";
  const rawImage = product.thumbnail || "";
  const image =
    (rawImage ? getAssetUrl(rawImage) : null) || "/images/default.png";
  const href = product.link || `/products/${product.slug || product.id}`;
  const price = Number(product.salePrice || product.price || 0);
  const originalPrice = product.originalPrice
    ? Number(product.originalPrice)
    : undefined;

  const discountLabel =
    originalPrice && price > 0 && originalPrice > price
      ? (() => {
          const pct = Math.round(((originalPrice - price) / originalPrice) * 100);
          return pct > 0 ? `-${pct}%` : `Save ৳${Math.round(originalPrice - price)}`;
        })()
      : null;

  const rawBadge = product.badge || product.tag;
  const badge = rawBadge === "Sale" && discountLabel ? discountLabel : rawBadge || discountLabel;
  const dotColor =
    DOT_COLORS[
      product.badgeVariant ||
        product.tagVariant ||
        (!rawBadge && discountLabel ? "sale" : "default")
    ] || tokens.primary;

  const handleCardClick = (_e: React.MouseEvent) => {
    // Navigate to details page if not clicking a button
    router.push(href);
  };

  return (
    <Box
      onClick={handleCardClick}
      sx={{
        cursor: "pointer",
        bgcolor: tokens.bgPanel,
        borderRadius: `${tokens.radiusXl}px`,
        border: "none",
        boxShadow: "none",
        p: 1.5,
        minWidth: 0,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        "&:hover .product-thumb": {
          transform: "scale(1.06)",
        },
      }}
    >
      {/* Thumbnail */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: { xs: 155, sm: 185, md: 200 },
          borderRadius: `${tokens.radiusLg}px`,
          bgcolor: "#F8FAFC",
          overflow: "hidden",
        }}
      >
        <Box
          component={Link}
          href={href}
          sx={{ display: "block", width: "100%", height: "100%" }}
        >
          <Box
            component="img"
            className="product-thumb"
            src={image}
            alt={title}
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.src = "/images/default.png";
            }}
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
              bgcolor: "rgba(255, 255, 255, 0.95)",
              backdropFilter: { xs: "none", md: "blur(8px)" },
              border: "1px solid rgba(15, 23, 42, 0.06)",
              borderRadius: "999px",
              px: 1.15,
              py: 0.35,
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                bgcolor: dotColor,
              }}
            />
            <Typography
              sx={{
                fontSize: 10.5,
                fontWeight: 700,
                color: tokens.textPrimary,
              }}
            >
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
            bgcolor: "rgba(255, 255, 255, 0.94)",
            backdropFilter: { xs: "none", md: "blur(10px)" },
            border: "1px solid rgba(15, 23, 42, 0.1)",
            boxShadow: "0 2px 8px rgba(15, 23, 42, 0.12), 0 1px 2px rgba(15, 23, 42, 0.06)",
            color: tokens.textPrimary,
            "&:hover": {
              bgcolor: "#FFFFFF",
              boxShadow: "0 4px 12px rgba(15, 23, 42, 0.16)",
            },
          }}
        >
          <FavoriteBorderIcon sx={{ fontSize: 15 }} />
        </IconButton>
      </Box>

      {/* Details */}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          px: 0.5,
          pt: 1.75,
          pb: 0.25,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            minWidth: 0,
            mb: 0.6,
          }}
        >
          <Typography
            sx={{
              fontSize: 10.5,
              fontWeight: 700,
              color: tokens.textMuted,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {brand}
          </Typography>
        </Box>

        <Typography
          component={Link}
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
            <Typography
              sx={{
                fontSize: { xs: 15.5, sm: 17.5 },
                fontWeight: 800,
                color: tokens.textPrimary,
              }}
            >
              {price
                ? formatPrice(price, locale)
                : product.readTime || t("viewDetails")}
            </Typography>
            {originalPrice && (
              <Typography
                sx={{
                  fontSize: 11.5,
                  color: tokens.textDisabled,
                  textDecoration: "line-through",
                }}
              >
                {formatPrice(originalPrice, locale)}
              </Typography>
            )}
          </Box>

          <IconButton
            disableRipple
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (isInCart) {
                router.push("/cart");
                return;
              }
              if (price) {
                addItem({
                  id: String(product.id),
                  title: title || product.name || "Product",
                  price:
                    originalPrice && originalPrice > price
                      ? originalPrice
                      : price,
                  discountPrice:
                    originalPrice && originalPrice > price
                      ? price
                      : (product.salePrice ?? null),
                  images: image ? [image] : product.images || [],
                  slug: product.slug || String(product.id),
                });
              }
            }}
            sx={{
              bgcolor: isInCart ? tokens.primary : tokens.bgDark,
              color: "#ffffff !important",
              width: 36,
              height: 36,
              borderRadius: `${tokens.radiusPill}px`,
              "&:hover": {
                bgcolor: isInCart ? tokens.primary : tokens.bgDark,
                color: "#ffffff !important",
              },
              "& .MuiSvgIcon-root": {
                color: "#ffffff !important",
              },
            }}
            aria-label={isInCart ? t("inCartAlready") : t("addToCart")}
          >
            {isInCart ? (
              <CheckRoundedIcon sx={{ fontSize: 16 }} />
            ) : (
              <ShoppingBagOutlinedIcon sx={{ fontSize: 16 }} />
            )}
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}

export default ProductCard;
