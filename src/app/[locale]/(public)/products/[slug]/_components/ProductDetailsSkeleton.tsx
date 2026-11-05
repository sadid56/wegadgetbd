import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Skeleton } from "@/components/ui/skeleton";
import { tokens } from "@/theme/theme";

export function ProductDetailsSkeleton() {
  return (
    <Box sx={{ bgcolor: tokens.bgCanvas, minHeight: "100vh", py: { xs: 2.5, md: 5 } }}>
      <Container maxWidth="lg">
        {/* Breadcrumb Skeleton */}
        <Box sx={{ display: "flex", gap: 1, mb: 3, alignItems: "center" }}>
          <Skeleton variant="rounded" width={48} height={18} />
          <Skeleton variant="rounded" width={12} height={18} />
          <Skeleton variant="rounded" width={72} height={18} />
          <Skeleton variant="rounded" width={12} height={18} />
          <Skeleton variant="rounded" width={160} height={18} />
        </Box>

        {/* 2-Column Hero Skeleton */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
            gap: { xs: 3, lg: 5 },
            mb: { xs: 5, md: 7 },
            alignItems: "start",
          }}
        >
          {/* Left Gallery Box Skeleton */}
          <Box
            sx={{
              bgcolor: tokens.bgPanel,
              border: "1px solid",
              borderColor: tokens.borderDefault,
              borderRadius: "20px",
              p: { xs: 2, sm: 3 },
            }}
          >
            <Skeleton
              variant="rounded"
              sx={{ width: "100%", aspectRatio: "1 / 1", borderRadius: "14px", height: "auto" }}
            />
            <Box sx={{ display: "flex", gap: 1.5, mt: 2.5 }}>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton
                  key={i}
                  variant="rounded"
                  width={68}
                  height={68}
                  sx={{ borderRadius: "10px", flexShrink: 0 }}
                />
              ))}
            </Box>
          </Box>

          {/* Right Product Hub Skeleton */}
          <Box
            sx={{
              bgcolor: tokens.bgPanel,
              border: "1px solid",
              borderColor: tokens.borderDefault,
              borderRadius: "20px",
              p: { xs: 2.5, sm: 3.5 },
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
            }}
          >
            {/* Badges row */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Skeleton variant="rounded" width={90} height={26} sx={{ borderRadius: "9999px" }} />
              <Skeleton variant="rounded" width={75} height={26} sx={{ borderRadius: "9999px" }} />
            </Box>

            {/* Title */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Skeleton variant="rounded" width="85%" height={32} />
              <Skeleton variant="rounded" width="60%" height={32} />
            </Box>

            {/* Ratings row */}
            <Skeleton variant="rounded" width={180} height={22} />

            {/* Price Hub */}
            <Box sx={{ bgcolor: tokens.bgCanvas, border: "1px solid", borderColor: tokens.borderSubtle, borderRadius: "14px", p: 2 }}>
              <Skeleton variant="rounded" width={140} height={36} />
            </Box>

            {/* Quantity */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Skeleton variant="rounded" width={120} height={20} />
              <Skeleton variant="rounded" width={120} height={38} sx={{ borderRadius: "10px" }} />
            </Box>

            {/* CTAs */}
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5, pt: 1 }}>
              <Skeleton variant="rounded" height={48} sx={{ borderRadius: "12px" }} />
              <Skeleton variant="rounded" height={48} sx={{ borderRadius: "12px" }} />
            </Box>

            {/* Trust Grid */}
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, pt: 1.5, borderTop: "1px solid", borderColor: tokens.borderSubtle }}>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} variant="rounded" height={52} sx={{ borderRadius: "10px" }} />
              ))}
            </Box>
          </Box>
        </Box>

        {/* Tabbed Content Skeleton */}
        <Box
          sx={{
            bgcolor: tokens.bgPanel,
            border: "1px solid",
            borderColor: tokens.borderDefault,
            borderRadius: "20px",
            overflow: "hidden",
            mb: 6,
          }}
        >
          <Box sx={{ display: "flex", gap: 2, p: 2, borderBottom: "1px solid", borderColor: tokens.borderDefault, bgcolor: tokens.bgCanvas }}>
            <Skeleton variant="rounded" width={180} height={32} sx={{ borderRadius: "6px" }} />
            <Skeleton variant="rounded" width={140} height={32} sx={{ borderRadius: "6px" }} />
          </Box>
          <Box sx={{ p: 4, display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Skeleton variant="rounded" width="100%" height={20} />
            <Skeleton variant="rounded" width="92%" height={20} />
            <Skeleton variant="rounded" width="75%" height={20} />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default ProductDetailsSkeleton;

