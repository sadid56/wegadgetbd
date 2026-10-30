import React from "react";
import {
  Button as MuiButton,
  ButtonBase as MuiButtonBase,
  CircularProgress,
  type ButtonProps as MuiButtonProps,
  type ButtonBaseProps as MuiButtonBaseProps,
} from "@mui/material";
import { tokens } from "../../theme/theme";

export type ButtonVariant =
  | "primary"
  | "default"
  | "contained"
  | "secondary"
  | "outlined"
  | "outline"
  | "ghost"
  | "text"
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
  href?: string;
  download?: string;
  target?: string;
  rel?: string;
  asChild?: boolean;
}

export type ButtonBaseProps = MuiButtonBaseProps & {
  component?: React.ElementType;
  href?: string;
  target?: string;
  rel?: string;
};

export const ButtonBase = React.forwardRef<HTMLButtonElement, ButtonBaseProps>(function ButtonBase(
  props,
  ref
) {
  return <MuiButtonBase ref={ref} {...props} />;
});

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  color,
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
  const effectiveVariant = color === "error" && (variant === "contained" || variant === "primary") ? "danger" : variant;

  const getVariantStyles = () => {
    switch (effectiveVariant) {
      case "primary":
      case "default":
      case "contained":
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
          color: color === "error" ? tokens.danger : tokens.textPrimary,
          border: `1px solid ${color === "error" ? tokens.dangerBorder : tokens.borderDefault}`,
          boxShadow: tokens.shadowSm,
          fontWeight: 600,
          "&:hover": {
            bgcolor: color === "error" ? tokens.dangerSubtle : tokens.bgSubtle,
            borderColor: color === "error" ? tokens.danger : tokens.borderHover,
            color: color === "error" ? tokens.danger : tokens.textPrimary,
          },
          "&.Mui-disabled": {
            bgcolor: tokens.bgInput,
            color: tokens.textDisabled,
            borderColor: tokens.borderDisabled,
            boxShadow: "none",
          },
        };

      case "ghost":
      case "text":
        return {
          bgcolor: "transparent",
          color: color === "error" ? tokens.danger : tokens.textSecondary,
          border: "1px solid transparent",
          fontWeight: 600,
          boxShadow: "none",
          "&:hover": {
            bgcolor: color === "error" ? tokens.dangerSubtle : tokens.bgSubtle,
            color: color === "error" ? tokens.danger : tokens.textPrimary,
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
          fontWeight: 600,
          "&:hover": {
            bgcolor: "transparent",
            color: tokens.primaryHover,
            textDecoration: "underline",
          },
        };

      case "danger":
      case "destructive":
        return {
          bgcolor: tokens.danger,
          color: tokens.textWhite,
          border: `1px solid ${tokens.danger}`,
          fontWeight: 600,
          boxShadow: tokens.shadowSm,
          "&:hover": {
            bgcolor: tokens.dangerHover,
            borderColor: tokens.dangerHover,
            color: tokens.textWhite,
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
      sx={[
        {
          borderRadius: `${tokens.radiusMd}px`,
          textTransform: "none",
          fontSize: isSmall ? "0.82rem" : isLarge ? "0.98rem" : "0.88rem",
          py: isIcon ? 0.8 : isSmall ? 0.6 : isLarge ? 1.2 : 0.9,
          px: isIcon ? 0.8 : isSmall ? 1.8 : isLarge ? 3.2 : 2.4,
          minWidth: isIcon ? 36 : undefined,
          transition: "all 0.18s ease-in-out",
          ...getVariantStyles(),
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      {...rest}
    >
      {loading && loadingText ? loadingText : children}
    </MuiButton>
  );
};

export const buttonVariants = () => "";
export default Button;
