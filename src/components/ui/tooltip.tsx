"use client";

import * as React from "react";
import MuiTooltip, { type TooltipProps as MuiTooltipProps } from "@mui/material/Tooltip";
import { tokens } from "@/theme/theme";

export type TooltipProps = MuiTooltipProps;

export function Tooltip({ slotProps, ...props }: TooltipProps) {
  return (
    <MuiTooltip
      slotProps={{
        tooltip: {
          sx: {
            bgcolor: tokens.bgDark,
            color: tokens.textWhite,
            fontSize: 12,
            fontWeight: 500,
            borderRadius: `${tokens.radiusSm}px`,
            px: 1.25,
            py: 0.6,
            boxShadow: tokens.shadowMd,
          },
        },
        ...slotProps,
      }}
      {...props}
    />
  );
}

export default Tooltip;

