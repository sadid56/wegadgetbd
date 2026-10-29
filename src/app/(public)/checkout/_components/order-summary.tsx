"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { keyframes } from "@emotion/react";

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
        bgcolor: "#fff",
        boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
        borderRadius: { xs: "0 0 24px 24px", md: "24px" },
        p: 2.5,
        border: "1px solid",
        borderColor: "grey.100",
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
          borderColor: "divider",
        }}
      >
        <ShoppingBagOutlinedIcon sx={{ fontSize: 20, color: "#f97316" }} />
        <Typography
          component='h2'
          sx={{
            ...BN,
            fontSize: 24,
            fontWeight: 700,
            color: "grey.800",
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
            bgcolor: "grey.300",
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
                bgcolor: "rgba(249,250,251,0.8)",
                borderRadius: "12px",
                border: "1px solid",
                borderColor: "grey.100",
                transition: "all 200ms",
                "&:hover": {
                  bgcolor: "#fff",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)",
                },
              }}
            >
              {/* Image */}
              <Box
                sx={{
                  position: "relative",
                  width: 80,
                  height: 80,
                  bgcolor: "#fff",
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: "divider",
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
                    bgcolor: "#f97316",
                    color: "#fff",
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
                    color: "grey.800",
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
                        color: "grey.400",
                        textDecoration: "line-through",
                      }}
                    >
                      ৳{Number(item.price) * qty}
                    </Typography>
                  )}
                  <Typography component='span' sx={{ fontWeight: 900, color: "#f97316", fontSize: 15 }}>
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
                      borderColor: "divider",
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
                        bgcolor: "grey.100",
                        border: 0,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        transition: "background-color 150ms",
                        "&:hover": { bgcolor: "grey.200" },
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
                        bgcolor: "grey.100",
                        border: 0,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        transition: "background-color 150ms",
                        "&:hover": { bgcolor: "grey.200" },
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
                        bgcolor: "#fef2f2",
                        color: "#ef4444",
                        borderRadius: "8px",
                        p: 1,
                        transition: "background-color 150ms",
                        "&:hover": { bgcolor: "#fee2e2" },
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
          background: "linear-gradient(to bottom, #fff, #f9fafb)",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", color: "grey.600" }}>
            <Box component='span' sx={{ fontFamily: "serif", color: "grey.900", fontSize: 14 }}>
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
                color: "grey.700",
                fontSize: 14,
              }}
            >
              <Box component='span' sx={{ fontFamily: "serif" }}>
                ডিসকাউন্টঃ
              </Box>
              <Box component='span'>-৳{discountAmount}</Box>
            </Box>
          )}

          <Box sx={{ display: "flex", justifyContent: "space-between", color: "grey.600" }}>
            <Box component='span' sx={{ fontFamily: "serif", fontSize: 14, color: "grey.800" }}>
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
              borderColor: "divider",
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            <Box component='span'>সর্বমোট:</Box>
            <Box component='span' sx={{ color: "#ea580c", fontWeight: 900 }}>
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
            bgcolor: "grey.800",
            color: "#fff",
            py: 1.5,
            borderRadius: "12px",
            fontWeight: 600,
            fontSize: 14,
            textTransform: "none",
            transition: "background-color 200ms",
            "&:hover": { bgcolor: "grey.900" },
          }}
        >
          Order Now
        </Button>
      </Box>
    </Box>
  );
}
