import React from "react";
import Box, { type BoxProps } from "@mui/material/Box";

export interface SectionContainerProps extends BoxProps {
  children: React.ReactNode;
  component?: React.ElementType;
}

export function SectionContainer({
  children,
  component = "section",
  sx,
  ...props
}: SectionContainerProps) {
  return (
    <Box
      component={component}
      sx={[
        {
          width: "100%",
          maxWidth: 1440,
          mx: "auto",
          px: { xs: 2, sm: 3, md: 4, lg: 5 },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      {...props}
    >
      {children}
    </Box>
  );
}

export default SectionContainer;
