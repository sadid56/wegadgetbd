"use client";

import * as React from "react";
import MuiMenu, { type MenuProps as MuiMenuProps } from "@mui/material/Menu";
import MuiMenuItem, { type MenuItemProps as MuiMenuItemProps } from "@mui/material/MenuItem";
import MuiDivider from "@mui/material/Divider";
import MuiListSubheader from "@mui/material/ListSubheader";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CheckIcon from "@mui/icons-material/Check";
import CircleIcon from "@mui/icons-material/Circle";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import type { SxProps, Theme } from "@mui/material/styles";
import { tokens } from "@/theme/theme";

interface DropdownContextValue {
  anchorEl: HTMLElement | null;
  setAnchorEl: (el: HTMLElement | null) => void;
  open: boolean;
  close: () => void;
}

const DropdownContext = React.createContext<DropdownContextValue | null>(null);

function useDropdownContext() {
  return React.useContext(DropdownContext);
}

function DropdownMenu({ children }: { children?: React.ReactNode }) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const close = React.useCallback(() => setAnchorEl(null), []);

  return (
    <DropdownContext.Provider value={{ anchorEl, setAnchorEl, open, close }}>
      {children}
    </DropdownContext.Provider>
  );
}

function DropdownMenuTrigger({
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
  const ctx = useDropdownContext();

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    onClick?.(e);
    ctx?.setAnchorEl(e.currentTarget);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ onClick?: React.MouseEventHandler }>, {
      onClick: (e: React.MouseEvent) => {
        (children.props as { onClick?: React.MouseEventHandler }).onClick?.(e);
        handleClick(e as any);
      },
    });
  }

  return (
    <Box component='button' type='button' onClick={handleClick as any} {...props} sx={{ cursor: "pointer", bgcolor: "transparent", border: 0, p: 0 }}>
      {children}
    </Box>
  );
}

function DropdownMenuPortal({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

interface DropdownMenuContentProps extends Omit<MuiMenuProps, "open" | "anchorEl"> {
  children?: React.ReactNode;
  sideOffset?: number;
  sx?: SxProps<Theme>;
}

function DropdownMenuContent({ children, sx, onClose, ...props }: DropdownMenuContentProps) {
  const ctx = useDropdownContext();

  const handleClose = (e: React.MouseEvent) => {
    ctx?.close();
    onClose?.(e as any, "backdropClick");
  };

  return (
    <MuiMenu
      anchorEl={ctx?.anchorEl}
      open={ctx?.open ?? false}
      onClose={handleClose}
      slotProps={{
        paper: {
          sx: {
            mt: 0.5,
            minWidth: 160,
            borderRadius: `${tokens.radiusMd}px`,
            border: `1px solid ${tokens.borderDefault}`,
            bgcolor: tokens.bgElevated,
            backgroundImage: "none",
            boxShadow: tokens.shadowPopover,
            p: 0.5,
            ...sx,
          },
        },
      }}
      {...props}
    >
      {children}
    </MuiMenu>
  );
}

function DropdownMenuGroup({ children }: { children?: React.ReactNode }) {
  return <Box sx={{ display: "flex", flexDirection: "column" }}>{children}</Box>;
}

interface MenuItemCustomProps extends MuiMenuItemProps {
  inset?: boolean;
  variant?: "default" | "destructive";
}

function DropdownMenuItem({ inset, variant = "default", onClick, sx, children, ...props }: MenuItemCustomProps) {
  const ctx = useDropdownContext();

  const handleClick = (e: React.MouseEvent<HTMLLIElement>) => {
    onClick?.(e);
    ctx?.close();
  };

  const isDestructive = variant === "destructive";

  return (
    <MuiMenuItem
      onClick={handleClick}
      sx={{
        fontSize: 13,
        fontWeight: 500,
        borderRadius: 1,
        py: 0.8,
        px: 1.5,
        pl: inset ? 3.5 : 1.5,
        color: isDestructive ? tokens.danger : tokens.textPrimary,
        gap: 1.5,
        "&:hover": {
          bgcolor: isDestructive ? tokens.dangerSubtle : tokens.bgSubtle,
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiMenuItem>
  );
}

function DropdownMenuCheckboxItem({
  checked,
  children,
  onClick,
  sx,
  ...props
}: MenuItemCustomProps & { checked?: boolean }) {
  const ctx = useDropdownContext();

  const handleClick = (e: React.MouseEvent<HTMLLIElement>) => {
    onClick?.(e);
    ctx?.close();
  };

  return (
    <MuiMenuItem
      onClick={handleClick}
      sx={{
        fontSize: 13,
        fontWeight: 500,
        borderRadius: 1,
        py: 0.8,
        px: 1.5,
        gap: 1.5,
        ...sx,
      }}
      {...props}
    >
      <Box sx={{ width: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {checked && <CheckIcon sx={{ fontSize: 16 }} />}
      </Box>
      {children}
    </MuiMenuItem>
  );
}

function DropdownMenuRadioGroup({ children }: { children?: React.ReactNode }) {
  return <Box sx={{ display: "flex", flexDirection: "column" }}>{children}</Box>;
}

function DropdownMenuRadioItem({
  children,
  onClick,
  sx,
  ...props
}: MenuItemCustomProps & { value?: string }) {
  const ctx = useDropdownContext();

  const handleClick = (e: React.MouseEvent<HTMLLIElement>) => {
    onClick?.(e);
    ctx?.close();
  };

  return (
    <MuiMenuItem
      onClick={handleClick}
      sx={{
        fontSize: 13,
        fontWeight: 500,
        borderRadius: 1,
        py: 0.8,
        px: 1.5,
        gap: 1.5,
        ...sx,
      }}
      {...props}
    >
      <Box sx={{ width: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircleIcon sx={{ fontSize: 8 }} />
      </Box>
      {children}
    </MuiMenuItem>
  );
}

function DropdownMenuLabel({
  inset,
  children,
  sx,
  ...props
}: {
  inset?: boolean;
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
}) {
  return (
    <MuiListSubheader
      sx={{
        lineHeight: 2,
        fontSize: 11,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        color: "text.secondary",
        bgcolor: "transparent",
        pl: inset ? 3.5 : 1.5,
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiListSubheader>
  );
}

function DropdownMenuSeparator({ sx, ...props }: React.ComponentProps<typeof MuiDivider>) {
  return <MuiDivider sx={{ my: 0.5, ...sx }} {...props} />;
}

function DropdownMenuShortcut({
  children,
  sx,
  ...props
}: {
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
}) {
  return (
    <Typography
      variant='caption'
      sx={{
        ml: "auto",
        fontSize: 11,
        color: "text.disabled",
        letterSpacing: "0.05em",
        ...sx,
      }}
      {...props}
    >
      {children}
    </Typography>
  );
}

function DropdownMenuSub({ children }: { children?: React.ReactNode }) {
  return <Box sx={{ position: "relative" }}>{children}</Box>;
}

function DropdownMenuSubTrigger({
  children,
  sx,
  ...props
}: MenuItemCustomProps) {
  return (
    <MuiMenuItem
      sx={{
        fontSize: 13,
        fontWeight: 500,
        borderRadius: 1,
        py: 0.8,
        px: 1.5,
        gap: 1.5,
        ...sx,
      }}
      {...props}
    >
      {children}
      <ChevronRightIcon sx={{ fontSize: 16, ml: "auto", color: "text.secondary" }} />
    </MuiMenuItem>
  );
}

function DropdownMenuSubContent({
  children,
  sx,
  ...props
}: DropdownMenuContentProps) {
  return (
    <MuiMenu
      open={false}
      sx={sx}
      {...props}
    >
      {children}
    </MuiMenu>
  );
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
