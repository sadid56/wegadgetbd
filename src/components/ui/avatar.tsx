"use client";

import * as React from "react";
import MuiAvatar, { type AvatarProps as MuiAvatarProps } from "@mui/material/Avatar";
import MuiAvatarGroup, { type AvatarGroupProps as MuiAvatarGroupProps } from "@mui/material/AvatarGroup";
import Box, { type BoxProps } from "@mui/material/Box";
import { type SxProps, type Theme } from "@mui/material/styles";
import { tokens } from "@/theme/theme";

interface AvatarContextValue {
  size: "default" | "sm" | "lg";
}

const AvatarContext = React.createContext<AvatarContextValue>({ size: "default" });

const sizeMap = {
  sm: 28,
  default: 36,
  lg: 48,
};

export interface AvatarProps extends MuiAvatarProps {
  size?: "default" | "sm" | "lg";
  className?: string;
}

function Avatar({ size = "default", sx, children, ...props }: AvatarProps) {
  const dimension = sizeMap[size] ?? 36;

  return (
    <AvatarContext.Provider value={{ size }}>
      <MuiAvatar
        sx={{
          width: dimension,
          height: dimension,
          fontSize: size === "sm" ? 12 : size === "lg" ? 18 : 14,
          fontWeight: 600,
          bgcolor: tokens.primarySubtle,
          color: tokens.textPrimary,
          ...sx,
        }}
        {...props}
      >
        {children}
      </MuiAvatar>
    </AvatarContext.Provider>
  );
}

function AvatarImage({
  src,
  alt = "",
  sx,
  ...props
}: React.ComponentProps<"img"> & { sx?: SxProps<Theme> }) {
  if (!src) return null;
  return (
    <Box
      component='img'
      src={src}
      alt={alt}
      sx={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        borderRadius: "50%",
        ...sx,
      }}
      {...(props as any)}
    />
  );
}

function AvatarFallback({ sx, children, ...props }: BoxProps) {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 600,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

function AvatarBadge({ sx, ...props }: BoxProps) {
  return (
    <Box
      component='span'
      sx={{
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 10,
        height: 10,
        borderRadius: "50%",
        bgcolor: tokens.success,
        border: `2px solid ${tokens.bgPanel}`,
        zIndex: 1,
        ...sx,
      }}
      {...props}
    />
  );
}

function AvatarGroup({ sx, ...props }: MuiAvatarGroupProps) {
  return (
    <MuiAvatarGroup
      sx={{
        "& .MuiAvatar-root": {
          borderColor: tokens.bgPanel,
        },
        ...sx,
      }}
      {...props}
    />
  );
}

function AvatarGroupCount({ sx, children, ...props }: BoxProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        bgcolor: tokens.bgSubtle,
        fontSize: 12,
        fontWeight: 600,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  AvatarGroup,
  AvatarGroupCount,
};
