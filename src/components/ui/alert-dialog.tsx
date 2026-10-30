"use client";

import * as React from "react";
import Dialog, { type DialogProps } from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";
import { type SxProps, type Theme } from "@mui/material/styles";
import { Button, type ButtonVariant, type ButtonSize } from "@/components/ui/button";
import { tokens } from "@/theme/theme";

interface AlertDialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const AlertDialogContext = React.createContext<AlertDialogContextValue | null>(null);

function useAlertDialogContext() {
  const context = React.useContext(AlertDialogContext);
  return context;
}

interface AlertDialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

function AlertDialog({ open: controlledOpen, defaultOpen = false, onOpenChange, children }: AlertDialogProps) {
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

  return <AlertDialogContext.Provider value={{ open, setOpen }}>{children}</AlertDialogContext.Provider>;
}

function AlertDialogTrigger({
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
  const ctx = useAlertDialogContext();

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

function AlertDialogPortal({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

function AlertDialogOverlay() {
  return null;
}

interface AlertDialogContentProps extends Omit<DialogProps, "open"> {
  children?: React.ReactNode;
  size?: "default" | "sm";
  sx?: SxProps<Theme>;
}

function AlertDialogContent({ children, size = "default", sx, onClose, ...props }: AlertDialogContentProps) {
  const ctx = useAlertDialogContext();
  const open = ctx?.open ?? false;

  const handleClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
    ctx?.setOpen(false);
    onClose?.(event, reason);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={size === "sm" ? "xs" : "sm"}
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: `${tokens.radiusLg}px`,
            p: 1,
            bgcolor: tokens.bgPanel,
            color: tokens.textPrimary,
            backgroundImage: "none",
            border: `1px solid ${tokens.borderDefault}`,
            boxShadow: tokens.shadowElevated,
            ...sx,
          },
        },
      }}
      {...props}
    >
      {children}
    </Dialog>
  );
}

function AlertDialogHeader({ sx, ...props }: React.ComponentProps<typeof Box>) {
  return <Box sx={{ display: "flex", flexDirection: "column", gap: 1, p: 2, ...sx }} {...props} />;
}

function AlertDialogFooter({ sx, ...props }: React.ComponentProps<typeof DialogActions>) {
  return (
    <DialogActions
      sx={{
        p: 2,
        pt: 1,
        gap: 1,
        display: "flex",
        justifyContent: "flex-end",
        ...sx,
      }}
      {...props}
    />
  );
}

function AlertDialogTitle({ sx, ...props }: React.ComponentProps<typeof DialogTitle>) {
  return (
    <DialogTitle
      sx={{
        p: 0,
        fontSize: "1.15rem",
        fontWeight: 700,
        color: tokens.textPrimary,
        ...sx,
      }}
      {...props}
    />
  );
}

function AlertDialogDescription({ sx, ...props }: React.ComponentProps<typeof DialogContentText>) {
  return (
    <DialogContentText
      sx={{
        fontSize: "0.88rem",
        color: tokens.textSecondary,
        lineHeight: 1.5,
        ...sx,
      }}
      {...props}
    />
  );
}

function AlertDialogMedia({ sx, ...props }: React.ComponentProps<typeof Box>) {
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 48,
        height: 48,
        borderRadius: `${tokens.radiusSm}px`,
        bgcolor: tokens.bgSubtle,
        mb: 1,
        ...sx,
      }}
      {...props}
    />
  );
}

interface ActionButtonProps extends React.ComponentProps<typeof Button> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

function AlertDialogAction({ variant = "default", size = "default", onClick, children, ...props }: ActionButtonProps) {
  const ctx = useAlertDialogContext();
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    ctx?.setOpen(false);
  };

  return (
    <Button variant={variant} size={size} onClick={handleClick} {...props}>
      {children}
    </Button>
  );
}

function AlertDialogCancel({ variant = "outline", size = "default", onClick, children, ...props }: ActionButtonProps) {
  const ctx = useAlertDialogContext();
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    ctx?.setOpen(false);
  };

  return (
    <Button variant={variant} size={size} onClick={handleClick} {...props}>
      {children}
    </Button>
  );
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
};
