"use client";

import * as React from "react";
import MuiDialog, { type DialogProps as MuiDialogProps } from "@mui/material/Dialog";
import MuiDialogTitle, { type DialogTitleProps as MuiDialogTitleProps } from "@mui/material/DialogTitle";
import MuiDialogContent, { type DialogContentProps as MuiDialogContentProps } from "@mui/material/DialogContent";
import MuiDialogContentText, { type DialogContentTextProps as MuiDialogContentTextProps } from "@mui/material/DialogContentText";
import MuiDialogActions, { type DialogActionsProps as MuiDialogActionsProps } from "@mui/material/DialogActions";
import MuiFade, { type FadeProps as MuiFadeProps } from "@mui/material/Fade";
import MuiSlide, { type SlideProps as MuiSlideProps } from "@mui/material/Slide";
import MuiCollapse, { type CollapseProps as MuiCollapseProps } from "@mui/material/Collapse";
import Box, { type BoxProps } from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "./icon-button";
import { tokens } from "@/theme/theme";

export interface ModalProps extends MuiDialogProps {
  showCloseButton?: boolean;
}

export function Modal({
  maxWidth = "sm",
  fullWidth = true,
  slotProps,
  showCloseButton = false,
  onClose,
  children,
  ...props
}: ModalProps) {
  const paperProps = (slotProps?.paper as Record<string, any>) ?? {};

  return (
    <MuiDialog
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      onClose={onClose}
      slotProps={{
        ...slotProps,
        paper: {
          ...paperProps,
          sx: [
            {
              borderRadius: `${tokens.radiusLg}px`,
              p: 1.5,
              bgcolor: tokens.bgPanel,
              color: tokens.textPrimary,
              backgroundImage: "none",
              border: `1px solid ${tokens.borderDefault}`,
              boxShadow: tokens.shadowElevated,
              position: "relative",
            },
            ...(Array.isArray(paperProps.sx) ? paperProps.sx : paperProps.sx ? [paperProps.sx] : []),
          ],
        },
      }}
      {...props}
    >
      {showCloseButton && onClose && (
        <IconButton
          size='small'
          onClick={(e) => onClose(e, "backdropClick")}
          aria-label='Close'
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

export function ModalTitle({ sx, ...props }: MuiDialogTitleProps) {
  return (
    <MuiDialogTitle
      sx={[
        {
          fontSize: "1.15rem",
          fontWeight: 700,
          color: tokens.textPrimary,
          p: 1.5,
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      {...props}
    />
  );
}

export function ModalContent({ sx, dividers, children, ...props }: MuiDialogContentProps) {
  return (
    <MuiDialogContent
      dividers={dividers}
      sx={[
        {
          borderColor: tokens.borderDefault,
          color: tokens.textPrimary,
          p: 1.5,
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      {...props}
    >
      {children}
    </MuiDialogContent>
  );
}

export function ModalContentText({ sx, ...props }: MuiDialogContentTextProps) {
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

export function ModalActions({ sx, ...props }: MuiDialogActionsProps) {
  return (
    <MuiDialogActions
      sx={[
        {
          p: 1.5,
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

export function ModalHeader({ sx, ...props }: BoxProps) {
  return <Box sx={{ display: "flex", flexDirection: "column", gap: 1, p: 1, ...sx }} {...props} />;
}

export function ModalClose({ onClick, children, ...props }: React.ComponentProps<typeof IconButton>) {
  return (
    <IconButton onClick={onClick} aria-label='Close' {...props}>
      {children || <CloseIcon sx={{ fontSize: 18 }} />}
    </IconButton>
  );
}

export const ModalFooter = ModalActions;
export const ModalDescription = ModalContentText;

// Transition helpers
export const Fade = React.forwardRef<unknown, MuiFadeProps>(function Fade(props, ref) {
  return <MuiFade ref={ref} {...props} />;
});

export const Slide = React.forwardRef<unknown, MuiSlideProps>(function Slide(props, ref) {
  return <MuiSlide ref={ref} {...props} />;
});

export const Collapse = React.forwardRef<unknown, MuiCollapseProps>(function Collapse(props, ref) {
  return <MuiCollapse ref={ref} {...props} />;
});

// Backward-compatible Dialog aliases
export const Dialog = Modal;
export const DialogTitle = ModalTitle;
export const DialogContent = ModalContent;
export const DialogContentText = ModalContentText;
export const DialogActions = ModalActions;
export const DialogHeader = ModalHeader;
export const DialogFooter = ModalFooter;
export const DialogClose = ModalClose;
export const DialogDescription = ModalDescription;

export type DialogProps = ModalProps;
export type DialogTitleProps = MuiDialogTitleProps;
export type DialogContentProps = MuiDialogContentProps;
export type DialogContentTextProps = MuiDialogContentTextProps;
export type DialogActionsProps = MuiDialogActionsProps;

export type ModalTitleProps = MuiDialogTitleProps;
export type ModalContentProps = MuiDialogContentProps;
export type ModalContentTextProps = MuiDialogContentTextProps;
export type ModalActionsProps = MuiDialogActionsProps;
export type FadeProps = MuiFadeProps;
export type SlideProps = MuiSlideProps;
export type CollapseProps = MuiCollapseProps;

export default Modal;
