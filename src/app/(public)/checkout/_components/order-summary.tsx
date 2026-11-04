"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { CircularProgress } from "@/components/ui/spinner";
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
  isSubmitting?: boolean;
  onIncreaseQty?: (id: string) => void;
  onDecreaseQty?: (id: string) => void;
  onRemoveItem?: (id: string) => void;
}

export function OrderSummary({
  products,
  originalSubtotal,
  deliveryCharge,
  discountAmount,
  totalAmount,
  isBuyNow,
  localQty,
  isSubmitting = false,
  onIncreaseQty,
  onDecreaseQty,
  onRemoveItem,
}: OrderSummaryProps) {
  return (
    <Box
      sx={{
        bgcolor: tokens.bgPanel,
        borderRadius: "12px",
        p: { xs: 2, sm: 2.5 },
        border: `1px solid ${tokens.borderDefault}`,
        position: { md: "sticky" },
        top: { md: 24 },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 2,
          pb: 1.5,
          borderBottom: `1px solid ${tokens.borderDefault}`,
        }}
      >
        <ShoppingBagOutlinedIcon sx={{ fontSize: 18, color: tokens.primary }} />
        <Typography
          component='h2'
          sx={{
            ...BN,
            fontSize: { xs: 17, sm: 19 },
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
          gap: 1.5,
          maxHeight: 360,
          overflowY: "auto",
          pr: 0.5,
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": { width: 5 },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: tokens.borderElevated,
            borderRadius: 3,
          },
        }}
      >
        {products.map((item: any) => {
          const qty = isBuyNow ? localQty : item.qty;
          const price = Number(item.price || 0);
          const salePrice = Number(item.discountPrice || item.price || 0);

          return (
            <Box
              key={item.id}
              sx={{
                display: "flex",
                gap: 1.5,
                p: 1.25,
                bgcolor: tokens.bgCanvas,
                borderRadius: "10px",
                border: `1px solid ${tokens.borderDefault}`,
              }}
            >
              {/* Image */}
              <Box
                sx={{
                  position: "relative",
                  width: 68,
                  height: 68,
                  bgcolor: tokens.bgPanel,
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: `1px solid ${tokens.borderDefault}`,
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
                    px: 0.75,
                    py: "1px",
                    borderBottomLeftRadius: "6px",
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
                    fontSize: 13,
                    fontWeight: 600,
                    color: tokens.textPrimary,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    lineHeight: 1.3,
                  }}
                >
                  {item.title}
                </Typography>

                {/* Price */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                  {price > salePrice && (
                    <Typography
                      component='span'
                      sx={{
                        fontSize: 12,
                        color: tokens.textDisabled,
                        textDecoration: "line-through",
                      }}
                    >
                      ৳{price * qty}
                    </Typography>
                  )}
                  <Typography component='span' sx={{ fontWeight: 700, color: tokens.textPrimary, fontSize: 14 }}>
                    ৳{salePrice * qty}
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
                      display: "inline-flex",
                      alignItems: "center",
                      border: `1px solid ${tokens.borderDefault}`,
                      borderRadius: "6px",
                      bgcolor: tokens.bgPanel,
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      component='button'
                      type='button'
                      onClick={() => onDecreaseQty?.(item.id)}
                      sx={{
                        px: 1,
                        py: 0.25,
                        bgcolor: "transparent",
                        border: 0,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        color: tokens.textSecondary,
                        "&:hover": { bgcolor: tokens.bgSubtle },
                      }}
                    >
                      <RemoveIcon sx={{ fontSize: 13 }} />
                    </Box>
                    <Box
                      component='span'
                      sx={{
                        px: 1,
                        fontSize: 12,
                        fontWeight: 600,
                        minWidth: 24,
                        textAlign: "center",
                        color: tokens.textPrimary,
                      }}
                    >
                      {qty}
                    </Box>
                    <Box
                      component='button'
                      type='button'
                      onClick={() => onIncreaseQty?.(item.id)}
                      sx={{
                        px: 1,
                        py: 0.25,
                        bgcolor: "transparent",
                        border: 0,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        color: tokens.textSecondary,
                        "&:hover": { bgcolor: tokens.bgSubtle },
                      }}
                    >
                      <AddIcon sx={{ fontSize: 13 }} />
                    </Box>
                  </Box>

                  {!isBuyNow && (
                    <IconButton
                      size='small'
                      type='button'
                      onClick={() => onRemoveItem?.(item.id)}
                      sx={{
                        color: tokens.textSecondary,
                        p: 0.5,
                        borderRadius: "6px",
                        "&:hover": { color: tokens.danger, bgcolor: tokens.dangerSubtle },
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

      {/* Price breakdown */}
      <Box sx={{ mt: 2.5, pt: 2, borderTop: `1px solid ${tokens.borderDefault}` }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
            <Box component='span' sx={{ ...BN, color: tokens.textSecondary }}>
              সাবটোটাল
            </Box>
            <Box component='span' sx={{ fontWeight: 600, color: tokens.textPrimary }}>
              ৳{originalSubtotal}
            </Box>
          </Box>

          {discountAmount > 0 && (
            <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
              <Box component='span' sx={{ ...BN, color: tokens.successText }}>
                ডিসকাউন্ট
              </Box>
              <Box component='span' sx={{ fontWeight: 600, color: tokens.successText }}>
                -৳{discountAmount}
              </Box>
            </Box>
          )}

          <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
            <Box component='span' sx={{ ...BN, color: tokens.textSecondary }}>
              ডেলিভারি চার্জ
            </Box>
            <Box component='span' sx={{ fontWeight: 600, color: tokens.textPrimary }}>
              ৳{deliveryCharge}
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              pt: 1.5,
              mt: 0.5,
              borderTop: `1px solid ${tokens.borderDefault}`,
            }}
          >
            <Box component='span' sx={{ ...BN, fontSize: 15, fontWeight: 700, color: tokens.textPrimary }}>
              সর্বমোট
            </Box>
            <Box component='span' sx={{ fontSize: 20, fontWeight: 800, color: tokens.primary }}>
              ৳{totalAmount}
            </Box>
          </Box>
        </Box>

        <Button
          type='submit'
          form='checkout-form'
          disabled={isSubmitting}
          fullWidth
          disableElevation
          sx={{
            ...BN,
            mt: 2.5,
            bgcolor: tokens.primary,
            color: tokens.textWhite,
            py: 1.25,
            borderRadius: "8px",
            fontWeight: 700,
            fontSize: 14,
            textTransform: "none",
            transition: "background-color 150ms ease",
            "&:hover": { bgcolor: tokens.primaryHover },
            "&.Mui-disabled": { opacity: 0.6, bgcolor: tokens.primary, color: tokens.textWhite },
          }}
        >
          {isSubmitting ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={16} sx={{ color: tokens.textWhite }} />
              <span>প্রসেস হচ্ছে...</span>
            </Box>
          ) : (
            "Order Now"
          )}
        </Button>
      </Box>
    </Box>
  );
}
