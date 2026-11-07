"use client";

import * as React from "react";
import Dialog, { type DialogProps } from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import { Button, type ButtonVariant } from "./button";
import { tokens } from "@/theme/theme";

export interface AlertDialogProps extends Omit<DialogProps, "title"> {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  confirmText?: React.ReactNode;
  cancelText?: React.ReactNode;
  onConfirm?: () => void;
  confirmVariant?: ButtonVariant;
  loading?: boolean;
}

export function AlertDialog({
  open,
  onClose,
  title,
  description,
  confirmText = "Continue",
  cancelText = "Cancel",
  onConfirm,
  confirmVariant = "destructive",
  loading = false,
  maxWidth = "xs",
  fullWidth = true,
  slotProps,
  children,
  ...props
}: AlertDialogProps) {
  const paperProps = (slotProps?.paper as Record<string, any>) ?? {};

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      slotProps={{
        ...slotProps,
        paper: {
          ...paperProps,
          sx: [
            {
              borderRadius: `${tokens.radiusXxl}px`,
              p: 1.5,
              bgcolor: tokens.bgPanel,
              color: tokens.textPrimary,
              backgroundImage: "none",
              border: `1px solid ${tokens.borderDefault}`,
              boxShadow: tokens.elevation3,
            },
            ...(Array.isArray(paperProps.sx)
              ? paperProps.sx
              : paperProps.sx
              ? [paperProps.sx]
              : []),
          ],
        },
      }}
      {...props}
    >
      <DialogTitle sx={{ fontSize: 18, fontWeight: 700, color: tokens.textPrimary, pb: 1 }}>
        {title}
      </DialogTitle>
      {description && (
        <DialogContent sx={{ py: 1 }}>
          <DialogContentText sx={{ fontSize: 14, color: tokens.textSecondary }}>
            {description}
          </DialogContentText>
        </DialogContent>
      )}
      {children}
      <DialogActions sx={{ p: 2, pt: 1, gap: 1 }}>
        <Button variant="outline" onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>
        <Button variant={confirmVariant} onClick={onConfirm} loading={loading}>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AlertDialog;
