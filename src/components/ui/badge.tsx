import * as React from "react";
import { Chip, type ChipProps, type SxProps, type Theme } from "@mui/material";
import { tokens } from "@/theme/theme";

export type BadgeVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "danger"
  | "outline"
  | "success"
  | "warning"
  | "new"
  | "sale"
  | "gaming"
  | "accent"
  | "guide"
  | "review"
  | "tips";

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
      case "new":
        return {
          bgcolor: tokens.badgeNewSubtle,
          color: tokens.badgeNew,
          border: `1px solid rgba(14, 165, 233, 0.25)`,
        };
      case "sale":
        return {
          bgcolor: tokens.badgeSaleSubtle,
          color: tokens.badgeSale,
          border: `1px solid rgba(249, 115, 22, 0.25)`,
        };
      case "gaming":
        return {
          bgcolor: tokens.badgeGamingSubtle,
          color: tokens.badgeGaming,
          border: `1px solid rgba(139, 92, 246, 0.25)`,
        };
      case "guide":
      case "accent":
        return {
          bgcolor: tokens.accentSubtle,
          color: tokens.primaryHover,
          border: `1px solid ${tokens.primaryBorder}`,
        };
      case "review":
        return {
          bgcolor: "rgba(14, 165, 233, 0.12)",
          color: "#0284c7",
          border: "1px solid rgba(14, 165, 233, 0.22)",
        };
      case "tips":
        return {
          bgcolor: "rgba(16, 185, 129, 0.12)",
          color: "#059669",
          border: "1px solid rgba(16, 185, 129, 0.22)",
        };
      case "secondary":
        return {
          bgcolor: tokens.bgSubtle,
          color: tokens.textSecondary,
          border: `1px solid ${tokens.borderDefault}`,
        };
      case "destructive":
      case "danger":
        return {
          bgcolor: tokens.dangerSubtle,
          color: tokens.danger,
          border: `1px solid ${tokens.dangerBorder}`,
        };
      case "success":
        return {
          bgcolor: tokens.successSubtle,
          color: tokens.successText,
          border: `1px solid ${tokens.successBorder}`,
        };
      case "warning":
        return {
          bgcolor: tokens.warningSubtle,
          color: tokens.warning,
          border: `1px solid ${tokens.warningBorder}`,
        };
      case "outline":
        return {
          bgcolor: "transparent",
          color: tokens.textPrimary,
          border: `1px solid ${tokens.borderElevated}`,
        };
      case "default":
      default:
        return {
          bgcolor: tokens.primarySubtle,
          color: tokens.primary,
          border: `1px solid ${tokens.primaryBorder}`,
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
        borderRadius: `${tokens.radiusPill}px`,
        ...getStyles(),
        ...sx,
      }}
      {...props}
    />
  );
}

export const badgeVariants = () => "";
