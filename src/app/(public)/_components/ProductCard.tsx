"use client";

import NextImage from "next/image";
import NextLink from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ButtonBase from "@mui/material/ButtonBase";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import BoltIcon from "@mui/icons-material/Bolt";
import { useCart } from "@/hooks/useCart";
import { calculateDiscount } from "@/lib/utils";

const BN = {
  fontFamily: "'Hind Siliguri','Noto Sans Bengali',sans-serif",
};

export function ProductCard({ product }: any) {
  const { addItem, cart } = useCart();

  const isInCart = cart.some((item: any) => item.id === product.id);

  const discount =
    product.discountPrice && product.price ? calculateDiscount(product.price.toString(), product.discountPrice.toString()) : null;

  const finalPrice = product.discountPrice ?? product.price ?? 0;

  const imgSrc = product.images?.[0] || "https://placehold.co/400x400/f3f4f6/9ca3af?text=No+Image";

  return (
    <Box
      sx={{
        ...BN,
        position: "relative",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#fff",
        borderRadius: "8px",
        border: "1px solid",
        borderColor: "grey.100",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        overflow: "hidden",
        transition: "all 300ms ease-out",
        "&:hover": {
          boxShadow: "0 20px 25px -5px rgba(229,231,235,0.8)",
          transform: "translateY(-4px)",
          "& .product-image": { transform: "scale(1.06)" },
          "& .product-overlay": { opacity: 1 },
          "& .product-view-btn": { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          aspectRatio: "4 / 3",
          bgcolor: "grey.50",
        }}
      >
        <NextImage
          src={imgSrc}
          alt={product.title || "Product"}
          fill
          sizes='(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'
          className='product-image'
          style={{
            objectFit: "cover",
            transition: "transform 500ms ease-out",
          }}
        />

        <Box
          className='product-overlay'
          sx={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.3), transparent)",
            opacity: 0,
            transition: "opacity 300ms",
            pointerEvents: "none",
          }}
        />

        <Box
          component={NextLink}
          href={`/products/${product.slug}`}
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
          }}
        >
          <Box
            className='product-view-btn'
            sx={{
              bgcolor: "#fff",
              color: "grey.800",
              borderRadius: 999,
              px: 2,
              py: 1,
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              fontSize: 12,
              fontWeight: 600,
              boxShadow: 3,
              opacity: 0,
              transform: "translateY(8px)",
              transition: "all 300ms",
            }}
          >
            <VisibilityOutlinedIcon sx={{ fontSize: 13 }} />
            বিস্তারিত দেখুন
          </Box>
        </Box>

        <Box
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            display: "flex",
            flexDirection: "column",
            gap: 0.75,
          }}
        >
          {discount && (
            <Box
              component='span'
              sx={{
                bgcolor: "error.main",
                color: "#fff",
                fontSize: { xs: 9, md: 10 },
                fontWeight: 900,
                px: 1,
                py: 0.25,
                borderRadius: "6px",
                boxShadow: 1,
                lineHeight: 1.2,
              }}
            >
              -{discount}%
            </Box>
          )}
        </Box>

        {!product.inStock && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(2px)",
            }}
          >
            <Box
              component='span'
              sx={{
                bgcolor: "grey.800",
                color: "#fff",
                fontSize: { xs: 10, md: 12 },
                fontWeight: 700,
                px: 1.5,
                py: 0.5,
                borderRadius: 999,
                boxShadow: 2,
              }}
            >
              স্টক শেষ
            </Box>
          </Box>
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          p: { xs: 1.5, md: 2 },
          gap: 1.25,
        }}
      >
        <Box component={NextLink} href={`/products/${product.slug}`} sx={{ textDecoration: "none" }}>
          <Typography
            component='h3'
            sx={{
              fontSize: { xs: "12.5px", md: 14 },
              fontWeight: 600,
              color: "grey.800",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              transition: "color 200ms",
              lineHeight: 1.35,
              "&:hover": { color: "success.main" },
            }}
          >
            {product.title}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            gap: 1,
            mt: "auto",
            pt: 0.5,
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {product.discountPrice && (
              <Typography
                component='span'
                sx={{
                  fontSize: { xs: 9, md: 10 },
                  color: "grey.400",
                  textDecoration: "line-through",
                  lineHeight: 1,
                  mb: 0.25,
                }}
              >
                ৳{Number(product.price).toLocaleString()}
              </Typography>
            )}
            <Typography
              component='span'
              sx={{
                fontSize: { xs: 15, md: 17 },
                fontWeight: 900,
                color: "grey.700",
                lineHeight: 1,
              }}
            >
              ৳{Number(finalPrice).toLocaleString()}
            </Typography>
          </Box>

          {discount && (
            <Box
              component='span'
              sx={{
                ml: "auto",
                mb: 0.25,
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                fontSize: 10,
                fontWeight: 700,
                color: "success.main",
                bgcolor: "success.50",
                border: "1px solid",
                borderColor: "success.100",
                px: 0.75,
                py: 0.25,
                borderRadius: "6px",
              }}
            >
              ৳{(Number(product.price) - Number(finalPrice)).toLocaleString()} টাকা-সাশ্রয়
            </Box>
          )}
        </Box>

        <Box sx={{ borderTop: "1px solid", borderColor: "grey.100" }} />

        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          {isInCart ? (
            <ButtonBase
              component={NextLink}
              href='/cart'
              sx={{
                flex: 1,
                height: { xs: 32, md: 36 },
                borderRadius: "6px",
                fontSize: { xs: 11, md: 12 },
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.75,
                bgcolor: "warning.50",
                border: "1px solid",
                borderColor: "warning.200",
                color: "warning.main",
                transition: "all 200ms",
                "&:hover": {
                  bgcolor: "success.main",
                  color: "#fff",
                  borderColor: "success.main",
                },
                "&:active": { transform: "scale(0.95)" },
              }}
            >
              <ShoppingCartIcon sx={{ display: { xs: "none", md: "block" }, fontSize: 11 }} />
              Carded
            </ButtonBase>
          ) : (
            <ButtonBase
              disabled={!product.inStock}
              onClick={() => addItem(product)}
              sx={{
                flex: 1,
                height: { xs: 28, md: 36 },
                borderRadius: "6px",
                fontSize: 12,
                fontWeight: 600,
                gap: { xs: "2px", md: 0.75 },
                bgcolor: product.inStock ? "grey.900" : "grey.100",
                color: product.inStock ? "#fff" : "grey.300",
                boxShadow: product.inStock ? 1 : 0,
                cursor: product.inStock ? "pointer" : "not-allowed",
                transition: "all 200ms",
                "&:hover": {
                  bgcolor: product.inStock ? "grey.700" : "grey.100",
                },
                "&:active": {
                  transform: product.inStock ? "scale(0.95)" : "none",
                },
              }}
            >
              <ShoppingCartIcon sx={{ fontSize: 10 }} />
              Card
            </ButtonBase>
          )}

          <ButtonBase
            component={NextLink}
            href={`/products/${product.slug}`}
            sx={{
              flex: 1,
              height: { xs: 28, md: 36 },
              borderRadius: "6px",
              border: "1px solid",
              fontSize: 12,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: { xs: "2px", md: 0.75 },
              textDecoration: "none",
              pointerEvents: product.inStock ? "auto" : "none",
              borderColor: product.inStock ? "success.main" : "grey.100",
              color: product.inStock ? "success.main" : "grey.300",
              bgcolor: "transparent",
              transition: "all 200ms",
              "&:hover": product.inStock ? { bgcolor: "success.main", color: "#fff" } : {},
              "&:active": {
                transform: product.inStock ? "scale(0.95)" : "none",
              },
            }}
          >
            <BoltIcon sx={{ fontSize: 11 }} />
            Buy
          </ButtonBase>
        </Box>
      </Box>
    </Box>
  );
}
