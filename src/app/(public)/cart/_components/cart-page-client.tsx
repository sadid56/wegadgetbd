"use client";

import NextLink from "next/link";
import { useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import { keyframes } from "@emotion/react";

import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import ReplayIcon from "@mui/icons-material/Replay";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import BoltIcon from "@mui/icons-material/Bolt";
import PercentIcon from "@mui/icons-material/Percent";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import StarIcon from "@mui/icons-material/Star";

import { useCart } from "@/hooks/useCart";
import { getAssetUrl } from "@/lib/storage";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const itemFadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.5; }
`;

const TRUST = [
  { icon: LocalShippingOutlinedIcon, text: "Free Delivery", sub: "Orders over ৳999" },
  { icon: ShieldOutlinedIcon, text: "Secure Checkout", sub: "SSL encrypted" },
  { icon: ReplayIcon, text: "Easy Returns", sub: "30-day policy" },
  { icon: BoltIcon, text: "Fast Processing", sub: "Same-day dispatch" },
];

function EmptyCart() {
  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f8fafc",
        px: 2,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 448,
          textAlign: "center",
          animation: `${fadeUp} 500ms cubic-bezier(0.16, 1, 0.3, 1) both`,
        }}
      >
        <Box sx={{ position: "relative", mx: "auto", width: 128, height: 128, mb: 4 }}>
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              bgcolor: "#f1f5f9",
              animation: `${pulse} 2s ease-in-out infinite`,
            }}
          />
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              bgcolor: "#fff",
              border: "1px solid #e2e8f0",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ShoppingBagOutlinedIcon sx={{ fontSize: 56, color: "#cbd5e1" }} />
          </Box>
          <Box sx={{ position: "absolute", inset: 0, animation: `${spin} 4s linear infinite` }}>
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translate(-50%, -4px)",
                width: 12,
                height: 12,
                borderRadius: "50%",
                bgcolor: "#fb923c",
                boxShadow: "0 4px 6px -1px rgba(254,215,170,1)",
              }}
            />
          </Box>
        </Box>

        <Typography
          component='h1'
          sx={{
            fontSize: 24,
            fontWeight: 900,
            color: "#0f172a",
            letterSpacing: "-0.02em",
            mb: 1,
          }}
        >
          Your cart is empty
        </Typography>
        <Typography
          sx={{
            color: "#94a3b8",
            fontSize: 14,
            lineHeight: 1.65,
            mb: 4,
            maxWidth: 320,
            mx: "auto",
          }}
        >
          Looks like you haven&apos;t added anything yet. Explore our collection and find something you&apos;ll love.
        </Typography>

        <Button
          component={NextLink}
          href='/products'
          startIcon={<Inventory2OutlinedIcon sx={{ fontSize: 16 }} />}
          disableElevation
          sx={{
            height: 48,
            px: 4,
            borderRadius: "16px",
            bgcolor: "#0f172a",
            color: "#fff",
            fontWeight: 700,
            fontSize: 14,
            textTransform: "none",
            boxShadow: "0 20px 25px -5px rgba(15,23,42,0.2)",
            transition: "all 200ms",
            "&:hover": { bgcolor: "#1e293b", transform: "scale(1.03)" },
            "&:active": { transform: "scale(0.97)" },
          }}
        >
          Explore Collection
        </Button>

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, mt: 4, flexWrap: "wrap" }}>
          {["Free delivery", "Easy returns", "100% genuine"].map((t) => (
            <Box key={t} sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <Box sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: "#cbd5e1" }} />
              <Typography sx={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>{t}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default function CartPage() {
  const { cart, removeItem, updateQty, totalPrice, totalCount, clearCart } = useCart();

  if (cart.length === 0) return <EmptyCart />;

  const savings = cart.reduce((acc, item) => {
    const orig = Number(item.price || 0);
    const disc = Number(item.discountPrice || item.price || 0);
    return acc + (orig - disc) * item.qty;
  }, 0);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc" }}>
      {/* Sticky header */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          bgcolor: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid #f1f5f9",
        }}
      >
        <Box
          sx={{
            maxWidth: 1152,
            mx: "auto",
            px: 2,
            height: { xs: 56, sm: 64 },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: { xs: 1, sm: 2 },
          }}
        >
          <Box
            component={NextLink}
            href='/products'
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              fontSize: 14,
              fontWeight: 600,
              color: "#64748b",
              textDecoration: "none",
              flexShrink: 0,
              transition: "color 200ms",
              "&:hover": { color: "#0f172a", "& .back-icon": { transform: "translateX(-2px)" } },
            }}
          >
            <ArrowBackIcon className='back-icon' sx={{ fontSize: 16, transition: "transform 200ms" }} />
            <Box component='span' sx={{ display: { xs: "none", sm: "inline" } }}>
              Continue Shopping
            </Box>
            <Box component='span' sx={{ display: { xs: "inline", sm: "none" }, fontSize: 12 }}>
              Shop
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.5, sm: 0.75 },
              fontSize: { xs: 11, sm: 12 },
              fontWeight: 600,
              color: "#94a3b8",
            }}
          >
            <Box component='span' sx={{ color: "#0f172a", fontWeight: 900 }}>
              Cart
            </Box>
            <ChevronRightIcon sx={{ fontSize: 12 }} />
            <Box component='span'>Checkout</Box>
            <ChevronRightIcon sx={{ fontSize: 12 }} />
            <Box component='span' sx={{ display: { xs: "none", sm: "inline" } }}>
              Done
            </Box>
          </Box>

          <Box
            component='button'
            onClick={clearCart}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              bgcolor: "transparent",
              border: 0,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              color: "#fb7185",
              flexShrink: 0,
              transition: "color 200ms",
              "&:hover": { color: "#e11d48" },
            }}
          >
            <DeleteOutlinedIcon sx={{ fontSize: 14 }} />
            <Box component='span' sx={{ display: { xs: "none", sm: "inline" } }}>
              Clear cart
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 1152, mx: "auto", px: { xs: 1.5, sm: 2 }, py: { xs: 2.5, sm: 3, md: 5 } }}>
        {/* Page title */}
        <Box sx={{ mb: { xs: 2.5, sm: 4 }, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            <Typography
              component='h1'
              sx={{
                fontSize: { xs: 18, sm: 24, md: 28 },
                fontWeight: 900,
                color: "#0f172a",
                letterSpacing: "-0.02em",
              }}
            >
              Shopping Cart
            </Typography>
            <Typography sx={{ fontSize: { xs: 12, sm: 14 }, color: "#94a3b8", mt: 0.25 }}>
              {totalCount} item{totalCount !== 1 ? "s" : ""} · Review before checkout
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, bgcolor: "#f1f5f9", px: 1.5, py: 0.75, borderRadius: 999 }}>
            <ShoppingCartIcon sx={{ fontSize: 14, color: "#64748b" }} />
            <Typography component='span' sx={{ fontSize: 14, fontWeight: 900, color: "#334155" }}>
              {totalCount}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "repeat(12, minmax(0, 1fr))" },
            gap: { xs: 2, sm: 3, lg: 4 },
            alignItems: "flex-start",
          }}
        >
          {/* LEFT */}
          <Box
            sx={{
              gridColumn: { lg: "span 7", xl: "span 8" },
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            {/* Desktop header row */}
            <Box
              sx={{
                display: { xs: "none", sm: "grid" },
                gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
                gap: 2,
                px: 2,
                py: 1,
                fontSize: 10,
                fontWeight: 900,
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                borderBottom: "1px solid #e2e8f0",
              }}
            >
              <Box sx={{ gridColumn: "span 6" }}>Product</Box>
              <Box sx={{ gridColumn: "span 2", textAlign: "center" }}>Price</Box>
              <Box sx={{ gridColumn: "span 2", textAlign: "center" }}>Qty</Box>
              <Box sx={{ gridColumn: "span 2", textAlign: "right", pr: 1 }}>Total</Box>
            </Box>

            {cart.map((item, idx) => {
              const unitPrice = Number(item.discountPrice || item.price || 0);
              const origPrice = Number(item.price || 0);
              const lineTotal = unitPrice * item.qty;
              const hasDisc = origPrice > unitPrice;
              const discPct = hasDisc ? Math.round((1 - unitPrice / origPrice) * 100) : 0;

              return (
                <Box
                  key={item.id}
                  sx={{
                    bgcolor: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "16px",
                    overflow: "hidden",
                    transition: "all 300ms",
                    animation: `${itemFadeIn} 280ms cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.04}s both`,
                    "&:hover": {
                      borderColor: "#cbd5e1",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)",
                      "& .cart-img": { transform: "scale(1.05)" },
                    },
                  }}
                >
                  {/* MOBILE */}
                  <Box sx={{ display: { xs: "flex", sm: "none" }, p: 1.5, gap: 1.5 }}>
                    <Box
                      sx={{
                        position: "relative",
                        width: 72,
                        height: 72,
                        borderRadius: "12px",
                        overflow: "hidden",
                        bgcolor: "#f8fafc",
                        border: "1px solid #f1f5f9",
                        flexShrink: 0,
                      }}
                    >
                      {item.images?.[0] ? (
                        <Box
                          component='img'
                          className='cart-img'
                          src={getAssetUrl(item.images[0])}
                          alt={item.title}
                          sx={{ width: "100%", height: "100%", objectFit: "contain", p: 0.5, transition: "transform 300ms" }}
                        />
                      ) : (
                        <Box sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Inventory2OutlinedIcon sx={{ fontSize: 24, color: "#cbd5e1" }} />
                        </Box>
                      )}
                      {hasDisc && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 4,
                            left: 4,
                            fontSize: 9,
                            fontWeight: 900,
                            color: "#fff",
                            bgcolor: "#f43f5e",
                            px: 0.75,
                            py: 0.25,
                            borderRadius: "6px",
                            lineHeight: 1,
                          }}
                        >
                          -{discPct}%
                        </Box>
                      )}
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1 }}>
                        <Typography
                          sx={{
                            fontWeight: 700,
                            color: "#0f172a",
                            fontSize: 14,
                            lineHeight: 1.35,
                            flex: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {item.title}
                        </Typography>
                        <IconButton
                          onClick={() => removeItem(item.id)}
                          size='small'
                          sx={{
                            width: 28,
                            height: 28,
                            borderRadius: "8px",
                            color: "#cbd5e1",
                            flexShrink: 0,
                            mt: 0.25,
                            "&:hover": { color: "#f43f5e", bgcolor: "#fff1f2" },
                          }}
                        >
                          <DeleteOutlinedIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.75 }}>
                        <Typography component='span' sx={{ fontSize: 16, fontWeight: 900, color: "#0f172a" }}>
                          ৳{unitPrice.toLocaleString()}
                        </Typography>
                        {hasDisc && (
                          <Typography component='span' sx={{ fontSize: 12, color: "#94a3b8", textDecoration: "line-through" }}>
                            ৳{origPrice.toLocaleString()}
                          </Typography>
                        )}
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            border: "1px solid #e2e8f0",
                            borderRadius: "12px",
                            overflow: "hidden",
                          }}
                        >
                          <Box
                            component='button'
                            onClick={() => updateQty(item.id, item.qty - 1)}
                            sx={{
                              width: 32,
                              height: 32,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              bgcolor: "transparent",
                              border: 0,
                              cursor: "pointer",
                              color: "#64748b",
                              transition: "background-color 150ms",
                              "&:hover": { bgcolor: "#f8fafc" },
                            }}
                          >
                            <RemoveIcon sx={{ fontSize: 12 }} />
                          </Box>
                          <Box
                            component='span'
                            sx={{
                              width: 36,
                              height: 32,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 14,
                              fontWeight: 900,
                              color: "#0f172a",
                              borderLeft: "1px solid #e2e8f0",
                              borderRight: "1px solid #e2e8f0",
                            }}
                          >
                            {item.qty}
                          </Box>
                          <Box
                            component='button'
                            onClick={() => updateQty(item.id, item.qty + 1)}
                            sx={{
                              width: 32,
                              height: 32,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              bgcolor: "transparent",
                              border: 0,
                              cursor: "pointer",
                              color: "#64748b",
                              transition: "background-color 150ms",
                              "&:hover": { bgcolor: "#f8fafc" },
                            }}
                          >
                            <AddIcon sx={{ fontSize: 12 }} />
                          </Box>
                        </Box>
                        <Typography sx={{ fontSize: 14, fontWeight: 900, color: "#0f172a" }}>৳{lineTotal.toLocaleString()}</Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* DESKTOP */}
                  <Box
                    sx={{
                      display: { xs: "none", sm: "grid" },
                      gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
                      gap: 2,
                      alignItems: "center",
                      p: 2,
                    }}
                  >
                    <Box sx={{ gridColumn: "span 6", display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Box
                        sx={{
                          position: "relative",
                          width: 68,
                          height: 68,
                          borderRadius: "12px",
                          overflow: "hidden",
                          bgcolor: "#f8fafc",
                          border: "1px solid #f1f5f9",
                          flexShrink: 0,
                        }}
                      >
                        {item.images?.[0] ? (
                          <Box
                            component='img'
                            className='cart-img'
                            src={getAssetUrl(item.images[0])}
                            alt={item.title}
                            sx={{ width: "100%", height: "100%", objectFit: "contain", p: 0.75, transition: "transform 300ms" }}
                          />
                        ) : (
                          <Box sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Inventory2OutlinedIcon sx={{ fontSize: 28, color: "#cbd5e1" }} />
                          </Box>
                        )}
                        {hasDisc && (
                          <Box
                            sx={{
                              position: "absolute",
                              top: 4,
                              left: 4,
                              fontSize: 9,
                              fontWeight: 900,
                              color: "#fff",
                              bgcolor: "#f43f5e",
                              px: 0.75,
                              py: 0.25,
                              borderRadius: "6px",
                              lineHeight: 1,
                            }}
                          >
                            -{discPct}%
                          </Box>
                        )}
                      </Box>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: "#0f172a",
                          fontSize: 14,
                          lineHeight: 1.35,
                          flex: 1,
                          minWidth: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {item.title}
                      </Typography>
                    </Box>

                    <Box sx={{ gridColumn: "span 2", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 900, color: "#0f172a" }}>৳{unitPrice.toLocaleString()}</Typography>
                      {hasDisc && (
                        <Typography sx={{ fontSize: 10, color: "#94a3b8", textDecoration: "line-through" }}>
                          ৳{origPrice.toLocaleString()}
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ gridColumn: "span 2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          border: "1px solid #e2e8f0",
                          borderRadius: "12px",
                          overflow: "hidden",
                        }}
                      >
                        <Box
                          component='button'
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          sx={{
                            width: 32,
                            height: 32,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "transparent",
                            border: 0,
                            cursor: "pointer",
                            color: "#64748b",
                            transition: "background-color 150ms, color 150ms",
                            "&:hover": { bgcolor: "#f8fafc", color: "#0f172a" },
                          }}
                        >
                          <RemoveIcon sx={{ fontSize: 12 }} />
                        </Box>
                        <Box
                          component='span'
                          sx={{
                            width: 40,
                            height: 32,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 14,
                            fontWeight: 900,
                            color: "#0f172a",
                            borderLeft: "1px solid #e2e8f0",
                            borderRight: "1px solid #e2e8f0",
                          }}
                        >
                          {item.qty}
                        </Box>
                        <Box
                          component='button'
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          sx={{
                            width: 32,
                            height: 32,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "transparent",
                            border: 0,
                            cursor: "pointer",
                            color: "#64748b",
                            transition: "background-color 150ms, color 150ms",
                            "&:hover": { bgcolor: "#f8fafc", color: "#0f172a" },
                          }}
                        >
                          <AddIcon sx={{ fontSize: 12 }} />
                        </Box>
                      </Box>
                    </Box>

                    <Box sx={{ gridColumn: "span 2", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 1, pr: 0.5 }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 900, color: "#0f172a" }}>৳{lineTotal.toLocaleString()}</Typography>
                      <IconButton
                        onClick={() => removeItem(item.id)}
                        size='small'
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: "12px",
                          color: "#cbd5e1",
                          "&:hover": { color: "#f43f5e", bgcolor: "#fff1f2" },
                        }}
                      >
                        <DeleteOutlinedIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              );
            })}

            {/* Promo code */}
            <Box sx={{ bgcolor: "#fff", border: "1px solid #e2e8f0", borderRadius: "16px", p: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                <LocalOfferOutlinedIcon sx={{ fontSize: 14, color: "#94a3b8" }} />
                <Box
                  component='span'
                  sx={{ fontSize: 12, fontWeight: 900, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.15em" }}
                >
                  Promo Code
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                <InputBase
                  placeholder='Enter coupon code'
                  sx={{
                    flex: 1,
                    height: 44,
                    px: 2,
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    bgcolor: "#f8fafc",
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#1e293b",
                    minWidth: 0,
                    transition: "border-color 200ms, box-shadow 200ms",
                    "& input::placeholder": { color: "#94a3b8", opacity: 1 },
                    "&.Mui-focused": { borderColor: "#94a3b8", boxShadow: "0 0 0 2px rgba(15,23,42,0.1)" },
                  }}
                />
                <Box
                  component='button'
                  sx={{
                    height: 44,
                    px: { xs: 2, sm: 2.5 },
                    borderRadius: "12px",
                    bgcolor: "#0f172a",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 14,
                    border: 0,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    transition: "background-color 200ms",
                    "&:hover": { bgcolor: "#1e293b" },
                  }}
                >
                  Apply
                </Box>
              </Box>
            </Box>

            {/* Trust strip */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(4, minmax(0, 1fr))" },
                gap: 1,
              }}
            >
              {TRUST.map(({ icon: Icon, text, sub }) => (
                <Box
                  key={text}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: { xs: 1, sm: 1.25 },
                    bgcolor: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    px: { xs: 1.25, sm: 1.5 },
                    py: { xs: 1.25, sm: 1.5 },
                  }}
                >
                  <Icon sx={{ fontSize: 16, color: "#94a3b8", flexShrink: 0 }} />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontSize: { xs: 10, sm: 11 }, fontWeight: 700, color: "#334155", lineHeight: 1 }}>{text}</Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: 9, sm: 10 },
                        color: "#94a3b8",
                        mt: 0.25,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {sub}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          {/* RIGHT — Summary */}
          <Box
            sx={{
              gridColumn: { lg: "span 5", xl: "span 4" },
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                bgcolor: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                position: { lg: "sticky" },
                top: { lg: "88px" },
              }}
            >
              <Box
                sx={{
                  px: { xs: 2, sm: 3 },
                  py: { xs: 1.75, sm: 2 },
                  borderBottom: "1px solid #f1f5f9",
                  bgcolor: "#f8fafc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <ShoppingCartIcon sx={{ fontSize: 16, color: "#64748b" }} />
                  <Typography
                    component='h2'
                    sx={{
                      fontSize: { xs: 12, sm: 14 },
                      fontWeight: 900,
                      color: "#0f172a",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Order Summary
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#94a3b8" }}>
                  {totalCount} item{totalCount !== 1 ? "s" : ""}
                </Typography>
              </Box>

              <Box sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 2.5 } }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75, mb: 2, maxHeight: 144, overflowY: "auto" }}>
                  {cart.map((item) => {
                    const p = Number(item.discountPrice || item.price || 0);
                    return (
                      <Box
                        key={item.id}
                        sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12, gap: 1 }}
                      >
                        <Box
                          component='span'
                          sx={{ color: "#64748b", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                        >
                          {item.title} ×{item.qty}
                        </Box>
                        <Box component='span' sx={{ fontWeight: 700, color: "#334155", flexShrink: 0 }}>
                          ৳{(p * item.qty).toLocaleString()}
                        </Box>
                      </Box>
                    );
                  })}
                </Box>

                <Box sx={{ height: 1, bgcolor: "#f1f5f9", mb: 1.5 }} />

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25, mb: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                    <Box component='span' sx={{ color: "#64748b", fontWeight: 500 }}>
                      Subtotal
                    </Box>
                    <Box component='span' sx={{ fontWeight: 700, color: "#0f172a" }}>
                      ৳{totalPrice.toLocaleString()}
                    </Box>
                  </Box>
                  {savings > 0 && (
                    <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                      <Box component='span' sx={{ color: "#059669", fontWeight: 500, display: "flex", alignItems: "center", gap: 0.5 }}>
                        <PercentIcon sx={{ fontSize: 14 }} /> You save
                      </Box>
                      <Box component='span' sx={{ fontWeight: 700, color: "#059669" }}>
                        -৳{savings.toLocaleString()}
                      </Box>
                    </Box>
                  )}
                  <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: 14, alignItems: "flex-start" }}>
                    <Box component='span' sx={{ color: "#64748b", fontWeight: 500 }}>
                      Delivery
                    </Box>
                    <Box component='span' sx={{ color: "#94a3b8", fontSize: 12, textAlign: "right" }}>
                      Calculated at checkout
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ height: 1, bgcolor: "#f1f5f9", mb: 2 }} />

                <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", mb: 2.5 }}>
                  <Box>
                    <Box
                      component='p'
                      sx={{
                        fontSize: 10,
                        fontWeight: 900,
                        color: "#94a3b8",
                        textTransform: "uppercase",
                        letterSpacing: "0.15em",
                        mb: 0.25,
                      }}
                    >
                      Grand Total
                    </Box>
                    <Typography
                      sx={{ fontSize: { xs: 24, sm: 30 }, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em", lineHeight: 1.1 }}
                    >
                      ৳{totalPrice.toLocaleString()}
                    </Typography>
                    {savings > 0 && (
                      <Typography sx={{ fontSize: 12, color: "#059669", fontWeight: 600, mt: 0.25 }}>
                        Saving ৳{savings.toLocaleString()}
                      </Typography>
                    )}
                  </Box>
                  <Box component='p' sx={{ fontSize: 10, color: "#94a3b8", fontWeight: 500, mb: 0.5 }}>
                    Excl. delivery
                  </Box>
                </Box>

                <Button
                  component={NextLink}
                  href='/checkout'
                  fullWidth
                  endIcon={<ChevronRightIcon sx={{ fontSize: 16 }} />}
                  disableElevation
                  sx={{
                    height: 48,
                    mb: 1.25,
                    borderRadius: "16px",
                    bgcolor: "#0f172a",
                    color: "#fff",
                    fontWeight: 900,
                    fontSize: 14,
                    textTransform: "none",
                    boxShadow: "0 20px 25px -5px rgba(15,23,42,0.2)",
                    transition: "all 200ms",
                    "&:hover": { bgcolor: "#1e293b", transform: "scale(1.02)" },
                    "&:active": { transform: "scale(0.98)" },
                  }}
                >
                  Proceed to Checkout
                </Button>

                <Button
                  component={NextLink}
                  href='/products'
                  fullWidth
                  startIcon={<ArrowBackIcon sx={{ fontSize: 14 }} />}
                  disableElevation
                  sx={{
                    height: { xs: 40, sm: 44 },
                    borderRadius: "16px",
                    bgcolor: "#fff",
                    border: "1px solid #e2e8f0",
                    color: "#475569",
                    fontWeight: 600,
                    fontSize: 14,
                    textTransform: "none",
                    transition: "background-color 200ms",
                    "&:hover": { bgcolor: "#f8fafc", borderColor: "#e2e8f0" },
                  }}
                >
                  Continue Shopping
                </Button>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    mt: 2,
                    pt: 2,
                    borderTop: "1px solid #f1f5f9",
                  }}
                >
                  <ShieldOutlinedIcon sx={{ fontSize: 14, color: "#cbd5e1" }} />
                  <Typography sx={{ fontSize: 10, color: "#94a3b8", fontWeight: 500, textAlign: "center" }}>
                    Secured by{" "}
                    <Box component='span' sx={{ fontWeight: 700, color: "#64748b" }}>
                      BongoNex
                    </Box>
                    {" · SSL Encrypted"}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                bgcolor: "#ecfdf5",
                border: "1px solid #d1fae5",
                borderRadius: "12px",
                px: { xs: 1.5, sm: 2 },
                py: 1.5,
              }}
            >
              <ShieldOutlinedIcon sx={{ fontSize: 16, color: "#10b981", flexShrink: 0 }} />
              <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#047857", lineHeight: 1.35 }}>
                100% genuine products · 30-day return guarantee
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                bgcolor: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                px: { xs: 1.5, sm: 2 },
                py: 1.5,
              }}
            >
              <Box sx={{ display: "flex", gap: 0.25 }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <StarIcon key={s} sx={{ fontSize: 14, color: "#fbbf24" }} />
                ))}
              </Box>
              <Typography sx={{ fontSize: 11, color: "#64748b", fontWeight: 500 }}>
                <Box component='span' sx={{ fontWeight: 900, color: "#334155" }}>
                  4.9/5
                </Box>{" "}
                from 18,400+ customers
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Mobile sticky bottom bar */}
      <Box
        sx={{
          display: { xs: "block", lg: "none" },
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          bgcolor: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid #f1f5f9",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.07)",
          px: 2,
          py: 1.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, maxWidth: 1152, mx: "auto" }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography component='p' sx={{ fontSize: 10, color: "#94a3b8", fontWeight: 500, lineHeight: 1, mb: 0.25 }}>
              Grand Total
            </Typography>
            <Typography sx={{ fontSize: 20, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em", lineHeight: 1 }}>
              ৳{totalPrice.toLocaleString()}
            </Typography>
            {savings > 0 && (
              <Typography sx={{ fontSize: 10, color: "#059669", fontWeight: 600, mt: 0.25 }}>Saving ৳{savings.toLocaleString()}</Typography>
            )}
          </Box>
          <Button
            component={NextLink}
            href='/checkout'
            endIcon={<ChevronRightIcon sx={{ fontSize: 16 }} />}
            disableElevation
            sx={{
              height: 48,
              px: 3,
              borderRadius: "16px",
              bgcolor: "#0f172a",
              color: "#fff",
              fontWeight: 900,
              fontSize: 14,
              textTransform: "none",
              flexShrink: 0,
              boxShadow: "0 10px 15px -3px rgba(15,23,42,0.2)",
              transition: "all 150ms",
              "&:hover": { bgcolor: "#1e293b" },
              "&:active": { transform: "scale(0.97)" },
            }}
          >
            Checkout
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
