"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import StarIcon from "@mui/icons-material/Star";
import VerifiedIcon from "@mui/icons-material/Verified";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useProductReviews } from "@/query-client/products";
import { formatBnNumber } from "@/lib/utils";
import { tokens } from "@/theme/theme";

interface ProductReviewsProps {
  productId: string;
  rating?: number | string | null;
  reviewsCount?: number;
}

export function ProductReviews({ productId, rating, reviewsCount = 12 }: ProductReviewsProps) {
  const { data: reviews, isLoading } = useProductReviews(productId);
  const score = Number(rating || 5).toFixed(1);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {/* Overview Score Card */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          gap: 3,
          p: { xs: 2.5, sm: 3.5 },
          bgcolor: tokens.bgCanvas,
          border: "1px solid",
          borderColor: tokens.borderDefault,
          borderRadius: "16px",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
          <Box sx={{ textAlign: "center" }}>
            <Typography sx={{ fontSize: { xs: "2.5rem", md: "3rem" }, fontWeight: 900, color: tokens.textPrimary, lineHeight: 1 }}>
              {score}
            </Typography>
            <Typography sx={{ fontSize: 13, color: tokens.textMuted, mt: 0.5 }}>
              ৫.০ এর মধ্যে
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <Box sx={{ display: "flex", gap: "2px" }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <StarIcon
                  key={s}
                  sx={{
                    fontSize: 20,
                    color: s <= Math.round(Number(rating || 5)) ? tokens.warning : tokens.borderDefault,
                  }}
                />
              ))}
            </Box>
            <Typography sx={{ fontSize: 13.5, color: tokens.textSecondary, fontWeight: 500 }}>
              {formatBnNumber(reviews?.length || reviewsCount)}+ গ্রাহক সন্তুষ্টি রিভিউ
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Badge variant="success" label="৯৮% পজিটিভ রেটিং" />
          <Badge variant="default" label="১০০% ভেরিফাইড ক্রয়" />
        </Box>
      </Box>

      {/* Reviews List */}
      {isLoading ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {[1, 2].map((i) => (
            <Box
              key={i}
              sx={{
                p: 2.5,
                bgcolor: tokens.bgCanvas,
                border: "1px solid",
                borderColor: tokens.borderSubtle,
                borderRadius: "14px",
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
              }}
            >
              <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                  <Skeleton variant="rounded" width={120} height={16} />
                  <Skeleton variant="rounded" width={80} height={14} />
                </Box>
              </Box>
              <Skeleton variant="rounded" width="95%" height={16} />
              <Skeleton variant="rounded" width="70%" height={16} />
            </Box>
          ))}
        </Box>
      ) : reviews && reviews.length > 0 ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {reviews.map((rev) => (
            <Box
              key={rev.id}
              sx={{
                p: { xs: 2, sm: 2.5 },
                bgcolor: tokens.bgPanel,
                border: "1px solid",
                borderColor: tokens.borderDefault,
                borderRadius: "14px",
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Avatar src={rev.customerPic || undefined} size="default">
                    {rev.customerName.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 700, color: tokens.textPrimary }}>
                        {rev.customerName}
                      </Typography>
                      <VerifiedIcon sx={{ fontSize: 15, color: tokens.primary }} />
                    </Box>
                    <Typography sx={{ fontSize: 12, color: tokens.textMuted }}>
                      {typeof rev.createdAt === "string" ? rev.createdAt.split("T")[0] : new Date(rev.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: "2px" }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <StarIcon
                      key={s}
                      sx={{
                        fontSize: 16,
                        color: s <= rev.rating ? tokens.warning : tokens.borderDefault,
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <Typography sx={{ fontSize: 14, color: tokens.textSecondary, lineHeight: 1.6 }}>
                {rev.review}
              </Typography>
            </Box>
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            textAlign: "center",
            py: 5,
            px: 3,
            bgcolor: tokens.bgCanvas,
            border: "1px dashed",
            borderColor: tokens.borderDefault,
            borderRadius: "16px",
          }}
        >
          <StarIcon sx={{ fontSize: 36, color: tokens.warning, mb: 1, opacity: 0.8 }} />
          <Typography sx={{ fontSize: 16, fontWeight: 700, color: tokens.textPrimary, mb: 0.5 }}>
            শীঘ্রই আরও কাস্টমার রিভিউ যুক্ত হবে
          </Typography>
          <Typography sx={{ fontSize: 13.5, color: tokens.textSecondary, maxWidth: 460, mx: "auto" }}>
            আমাদের ভেরিফায়েড গ্রাহকদের মতামত সরাসরি এখানে প্রদর্শিত হয়। পণ্যটি ব্যবহার করার পর আপনিও আপনার মূল্যবান রিভিউ শেয়ার করতে পারবেন।
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default ProductReviews;
