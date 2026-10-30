"use client";

import * as React from "react";
import Typography, { type TypographyProps } from "@mui/material/Typography";
import { tokens } from "@/theme/theme";

export interface LabelProps extends TypographyProps<"label"> {
  htmlFor?: string;
  className?: string;
}

function Label({ htmlFor, sx, children, ...props }: LabelProps) {
  return (
    <Typography
      component='label'
      htmlFor={htmlFor}
      sx={{
        display: "inline-block",
        fontSize: "0.875rem",
        fontWeight: 600,
        color: tokens.textPrimary,
        lineHeight: 1.4,
        mb: 0.5,
        userSelect: "none",
        ...sx,
      }}
      {...props}
    >
      {children}
    </Typography>
  );
}

export { Label };
