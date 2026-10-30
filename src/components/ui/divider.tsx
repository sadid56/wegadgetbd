"use client";

import * as React from "react";
import MuiDivider, { type DividerProps as MuiDividerProps } from "@mui/material/Divider";
import { tokens } from "@/theme/theme";

export interface DividerProps extends MuiDividerProps {}

export function Divider({ sx, ...props }: DividerProps) {
  return (
    <MuiDivider
      sx={[
        {
          borderColor: tokens.borderDefault,
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      {...props}
    />
  );
}

export const Separator = Divider;
export default Divider;

