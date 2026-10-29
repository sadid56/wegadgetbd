import NextImage from "next/image";
import Box from "@mui/material/Box";
import { getAssetUrl } from "@/lib/storage";

interface ProductGalleryProps {
  images: string[];
  activeImg: number;
  setActiveImg: (index: number) => void;
  discountPercent: number;
  productTitle: string;
}

export default function ProductGallery({ images, activeImg, setActiveImg, discountPercent, productTitle }: ProductGalleryProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, gap: 2 }}>
      {images?.length > 1 && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(5, 1fr)", lg: "1fr" },
            gap: 1.5,
            width: { lg: 70 },
            order: { xs: 2, lg: 1 },
            flexShrink: 0,
          }}
        >
          {images.slice(0, 5).map((img, idx) => (
            <Box
              key={idx}
              component='button'
              type='button'
              onClick={() => setActiveImg(idx)}
              sx={{
                position: "relative",
                aspectRatio: "1 / 1",
                borderRadius: "6px",
                overflow: "hidden",
                p: 0,
                bgcolor: "transparent",
                cursor: "pointer",
                outline: "2px solid",
                outlineOffset: -1,
                outlineColor: activeImg === idx ? "#ff7319" : "#e5e7eb",
                transition: "all 200ms",
                "&:hover": {
                  transform: "scale(1.05)",
                  outlineColor: activeImg === idx ? "#ff7319" : "#d1d5db",
                },
              }}
            >
              <NextImage src={getAssetUrl(img)} alt='' fill sizes='60px' style={{ objectFit: "cover" }} />
            </Box>
          ))}
        </Box>
      )}

      <Box
        sx={{
          position: "relative",
          flex: 1,
          aspectRatio: { xs: "3 / 3", md: "2 / 1" },
          bgcolor: "#f9fafb",
          borderRadius: "16px",
          overflow: "hidden",
          order: { xs: 1, lg: 2 },
          "&:hover .product-main-img": { transform: "scale(1.05)" },
        }}
      >
        {images?.[activeImg] ? (
          <NextImage
            className='product-main-img'
            src={getAssetUrl(images[activeImg])}
            alt={productTitle}
            fill
            style={{ objectFit: "cover", transition: "transform 500ms" }}
            priority
          />
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "#9ca3af",
            }}
          >
            No Image
          </Box>
        )}

        {discountPercent > 0 && (
          <Box
            sx={{
              position: "absolute",
              top: 24,
              left: 8,
              bgcolor: "#ff1919",
              color: "#fff",
              fontSize: 12,
              fontWeight: 700,
              px: 2,
              py: 0.75,
              borderRadius: 999,
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)",
            }}
          >
            -{discountPercent}%
          </Box>
        )}
      </Box>
    </Box>
  );
}
