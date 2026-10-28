"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import ButtonBase from "@mui/material/ButtonBase";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import BoltIcon from "@mui/icons-material/Bolt";
import { keyframes } from "@emotion/react";

interface Props {
  price: number;
  qty: number;
  isInCart: boolean;
  addToCart: () => void;
  handleBuyNow: () => void;
}

const slideUp = keyframes`
  from { transform: translateY(80px); }
  to   { transform: translateY(0); }
`;

export default function ProductStickyBar({ price, qty, isInCart, addToCart, handleBuyNow }: Props) {
  const total = price * qty;

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        zIndex: 50,
        bgcolor: "#fff",
        borderTop: "1px solid",
        borderColor: "divider",
        boxShadow: "0 -10px 15px -3px rgba(0,0,0,0.1)",
        display: { xs: "block", lg: "none" },
        animation: `${slideUp} 300ms ease-out both`,
      }}
    >
      <Container
        maxWidth='lg'
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: 1.5,
          px: 2.5,
          gap: 1.5,
        }}
      >
        {/* Price */}
        <Box>
          <Box component='p' sx={{ fontSize: 20, color: "#6b7280", m: 0, lineHeight: 1.2 }}>
            Total
          </Box>
          <Box
            component='p'
            sx={{
              fontSize: 18,
              fontWeight: 700,
              color: "#ff7319",
              m: 0,
              mt: 0.25,
              lineHeight: 1.2,
            }}
          >
            ৳{total}
          </Box>
        </Box>

        {/* Buttons */}
        <Box sx={{ display: "flex", gap: 1, width: "65%" }}>
          <ButtonBase
            onClick={addToCart}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              width: "50%",
              border: "1px solid #ff7319",
              color: "#ff7319",
              borderRadius: "8px",
              py: 1,
              fontWeight: 500,
              fontSize: 14,
              transition: "background-color 200ms",
              "&:hover": { bgcolor: "#fff7ed" },
            }}
          >
            <ShoppingCartOutlinedIcon sx={{ fontSize: 18 }} />
            {isInCart ? "Added" : "Cart"}
          </ButtonBase>

          <ButtonBase
            onClick={handleBuyNow}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              width: "50%",
              bgcolor: "#ff7319",
              color: "#fff",
              borderRadius: "8px",
              py: 1,
              fontWeight: 600,
              fontSize: 14,
              transition: "background-color 200ms",
              "&:hover": { bgcolor: "#ea580c" },
            }}
          >
            <BoltIcon sx={{ fontSize: 18 }} />
            Buy Now
          </ButtonBase>
        </Box>
      </Container>
    </Box>
  );
}
