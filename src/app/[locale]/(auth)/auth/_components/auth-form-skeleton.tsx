import Box from "@mui/material/Box";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { tokens } from "@/theme/theme";

const cardSx = {
  p: { xs: 3, sm: 4.25 },
  borderRadius: `${tokens.radiusLg}px`,
  bgcolor: tokens.bgPanel,
  border: `1px solid ${tokens.borderDefault}`,
  boxShadow: "0 12px 36px -4px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.03)",
  position: "relative",
  width: "100%",
};

interface AuthFormSkeletonProps {
  type: "signin" | "signup";
}

export function AuthFormSkeleton({ type }: AuthFormSkeletonProps) {
  return (
    <Card sx={cardSx}>
      {/* Title & Subtitle */}
      <Box sx={{ mb: 3.5, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Skeleton variant='rounded' width='55%' height={30} sx={{ borderRadius: "8px", mb: 1 }} />
        <Skeleton variant='rounded' width='75%' height={18} sx={{ borderRadius: "6px" }} />
      </Box>

      {/* Social Auth (Google Button) */}
      <Skeleton variant='rounded' width='100%' height={44} sx={{ borderRadius: "10px" }} />

      {/* Divider */}
      <Box sx={{ position: "relative", my: 2.8, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Box sx={{ width: "100%", height: "1px", bgcolor: tokens.borderDefault }} />
        <Skeleton
          variant='rounded'
          width={36}
          height={16}
          sx={{
            position: "absolute",
            bgcolor: tokens.bgPanel,
            borderRadius: "4px",
          }}
        />
      </Box>

      {/* Form Inputs */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {type === "signup" && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
            <Skeleton variant='rounded' width={80} height={16} sx={{ borderRadius: "4px" }} />
            <Skeleton variant='rounded' width='100%' height={46} sx={{ borderRadius: "10px" }} />
          </Box>
        )}

        {/* Email Field */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
          <Skeleton variant='rounded' width={60} height={16} sx={{ borderRadius: "4px" }} />
          <Skeleton variant='rounded' width='100%' height={46} sx={{ borderRadius: "10px" }} />
        </Box>

        {/* Password Field */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
          <Skeleton variant='rounded' width={75} height={16} sx={{ borderRadius: "4px" }} />
          <Skeleton variant='rounded' width='100%' height={46} sx={{ borderRadius: "10px" }} />
        </Box>

        {/* Submit Button */}
        <Skeleton variant='rounded' width='100%' height={48} sx={{ borderRadius: "10px", mt: 0.5 }} />
      </Box>

      {/* Footer Link */}
      <Box
        sx={{
          mt: 3,
          pt: 2.5,
          borderTop: `1px solid ${tokens.borderSubtle}`,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Skeleton variant='rounded' width='55%' height={18} sx={{ borderRadius: "6px" }} />
      </Box>
    </Card>
  );
}
