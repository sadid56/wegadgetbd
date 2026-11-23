"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import { useLocale } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/i18n-utils";
import { getAssetUrl } from "@/lib/storage";
import type { AiProductCardData } from "@/lib/ai-drawer";
import { tokens } from "@/theme/theme";

interface AiMiniProductCardProps {
  product: AiProductCardData;
  onNavigate?: () => void;
}

export function AiMiniProductCard({ product, onNavigate }: AiMiniProductCardProps) {
  const locale = useLocale();
  const isBn = locale === "bn";
  const router = useRouter();
  const { addItem, cart } = useCart();

  const isInCart = cart.some((item) => String(item.id) === String(product.id));
  const regularPrice = Number(product.price || 0);
  const discountPrice = product.discountPrice != null ? Number(product.discountPrice) : null;
  const hasDiscount = discountPrice !== null && discountPrice > 0 && discountPrice < regularPrice;
  const effectivePrice = hasDiscount ? discountPrice : regularPrice;

  const imgSrc = product.thumbnail ? getAssetUrl(product.thumbnail) : "/images/default.png";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    if (isInCart) {
      onNavigate?.();
      router.push("/cart");
      return;
    }
    addItem({
      id: product.id,
      title: product.title,
      slug: product.slug,
      price: regularPrice,
      discountPrice: hasDiscount ? discountPrice : null,
      images: imgSrc ? [imgSrc] : [],
    });
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    onNavigate?.();
    router.push(`/checkout?buyNow=${product.slug}&qty=1`);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        p: 1.35,
        borderRadius: "20px",
        bgcolor: tokens.bgPanel,
        border: "none",
      }}
    >
      <Box
        component={Link}
        href={`/products/${product.slug}`}
        onClick={() => onNavigate?.()}
        sx={{
          width: 58,
          height: 58,
          borderRadius: "14px",
          overflow: "hidden",
          bgcolor: tokens.bgSurfaceContainerLow,
          flexShrink: 0,
          display: "block",
        }}
      >
        <Box
          component='img'
          src={imgSrc}
          alt={product.title}
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            e.currentTarget.src = "/images/default.png";
          }}
          sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          component={Link}
          href={`/products/${product.slug}`}
          onClick={() => onNavigate?.()}
          sx={{
            display: "block",
            fontSize: 12.5,
            fontWeight: 700,
            color: tokens.textPrimary,
            textDecoration: "none",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            "&:hover": { color: tokens.primaryDark },
          }}
        >
          {product.title}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mt: 0.25, flexWrap: "wrap" }}>
          <Typography sx={{ fontSize: 12.5, fontWeight: 800, color: tokens.primaryDark }}>
            {formatPrice(effectivePrice, locale)}
          </Typography>
          {hasDiscount && (
            <Typography
              sx={{
                fontSize: 10.5,
                color: tokens.textDisabled,
                textDecoration: "line-through",
              }}
            >
              {formatPrice(regularPrice, locale)}
            </Typography>
          )}
          <Box
            component='span'
            sx={{
              fontSize: 10,
              fontWeight: 700,
              px: 0.75,
              py: 0.15,
              borderRadius: "999px",
              bgcolor: product.inStock ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
              color: product.inStock ? "#047857" : "#DC2626",
            }}
          >
            {product.inStock ? (isBn ? "স্টকে আছে" : "In Stock") : isBn ? "স্টক শেষ" : "Out of Stock"}
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mt: 0.9 }}>
          <Box
            component='button'
            type='button'
            disabled={!product.inStock}
            onClick={handleAddToCart}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.45,
              px: 1.25,
              py: 0.55,
              borderRadius: "999px",
              border: "none",
              bgcolor: isInCart ? tokens.primaryLight : tokens.bgSurfaceContainerLow,
              color: isInCart ? tokens.primaryDark : tokens.textPrimary,
              fontSize: 11.5,
              fontWeight: 700,
              cursor: product.inStock ? "pointer" : "not-allowed",
              opacity: product.inStock ? 1 : 0.5,
              transition: "background-color 150ms ease, color 150ms ease",
              "&:hover": product.inStock
                ? { bgcolor: tokens.bgSurfaceContainerHigh }
                : undefined,
            }}
          >
            {isInCart ? (
              <CheckRoundedIcon sx={{ fontSize: 13.5 }} />
            ) : (
              <ShoppingCartOutlinedIcon sx={{ fontSize: 13.5 }} />
            )}
            <span>{isInCart ? (isBn ? "কার্টে আছে" : "In Cart") : isBn ? "কার্টে রাখুন" : "Add to Cart"}</span>
          </Box>

          <Box
            component='button'
            type='button'
            disabled={!product.inStock}
            onClick={handleBuyNow}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.35,
              px: 1.25,
              py: 0.55,
              borderRadius: "999px",
              border: "none",
              bgcolor: tokens.primary,
              color: tokens.onPrimary,
              fontSize: 11.5,
              fontWeight: 700,
              cursor: product.inStock ? "pointer" : "not-allowed",
              opacity: product.inStock ? 1 : 0.5,
              transition: "background-color 150ms ease",
              "&:hover": product.inStock ? { bgcolor: tokens.primaryHover } : undefined,
            }}
          >
            <BoltRoundedIcon sx={{ fontSize: 13.5 }} />
            <span>{isBn ? "অর্ডার করুন" : "Order Now"}</span>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
