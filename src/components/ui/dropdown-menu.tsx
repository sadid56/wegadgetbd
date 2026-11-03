"use client";

import * as React from "react";
import MuiMenu, { type MenuProps as MuiMenuProps } from "@mui/material/Menu";
import MuiMenuItem, { type MenuItemProps as MuiMenuItemProps } from "@mui/material/MenuItem";
import MuiDivider, { type DividerProps as MuiDividerProps } from "@mui/material/Divider";
import MuiListSubheader, { type ListSubheaderProps as MuiListSubheaderProps } from "@mui/material/ListSubheader";
import Box from "@mui/material/Box";
import { type SxProps, type Theme } from "@mui/material/styles";
import { tokens } from "@/theme/theme";

export interface DropdownMenuProps extends Omit<MuiMenuProps, "open"> {
  trigger?: React.ReactNode;
  open?: boolean;
  anchorEl?: HTMLElement | null;
  onClose?: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void;
  align?: "left" | "right" | "center" | "start" | "end";
  children?: React.ReactNode;
}

export function DropdownMenu({
  trigger,
  open: controlledOpen,
  anchorEl: controlledAnchorEl,
  onClose,
  align = "end",
  children,
  slotProps,
  sx,
  disableScrollLock = true,
  ...props
}: DropdownMenuProps) {
  const [internalAnchorEl, setInternalAnchorEl] = React.useState<HTMLElement | null>(null);

  const isControlled = controlledAnchorEl !== undefined || controlledOpen !== undefined;
  const anchorEl = isControlled ? controlledAnchorEl : internalAnchorEl;
  const open = isControlled ? (controlledOpen ?? Boolean(controlledAnchorEl)) : Boolean(internalAnchorEl);

  const handleTriggerClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (!isControlled) {
      setInternalAnchorEl(e.currentTarget);
    }
  };

  const handleClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
    if (!isControlled) {
      setInternalAnchorEl(null);
    }
    onClose?.(event, reason);
  };

  const isRight = align === "right" || align === "end";
  const isCenter = align === "center";
  const horizontal = isRight ? "right" : isCenter ? "center" : "left";

  const paperProps = (slotProps?.paper as Record<string, any>) ?? {};
  const listProps = (slotProps?.list as Record<string, any>) ?? {};

  const menu = (
    <MuiMenu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      disableScrollLock={disableScrollLock}
      anchorOrigin={{
        vertical: "bottom",
        horizontal,
      }}
      transformOrigin={{
        vertical: "top",
        horizontal,
      }}
      slotProps={{
        ...slotProps,
        paper: {
          ...paperProps,
          sx: [
            {
              mt: 0.75,
              minWidth: 160,
              borderRadius: `${tokens.radiusMd}px`,
              border: `1px solid ${tokens.borderDefault}`,
              bgcolor: tokens.bgElevated,
              backgroundImage: "none",
              boxShadow: tokens.shadowPopover,
              p: 0.5,
              color: tokens.textPrimary,
            },
            ...(Array.isArray(paperProps.sx) ? paperProps.sx : paperProps.sx ? [paperProps.sx] : []),
          ],
        },
        list: {
          ...listProps,
          sx: [
            { p: 0.25 },
            ...(Array.isArray(listProps.sx) ? listProps.sx : listProps.sx ? [listProps.sx] : []),
          ],
        },
      }}
      sx={sx}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        const originalOnClick = (child.props as any)?.onClick;
        return React.cloneElement(child as React.ReactElement<any>, {
          onClick: (e: React.MouseEvent) => {
            originalOnClick?.(e);
            if (!isControlled) {
              setInternalAnchorEl(null);
            }
          },
        });
      })}
    </MuiMenu>
  );

  if (trigger) {
    return (
      <>
        {React.isValidElement(trigger) ? (
          React.cloneElement(trigger as React.ReactElement<any>, {
            onClick: (e: React.MouseEvent<HTMLElement>) => {
              (trigger.props as any)?.onClick?.(e);
              handleTriggerClick(e);
            },
          })
        ) : (
          <Box component='span' onClick={handleTriggerClick} sx={{ display: "inline-flex", cursor: "pointer" }}>
            {trigger}
          </Box>
        )}
        {menu}
      </>
    );
  }

  return menu;
}

export interface DropdownMenuItemProps extends Omit<MuiMenuItemProps, "component"> {
  variant?: "default" | "destructive";
  component?: React.ElementType;
  href?: string;
  target?: string;
}

export const DropdownMenuItem = React.forwardRef<HTMLLIElement, DropdownMenuItemProps>(
  function DropdownMenuItem({ variant = "default", sx, children, ...props }, ref) {
    const isDestructive = variant === "destructive";

    return (
      <MuiMenuItem
        ref={ref}
        sx={[
          {
            fontSize: 13,
            fontWeight: 500,
            borderRadius: `${tokens.radiusSm}px`,
            py: 0.8,
            px: 1.5,
            gap: 1.25,
            color: isDestructive ? tokens.danger : tokens.textPrimary,
            "& .MuiSvgIcon-root": {
              fontSize: 18,
              color: isDestructive ? tokens.danger : tokens.textSecondary,
            },
            "&:hover": {
              bgcolor: isDestructive ? tokens.dangerSubtle : tokens.bgSubtle,
            },
          },
          ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
        ]}
        {...props}
      >
        {children}
      </MuiMenuItem>
    );
  }
);

export interface DropdownMenuLabelProps extends MuiListSubheaderProps {}

export const DropdownMenuLabel = React.forwardRef<HTMLLIElement, DropdownMenuLabelProps>(
  function DropdownMenuLabel({ sx, ...props }, ref) {
    return (
      <MuiListSubheader
        ref={ref}
        sx={[
          {
            bgcolor: "transparent",
            fontSize: 11,
            fontWeight: 700,
            color: tokens.textSecondary,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            lineHeight: "28px",
            px: 1.5,
          },
          ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
        ]}
        {...props}
      />
    );
  }
);

export interface DropdownMenuSeparatorProps extends MuiDividerProps {}

export const DropdownMenuSeparator = React.forwardRef<HTMLHRElement, DropdownMenuSeparatorProps>(
  function DropdownMenuSeparator({ sx, ...props }, ref) {
    return (
      <MuiDivider
        ref={ref}
        sx={[
          {
            my: 0.5,
            borderColor: tokens.borderDefault,
          },
          ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
        ]}
        {...props}
      />
    );
  }
);

// Aliases
export const DropdownItem = DropdownMenuItem;
export const DropdownSeparator = DropdownMenuSeparator;
export const DropdownLabel = DropdownMenuLabel;
export default DropdownMenu;
