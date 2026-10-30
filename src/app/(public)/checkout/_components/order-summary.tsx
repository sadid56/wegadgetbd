"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { keyframes } from "@emotion/react";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { tokens } from "@/theme/theme";

import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { BN } from "./checkout-constants";
import { getAssetUrl } from "@/lib/storage";

interface OrderSummaryProps {
  products: any[];
  originalSubtotal: number;
  deliveryCharge: number;
  discountAmount: number;
  totalAmount: number;
  isBuyNow: boolean;
  localQty: number;
  onIncreaseQty?: (id: string) => void;
  onDecreaseQty?: (id: string) => void;
  onRemoveItem?: (id: string) => void;
}

const fadeInX = keyframes`
  from { opacity: 0; transform: translateX(20px); }
  to   { opacity: 1; transform: translateX(0); }
`;

export function OrderSummary({
  products,
  originalSubtotal,
  deliveryCharge,
  discountAmount,
  totalAmount,
  isBuyNow,
  localQty,
  onIncreaseQty,
  onDecreaseQty,
  onRemoveItem,
}: OrderSummaryProps) {
  return (
    <Box
      sx={{
        bgcolor: tokens.bgPanel,
        boxShadow: tokens.shadowElevated,
        borderRadius: { xs: "0 0 24px 24px", md: "24px" },
        p: 2.5,
        border: "1px solid",
        borderColor: tokens.borderDefault,
        position: { md: "sticky" },
        top: { md: 40 },
        animation: `${fadeInX} 400ms ease-out both`,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 1,
          pb: 1,
          borderBottom: "1px solid",
          borderColor: tokens.borderDefault,
        }}
      >
        <ShoppingBagOutlinedIcon sx={{ fontSize: 20, color: tokens.primary }} />
        <Typography
          component='h2'
          sx={{
            ...BN,
            fontSize: 24,
            fontWeight: 700,
            color: tokens.textPrimary,
            lineHeight: 1.2,
          }}
        >
          অর্ডারের সারসংক্ষেপ
        </Typography>
      </Box>

      {/* Product list */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxHeight: 400,
          overflowY: "auto",
          pr: 1,
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": { width: 6 },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: tokens.borderElevated,
            borderRadius: 3,
          },
          "&::-webkit-scrollbar-track": { bgcolor: "transparent" },
        }}
      >
        {products.map((item: any) => {
          const qty = isBuyNow ? localQty : item.qty;

          return (
            <Box
              key={item.id}
              sx={{
                display: "flex",
                gap: 2,
                p: 1,
                bgcolor: tokens.bgCanvas,
                borderRadius: "12px",
                border: "1px solid",
                borderColor: tokens.borderSubtle,
                transition: "all 200ms",
                "&:hover": {
                  bgcolor: tokens.bgPanel,
                  boxShadow: tokens.shadowMd,
                },
              }}
            >
              {/* Image */}
              <Box
                sx={{
                  position: "relative",
                  width: 80,
                  height: 80,
                  bgcolor: tokens.bgPanel,
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: tokens.borderDefault,
                  flexShrink: 0,
                }}
              >
                <Box
                  component='img'
                  src={getAssetUrl(item.images?.[0]) || ""}
                  alt={item.title}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    p: 0.5,
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    bgcolor: tokens.primary,
                    color: tokens.textWhite,
                    fontSize: 10,
                    fontWeight: 700,
                    px: 1,
                    py: "2px",
                    borderBottomLeftRadius: "8px",
                  }}
                >
                  x{qty}
                </Box>
              </Box>

              {/* Content */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <Typography
                  sx={{
                    ...BN,
                    fontSize: 14,
                    fontWeight: 700,
                    color: tokens.textPrimary,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    lineHeight: 1.35,
                  }}
                >
                  {item.title}
                </Typography>

                {/* Price */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {discountAmount > 0 && (
                    <Typography
                      component='span'
                      sx={{
                        fontSize: 14,
                        color: tokens.textDisabled,
                        textDecoration: "line-through",
                      }}
                    >
                      ৳{Number(item.price) * qty}
                    </Typography>
                  )}
                  <Typography component='span' sx={{ fontWeight: 900, color: tokens.primary, fontSize: 15 }}>
                    ৳{Number(item.discountPrice || item.price) * qty}
                  </Typography>
                </Box>

                {/* Actions */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mt: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      border: "1px solid",
                      borderColor: tokens.borderDefault,
                      borderRadius: "8px",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      component='button'
                      onClick={() => onDecreaseQty?.(item.id)}
                      sx={{
                        px: 1,
                        py: 0.5,
                        bgcolor: tokens.bgSubtle,
                        border: 0,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        transition: "background-color 150ms",
                        "&:hover": { bgcolor: tokens.borderDefault },
                      }}
                    >
                      <RemoveIcon sx={{ fontSize: 14 }} />
                    </Box>
                    <Box
                      component='span'
                      sx={{
                        px: 1.5,
                        fontSize: 14,
                        fontWeight: 600,
                        minWidth: 32,
                        textAlign: "center",
                      }}
                    >
                      {qty}
                    </Box>
                    <Box
                      component='button'
                      onClick={() => onIncreaseQty?.(item.id)}
                      sx={{
                        px: 1,
                        py: 0.5,
                        bgcolor: tokens.bgSubtle,
                        border: 0,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        transition: "background-color 150ms",
                        "&:hover": { bgcolor: tokens.borderDefault },
                      }}
                    >
                      <AddIcon sx={{ fontSize: 14 }} />
                    </Box>
                  </Box>

                  {!isBuyNow && (
                    <IconButton
                      size='small'
                      onClick={() => onRemoveItem?.(item.id)}
                      sx={{
                        bgcolor: tokens.dangerSubtle,
                        color: tokens.danger,
                        borderRadius: "8px",
                        p: 1,
                        transition: "background-color 150ms",
                        "&:hover": { bgcolor: tokens.dangerBorder },
                      }}
                    >
                      <DeleteOutlinedIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  )}
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Price section */}
      <Box
        sx={{
          p: 1.5,
          borderRadius: "0 0 12px 12px",
          background: `linear-gradient(to bottom, ${tokens.bgPanel}, ${tokens.bgCanvas})`,
          boxShadow: tokens.shadowMd,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", color: tokens.textSecondary }}>
            <Box component='span' sx={{ fontFamily: "serif", color: tokens.textPrimary, fontSize: 14 }}>
              সাবটোটাল:
            </Box>
            <Box component='span' sx={{ fontWeight: 900, fontSize: 14 }}>
              ৳{originalSubtotal}
            </Box>
          </Box>

          {discountAmount > 0 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                color: tokens.textSecondary,
                fontSize: 14,
              }}
            >
              <Box component='span' sx={{ fontFamily: "serif" }}>
                ডিসকাউন্টঃ
              </Box>
              <Box component='span'>-৳{discountAmount}</Box>
            </Box>
          )}

          <Box sx={{ display: "flex", justifyContent: "space-between", color: tokens.textSecondary }}>
            <Box component='span' sx={{ fontFamily: "serif", fontSize: 14, color: tokens.textPrimary }}>
              ডেলিভারি-চার্জ:
            </Box>
            <Box component='span' sx={{ fontSize: 14 }}>
              ৳{deliveryCharge}
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              pt: 1.5,
              borderTop: "1px solid",
              borderColor: tokens.borderDefault,
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            <Box component='span'>সর্বমোট:</Box>
            <Box component='span' sx={{ color: tokens.primaryHover, fontWeight: 900 }}>
              ৳{totalAmount}
            </Box>
          </Box>
        </Box>

        <Button
          fullWidth
          disableElevation
          sx={{
            ...BN,
            mt: 2.5,
            bgcolor: tokens.textPrimary,
            color: tokens.textWhite,
            py: 1.5,
            borderRadius: "12px",
            fontWeight: 600,
            fontSize: 14,
            textTransform: "none",
            transition: "background-color 200ms",
            "&:hover": { bgcolor: tokens.bgDark },
          }}
        >
          Order Now
        </Button>
      </Box>
    </Box>
  );
}
