"use client";

import * as React from "react";
import MuiDrawer, { type DrawerProps as MuiDrawerProps } from "@mui/material/Drawer";
import Box, { type BoxProps } from "@mui/material/Box";
import Typography, { type TypographyProps } from "@mui/material/Typography";
import { tokens } from "@/theme/theme";

export interface DrawerProps extends MuiDrawerProps {
  direction?: "bottom" | "top" | "left" | "right";
}

export function Drawer({
  anchor,
  direction = "bottom",
  slotProps,
  sx,
  children,
  ...props
}: DrawerProps) {
  const chosenAnchor = anchor || direction;
  const paperProps = (slotProps?.paper as Record<string, any>) ?? {};

  return (
    <MuiDrawer
      anchor={chosenAnchor}
      slotProps={{
        ...slotProps,
        paper: {
          ...paperProps,
          sx: [
            {
              bgcolor: tokens.bgPanel,
              color: tokens.textPrimary,
              backgroundImage: "none",
              boxShadow: tokens.elevation3,
              ...(chosenAnchor === "bottom"
                ? {
                    borderTopLeftRadius: `${tokens.radiusXxl}px`,
                    borderTopRightRadius: `${tokens.radiusXxl}px`,
                    borderTop: `1px solid ${tokens.borderDefault}`,
                    maxHeight: "85vh",
                  }
                : chosenAnchor === "top"
                ? {
                    borderBottomLeftRadius: `${tokens.radiusXxl}px`,
                    borderBottomRightRadius: `${tokens.radiusXxl}px`,
                    borderBottom: `1px solid ${tokens.borderDefault}`,
                  }
                : chosenAnchor === "left"
                ? {
                    borderTopRightRadius: `${tokens.radiusXl}px`,
                    borderBottomRightRadius: `${tokens.radiusXl}px`,
                    borderRight: `1px solid ${tokens.borderDefault}`,
                  }
                : {
                    borderTopLeftRadius: `${tokens.radiusXl}px`,
                    borderBottomLeftRadius: `${tokens.radiusXl}px`,
                    borderLeft: `1px solid ${tokens.borderDefault}`,
                  }),
            },
            ...(Array.isArray(paperProps.sx) ? paperProps.sx : paperProps.sx ? [paperProps.sx] : []),
          ],
        },
      }}
      sx={sx}
      {...props}
    >
      {children}
    </MuiDrawer>
  );
}

export function DrawerHeader({ sx, ...props }: BoxProps) {
  return (
    <Box
      sx={[
        {
          p: 2,
          pb: 1,
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      {...props}
    />
  );
}

export function DrawerFooter({ sx, ...props }: BoxProps) {
  return (
    <Box
      sx={[
        {
          p: 2,
          pt: 1,
          display: "flex",
          justifyContent: "flex-end",
          gap: 1,
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      {...props}
    />
  );
}

export function DrawerTitle({ sx, ...props }: TypographyProps) {
  return (
    <Typography
      variant='h6'
      sx={[
        {
          fontWeight: 700,
          color: tokens.textPrimary,
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      {...props}
    />
  );
}

export function DrawerDescription({ sx, ...props }: TypographyProps) {
  return (
    <Typography
      variant='body2'
      sx={[
        {
          color: tokens.textSecondary,
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      {...props}
    />
  );
}

export default Drawer;
