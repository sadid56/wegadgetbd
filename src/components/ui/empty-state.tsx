import * as React from "react";
import Box, { type BoxProps } from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SearchOffRoundedIcon from "@mui/icons-material/SearchOffRounded";
import { type SxProps, type Theme } from "@mui/material";

import { tokens } from "@/theme/theme";
import { Button, type ButtonVariant, type ButtonSize } from "./button";

export interface EmptyStateProps extends Omit<BoxProps, "title"> {
  /**
   * Main icon or illustration. Pass `false` or `null` to hide the icon container.
   * Defaults to `<SearchOffRoundedIcon />`.
   */
  icon?: React.ReactNode | boolean;
  /**
   * Title text or element.
   */
  title: React.ReactNode;
  /**
   * Explanatory text or elements.
   */
  description?: React.ReactNode;
  /**
   * Custom action element (e.g. `<Button>`, `<Link>`).
   */
  action?: React.ReactNode;
  /**
   * Quick text for a standard action button.
   */
  actionText?: string;
  /**
   * Callback for standard action button.
   */
  onAction?: () => void;
  /**
   * Variant for standard action button. Defaults to `"primary"`.
   */
  actionVariant?: ButtonVariant;
  /**
   * Size for standard action button. Defaults to `"sm"`.
   */
  actionSize?: ButtonSize;
  /**
   * Optional start icon for the action button.
   */
  actionIcon?: React.ReactNode;
  /**
   * Whether to wrap in a card surface (white background, border, rounded corners).
   * Defaults to `true`.
   */
  card?: boolean;
  /**
   * Custom sx styles on the container.
   */
  sx?: SxProps<Theme>;
  /**
   * Additional content rendered below the action.
   */
  children?: React.ReactNode;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  function EmptyState(
    {
      icon,
      title,
      description,
      action,
      actionText,
      onAction,
      actionVariant = "primary",
      actionSize = "sm",
      actionIcon,
      card = true,
      sx,
      children,
      ...props
    },
    ref
  ) {
    const showIcon = icon !== false && icon !== null;
    const defaultIcon = (
      <SearchOffRoundedIcon sx={{ fontSize: 28, color: tokens.textSecondary }} />
    );

    return (
      <Box
        ref={ref}
        sx={[
          {
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            ...(card
              ? {
                  bgcolor: tokens.bgPanel,
                  borderRadius: "20px",
                  border: `1px solid ${tokens.borderDefault}`,
                  boxShadow: "0 2px 10px rgba(15, 23, 42, 0.03)",
                  py: { xs: 8, md: 10 },
                  px: 3,
                }
              : {
                  py: { xs: 5, md: 7 },
                  px: 2,
                }),
          },
          ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
        ]}
        {...props}
      >
        {showIcon && (
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              bgcolor: tokens.bgSubtle,
              border: `1px solid ${tokens.borderDefault}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2.5,
              flexShrink: 0,
            }}
          >
            {icon && icon !== true ? icon : defaultIcon}
          </Box>
        )}

        {typeof title === "string" ? (
          <Typography
            sx={{
              fontSize: "1.125rem",
              fontWeight: 700,
              color: tokens.textPrimary,
              letterSpacing: "-0.015em",
              mb: 1,
            }}
          >
            {title}
          </Typography>
        ) : (
          title
        )}

        {description &&
          (typeof description === "string" ? (
            <Typography
              sx={{
                fontSize: "0.875rem",
                color: tokens.textSecondary,
                lineHeight: 1.6,
                mb: action || actionText || children ? 3 : 0,
                maxWidth: 420,
              }}
            >
              {description}
            </Typography>
          ) : (
            description
          ))}

        {action
          ? action
          : actionText && (
              <Button
                variant={actionVariant}
                size={actionSize}
                onClick={onAction}
                startIcon={actionIcon}
                sx={{ borderRadius: "999px", px: 3.5, height: 40 }}
              >
                {actionText}
              </Button>
            )}

        {children}
      </Box>
    );
  }
);

export default EmptyState;

