"use client";

import * as React from "react";
import MuiCircularProgress, { type CircularProgressProps as MuiCircularProgressProps } from "@mui/material/CircularProgress";
import { tokens } from "@/theme/theme";

export interface SpinnerProps extends MuiCircularProgressProps {}

export function Spinner({ sx, size = 24, ...props }: SpinnerProps) {
  return (
    <MuiCircularProgress
      size={size}
      sx={[
        {
          color: tokens.primary,
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      {...props}
    />
  );
}

export const CircularProgress = Spinner;
export default Spinner;

