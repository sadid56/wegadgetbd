"use client";

import * as React from "react";
import MuiSlider, { type SliderProps as MuiSliderProps } from "@mui/material/Slider";
import { tokens } from "@/theme/theme";

export type SliderProps = MuiSliderProps;

export const Slider = React.forwardRef<HTMLSpanElement, SliderProps>(function Slider(
  { sx, ...props },
  ref
) {
  return (
    <MuiSlider
      ref={ref}
      sx={[
        {
          color: tokens.primary,
          height: 5,
          padding: "13px 0",
          "& .MuiSlider-thumb": {
            height: 18,
            width: 18,
            backgroundColor: tokens.bgPanel,
            border: `2px solid ${tokens.primary}`,
            boxShadow: tokens.shadowSm,
            "&:hover": {
              boxShadow: `0 0 0 6px ${tokens.primaryLight}`,
            },
            "&.Mui-focusVisible": {
              boxShadow: `0 0 0 8px ${tokens.primaryLight}`,
            },
            "&.Mui-active": {
              boxShadow: `0 0 0 10px ${tokens.primaryLight}`,
            },
          },
          "& .MuiSlider-track": {
            height: 5,
            borderRadius: 3,
            backgroundColor: tokens.primary,
            border: "none",
          },
          "& .MuiSlider-rail": {
            height: 5,
            borderRadius: 3,
            opacity: 1,
            backgroundColor: tokens.borderDefault,
          },
          "& .MuiSlider-valueLabel": {
            lineHeight: 1.2,
            fontSize: 12,
            background: "unset",
            padding: 0,
            width: 32,
            height: 32,
            borderRadius: "50% 50% 50% 0",
            backgroundColor: tokens.bgDark,
            color: tokens.textWhite,
            transformOrigin: "bottom left",
            transform: "translate(50%, -100%) rotate(-45deg) scale(0)",
            "&::before": { display: "none" },
            "&.MuiSlider-valueLabelOpen": {
              transform: "translate(50%, -100%) rotate(-45deg) scale(1)",
            },
            "& > *": {
              transform: "rotate(45deg)",
            },
          },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      {...props}
    />
  );
});

export default Slider;

