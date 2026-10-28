"use client";

import * as React from "react";
import Typography, { type TypographyProps } from "@mui/material/Typography";

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
        color: "text.primary",
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
