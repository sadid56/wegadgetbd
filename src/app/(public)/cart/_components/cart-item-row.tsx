"use client";

import NextLink from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { IconButton } from "@/components/ui/icon-button";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import { getAssetUrl } from "@/lib/storage";
import { tokens } from "@/theme/theme";

type CartItemRowProps = {
  item: any;
  isLast: boolean;
  onUpdateQty: (id: any, qty: number) => void;
  onRemove: (item: any) => void;
};

export default function CartItemRow({ item, isLast, onUpdateQty, onRemove }: CartItemRowProps) {
  const itemTitle = item.title || (item as any).name || "Product";
  const rawImg = item.images?.[0] || (item as any).image;
  const imgSrc = rawImg ? getAssetUrl(rawImg) : null;
  const unitPrice = Number(item.discountPrice || item.price || 0);
  const origPrice = Number(item.price || 0);
  const hasDiscount = origPrice > unitPrice;
  const lineTotal = unitPrice * item.qty;
  const href = item.slug ? `/products/${item.slug}` : "#";

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderBottom: isLast ? "none" : `1px solid ${tokens.borderSubtle}`,
      }}
    >
      {/* Desktop View */}
      <Box
        sx={{
          display: { xs: "none", sm: "grid" },
          gridTemplateColumns: "1fr 110px 130px 110px 44px",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 0 }}>
          <Box
            component={NextLink}
            href={href}
            sx={{
              width: 64,
              height: 64,
              borderRadius: "8px",
              bgcolor: tokens.bgCanvas,
              border: `1px solid ${tokens.borderDefault}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            {imgSrc ? (
              <Box
                component="img"
                src={imgSrc}
                alt={itemTitle}
                sx={{ width: "100%", height: "100%", objectFit: "contain", p: 0.5 }}
              />
            ) : (
              <Inventory2OutlinedIcon sx={{ fontSize: 24, color: tokens.textDisabled }} />
            )}
          </Box>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              component={NextLink}
              href={href}
              sx={{
                fontSize: 14,
                fontWeight: 600,
                color: tokens.textPrimary,
                lineHeight: 1.4,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textDecoration: "none",
                transition: "color 150ms ease",
                "&:hover": { color: tokens.primary },
              }}
            >
              {itemTitle}
            </Typography>
            {hasDiscount && (
              <Typography sx={{ fontSize: 11, color: tokens.primary, fontWeight: 600, mt: 0.5 }}>
                Special Offer Applied
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ textAlign: "right" }}>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: tokens.textPrimary }}>
            ৳{unitPrice.toLocaleString()}
          </Typography>
          {hasDiscount && (
            <Typography sx={{ fontSize: 11, color: tokens.textDisabled, textDecoration: "line-through" }}>
              ৳{origPrice.toLocaleString()}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              border: `1px solid ${tokens.borderDefault}`,
              borderRadius: "6px",
              bgcolor: tokens.bgPanel,
            }}
          >
            <IconButton
              size="small"
              disabled={item.qty <= 1}
              onClick={() => onUpdateQty(item.id, item.qty - 1)}
              sx={{
                p: 0.5,
                width: 28,
                height: 28,
                borderRadius: 0,
                color: tokens.textSecondary,
                "&:hover": { bgcolor: tokens.bgCanvas },
                "&:disabled": { color: tokens.borderElevated },
              }}
            >
              <RemoveIcon sx={{ fontSize: 13 }} />
            </IconButton>
            <Typography
              sx={{
                width: 36,
                textAlign: "center",
                fontSize: 13,
                fontWeight: 700,
                color: tokens.textPrimary,
                userSelect: "none",
              }}
            >
              {item.qty}
            </Typography>
            <IconButton
              size="small"
              onClick={() => onUpdateQty(item.id, item.qty + 1)}
              sx={{
                p: 0.5,
                width: 28,
                height: 28,
                borderRadius: 0,
                color: tokens.textSecondary,
                "&:hover": { bgcolor: tokens.bgCanvas },
              }}
            >
              <AddIcon sx={{ fontSize: 13 }} />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ textAlign: "right" }}>
          <Typography sx={{ fontSize: 14, fontWeight: 800, color: tokens.textPrimary }}>
            ৳{lineTotal.toLocaleString()}
          </Typography>
        </Box>

        <Box sx={{ textAlign: "right" }}>
          <IconButton
            size="small"
            onClick={() => onRemove(item)}
            sx={{
              color: tokens.textDisabled,
              transition: "color 150ms ease",
              "&:hover": { color: tokens.danger },
            }}
            aria-label="Remove item"
          >
            <DeleteOutlinedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Box>

      {/* Mobile View */}
      <Box sx={{ display: { xs: "flex", sm: "none" }, gap: 1.5 }}>
        <Box
          component={NextLink}
          href={href}
          sx={{
            width: 72,
            height: 72,
            borderRadius: "8px",
            bgcolor: tokens.bgCanvas,
            border: `1px solid ${tokens.borderDefault}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          {imgSrc ? (
            <Box
              component="img"
              src={imgSrc}
              alt={itemTitle}
              sx={{ width: "100%", height: "100%", objectFit: "contain", p: 0.5 }}
            />
          ) : (
            <Inventory2OutlinedIcon sx={{ fontSize: 24, color: tokens.textDisabled }} />
          )}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1 }}>
            <Typography
              component={NextLink}
              href={href}
              sx={{
                fontSize: 13,
                fontWeight: 600,
                color: tokens.textPrimary,
                lineHeight: 1.35,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textDecoration: "none",
              }}
            >
              {itemTitle}
            </Typography>
            <IconButton
              size="small"
              onClick={() => onRemove(item)}
              sx={{ color: tokens.textDisabled, p: 0.25, "&:hover": { color: tokens.danger } }}
              aria-label="Remove item"
            >
              <DeleteOutlinedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 1 }}>
            <Box>
              <Typography sx={{ fontSize: 14, fontWeight: 800, color: tokens.textPrimary }}>
                ৳{lineTotal.toLocaleString()}
              </Typography>
              {item.qty > 1 && (
                <Typography sx={{ fontSize: 11, color: tokens.textDisabled }}>
                  ৳{unitPrice.toLocaleString()} each
                </Typography>
              )}
            </Box>

            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                border: `1px solid ${tokens.borderDefault}`,
                borderRadius: "6px",
              }}
            >
              <IconButton
                size="small"
                disabled={item.qty <= 1}
                onClick={() => onUpdateQty(item.id, item.qty - 1)}
                sx={{ width: 26, height: 26, p: 0 }}
              >
                <RemoveIcon sx={{ fontSize: 12 }} />
              </IconButton>
              <Typography sx={{ width: 28, textAlign: "center", fontSize: 12, fontWeight: 700 }}>
                {item.qty}
              </Typography>
              <IconButton
                size="small"
                onClick={() => onUpdateQty(item.id, item.qty + 1)}
                sx={{ width: 26, height: 26, p: 0 }}
              >
                <AddIcon sx={{ fontSize: 12 }} />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
