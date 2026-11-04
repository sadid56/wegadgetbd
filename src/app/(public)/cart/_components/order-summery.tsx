"use client";

import NextLink from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button } from "@/components/ui/button";
import PercentIcon from "@mui/icons-material/Percent";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { tokens } from "@/theme/theme";

type OrderSummaryProps = {
  totalPrice: number;
  totalCount: number;
  savings: number;
};

export default function OrderSummary({ totalPrice, totalCount, savings }: OrderSummaryProps) {
  return (
    <Box
      sx={{
        bgcolor: tokens.bgPanel,
        border: `1px solid ${tokens.borderDefault}`,
        borderRadius: "12px",
        p: 3,
        position: { lg: "sticky" },
        top: { lg: 88 },
      }}
    >
      <Typography
        component="h2"
        sx={{
          fontSize: 16,
          fontWeight: 800,
          color: tokens.textPrimary,
          pb: 2,
          borderBottom: `1px solid ${tokens.borderSubtle}`,
        }}
      >
        Order Summary
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, py: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
          <Typography sx={{ fontSize: 14, color: tokens.textMuted }}>
            Subtotal ({totalCount} {totalCount === 1 ? "item" : "items"})
          </Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: tokens.textPrimary }}>
            ৳{totalPrice.toLocaleString()}
          </Typography>
        </Box>

        {savings > 0 && (
          <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
            <Typography sx={{ fontSize: 14, color: tokens.primary, fontWeight: 600, display: "flex", alignItems: "center", gap: 0.5 }}>
              <PercentIcon sx={{ fontSize: 14 }} /> Total Savings
            </Typography>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: tokens.primary }}>
              -৳{savings.toLocaleString()}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
          <Typography sx={{ fontSize: 14, color: tokens.textMuted }}>
            Delivery Charge
          </Typography>
          <Typography sx={{ fontSize: 12, color: tokens.textDisabled, fontStyle: "italic" }}>
            Calculated at checkout
          </Typography>
        </Box>
      </Box>

      <Box sx={{ pt: 2, borderTop: `1px solid ${tokens.borderDefault}`, mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <Typography sx={{ fontSize: 15, fontWeight: 800, color: tokens.textPrimary }}>
            Estimated Total
          </Typography>
          <Typography sx={{ fontSize: 24, fontWeight: 900, color: tokens.textPrimary, letterSpacing: "-0.02em" }}>
            ৳{totalPrice.toLocaleString()}
          </Typography>
        </Box>
        <Typography sx={{ fontSize: 11, color: tokens.textDisabled, mt: 0.25, textAlign: "right" }}>
          Excluding delivery fees
        </Typography>
      </Box>

      <Button
        component={NextLink}
        href="/checkout"
        fullWidth
        sx={{
          height: 48,
          borderRadius: "8px",
          bgcolor: tokens.primary,
          color: tokens.textWhite,
          fontWeight: 800,
          fontSize: 14,
          textTransform: "none",
          transition: "background-color 150ms ease",
          "&:hover": { bgcolor: tokens.primaryHover },
        }}
      >
        Proceed to Checkout
      </Button>

      <Button
        component={NextLink}
        href="/products"
        fullWidth
        variant="secondary"
        sx={{
          mt: 1.5,
          height: 42,
          borderRadius: "8px",
          border: `1px solid ${tokens.borderDefault}`,
          color: tokens.textSecondary,
          fontWeight: 600,
          fontSize: 13,
          textTransform: "none",
          "&:hover": { bgcolor: tokens.bgCanvas, color: tokens.textPrimary },
        }}
      >
        Continue Shopping
      </Button>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 0.75,
          mt: 2.5,
          color: tokens.textDisabled,
        }}
      >
        <LockOutlinedIcon sx={{ fontSize: 14 }} />
        <Typography sx={{ fontSize: 11, fontWeight: 500 }}>
          SSL Encrypted &amp; Secure Checkout
        </Typography>
      </Box>
    </Box>
  );
}
