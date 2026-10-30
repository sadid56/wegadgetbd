"use client";

import { useState } from "react";
import NextImage from "next/image";
import Box from "@mui/material/Box";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ReplayIcon from "@mui/icons-material/Replay";
import { IconButton } from "@/components/ui/icon-button";
import { tokens } from "@/theme/theme";
import { calculateDiscount } from "@/lib/utils";
import { getAssetUrl } from "@/lib/storage";

interface ImageGalleryProps {
  images: string[];
  title: string;
  discountPrice?: string | number;
  price: string | number;
}

const zoomBtnSx = {
  width: 36,
  height: 36,
  borderRadius: "50%",
  bgcolor: "rgba(255,255,255,0.8)",
  backdropFilter: "blur(8px)",
  border: "1px solid",
  borderColor: tokens.borderDefault,
  boxShadow: tokens.shadowSm,
  color: tokens.textPrimary,
  transition: "all 200ms",
  "&:hover": {
    bgcolor: tokens.primary,
    color: tokens.textWhite,
  },
} as const;

export function ImageGallery({ images, title, discountPrice, price }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const discount = discountPrice ? calculateDiscount(price.toString(), discountPrice.toString()) : 0;

  return (
    <Box sx={{ position: { lg: "sticky" }, top: { lg: 128 }, pb: { xs: 2.5, lg: 5 } }}>
      <TransformWrapper
        initialScale={1}
        minScale={1}
        maxScale={4}
        centerOnInit
        limitToBounds
        wheel={{ step: 0.12 }}
        pinch={{ step: 8 }}
        doubleClick={{ mode: "zoomIn", step: 0.7 }}
        panning={{ velocityDisabled: true }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <Box
            sx={{
              aspectRatio: "1 / 1",
              bgcolor: tokens.bgSubtle,
              backdropFilter: "blur(20px)",
              border: "1px solid",
              borderColor: tokens.borderDefault,
              borderRadius: { xs: "32px", md: "40px" },
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              boxShadow: tokens.shadowMd,
              cursor: "zoom-in",
            }}
          >
            {/* Zoom controls */}
            <Box
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                zIndex: 30,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <IconButton onClick={() => zoomIn()} aria-label='Zoom in' sx={zoomBtnSx}>
                <AddIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton onClick={() => zoomOut()} aria-label='Zoom out' sx={zoomBtnSx}>
                <RemoveIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton onClick={() => resetTransform()} aria-label='Reset zoom' sx={zoomBtnSx}>
                <ReplayIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </Box>

            {images.length > 0 ? (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  cursor: "zoom-in",
                  transition: "transform 150ms",
                  "&:hover": { transform: "scale(1.02)" },
                  "&:active": { transform: "scale(0.98)" },
                }}
              >
                <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ width: "100%", height: "100%" }}>
                  <NextImage
                    src={getAssetUrl(selectedImage || images[0])}
                    alt={title}
                    width={800}
                    height={800}
                    draggable={false}
                    priority
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      filter: "drop-shadow(0 10px 25px rgba(0,0,0,0.15))",
                      transition: "transform 700ms",
                    }}
                  />
                </TransformComponent>
              </Box>
            ) : (
              <Box
                sx={{
                  color: tokens.textSecondary,
                  fontWeight: 300,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  fontSize: 14,
                }}
              >
                Visual Pending
              </Box>
            )}

            {/* Discount badge */}
            {discountPrice && (
              <Box
                sx={{
                  position: "absolute",
                  top: { xs: 24, md: 32 },
                  left: { xs: 24, md: 32 },
                  zIndex: 20,
                  bgcolor: tokens.primary,
                  color: tokens.textWhite,
                  fontSize: { xs: 12, md: 14 },
                  fontWeight: 900,
                  px: { xs: 1.5, md: 2 },
                  py: { xs: 0.5, md: 0.75 },
                  borderRadius: 999,
                  boxShadow: tokens.shadowSm,
                }}
              >
                -{discount}% ছাড়
              </Box>
            )}

            {/* Decorative corner */}
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                p: { xs: 3, md: 4 },
                opacity: 0.1,
                pointerEvents: "none",
                transition: "opacity 300ms",
                "&:hover": { opacity: 0.3 },
              }}
            >
              <Box
                sx={{
                  width: { xs: 40, md: 48 },
                  height: { xs: 40, md: 48 },
                  borderRight: "2px solid",
                  borderBottom: "2px solid",
                  borderColor: tokens.textPrimary,
                  borderBottomRightRadius: "16px",
                }}
              />
            </Box>
          </Box>
        )}
      </TransformWrapper>

      {/* Thumbnails */}
      {images.length > 1 && (
        <Box
          sx={{
            mt: 3,
            display: "flex",
            gap: 1.5,
            overflowX: "auto",
            pb: 1,
            px: 0.5,
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {images.map((img, i) => {
            const isActive = selectedImage === img || (!selectedImage && i === 0);
            return (
              <Box
                key={i}
                component='button'
                type='button'
                onClick={() => setSelectedImage(img)}
                sx={{
                  position: "relative",
                  width: { xs: 64, md: 80 },
                  height: { xs: 64, md: 80 },
                  flexShrink: 0,
                  borderRadius: "16px",
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: isActive ? tokens.primary : tokens.borderDefault,
                  outline: isActive ? "2px solid" : "none",
                  outlineColor: tokens.primary,
                  outlineOffset: 2,
                  opacity: isActive ? 1 : 0.5,
                  transform: isActive ? "scale(1.05)" : "scale(1)",
                  cursor: "pointer",
                  p: 0,
                  bgcolor: "transparent",
                  transition: "all 300ms",
                  "&:hover": { opacity: 1, transform: "scale(1.05)" },
                }}
              >
                <NextImage src={getAssetUrl(img)} alt={`View ${i + 1}`} fill sizes='80px' style={{ objectFit: "cover" }} />
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
