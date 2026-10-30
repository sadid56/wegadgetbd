"use client";

import NextLink from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { keyframes } from "@emotion/react";
import { Button } from "@/components/ui/button";
import { tokens } from "@/theme/theme";

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
              bgcolor: tokens.bgSubtle,
              borderColor: tokens.borderDefault,
              color: tokens.primary,
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
              bgcolor: tokens.badgeGamingSubtle,
              borderColor: tokens.badgeGamingSubtle,
              color: tokens.badgeGaming,
            }}
          >
            {product.brand}
          </Box>
        )}
        <Box
          component='span'
          sx={{
            ...pillSx,
            bgcolor: product.inStock ? tokens.successSubtle : tokens.dangerSubtle,
            borderColor: product.inStock ? tokens.successBorder : tokens.dangerBorder,
            color: product.inStock ? tokens.successText : tokens.dangerHover,
          }}
        >
          {product.inStock ? "স্টকে আছে" : "স্টক শেষ"}
        </Box>

        <Box sx={{ height: 1, width: { xs: 24, md: 32 }, bgcolor: tokens.borderDefault }} />

        {product.rating && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              bgcolor: tokens.warningSubtle,
              px: 1,
              py: 0.25,
              borderRadius: 999,
              border: `1px solid ${tokens.warningBorder}`,
            }}
          >
            <StarIcon sx={{ fontSize: 12, color: tokens.warning }} />
            <Box
              component='span'
              sx={{
                fontSize: 10,
                fontWeight: 700,
                color: tokens.warningHover,
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
            color: tokens.textPrimary,
          }}
        >
          {product.title}
        </Typography>
        {product.model && (
          <Typography
            sx={{
              fontSize: { xs: 12, md: 14 },
              fontWeight: 500,
              color: tokens.textSecondary,
              letterSpacing: "0.15em",
            }}
          >
            মডেল: {product.model}
          </Typography>
        )}
      </Box>

      {/* Price row */}
      <Box sx={{ display: "flex", alignItems: "baseline", gap: 2, mb: { xs: 4, md: 5 }, flexWrap: "wrap" }}>
        <Box component='span' sx={{ fontSize: { xs: 20, md: 24 }, fontWeight: 900, color: tokens.textPrimary }}>
          <Box component='span' sx={{ fontSize: 14, letterSpacing: "0.15em", color: tokens.textSecondary }}>
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
                color: tokens.textSecondary,
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
                bgcolor: tokens.dangerSubtle,
                color: tokens.danger,
                border: `1px solid ${tokens.dangerBorder}`,
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
            color: tokens.textSecondary,
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
                  bgcolor: tokens.bgSubtle,
                  border: "1px solid",
                  borderColor: tokens.borderDefault,
                  color: tokens.textSecondary,
                  cursor: "pointer",
                  transition: "all 200ms",
                  "&:hover": {
                    borderColor: tokens.primary,
                    color: tokens.primary,
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
                color: tokens.textSecondary,
              }}
            >
              প্রযুক্তিগত বৈশিষ্ট্য
            </Typography>
            <Box sx={{ height: "1px", flex: 1, bgcolor: tokens.borderDefault, opacity: 0.5 }} />
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
                  bgcolor: tokens.bgSubtle,
                  border: "1px solid",
                  borderColor: tokens.borderDefault,
                  transition: "border-color 200ms",
                  "&:hover": {
                    borderColor: tokens.textDisabled,
                    "& .spec-key": { color: tokens.primary },
                  },
                }}
              >
                <Box
                  component='span'
                  className='spec-key'
                  sx={{
                    fontSize: 10,
                    color: tokens.textSecondary,
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
                    color: tokens.textPrimary,
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
              borderColor: tokens.borderDefault,
              bgcolor: tokens.bgSubtle,
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
                  color: tokens.textSecondary,
                }}
              >
                অর্ডারের পরিমাণ
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  bgcolor: tokens.primarySubtle,
                  border: "1px solid",
                  borderColor: tokens.borderDefault,
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
                    color: tokens.textPrimary,
                    transition: "background-color 150ms",
                    "&:hover": { bgcolor: tokens.bgSubtle },
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
                    color: tokens.textPrimary,
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
                    color: tokens.textPrimary,
                    transition: "background-color 150ms",
                    "&:hover": { bgcolor: tokens.bgSubtle },
                  }}
                >
                  +
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: tokens.textSecondary }}>
                <Box component='span'>প্রতি ইউনিট মূল্য</Box>
                <Box component='span'>৳{formatBnNumber(discountedPrice)}</Box>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: tokens.textSecondary }}>
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
                    color: tokens.successText,
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
                    bgcolor: tokens.primary,
                    color: tokens.textWhite,
                    "&.Mui-disabled": {
                      bgcolor: tokens.primary,
                      color: tokens.textWhite,
                      opacity: 1,
                    },
                  }
                : {
                    borderColor: tokens.borderDefault,
                    color: tokens.textPrimary,
                    "&:hover": {
                      borderColor: tokens.borderDefault,
                      bgcolor: tokens.bgSubtle,
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
              bgcolor: tokens.textPrimary,
              color: tokens.textWhite,
              boxShadow: tokens.shadowLg,
              transition: "all 200ms",
              "&:hover": {
                bgcolor: tokens.textPrimary,
                opacity: 0.9,
              },
              "&.Mui-disabled": {
                bgcolor: tokens.textPrimary,
                color: tokens.textWhite,
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
            borderColor: tokens.borderDefault,
            bgcolor: tokens.bgPanel,
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
              color: tokens.textSecondary,
            }}
          >
            {product.inStock ? (
              <Inventory2OutlinedIcon sx={{ fontSize: 16, color: tokens.success }} />
            ) : (
              <RemoveCircleOutlineIcon sx={{ fontSize: 16, color: tokens.danger }} />
            )}
            স্টক অবস্থা
          </Box>
          <Box
            component='span'
            sx={{
              fontSize: 12,
              fontWeight: 900,
              color: product.inStock ? tokens.success : tokens.danger,
            }}
          >
            {product.inStock ? "এখনই পাওয়া যাচ্ছে" : "বর্তমানে পাওয়া যাচ্ছে না"}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
