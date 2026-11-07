"use client";

import * as React from "react";
import { Switch as MuiSwitch, type SwitchProps as MuiSwitchProps } from "@mui/material";
import { tokens } from "@/theme/theme";

export interface SwitchProps extends Omit<MuiSwitchProps, "onChange"> {
  onCheckedChange?: (checked: boolean) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
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
      <MuiSwitch
        ref={ref}
        checked={Boolean(checked)}
        disabled={disabled}
        onChange={handleChange}
        sx={{
          width: 52,
          height: 32,
          padding: 0,
          display: "inline-flex",
          alignItems: "center",
          "& .MuiSwitch-switchBase": {
            padding: "4px !important",
            margin: "0 !important",
            transition: "transform 200ms cubic-bezier(0.2, 0, 0, 1)",
            "&.Mui-checked": {
              transform: "translateX(20px) !important",
              color: "#ffffff !important",
              "& .MuiSwitch-thumb": {
                width: "24px !important",
                height: "24px !important",
                backgroundColor: "#ffffff !important",
              },
              "& + .MuiSwitch-track": {
                opacity: "1 !important",
                backgroundColor: `${tokens.primary} !important`,
                borderColor: `${tokens.primary} !important`,
              },
            },
            "&.Mui-disabled": {
              opacity: 0.5,
              "& + .MuiSwitch-track": {
                opacity: 0.38,
              },
            },
          },
          "& .MuiSwitch-thumb": {
            width: "18px !important",
            height: "18px !important",
            boxSizing: "border-box",
            borderRadius: "50% !important",
            backgroundColor: `${tokens.outline} !important`,
            boxShadow: tokens.elevation1,
            transition: "all 200ms cubic-bezier(0.2, 0, 0, 1)",
          },
          "& .MuiSwitch-track": {
            borderRadius: "16px !important",
            opacity: "1 !important",
            backgroundColor: `${tokens.bgSurfaceContainerHighest} !important`,
            border: `2px solid ${tokens.outlineVariant} !important`,
            boxSizing: "border-box",
            transition: "all 200ms cubic-bezier(0.2, 0, 0, 1)",
          },
          ...sx,
        }}
        {...props}
      />
    );
  }
);

Switch.displayName = "Switch";
