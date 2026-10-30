import {
  Chip as MuiChip,
  Badge as MuiCountBadge,
  type ChipProps as MuiChipProps,
  type BadgeProps as MuiCountBadgeProps,
  type SxProps,
  type Theme,
} from "@mui/material";
import { tokens } from "@/theme/theme";

export type BadgeVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "danger"
  | "outline"
  | "outlined"
  | "filled"
  | "success"
  | "warning"
  | "info"
  | "new"
  | "sale"
  | "gaming"
  | "accent"
  | "guide"
  | "review"
  | "tips";

export interface BadgeProps extends Omit<MuiChipProps, "variant" | "color"> {
  variant?: BadgeVariant;
  color?: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
  sx?: SxProps<Theme>;
}

export type ChipProps = BadgeProps;
export type CountBadgeProps = MuiCountBadgeProps;

export function CountBadge({ sx, ...props }: CountBadgeProps) {
  return (
    <MuiCountBadge
      sx={[
        {
          "& .MuiBadge-badge": {
            bgcolor: tokens.primary,
            color: tokens.textWhite,
            fontWeight: 700,
          },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      {...props}
    />
  );
}

export function Badge({ variant = "default", color, sx, label, children, size = "small", ...props }: BadgeProps) {
  const resolvedVariant: BadgeVariant =
    color === "success"
      ? "success"
      : color === "error"
        ? "danger"
        : color === "warning"
          ? "warning"
          : color === "info"
            ? "info"
            : color === "secondary"
              ? "secondary"
              : variant === "outlined"
                ? "outline"
                : variant;

  const getStyles = () => {
    switch (resolvedVariant) {
      case "new":
      case "info":
      case "review":
        return {
          bgcolor: tokens.infoSubtle,
          color: tokens.info,
          border: `1px solid ${tokens.infoBorder}`,
        };
      case "sale":
        return {
          bgcolor: tokens.badgeSaleSubtle,
          color: tokens.badgeSale,
          border: `1px solid ${tokens.warningBorder}`,
        };
      case "gaming":
        return {
          bgcolor: tokens.badgeGamingSubtle,
          color: tokens.badgeGaming,
          border: `1px solid ${tokens.badgeGamingSubtle}`,
        };
      case "guide":
      case "accent":
      case "tips":
        return {
          bgcolor: tokens.accentSubtle,
          color: tokens.primaryHover,
          border: `1px solid ${tokens.primaryBorder}`,
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
      case "filled":
      default:
        return {
          bgcolor: tokens.primarySubtle,
          color: tokens.primary,
          border: `1px solid ${tokens.primaryBorder}`,
        };
    }
  };

  return (
    <MuiChip
      size={size}
      label={label ?? children}
      sx={[
        {
          fontWeight: 600,
          fontSize: "0.75rem",
          height: 24,
          borderRadius: `${tokens.radiusPill}px`,
          ...getStyles(),
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      {...props}
    />
  );
}

export const Chip = Badge;
export const badgeVariants = () => "";
export default Badge;
