import Box from "@mui/material/Box";
import { SectionContainer } from "@/components/common/SectionContainer";
import { Skeleton } from "@/components/ui/skeleton";
import { tokens } from "@/theme/theme";

export function ProductDetailsSkeleton() {
  return (
    <Box sx={{ bgcolor: tokens.bgCanvas, minHeight: "100vh", pb: { xs: 11, md: 6 } }}>
      <SectionContainer sx={{ py: { xs: 2.5, md: 4 } }}>
        {/* Breadcrumb Skeleton */}
        <Box sx={{ display: "flex", gap: 1, mb: 2.5, alignItems: "center" }}>
          <Skeleton variant="rounded" width={44} height={16} />
          <Skeleton variant="rounded" width={10} height={16} />
          <Skeleton variant="rounded" width={130} height={16} />
          <Skeleton variant="rounded" width={10} height={16} />
          <Skeleton variant="rounded" width={180} height={16} />
        </Box>

        {/* Top Main Grid: 1.15fr Left Gallery + 1fr Right Buy Box */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1.15fr 1fr" },
            gap: { xs: 3, lg: 3.5 },
            alignItems: "start",
            mb: 4,
          }}
        >
          {/* Left Gallery Card Skeleton */}
          <Box
            sx={{
              bgcolor: tokens.bgPanel,
              border: "none",
              borderRadius: `${tokens.radiusXl}px`,
              p: { xs: 2, sm: 3 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                flexDirection: { xs: "column-reverse", sm: "row" },
              }}
            >
              {/* Vertical Thumbnails */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "row", sm: "column" },
                  gap: 1.25,
                }}
              >
                {[1, 2, 3].map((i) => (
                  <Skeleton
                    key={i}
                    variant="rounded"
                    sx={{
                      width: { xs: 60, sm: 64 },
                      height: { xs: 60, sm: 64 },
                      borderRadius: "10px",
                      flexShrink: 0,
                    }}
                  />
                ))}
              </Box>

              {/* Main Square Image */}
              <Skeleton
                variant="rounded"
                sx={{
                  flex: 1,
                  width: "100%",
                  aspectRatio: "1 / 1",
                  borderRadius: "14px",
                  height: "auto",
                }}
              />
            </Box>
          </Box>

          {/* Right Product Info & Buy Box Skeleton */}
          <Box
            sx={{
              bgcolor: tokens.bgPanel,
              border: "none",
              borderRadius: `${tokens.radiusXl}px`,
              p: { xs: 2.5, sm: 3.5 },
              display: "flex",
              flexDirection: "column",
              gap: 2.25,
            }}
          >
            {/* Category & Stock Pill */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Skeleton variant="rounded" width={170} height={16} />
              <Skeleton variant="rounded" width={72} height={24} sx={{ borderRadius: "9999px" }} />
            </Box>

            {/* Title */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
              <Skeleton variant="rounded" width="82%" height={30} />
              <Skeleton variant="rounded" width="48%" height={30} />
            </Box>

            {/* Rating & Sold count */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Skeleton variant="rounded" width={110} height={18} />
              <Skeleton variant="rounded" width={140} height={18} />
            </Box>

            {/* Price Box */}
            <Box sx={{ bgcolor: tokens.bgCanvas, borderRadius: "12px", p: 2 }}>
              <Skeleton variant="rounded" width={140} height={36} />
            </Box>

            {/* Tag Pills */}
            <Box sx={{ display: "flex", gap: 1 }}>
              <Skeleton variant="rounded" width={110} height={24} sx={{ borderRadius: "9999px" }} />
              <Skeleton variant="rounded" width={125} height={24} sx={{ borderRadius: "9999px" }} />
            </Box>

            {/* Quantity + Add to Cart Row */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, pt: 0.5 }}>
              <Skeleton variant="rounded" width={114} height={42} sx={{ borderRadius: "9999px", flexShrink: 0 }} />
              <Skeleton variant="rounded" height={44} sx={{ flex: 1, borderRadius: "9999px" }} />
            </Box>

            {/* Order Now & WhatsApp Pill Buttons */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
              <Skeleton variant="rounded" width="100%" height={46} sx={{ borderRadius: "9999px" }} />
              <Skeleton variant="rounded" width="100%" height={46} sx={{ borderRadius: "9999px" }} />
            </Box>
          </Box>
        </Box>

        {/* Bottom Tabbed Content Skeleton */}
        <Box
          sx={{
            bgcolor: tokens.bgPanel,
            border: "none",
            borderRadius: `${tokens.radiusXl}px`,
            overflow: "hidden",
            mb: 6,
          }}
        >
          <Box sx={{ display: "flex", gap: 3, px: 3, py: 2, borderBottom: "1px solid", borderColor: tokens.borderDefault }}>
            <Skeleton variant="rounded" width={120} height={24} />
            <Skeleton variant="rounded" width={120} height={24} />
            <Skeleton variant="rounded" width={100} height={24} />
          </Box>
          <Box sx={{ p: { xs: 2.5, sm: 3.5 }, display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Skeleton variant="rounded" width="40%" height={24} />
            <Skeleton variant="rounded" width="100%" height={18} />
            <Skeleton variant="rounded" width="94%" height={18} />
            <Skeleton variant="rounded" width="78%" height={18} />
          </Box>
        </Box>
      </SectionContainer>
    </Box>
  );
}

export default ProductDetailsSkeleton;
