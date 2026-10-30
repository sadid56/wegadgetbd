"use client";

import * as React from "react";
import MuiSelect, { type SelectProps as MuiSelectProps, type SelectChangeEvent } from "@mui/material/Select";
import MuiMenuItem, { type MenuItemProps as MuiMenuItemProps } from "@mui/material/MenuItem";
import MuiFormControl, { type FormControlProps as MuiFormControlProps } from "@mui/material/FormControl";
import MuiFormControlLabel, { type FormControlLabelProps as MuiFormControlLabelProps } from "@mui/material/FormControlLabel";
import { tokens } from "@/theme/theme";

export type { SelectChangeEvent };
export type SelectProps<Value = unknown> = MuiSelectProps<Value>;
export interface MenuItemProps extends MuiMenuItemProps {
  variant?: "default" | "accent" | "danger";
}
export type FormControlProps = MuiFormControlProps;
export type FormControlLabelProps = MuiFormControlLabelProps;

export function Select<Value = unknown>({ sx, MenuProps, ...props }: SelectProps<Value>) {
  return (
    <MuiSelect
      MenuProps={{
        disableScrollLock: true,
        slotProps: {
          paper: {
            sx: {
              bgcolor: tokens.bgPanel,
              border: `1px solid ${tokens.borderDefault}`,
              borderRadius: `${tokens.radiusMd}px`,
              boxShadow: tokens.shadowPopover,
              mt: 0.5,
            },
          },
        },
        ...MenuProps,
      }}
      sx={[
        {
          bgcolor: tokens.bgInput,
          color: tokens.textPrimary,
          borderRadius: `${tokens.radiusMd}px`,
          fontSize: "0.875rem",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: tokens.borderDefault,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: tokens.borderHover,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: tokens.primary,
          },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      {...props}
    />
  );
}

export const MenuItem = React.forwardRef<HTMLLIElement, MenuItemProps>(function MenuItem(
  { sx, variant = "default", ...props },
  ref
) {
  return (
    <MuiMenuItem
      ref={ref}
      sx={[
        {
          fontSize: 13.5,
          fontWeight: variant !== "default" ? 600 : 500,
          color: variant === "danger" ? tokens.danger : tokens.textPrimary,
          borderRadius: `${tokens.radiusSm}px`,
          py: 1,
          px: 1.25,
          my: 0.25,
          gap: 1.5,
          textDecoration: "none",
          "& svg": {
            fontSize: 19,
            color:
              variant === "danger"
                ? tokens.danger
                : variant === "accent"
                ? tokens.primary
                : tokens.textSecondary,
            flexShrink: 0,
          },
          "&:hover": {
            bgcolor: variant === "danger" ? tokens.dangerSubtle : tokens.bgSubtle,
          },
          "&.Mui-selected": {
            bgcolor: `${tokens.primarySubtle} !important`,
            color: tokens.primary,
            fontWeight: 600,
            "& svg": {
              color: tokens.primary,
            },
          },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      {...props}
    />
  );
});

export function FormControl({ sx, ...props }: FormControlProps) {
  return <MuiFormControl sx={sx} {...props} />;
}

export function FormControlLabel({ sx, ...props }: FormControlLabelProps) {
  return (
    <MuiFormControlLabel
      sx={[
        {
          color: tokens.textPrimary,
          "& .MuiFormControlLabel-label": {
            fontSize: "0.875rem",
            color: tokens.textPrimary,
          },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      {...props}
    />
  );
}

export default Select;

