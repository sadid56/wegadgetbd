import * as React from "react";
import { Chip, type ChipProps, type SxProps, type Theme } from "@mui/material";
import { studioTokens } from "@/theme/theme";

export type BadgeVariant = "default" | "secondary" | "destructive" | "danger" | "outline" | "success" | "warning";

export interface BadgeProps extends Omit<ChipProps, "variant" | "color"> {
  variant?: BadgeVariant;
  sx?: SxProps<Theme>;
}

export function Badge({
  variant = "default",
  sx,
  label,
  children,
  size = "small",
  ...props
}: BadgeProps) {
  const getStyles = () => {
    switch (variant) {
      case "secondary":
        return {
          bgcolor: studioTokens.bgSubtle,
          color: studioTokens.textSecondary,
          border: `1px solid ${studioTokens.borderDefault}`,
        };
      case "destructive":
      case "danger":
        return {
          bgcolor: studioTokens.dangerSubtle,
          color: studioTokens.danger,
          border: `1px solid ${studioTokens.dangerBorder}`,
        };
      case "success":
        return {
          bgcolor: studioTokens.successSubtle,
          color: studioTokens.successText,
          border: `1px solid ${studioTokens.successBorder}`,
        };
      case "warning":
        return {
          bgcolor: studioTokens.warningSubtle,
          color: studioTokens.warning,
          border: `1px solid ${studioTokens.warningBorder}`,
        };
      case "outline":
        return {
          bgcolor: "transparent",
          color: studioTokens.textPrimary,
          border: `1px solid ${studioTokens.borderElevated}`,
        };
      case "default":
      default:
        return {
          bgcolor: studioTokens.primarySubtle,
          color: studioTokens.primary,
          border: `1px solid ${studioTokens.primaryBorder}`,
        };
    }
  };

  return (
    <Chip
      size={size}
      label={label || children}
      sx={{
        fontWeight: 600,
        fontSize: "0.75rem",
        height: 24,
        borderRadius: `${studioTokens.radiusPill}px`,
        ...getStyles(),
        ...sx,
      }}
      {...props}
    />
  );
}

export const badgeVariants = () => "";
