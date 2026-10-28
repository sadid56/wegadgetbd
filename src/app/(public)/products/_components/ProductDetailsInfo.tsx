"use client";

import NextLink from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { keyframes } from "@emotion/react";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import StarIcon from "@mui/icons-material/Star";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";

import { formatBnNumber } from "@/lib/utils";

interface ProductDetailsInfoProps {
  product: any;
  qty: number;
  setQty: (qty: number) => void;
  isInCart: boolean;
  onAddToCart: () => void;
  onBuyNow: () => void;
}

const fadeInRight = keyframes`
  from { opacity: 0; transform: translateX(20px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const pillSx = {
  display: "inline-flex",
  alignItems: "center",
  gap: 0.5,
  px: 1.5,
  py: 0.5,
  borderRadius: 999,
  border: "1px solid",
  fontSize: { xs: 9, md: 10 },
  fontWeight: 900,
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  lineHeight: 1.4,
} as const;

export function ProductDetailsInfo({ product, qty, setQty, isInCart, onAddToCart, onBuyNow }: ProductDetailsInfoProps) {
  const basePrice = Number(product.price || 0);
  const discountedPrice = Number(product.discountPrice || product.price || 0);
  const discountAmountPerUnit = Math.max(basePrice - discountedPrice, 0);
  const discountPercent = basePrice > 0 ? Math.round((discountAmountPerUnit / basePrice) * 100) : 0;
  const subtotal = discountedPrice * qty;
  const totalDiscount = discountAmountPerUnit * qty;

  return (
    <Box sx={{ animation: `${fadeInRight} 800ms 300ms ease-out both` }}>
      {/* Badges row */}
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1, mb: 3 }}>
        {product.category?.name && (
          <Box
            component='span'
            sx={{
              ...pillSx,
              bgcolor: "action.hover",
              borderColor: "divider",
              color: "primary.main",
            }}
          >
            {product.category.name}
          </Box>
        )}
        {product.brand && (
          <Box
            component='span'
            sx={{
              ...pillSx,
              bgcolor: "rgba(139,92,246,0.1)",
              borderColor: "rgba(139,92,246,0.2)",
              color: (theme) => (theme.palette.mode === "dark" ? "#c4b5fd" : "#7c3aed"),
            }}
          >
            {product.brand}
          </Box>
        )}
        <Box
          component='span'
          sx={{
            ...pillSx,
            bgcolor: product.inStock ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
            borderColor: product.inStock ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)",
            color: product.inStock ? { xs: "#059669", dark: "#34d399" } : { xs: "#dc2626", dark: "#f87171" },
          }}
        >
          {product.inStock ? "স্টকে আছে" : "স্টক শেষ"}
        </Box>

        <Box sx={{ height: 1, width: { xs: 24, md: 32 }, bgcolor: "divider" }} />

        {product.rating && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              bgcolor: "rgba(234,179,8,0.1)",
              px: 1,
              py: 0.25,
              borderRadius: 999,
              border: "1px solid rgba(234,179,8,0.2)",
            }}
          >
            <StarIcon sx={{ fontSize: 12, color: "#eab308" }} />
            <Box
              component='span'
              sx={{
                fontSize: 10,
                fontWeight: 700,
                color: (theme) => (theme.palette.mode === "dark" ? "#eab308" : "#ca8a04"),
              }}
            >
              {product.rating}
            </Box>
          </Box>
        )}
      </Box>

      {/* Title + model */}
      <Box sx={{ mb: { xs: 3, md: 4 } }}>
        <Typography
          component='h1'
          sx={{
            fontSize: { xs: "1.5rem", md: "1.875rem", lg: "2.25rem" },
            fontWeight: 900,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            mb: 1,
            color: "text.primary",
          }}
        >
          {product.title}
        </Typography>
        {product.model && (
          <Typography
            sx={{
              fontSize: { xs: 12, md: 14 },
              fontWeight: 500,
              color: "text.secondary",
              letterSpacing: "0.15em",
            }}
          >
            মডেল: {product.model}
          </Typography>
        )}
      </Box>

      {/* Price row */}
      <Box sx={{ display: "flex", alignItems: "baseline", gap: 2, mb: { xs: 4, md: 5 }, flexWrap: "wrap" }}>
        <Box component='span' sx={{ fontSize: { xs: 20, md: 24 }, fontWeight: 900, color: "text.primary" }}>
          <Box component='span' sx={{ fontSize: 14, letterSpacing: "0.15em", color: "text.secondary" }}>
            মূল্য:{" "}
          </Box>
          ৳{formatBnNumber(discountedPrice)}
        </Box>
        {product.discountPrice && (
          <>
            <Box
              component='span'
              sx={{
                fontSize: { xs: 18, md: 20 },
                color: "text.secondary",
                textDecoration: "line-through",
                fontWeight: 300,
                opacity: 0.5,
              }}
            >
              ৳{formatBnNumber(basePrice)}
            </Box>
            <Box
              component='span'
              sx={{
                fontSize: { xs: 12, md: 14 },
                fontWeight: 900,
                px: 1,
                py: 0.5,
                borderRadius: "6px",
                bgcolor: "rgba(244,63,94,0.1)",
                color: "#f43f5e",
                border: "1px solid rgba(244,63,94,0.2)",
              }}
            >
              -{formatBnNumber(discountPercent)}%
            </Box>
          </>
        )}
      </Box>

      {/* Description */}
      <Box sx={{ mb: 5 }}>
        <Typography
          sx={{
            color: "text.secondary",
            fontSize: { xs: 16, md: 18 },
            lineHeight: 1.65,
            fontWeight: 300,
          }}
        >
          {product.description}
        </Typography>
      </Box>

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {product.tags.map((tag: string) => (
            <Box key={tag} component={NextLink} href={`/products?search=${tag}`} sx={{ textDecoration: "none" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  borderRadius: 999,
                  px: 2,
                  py: 0.75,
                  bgcolor: "action.hover",
                  border: "1px solid",
                  borderColor: "divider",
                  color: "text.secondary",
                  cursor: "pointer",
                  transition: "all 200ms",
                  "&:hover": {
                    borderColor: "primary.main",
                    color: "primary.main",
                    "& .tag-icon": { opacity: 1 },
                  },
                }}
              >
                <LocalOfferOutlinedIcon className='tag-icon' sx={{ fontSize: 12, opacity: 0.5, transition: "opacity 200ms" }} />
                <Box
                  component='span'
                  sx={{
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {tag}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* Specifications */}
      {product.specifications && Object.keys(product.specifications as object).length > 0 && (
        <Box sx={{ mt: 3, mb: 2.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <Typography
              component='h3'
              sx={{
                fontSize: 12,
                fontWeight: 900,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "text.secondary",
              }}
            >
              প্রযুক্তিগত বৈশিষ্ট্য
            </Typography>
            <Box sx={{ height: "1px", flex: 1, bgcolor: "divider", opacity: 0.5 }} />
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
              gap: { xs: 1.5, md: 2 },
            }}
          >
            {Object.entries(product.specifications as object).map(([key, value]) => (
              <Box
                key={key}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  p: 2,
                  borderRadius: "16px",
                  bgcolor: "action.hover",
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "border-color 200ms",
                  "&:hover": {
                    borderColor: "text.disabled",
                    "& .spec-key": { color: "primary.main" },
                  },
                }}
              >
                <Box
                  component='span'
                  className='spec-key'
                  sx={{
                    fontSize: 10,
                    color: "text.secondary",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    mb: 0.5,
                    transition: "color 200ms",
                  }}
                >
                  {key}
                </Box>
                <Box
                  component='span'
                  sx={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "text.primary",
                    opacity: 0.8,
                  }}
                >
                  {String(value)}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Actions block */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 3, md: 4 }, py: 4 }}>
        {!isInCart && (
          <Box
            sx={{
              borderRadius: "16px",
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "action.hover",
              p: { xs: 2, md: 2.5 },
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
              <Box
                component='span'
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: 12, md: 14 },
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  color: "text.secondary",
                }}
              >
                অর্ডারের পরিমাণ
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  bgcolor: "action.selected",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: { xs: "12px", md: "16px" },
                  p: { xs: 0.25, md: 0.5 },
                }}
              >
                <Box
                  component='button'
                  type='button'
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  sx={{
                    width: { xs: 40, md: 48 },
                    height: { xs: 40, md: 48 },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "transparent",
                    border: 0,
                    borderRadius: { xs: "8px", md: "12px" },
                    cursor: "pointer",
                    fontSize: { xs: 18, md: 20 },
                    fontWeight: 700,
                    color: "text.primary",
                    transition: "background-color 150ms",
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                >
                  -
                </Box>
                <Box
                  component='span'
                  sx={{
                    width: { xs: 40, md: 56 },
                    textAlign: "center",
                    fontWeight: 900,
                    fontSize: { xs: 16, md: 18 },
                    color: "text.primary",
                  }}
                >
                  {qty}
                </Box>
                <Box
                  component='button'
                  type='button'
                  onClick={() => setQty(qty + 1)}
                  sx={{
                    width: { xs: 40, md: 48 },
                    height: { xs: 40, md: 48 },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "transparent",
                    border: 0,
                    borderRadius: { xs: "8px", md: "12px" },
                    cursor: "pointer",
                    fontSize: { xs: 18, md: 20 },
                    fontWeight: 700,
                    color: "text.primary",
                    transition: "background-color 150ms",
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                >
                  +
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "text.secondary" }}>
                <Box component='span'>প্রতি ইউনিট মূল্য</Box>
                <Box component='span'>৳{formatBnNumber(discountedPrice)}</Box>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "text.secondary" }}>
                <Box component='span'>মোট</Box>
                <Box component='span'>৳{formatBnNumber(subtotal)}</Box>
              </Box>
              {totalDiscount > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 14,
                    fontWeight: 600,
                    color: (theme) => (theme.palette.mode === "dark" ? "#34d399" : "#059669"),
                  }}
                >
                  <Box component='span'>ছাড় ({formatBnNumber(discountPercent)}%)</Box>
                  <Box component='span'>-৳{formatBnNumber(totalDiscount)}</Box>
                </Box>
              )}
            </Box>
          </Box>
        )}

        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: { xs: 1.5, md: 2 } }}>
          <Button
            onClick={onAddToCart}
            disabled={isInCart}
            disableElevation
            variant={isInCart ? "contained" : "outlined"}
            startIcon={
              isInCart ? (
                <CheckCircleIcon sx={{ fontSize: { xs: 20, md: 24 } }} />
              ) : (
                <ShoppingCartIcon sx={{ fontSize: { xs: 20, md: 24 } }} />
              )
            }
            sx={{
              flex: 1,
              height: { xs: 56, md: 64 },
              fontSize: { xs: 16, md: 18 },
              fontWeight: 700,
              borderRadius: { xs: "12px", md: "16px" },
              textTransform: "none",
              transition: "all 200ms",
              ...(isInCart
                ? {
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    "&.Mui-disabled": {
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      opacity: 1,
                    },
                  }
                : {
                    borderColor: "divider",
                    color: "text.primary",
                    "&:hover": {
                      borderColor: "divider",
                      bgcolor: "action.hover",
                    },
                  }),
            }}
          >
            {isInCart ? "কার্টে আছে" : "কার্টে যোগ করুন"}
          </Button>

          <Button
            onClick={onBuyNow}
            disabled={!product.inStock}
            disableElevation
            startIcon={<ChatBubbleOutlineIcon sx={{ fontSize: { xs: 20, md: 24 } }} />}
            sx={{
              flex: 1,
              height: { xs: 56, md: 64 },
              fontSize: { xs: 16, md: 18 },
              fontWeight: 900,
              borderRadius: { xs: "12px", md: "16px" },
              textTransform: "none",
              bgcolor: "text.primary",
              color: "background.default",
              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
              transition: "all 200ms",
              "&:hover": {
                bgcolor: "text.primary",
                opacity: 0.9,
              },
              "&.Mui-disabled": {
                bgcolor: "text.primary",
                color: "background.default",
                opacity: 0.4,
              },
            }}
          >
            {formatBnNumber(product.soldCount || 360)} পিস বিক্রি - এখনই অর্ডার
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: "16px",
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            p: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.05em",
              color: "text.secondary",
            }}
          >
            {product.inStock ? (
              <Inventory2OutlinedIcon sx={{ fontSize: 16, color: "#10b981" }} />
            ) : (
              <RemoveCircleOutlineIcon sx={{ fontSize: 16, color: "#ef4444" }} />
            )}
            স্টক অবস্থা
          </Box>
          <Box
            component='span'
            sx={{
              fontSize: 12,
              fontWeight: 900,
              color: product.inStock ? "#10b981" : "#ef4444",
            }}
          >
            {product.inStock ? "এখনই পাওয়া যাচ্ছে" : "বর্তমানে পাওয়া যাচ্ছে না"}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
