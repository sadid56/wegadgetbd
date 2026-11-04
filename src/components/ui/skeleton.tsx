import { Skeleton as MuiSkeleton, type SkeletonProps as MuiSkeletonProps } from "@mui/material";
import { tokens } from "@/theme/theme";

export interface SkeletonProps extends MuiSkeletonProps {
  className?: string;
}

export function Skeleton({ sx, animation = "wave", ...props }: SkeletonProps) {
  return (
    <MuiSkeleton
      animation={animation}
      sx={[
        {
          bgcolor: tokens.bgSubtle,
          borderRadius: `${tokens.radiusMd}px`,
          position: "relative",
          overflow: "hidden",
          "&.MuiSkeleton-wave::after": {
            background:
              "linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.65) 50%, rgba(255, 255, 255, 0) 100%)",
            animationDuration: "1.6s",
          },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      {...props}
    />
  );
}
