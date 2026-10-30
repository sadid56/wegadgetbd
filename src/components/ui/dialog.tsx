"use client";

import * as React from "react";
import MuiDialog, { type DialogProps as MuiDialogProps } from "@mui/material/Dialog";
import MuiDialogTitle from "@mui/material/DialogTitle";
import MuiDialogContent, { type DialogContentProps as MuiDialogContentProps } from "@mui/material/DialogContent";
import MuiDialogContentText from "@mui/material/DialogContentText";
import MuiDialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import type { SxProps, Theme } from "@mui/material/styles";
import { IconButton } from "./icon-button";
import { tokens } from "@/theme/theme";

interface DialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  hasDirectDialog: boolean;
}

const DialogContext = React.createContext<DialogContextValue | null>(null);

function useDialogContext() {
  return React.useContext(DialogContext);
}

export interface DialogProps extends Omit<MuiDialogProps, "open"> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  PaperProps?: { sx?: SxProps<Theme>; [key: string]: any };
  children?: React.ReactNode;
}

function Dialog({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  onClose,
  maxWidth = "sm",
  fullWidth = true,
  PaperProps,
  slotProps,
  children,
  ...props
}: DialogProps) {
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

  // If onClose or PaperProps is passed, render MuiDialog directly (MUI Dialog pattern)
  const hasDirectDialog = Boolean(onClose || PaperProps || props["aria-labelledby"] || props["aria-describedby"]);

  const handleClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
    setOpen(false);
    onClose?.(event, reason);
  };

  if (hasDirectDialog || !onOpenChange) {
    return (
      <DialogContext.Provider value={{ open, setOpen, hasDirectDialog: true }}>
        <MuiDialog
          open={open}
          onClose={handleClose}
          maxWidth={maxWidth}
          fullWidth={fullWidth}
          slotProps={{
            ...slotProps,
            paper: {
              ...PaperProps,
              ...(typeof slotProps?.paper === "object" ? slotProps.paper : {}),
              sx: [
                {
                  borderRadius: `${tokens.radiusLg}px`,
                  bgcolor: tokens.bgPanel,
                  color: tokens.textPrimary,
                  backgroundImage: "none",
                  border: `1px solid ${tokens.borderDefault}`,
                  boxShadow: tokens.shadowElevated,
                },
                ...(Array.isArray(PaperProps?.sx) ? PaperProps.sx : PaperProps?.sx ? [PaperProps.sx] : []),
              ],
            },
          }}
          {...props}
        >
          {children}
        </MuiDialog>
      </DialogContext.Provider>
    );
  }

  return (
    <DialogContext.Provider value={{ open, setOpen, hasDirectDialog: false }}>
      {children}
    </DialogContext.Provider>
  );
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

export interface DialogContentProps extends MuiDialogContentProps {
  children?: React.ReactNode;
  showCloseButton?: boolean;
  onClose?: MuiDialogProps["onClose"];
  sx?: SxProps<Theme>;
}

function DialogContent({ children, showCloseButton = true, sx, onClose, dividers, ...props }: DialogContentProps) {
  const ctx = useDialogContext();

  // When used inside a direct <Dialog open onClose>, render MuiDialogContent
  if (!ctx || ctx.hasDirectDialog) {
    return (
      <MuiDialogContent
        dividers={dividers}
        sx={[
          {
            borderColor: tokens.borderDefault,
            color: tokens.textPrimary,
          },
          ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
        ]}
        {...props}
      >
        {children}
      </MuiDialogContent>
    );
  }

  const open = ctx.open ?? false;
  const handleClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
    ctx.setOpen(false);
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
            borderRadius: `${tokens.radiusLg}px`,
            p: 2,
            bgcolor: tokens.bgPanel,
            color: tokens.textPrimary,
            backgroundImage: "none",
            border: `1px solid ${tokens.borderDefault}`,
            boxShadow: tokens.shadowElevated,
            position: "relative",
            ...sx,
          },
        },
      }}
    >
      {showCloseButton && (
        <IconButton
          size='small'
          onClick={() => ctx.setOpen(false)}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            color: tokens.textSecondary,
            "&:hover": { color: tokens.textPrimary },
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

function DialogActions({ sx, ...props }: React.ComponentProps<typeof MuiDialogActions>) {
  return (
    <MuiDialogActions
      sx={[
        {
          p: 2,
          gap: 1,
          display: "flex",
          justifyContent: "flex-end",
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      {...props}
    />
  );
}

const DialogFooter = DialogActions;

function DialogTitle({ sx, ...props }: React.ComponentProps<typeof MuiDialogTitle>) {
  return (
    <MuiDialogTitle
      sx={[
        {
          fontSize: "1.15rem",
          fontWeight: 700,
          color: tokens.textPrimary,
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      {...props}
    />
  );
}

function DialogContentText({ sx, ...props }: React.ComponentProps<typeof MuiDialogContentText>) {
  return (
    <MuiDialogContentText
      sx={[
        {
          fontSize: "0.88rem",
          color: tokens.textSecondary,
          lineHeight: 1.5,
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      {...props}
    />
  );
}

const DialogDescription = DialogContentText;

export {
  Dialog,
  DialogActions,
  DialogClose,
  DialogContent,
  DialogContentText,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
