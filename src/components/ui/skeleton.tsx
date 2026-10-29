import { Skeleton as MuiSkeleton, type SkeletonProps as MuiSkeletonProps } from "@mui/material";
import { tokens } from "@/theme/theme";

export interface SkeletonProps extends MuiSkeletonProps {
  className?: string;
}

export function Skeleton({ sx, ...props }: SkeletonProps) {
  return (
    <MuiSkeleton
      animation='wave'
      sx={{
        bgcolor: tokens.bgSubtle,
        borderRadius: `${tokens.radiusMd}px`,
        ...sx,
      }}
      {...props}
    />
  );
}
