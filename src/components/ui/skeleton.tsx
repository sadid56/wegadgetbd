import { Skeleton as MuiSkeleton, type SkeletonProps as MuiSkeletonProps } from "@mui/material";
import { studioTokens } from "@/theme/theme";

export interface SkeletonProps extends MuiSkeletonProps {
  className?: string;
}

export function Skeleton({ sx, ...props }: SkeletonProps) {
  return (
    <MuiSkeleton
      animation='wave'
      sx={{
        bgcolor: studioTokens.bgSubtle,
        borderRadius: `${studioTokens.radiusMd}px`,
        ...sx,
      }}
      {...props}
    />
  );
}
