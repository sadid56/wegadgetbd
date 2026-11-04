"use client";

import Box from "@mui/material/Box";
import { Skeleton } from "@/components/ui/skeleton";
import { tokens } from "@/theme/theme";

export default function CartPageSkeleton() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: tokens.bgCanvas, pb: { xs: 8, md: 10 } }}>
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
          }}
        >
          <Skeleton variant="rounded" width={140} height={20} />
          <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 1.5, alignItems: "center" }}>
            <Skeleton variant="rounded" width={60} height={20} />
            <Skeleton variant="rounded" width={12} height={12} />
            <Skeleton variant="rounded" width={80} height={20} />
            <Skeleton variant="rounded" width={12} height={12} />
            <Skeleton variant="rounded" width={50} height={20} />
          </Box>
          <Skeleton variant="rounded" width={85} height={20} />
        </Box>
      </Box>

      <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, sm: 3 }, pt: { xs: 3, md: 4 } }}>
        <Box sx={{ mb: 3 }}>
          <Skeleton variant="rounded" width={220} height={32} sx={{ mb: 1 }} />
          <Skeleton variant="rounded" width={130} height={18} />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 380px" },
            gap: 3,
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Box
              sx={{
                bgcolor: tokens.bgPanel,
                border: `1px solid ${tokens.borderDefault}`,
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  display: { xs: "none", sm: "grid" },
                  gridTemplateColumns: "1fr 110px 130px 110px 44px",
                  alignItems: "center",
                  px: 2.5,
                  py: 1.5,
                  bgcolor: tokens.bgCanvas,
                  borderBottom: `1px solid ${tokens.borderDefault}`,
                }}
              >
                <Skeleton variant="rounded" width={60} height={14} />
                <Skeleton variant="rounded" width={40} height={14} sx={{ justifySelf: "end" }} />
                <Skeleton variant="rounded" width={60} height={14} sx={{ justifySelf: "center" }} />
                <Skeleton variant="rounded" width={40} height={14} sx={{ justifySelf: "end" }} />
                <Box />
              </Box>

              {[1, 2].map((idx) => (
                <Box
                  key={idx}
                  sx={{
                    p: { xs: 2, sm: 2.5 },
                    borderBottom: idx === 2 ? "none" : `1px solid ${tokens.borderSubtle}`,
                  }}
                >
                  <Box
                    sx={{
                      display: { xs: "none", sm: "grid" },
                      gridTemplateColumns: "1fr 110px 130px 110px 44px",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Skeleton variant="rounded" width={64} height={64} sx={{ borderRadius: "8px", flexShrink: 0 }} />
                      <Box sx={{ flex: 1 }}>
                        <Skeleton variant="rounded" width="75%" height={16} sx={{ mb: 1 }} />
                        <Skeleton variant="rounded" width="40%" height={14} />
                      </Box>
                    </Box>
                    <Skeleton variant="rounded" width={60} height={16} sx={{ justifySelf: "end" }} />
                    <Skeleton variant="rounded" width={86} height={32} sx={{ justifySelf: "center", borderRadius: "6px" }} />
                    <Skeleton variant="rounded" width={60} height={16} sx={{ justifySelf: "end" }} />
                    <Skeleton variant="circular" width={22} height={22} sx={{ justifySelf: "end" }} />
                  </Box>

                  <Box sx={{ display: { xs: "flex", sm: "none" }, gap: 1.5 }}>
                    <Skeleton variant="rounded" width={72} height={72} sx={{ borderRadius: "8px", flexShrink: 0 }} />
                    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <Box>
                        <Skeleton variant="rounded" width="80%" height={15} sx={{ mb: 0.75 }} />
                        <Skeleton variant="rounded" width="45%" height={13} />
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 1 }}>
                        <Skeleton variant="rounded" width={60} height={16} />
                        <Skeleton variant="rounded" width={80} height={26} sx={{ borderRadius: "6px" }} />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>

            <Box
              sx={{
                bgcolor: tokens.bgPanel,
                border: `1px solid ${tokens.borderDefault}`,
                borderRadius: "12px",
                p: 2.5,
              }}
            >
              <Skeleton variant="rounded" width={140} height={16} sx={{ mb: 1.5 }} />
              <Box sx={{ display: "flex", gap: 1 }}>
                <Skeleton variant="rounded" height={42} sx={{ flex: 1, borderRadius: "8px" }} />
                <Skeleton variant="rounded" width={80} height={42} sx={{ borderRadius: "8px" }} />
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              bgcolor: tokens.bgPanel,
              border: `1px solid ${tokens.borderDefault}`,
              borderRadius: "12px",
              p: 3,
            }}
          >
            <Skeleton variant="rounded" width={130} height={20} sx={{ pb: 1, mb: 2 }} />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.75, py: 1.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Skeleton variant="rounded" width={100} height={14} />
                <Skeleton variant="rounded" width={60} height={14} />
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Skeleton variant="rounded" width={90} height={14} />
                <Skeleton variant="rounded" width={120} height={14} />
              </Box>
            </Box>

            <Box sx={{ pt: 2, borderTop: `1px solid ${tokens.borderDefault}`, mb: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Skeleton variant="rounded" width={100} height={18} />
                <Skeleton variant="rounded" width={90} height={28} />
              </Box>
            </Box>

            <Skeleton variant="rounded" height={48} sx={{ borderRadius: "8px", mb: 1.5 }} />
            <Skeleton variant="rounded" height={42} sx={{ borderRadius: "8px" }} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
