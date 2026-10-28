"use client";

import * as React from "react";
import { Checkbox as MuiCheckbox, type CheckboxProps as MuiCheckboxProps } from "@mui/material";
import { studioTokens } from "@/theme/theme";

export interface CheckboxProps extends Omit<MuiCheckboxProps, "onChange"> {
  onCheckedChange?: (checked: boolean) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}

export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ checked, onCheckedChange, onChange, sx, disabled, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, isChecked: boolean) => {
      if (onCheckedChange) {
        onCheckedChange(isChecked);
      }
      if (onChange) {
        onChange(e, isChecked);
      }
    };

    return (
      <MuiCheckbox
        ref={ref}
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        size="small"
        sx={{
          color: studioTokens.borderDefault,
          p: 0.5,
          "&.Mui-checked": {
            color: studioTokens.primary,
          },
          "&.Mui-disabled": {
            color: studioTokens.borderDisabled,
          },
          ...sx,
        }}
        {...props}
      />
    );
  }
);

Checkbox.displayName = "Checkbox";
