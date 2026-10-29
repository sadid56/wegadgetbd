import React from "react";
import { Button as MuiButton, CircularProgress, type ButtonProps as MuiButtonProps } from "@mui/material";
import { tokens } from "../../theme/theme";

export type ButtonVariant =
  | "primary"
  | "default"
  | "secondary"
  | "outlined"
  | "outline"
  | "ghost"
  | "danger"
  | "destructive"
  | "link";

export type ButtonSize = "small" | "medium" | "large" | "default" | "icon" | "sm" | "lg";

export interface ButtonProps extends Omit<MuiButtonProps, "variant" | "size"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingText?: React.ReactNode;
  component?: React.ElementType;
  download?: string;
  target?: string;
  rel?: string;
  asChild?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  loading = false,
  loadingText,
  disabled = false,
  startIcon,
  endIcon,
  children,
  sx,
  size = "medium",
  asChild,
  ...rest
}) => {
  const isDisabled = disabled || loading;

  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
      case "default":
        return {
          bgcolor: tokens.primary,
          color: tokens.textWhite,
          border: "1px solid transparent",
          fontWeight: 700,
          boxShadow: tokens.shadowPrimary,
          "&:hover": {
            bgcolor: tokens.primaryHover,
            color: tokens.textWhite,
            boxShadow: tokens.shadowPrimaryHover,
          },
          "&.Mui-disabled": {
            bgcolor: tokens.primaryDisabled,
            color: tokens.textDisabled,
            boxShadow: "none",
          },
        };

      case "secondary":
      case "outlined":
      case "outline":
        return {
          bgcolor: tokens.bgPanel,
          color: tokens.textPrimary,
          border: `1px solid ${tokens.borderDefault}`,
          boxShadow: tokens.shadowSm,
          fontWeight: 500,
          "&:hover": {
            bgcolor: tokens.bgSubtle,
            borderColor: tokens.primaryLight,
            color: tokens.textPrimary,
            boxShadow: tokens.shadowMd,
          },
          "&.Mui-disabled": {
            bgcolor: tokens.bgInput,
            color: tokens.textDisabled,
            borderColor: tokens.borderDisabled,
            boxShadow: "none",
          },
        };

      case "ghost":
        return {
          bgcolor: "transparent",
          color: tokens.textSecondary,
          border: "1px solid transparent",
          fontWeight: 500,
          boxShadow: "none",
          "&:hover": {
            bgcolor: tokens.bgSubtle,
            color: tokens.textPrimary,
          },
          "&.Mui-disabled": {
            color: tokens.textDisabled,
          },
        };

      case "link":
        return {
          bgcolor: "transparent",
          color: tokens.primary,
          border: "none",
          textDecoration: "underline",
          fontWeight: 500,
          "&:hover": {
            bgcolor: "transparent",
            color: tokens.primaryLight,
            textDecoration: "underline",
          },
        };

      case "danger":
      case "destructive":
        return {
          bgcolor: tokens.dangerSubtle,
          color: tokens.danger,
          border: `1px solid ${tokens.dangerBorder}`,
          fontWeight: 600,
          boxShadow: tokens.shadowSm,
          "&:hover": {
            bgcolor: tokens.errorSubtle,
            borderColor: tokens.error,
            color: tokens.textPrimary,
            boxShadow: tokens.shadowMd,
          },
          "&.Mui-disabled": {
            bgcolor: tokens.bgInput,
            borderColor: tokens.borderDisabled,
            color: tokens.textDisabled,
            boxShadow: "none",
          },
        };
    }
  };

  const isSmall = size === "small" || size === "sm";
  const isLarge = size === "large" || size === "lg";
  const isIcon = size === "icon";

  const spinnerSize = isSmall ? 14 : isLarge ? 20 : 16;

  const muiSize: "small" | "medium" | "large" = isSmall ? "small" : isLarge ? "large" : "medium";

  return (
    <MuiButton
      disabled={isDisabled}
      size={muiSize}
      startIcon={loading ? <CircularProgress size={spinnerSize} color='inherit' /> : startIcon}
      endIcon={loading ? undefined : endIcon}
      sx={{
        borderRadius: `${tokens.radiusMd}px`,
        textTransform: "none",
        fontSize: isSmall ? "0.82rem" : isLarge ? "0.98rem" : "0.88rem",
        py: isIcon ? 0.8 : isSmall ? 0.6 : isLarge ? 1.2 : 0.9,
        px: isIcon ? 0.8 : isSmall ? 1.8 : isLarge ? 3.2 : 2.4,
        minWidth: isIcon ? 36 : undefined,
        transition: "all 0.18s ease-in-out",
        ...getVariantStyles(),
        ...sx,
      }}
      {...rest}
    >
      {loading && loadingText ? loadingText : children}
    </MuiButton>
  );
};

export const buttonVariants = () => "";
