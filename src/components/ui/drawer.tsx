"use client";

import * as React from "react";
import MuiDrawer, { type DrawerProps as MuiDrawerProps } from "@mui/material/Drawer";
import Box, { type BoxProps } from "@mui/material/Box";
import Typography, { type TypographyProps } from "@mui/material/Typography";
import type { SxProps, Theme } from "@mui/material/styles";

interface DrawerContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  direction?: "bottom" | "top" | "left" | "right";
}

const DrawerContext = React.createContext<DrawerContextValue | null>(null);

function useDrawerContext() {
  return React.useContext(DrawerContext);
}

interface DrawerProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  direction?: "bottom" | "top" | "left" | "right";
  children?: React.ReactNode;
}

function Drawer({ open: controlledOpen, defaultOpen = false, onOpenChange, direction = "bottom", children }: DrawerProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(next);
      }
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  return <DrawerContext.Provider value={{ open, setOpen, direction }}>{children}</DrawerContext.Provider>;
}

function DrawerTrigger({
  asChild,
  children,
  onClick,
  ...props
}: {
  asChild?: boolean;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler;
  [key: string]: unknown;
}) {
  const ctx = useDrawerContext();

  const handleClick = (e: React.MouseEvent) => {
    onClick?.(e);
    ctx?.setOpen(true);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ onClick?: React.MouseEventHandler }>, {
      onClick: (e: React.MouseEvent) => {
        (children.props as { onClick?: React.MouseEventHandler }).onClick?.(e);
        handleClick(e);
      },
    });
  }

  return (
    <Box component='button' type='button' onClick={handleClick} {...props} sx={{ cursor: "pointer", bgcolor: "transparent", border: 0, p: 0 }}>
      {children}
    </Box>
  );
}

function DrawerPortal({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

function DrawerOverlay() {
  return null;
}

function DrawerClose({
  asChild,
  children,
  onClick,
  ...props
}: {
  asChild?: boolean;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler;
  [key: string]: unknown;
}) {
  const ctx = useDrawerContext();

  const handleClick = (e: React.MouseEvent) => {
    onClick?.(e);
    ctx?.setOpen(false);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ onClick?: React.MouseEventHandler }>, {
      onClick: (e: React.MouseEvent) => {
        (children.props as { onClick?: React.MouseEventHandler }).onClick?.(e);
        handleClick(e);
      },
    });
  }

  return (
    <Box component='button' type='button' onClick={handleClick} {...props} sx={{ cursor: "pointer", bgcolor: "transparent", border: 0, p: 0 }}>
      {children}
    </Box>
  );
}

interface DrawerContentProps extends Omit<MuiDrawerProps, "open"> {
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
}

function DrawerContent({ children, sx, onClose, ...props }: DrawerContentProps) {
  const ctx = useDrawerContext();
  const open = ctx?.open ?? false;
  const direction = ctx?.direction ?? "bottom";

  const handleClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
    ctx?.setOpen(false);
    onClose?.(event, reason);
  };

  const isVertical = direction === "bottom" || direction === "top";

  return (
    <MuiDrawer
      anchor={direction}
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          sx: {
            bgcolor: "background.paper",
            backgroundImage: "none",
            borderTopLeftRadius: direction === "bottom" ? 16 : 0,
            borderTopRightLeftRadius: direction === "bottom" ? 16 : 0,
            borderBottomLeftRadius: direction === "top" ? 16 : 0,
            borderBottomRightRadius: direction === "top" ? 16 : 0,
            maxHeight: isVertical ? "85vh" : "100%",
            width: !isVertical ? { xs: "85%", sm: 400 } : "100%",
            p: 2,
            ...sx,
          },
        },
      }}
      {...props}
    >
      {direction === "bottom" && (
        <Box
          sx={{
            width: 48,
            height: 4,
            borderRadius: 2,
            bgcolor: "divider",
            mx: "auto",
            mb: 2,
          }}
        />
      )}
      {children}
    </MuiDrawer>
  );
}

function DrawerHeader({ sx, ...props }: BoxProps) {
  return <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, p: 1, ...sx }} {...props} />;
}

function DrawerFooter({ sx, ...props }: BoxProps) {
  return <Box sx={{ mt: "auto", display: "flex", flexDirection: "column", gap: 1, p: 1, ...sx }} {...props} />;
}

function DrawerTitle({ sx, ...props }: TypographyProps) {
  return <Typography sx={{ fontSize: "1.1rem", fontWeight: 700, color: "text.primary", ...sx }} {...props} />;
}

function DrawerDescription({ sx, ...props }: TypographyProps) {
  return <Typography sx={{ fontSize: "0.85rem", color: "text.secondary", ...sx }} {...props} />;
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
