"use client";

import * as React from "react";
import MuiDialog, { type DialogProps as MuiDialogProps } from "@mui/material/Dialog";
import MuiDialogTitle from "@mui/material/DialogTitle";
import MuiDialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import type { SxProps, Theme } from "@mui/material/styles";

interface DialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextValue | null>(null);

function useDialogContext() {
  return React.useContext(DialogContext);
}

interface DialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

function Dialog({ open: controlledOpen, defaultOpen = false, onOpenChange, children }: DialogProps) {
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

  return <DialogContext.Provider value={{ open, setOpen }}>{children}</DialogContext.Provider>;
}

function DialogTrigger({
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
  const ctx = useDialogContext();

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

function DialogPortal({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

function DialogClose({
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
  const ctx = useDialogContext();

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

function DialogOverlay() {
  return null;
}

interface DialogContentProps extends Omit<MuiDialogProps, "open"> {
  children?: React.ReactNode;
  showCloseButton?: boolean;
  sx?: SxProps<Theme>;
}

function DialogContent({ children, showCloseButton = true, sx, onClose, ...props }: DialogContentProps) {
  const ctx = useDialogContext();
  const open = ctx?.open ?? false;

  const handleClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
    ctx?.setOpen(false);
    onClose?.(event, reason);
  };

  return (
    <MuiDialog
      open={open}
      onClose={handleClose}
      maxWidth='sm'
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            p: 2,
            bgcolor: "background.paper",
            backgroundImage: "none",
            border: 1,
            borderColor: "divider",
            boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2), 0 8px 10px -6px rgba(0,0,0,0.2)",
            position: "relative",
            ...sx,
          },
        },
      }}
      {...props}
    >
      {showCloseButton && (
        <IconButton
          size='small'
          onClick={() => ctx?.setOpen(false)}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            color: "text.secondary",
            "&:hover": { color: "text.primary" },
          }}
        >
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      )}
      {children}
    </MuiDialog>
  );
}

function DialogHeader({ sx, ...props }: React.ComponentProps<typeof Box>) {
  return <Box sx={{ display: "flex", flexDirection: "column", gap: 1, p: 1, ...sx }} {...props} />;
}

function DialogFooter({ sx, ...props }: React.ComponentProps<typeof DialogActions>) {
  return (
    <DialogActions
      sx={{
        p: 1,
        pt: 2,
        gap: 1,
        display: "flex",
        justifyContent: "flex-end",
        ...sx,
      }}
      {...props}
    />
  );
}

function DialogTitle({ sx, ...props }: React.ComponentProps<typeof MuiDialogTitle>) {
  return (
    <MuiDialogTitle
      sx={{
        p: 0,
        fontSize: "1.15rem",
        fontWeight: 700,
        color: "text.primary",
        ...sx,
      }}
      {...props}
    />
  );
}

function DialogDescription({ sx, ...props }: React.ComponentProps<typeof DialogContentText>) {
  return (
    <DialogContentText
      sx={{
        fontSize: "0.88rem",
        color: "text.secondary",
        lineHeight: 1.5,
        ...sx,
      }}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
