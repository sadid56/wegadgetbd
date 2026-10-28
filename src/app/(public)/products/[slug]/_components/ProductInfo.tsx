"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import StarIcon from "@mui/icons-material/Star";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CheckIcon from "@mui/icons-material/Check";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { keyframes } from "@emotion/react";

interface ProductInfoProps {
  product: any;
  qty: number;
  setQty: (qty: number) => void;
  basePrice: number;
  discountedPrice: number;
  discountAmount: number;
  discountPercent: number;
  isInCart: boolean;
  handleBuyNow: () => void;
  addToCart: () => void;
}

const pulseDot = keyframes`
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.5; }
`;

const BN = { fontFamily: "'Hind Siliguri','Noto Sans Bengali',sans-serif" };

export default function ProductInfo({
  product,
  qty,
  setQty,
  basePrice,
  discountedPrice,
  discountAmount,
  discountPercent,
  isInCart,
  handleBuyNow,
  addToCart,
}: ProductInfoProps) {
  const productAny = product as any;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        bgcolor: "#f3f4f6",
        p: 2,
        borderRadius: "12px",
      }}
    >
      {/* Title & Rating */}
      <Box>
        <Typography
          component='h1'
          sx={{
            fontSize: { xs: "1.875rem", lg: "2.25rem" },
            fontWeight: 600,
            color: "#111827",
            lineHeight: 1.2,
            mb: 2,
          }}
        >
          {product.title}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, flexWrap: "wrap" }}>
          {product.rating && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ display: "flex" }}>
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    sx={{
                      fontSize: 20,
                      color: i < Math.round(product.rating!) ? "#ff7319" : "#d1d5db",
                    }}
                  />
                ))}
              </Box>
              <Box component='span' sx={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>
                {product.rating}
              </Box>
            </Box>
          )}
          {productAny.soldCount && (
            <Box
              component='span'
              sx={{
                fontSize: 14,
                color: "#6b7280",
                bgcolor: "#f9fafb",
                px: 1.5,
                py: 0.5,
                borderRadius: 999,
                border: "1px solid #f3f4f6",
                fontStyle: "italic",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              <TrendingUpIcon sx={{ fontSize: 14, color: "#f97316", mr: 0.5 }} />
              {productAny.soldCount}+ pieces sold
            </Box>
          )}

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, ml: "auto" }}>
            <Box
              sx={{
                height: 8,
                width: 8,
                borderRadius: "50%",
                bgcolor: product.inStock ? "#22c55e" : "#ef4444",
                animation: product.inStock ? `${pulseDot} 2s ease-in-out infinite` : "none",
              }}
            />
            <Box
              component='span'
              sx={{
                fontSize: 14,
                fontWeight: 600,
                color: product.inStock ? "#16a34a" : "#dc2626",
              }}
            >
              {product.inStock ? "In Stock" : "Unavailable"}
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
        {/* Price */}
        <Box
          sx={{
            borderTop: "1px solid",
            borderBottom: "1px solid",
            borderColor: "divider",
            py: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1.5 }}>
            <Box component='span' sx={{ fontSize: "2.25rem", fontWeight: 600, color: "#ff7319" }}>
              ৳{discountedPrice.toLocaleString()}
            </Box>
            {discountAmount > 0 && (
              <Box
                component='span'
                sx={{
                  fontSize: "1.25rem",
                  color: "#9ca3af",
                  textDecoration: "line-through",
                  mb: 0.5,
                }}
              >
                ৳{basePrice.toLocaleString()}
              </Box>
            )}
          </Box>
          {discountAmount > 0 && (
            <Typography sx={{ fontSize: 14, color: "#16a34a", fontWeight: 500, mt: 1 }}>
              You save ৳{discountAmount.toLocaleString()} ({discountPercent}% off)
            </Typography>
          )}
        </Box>

        {/* Quantity */}
        <Box>
          <Box
            component='label'
            sx={{
              display: "block",
              fontSize: { xs: 14, md: 16 },
              fontWeight: 600,
              color: "#111827",
              mb: 1.5,
            }}
          >
            Quantity:
          </Box>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              border: "2px solid #e5e7eb",
              borderRadius: 999,
            }}
          >
            <Box
              component='button'
              type='button'
              onClick={() => setQty(Math.max(1, qty - 1))}
              sx={{
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                m: 0.5,
                border: "1px solid #d1d5db",
                borderRadius: "50%",
                bgcolor: "#d1d5db",
                cursor: "pointer",
                transition: "background-color 150ms",
                "&:hover": { bgcolor: "#f3f4f6" },
              }}
            >
              <Box component='span' sx={{ fontSize: 20, fontWeight: 600, color: "#4b5563" }}>
                −
              </Box>
            </Box>
            <Box
              component='span'
              sx={{
                width: 64,
                height: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                fontWeight: 700,
                color: "#111827",
              }}
            >
              {qty}
            </Box>
            <Box
              component='button'
              type='button'
              onClick={() => setQty(qty + 1)}
              sx={{
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                m: 0.5,
                border: "1px solid #d1d5db",
                borderRadius: "50%",
                bgcolor: "#d1d5db",
                cursor: "pointer",
                transition: "background-color 150ms",
                "&:hover": { bgcolor: "#f3f4f6" },
              }}
            >
              <Box component='span' sx={{ fontSize: 20, fontWeight: 600, color: "#4b5563" }}>
                +
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Actions */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 1.5, md: 2.5 },
          pt: 2,
          flexWrap: "wrap",
        }}
      >
        <Box
          component='button'
          type='button'
          onClick={handleBuyNow}
          disabled={!product.inStock}
          sx={{
            width: "100%",
            height: { xs: 40, md: 56 },
            flex: 1,
            bgcolor: "#111827",
            color: "#fff",
            fontWeight: 700,
            borderRadius: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: { xs: 1, md: 1.5 },
            border: 0,
            cursor: product.inStock ? "pointer" : "not-allowed",
            transition: "all 200ms",
            fontSize: { xs: 14, md: 16 },
            opacity: product.inStock ? 1 : 0.5,
            boxShadow: "0 20px 25px -5px #e5e7eb",
            "&:hover": product.inStock ? { bgcolor: "#000" } : {},
          }}
        >
          <CheckIcon sx={{ fontSize: 20, color: "#f97316" }} />
          Buy Now
        </Box>

        <Box
          component='button'
          type='button'
          onClick={addToCart}
          disabled={isInCart || !product.inStock}
          sx={{
            width: "100%",
            height: { xs: 40, md: 56 },
            flex: 1,
            border: "2px solid",
            borderColor: isInCart ? "#22c55e" : "#d1d5db",
            bgcolor: isInCart ? "#f0fdf4" : "transparent",
            color: isInCart ? "#16a34a" : "#374151",
            fontWeight: 600,
            borderRadius: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1.5,
            fontSize: { xs: 14, md: 16 },
            cursor: isInCart || !product.inStock ? "not-allowed" : "pointer",
            opacity: isInCart || !product.inStock ? 0.5 : 1,
            transition: "all 200ms",
            "&:hover": !isInCart && product.inStock ? { borderColor: "#ff7319", color: "#ff7319" } : {},
          }}
        >
          {isInCart ? (
            <>
              <CheckIcon sx={{ fontSize: 20 }} />
              Added to Cart
            </>
          ) : (
            <>
              <ShoppingCartIcon sx={{ fontSize: 20 }} />
              Add to Cart
            </>
          )}
        </Box>
      </Box>

      {/* Tags */}
      {productAny.tags && productAny.tags.length > 0 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, pt: 1 }}>
          {productAny.tags.map((tag: string) => (
            <Box
              key={tag}
              component='span'
              sx={{
                fontSize: 10,
                fontWeight: 700,
                color: "#9ca3af",
                border: "1px solid #f3f4f6",
                bgcolor: "rgba(249,250,251,0.5)",
                px: 1.25,
                py: 0.5,
                borderRadius: "6px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              #{tag}
            </Box>
          ))}
        </Box>
      )}

      {/* Specs */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          rowGap: 2.5,
          columnGap: 5,
          py: 3,
          borderTop: "1px solid #f3f4f6",
          mt: 4,
        }}
      >
        {productAny.brand && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <Box
              component='span'
              sx={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", color: "#9ca3af", fontWeight: 700 }}
            >
              Brand
            </Box>
            <Box component='span' sx={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
              {productAny.brand}
            </Box>
          </Box>
        )}
        {productAny.model && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <Box
              component='span'
              sx={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", color: "#9ca3af", fontWeight: 700 }}
            >
              Model
            </Box>
            <Box component='span' sx={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
              {productAny.model}
            </Box>
          </Box>
        )}
        {product.category?.name && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <Box
              component='span'
              sx={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", color: "#9ca3af", fontWeight: 700 }}
            >
              Category
            </Box>
            <Box component='span' sx={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
              {product.category.name}
            </Box>
          </Box>
        )}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Box
            component='span'
            sx={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", color: "#9ca3af", fontWeight: 700 }}
          >
            Condition
          </Box>
          <Box component='span' sx={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
            Brand New
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
