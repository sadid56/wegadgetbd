"use client";

import * as React from "react";
import MuiIconButton, { type IconButtonProps as MuiIconButtonProps } from "@mui/material/IconButton";
import { tokens } from "@/theme/theme";

export interface IconButtonProps extends MuiIconButtonProps {
  component?: React.ElementType;
  href?: string;
  target?: string;
  rel?: string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { sx, ...props },
  ref
) {
  return (
    <MuiIconButton
      ref={ref}
      sx={[
        {
          color: tokens.textSecondary,
          borderRadius: `${tokens.radiusMd}px`,
          transition: "all 0.2s ease",
          "&:hover": {
            bgcolor: tokens.bgSubtle,
            color: tokens.textPrimary,
          },
          "&.Mui-disabled": {
            color: tokens.textDisabled,
          },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      {...props}
    />
  );
});

export default IconButton;

