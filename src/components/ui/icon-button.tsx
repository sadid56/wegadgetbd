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
          borderRadius: `${tokens.radiusPill}px`,
          transition: "all 0.2s cubic-bezier(0.2, 0, 0, 1)",
          "&:hover": {
            bgcolor: tokens.bgSubtle,
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

