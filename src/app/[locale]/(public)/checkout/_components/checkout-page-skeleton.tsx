"use client";

import Box from "@mui/material/Box";
import { Skeleton } from "@/components/ui/skeleton";
import { tokens } from "@/theme/theme";

export default function CheckoutPageSkeleton() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: tokens.bgCanvas, pb: { xs: 12, md: 10 } }}>
      {/* Top Stepper Navigation Skeleton */}
      <Box
        sx={{
          borderBottom: `1px solid ${tokens.borderDefault}`,
          bgcolor: tokens.bgPanel,
          py: 1.75,
          px: { xs: 2, sm: 3 },
        }}
      >
        <Box
          sx={{
            maxWidth: 1200,
            mx: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Skeleton variant="rounded" width={110} height={20} />

          <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 1.5, alignItems: "center" }}>
            <Skeleton variant="rounded" width={55} height={20} />
            <Skeleton variant="rounded" width={12} height={12} />
            <Skeleton variant="rounded" width={80} height={20} />
            <Skeleton variant="rounded" width={12} height={12} />
            <Skeleton variant="rounded" width={50} height={20} />
          </Box>

          <Box sx={{ display: { xs: "flex", sm: "none" } }}>
            <Skeleton variant="rounded" width={90} height={18} />
          </Box>

          <Skeleton variant="rounded" width={115} height={20} />
        </Box>
      </Box>

      {/* Main Container */}
      <Box
        component="main"
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: { xs: 2, sm: 3 },
          pt: { xs: 3, md: 4 },
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 380px" },
            gap: 3,
            alignItems: "flex-start",
          }}
        >
          {/* Left Column: Form Panel Skeleton */}
          <Box
            sx={{
              bgcolor: tokens.bgPanel,
              borderRadius: "12px",
              p: { xs: 2.5, sm: 3 },
              border: `1px solid ${tokens.borderDefault}`,
            }}
          >
            {/* Form Title */}
            <Skeleton
              variant="rounded"
              width="65%"
              height={24}
              sx={{ mb: { xs: 2.5, md: 3 }, borderRadius: "6px" }}
            />

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: { xs: 2, md: 2.5 },
              }}
            >
              {/* Field 1: Name */}
              <Box>
                <Skeleton variant="rounded" width={85} height={16} sx={{ mb: 1, borderRadius: "4px" }} />
                <Skeleton variant="rounded" width="100%" height={44} sx={{ borderRadius: "8px" }} />
              </Box>

              {/* Field 2: Phone */}
              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Skeleton variant="rounded" width={95} height={16} sx={{ borderRadius: "4px" }} />
                  <Skeleton variant="rounded" width={120} height={14} sx={{ borderRadius: "4px" }} />
                </Box>
                <Skeleton variant="rounded" width="100%" height={44} sx={{ borderRadius: "8px" }} />
              </Box>

              {/* Field 3: Address */}
              <Box>
                <Skeleton variant="rounded" width={105} height={16} sx={{ mb: 1, borderRadius: "4px" }} />
                <Skeleton variant="rounded" width="100%" height={74} sx={{ borderRadius: "8px" }} />
              </Box>

              {/* Field 4: Delivery Options */}
              <Box>
                <Skeleton variant="rounded" width={170} height={16} sx={{ mb: 1.5, borderRadius: "4px" }} />
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 1.5,
                  }}
                >
                  <Skeleton variant="rounded" width="100%" height={62} sx={{ borderRadius: "8px" }} />
                  <Skeleton variant="rounded" width="100%" height={62} sx={{ borderRadius: "8px" }} />
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Right Column: Order Summary Skeleton */}
          <Box
            sx={{
              bgcolor: tokens.bgPanel,
              borderRadius: "12px",
              p: { xs: 2, sm: 2.5 },
              border: `1px solid ${tokens.borderDefault}`,
            }}
          >
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 2,
                pb: 1.5,
                borderBottom: `1px solid ${tokens.borderDefault}`,
              }}
            >
              <Skeleton variant="circular" width={18} height={18} />
              <Skeleton variant="rounded" width={140} height={20} sx={{ borderRadius: "4px" }} />
            </Box>

            {/* Products List Skeletons */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {[1, 2].map((idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: "flex",
                    gap: 1.5,
                    p: 1.25,
                    bgcolor: tokens.bgCanvas,
                    borderRadius: "10px",
                    border: `1px solid ${tokens.borderDefault}`,
                  }}
                >
                  <Skeleton
                    variant="rounded"
                    width={68}
                    height={68}
                    sx={{ borderRadius: "8px", flexShrink: 0 }}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <Skeleton variant="rounded" width="85%" height={16} sx={{ borderRadius: "4px" }} />
                    <Skeleton variant="rounded" width="40%" height={14} sx={{ borderRadius: "4px" }} />
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 0.5 }}>
                      <Skeleton variant="rounded" width={74} height={24} sx={{ borderRadius: "6px" }} />
                      <Skeleton variant="rounded" width={24} height={24} sx={{ borderRadius: "6px" }} />
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Price breakdown */}
            <Box sx={{ mt: 2.5, pt: 2, borderTop: `1px solid ${tokens.borderDefault}` }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Skeleton variant="rounded" width={65} height={15} sx={{ borderRadius: "4px" }} />
                  <Skeleton variant="rounded" width={50} height={15} sx={{ borderRadius: "4px" }} />
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Skeleton variant="rounded" width={90} height={15} sx={{ borderRadius: "4px" }} />
                  <Skeleton variant="rounded" width={40} height={15} sx={{ borderRadius: "4px" }} />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    pt: 1.5,
                    mt: 0.5,
                    borderTop: `1px solid ${tokens.borderDefault}`,
                  }}
                >
                  <Skeleton variant="rounded" width={60} height={18} sx={{ borderRadius: "4px" }} />
                  <Skeleton variant="rounded" width={75} height={22} sx={{ borderRadius: "4px" }} />
                </Box>
              </Box>

              {/* Submit Button */}
              <Skeleton
                variant="rounded"
                width="100%"
                height={44}
                sx={{ borderRadius: "8px", mt: 2.5 }}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Mobile Fixed Bottom Checkout Bar Skeleton */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: { xs: "block", md: "none" },
          bgcolor: tokens.bgPanel,
          borderTop: `1px solid ${tokens.borderDefault}`,
          p: 1.5,
          boxShadow: tokens.shadowLg,
        }}
      >
        <Box sx={{ maxWidth: 600, mx: "auto" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Skeleton variant="rounded" width={110} height={20} sx={{ borderRadius: "4px" }} />
            <Skeleton variant="rounded" width={110} height={16} sx={{ borderRadius: "4px" }} />
          </Box>
          <Skeleton
            variant="rounded"
            width="100%"
            height={44}
            sx={{ borderRadius: "8px" }}
          />
        </Box>
      </Box>
    </Box>
  );
}

