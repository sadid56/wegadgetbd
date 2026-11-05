"use client";

import { Link } from "@/i18n/routing";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Skeleton } from "@/components/ui/skeleton";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { tokens } from "@/theme/theme";
import { SectionContainer } from "@/components/common/SectionContainer";
import { useLatestArrivals } from "@/query-client/products";
import { ProductCard, type ProductCardItem } from "./ProductCard";
import { useTranslations } from "next-intl";

function ProductCardSkeleton() {
  return (
    <Box
      sx={{
        bgcolor: tokens.bgPanel,
        borderRadius: "20px",
        border: `1px solid ${tokens.borderDefault}`,
        boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
        p: 1.5,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
      }}
    >
      <Skeleton
        variant="rectangular"
        animation="wave"
        sx={{
          width: "100%",
          height: { xs: 155, sm: 185, md: 200 },
          borderRadius: "14px",
          bgcolor: tokens.bgCanvas,
        }}
      />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", px: 0.5, pt: 1.75, pb: 0.25 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.8 }}>
          <Skeleton animation="wave" width="35%" height={14} />
          <Skeleton animation="wave" width="25%" height={14} />
        </Box>
        <Skeleton animation="wave" width="90%" height={22} sx={{ mb: 1.5 }} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: "auto",
            pt: 1.25,
            borderTop: `1px solid ${tokens.borderSubtle}`,
          }}
        >
          <Skeleton animation="wave" width="40%" height={24} />
          <Skeleton animation="wave" variant="rounded" width={34} height={34} sx={{ borderRadius: "10px" }} />
        </Box>
      </Box>
    </Box>
  );
}

export function LatestArrivalsSection({ products: passedProducts }: { products?: ProductCardItem[] }) {
  const t = useTranslations("home");
  const { data: serverProducts, isLoading } = useLatestArrivals(4);

  const displayList = passedProducts && passedProducts.length > 0 ? passedProducts : serverProducts ?? [];

  return (
    <SectionContainer
      sx={{
        py: { xs: 3, md: 5 },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          mb: { xs: 2.5, md: 3.5 },
        }}
      >
        <Box>
          <Typography
            component="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1.5rem", sm: "1.85rem", md: "2.1rem" },
              color: tokens.textPrimary,
              letterSpacing: "-0.02em",
            }}
          >
            {t("latestArrivalsTitle")}
          </Typography>
          <Typography sx={{ fontSize: 13.5, color: tokens.textMuted, mt: 0.5 }}>
            {t("latestArrivalsSubtitle")}
          </Typography>
        </Box>

        <Box
          component={Link}
          href="/products?sort=newest"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.75,
            fontSize: 13.5,
            fontWeight: 700,
            color: tokens.textPrimary,
            textDecoration: "none",
            transition: "color 0.2s ease, transform 0.2s ease",
            "&:hover": {
              color: tokens.primary,
              transform: "translateX(3px)",
            },
          }}
        >
          {t("latestArrivalsViewAll")} <ArrowForwardIcon sx={{ fontSize: 16 }} />
        </Box>
      </Box>

      {/* 4 Cards Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: { xs: 1.5, sm: 2, md: 2.5 },
        }}
      >
        {isLoading && (!displayList || displayList.length === 0) ? (
          Array.from({ length: 4 }).map((_, idx) => <ProductCardSkeleton key={`latest-skeleton-${idx}`} />)
        ) : displayList.length > 0 ? (
          displayList.map((item) => <ProductCard key={item.id} product={item} />)
        ) : (
          <Box
            sx={{
              gridColumn: "1 / -1",
              py: 6,
              textAlign: "center",
              bgcolor: tokens.bgPanel,
              borderRadius: "16px",
              border: `1px dashed ${tokens.borderDefault}`,
            }}
          >
            <Typography sx={{ color: tokens.textMuted, fontSize: 14 }}>
              {t("latestArrivalsEmpty")}
            </Typography>
          </Box>
        )}
      </Box>
    </SectionContainer>
  );
}

export default LatestArrivalsSection;
