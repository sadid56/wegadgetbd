"use client";

import * as React from "react";
import { Switch as MuiSwitch, type SwitchProps as MuiSwitchProps } from "@mui/material";
import { studioTokens } from "@/theme/theme";

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
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        sx={{
          width: 44,
          height: 24,
          padding: 0,
          display: "flex",
          "&:active": {
            "& .MuiSwitch-thumb": {
              width: 18,
            },
            "& .MuiSwitch-switchBase.Mui-checked": {
              transform: "translateX(16px)",
            },
          },
          "& .MuiSwitch-switchBase": {
            padding: 2,
            "&.Mui-checked": {
              transform: "translateX(20px)",
              color: studioTokens.bgCanvas,
              "& + .MuiSwitch-track": {
                opacity: 1,
                backgroundColor: studioTokens.primary,
              },
            },
          },
          "& .MuiSwitch-thumb": {
            boxShadow: studioTokens.shadowSm,
            width: 20,
            height: 20,
            borderRadius: 10,
            transition: "width 0.2s",
            backgroundColor: "#fff",
          },
          "& .MuiSwitch-track": {
            borderRadius: 12,
            opacity: 1,
            backgroundColor: studioTokens.bgSubtle,
            boxSizing: "border-box",
          },
          ...sx,
        }}
        {...props}
      />
    );
  }
);

Switch.displayName = "Switch";
