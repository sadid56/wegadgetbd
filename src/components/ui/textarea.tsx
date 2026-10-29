import React from "react";
import { Box, Stack, Typography, TextField, type TextFieldProps, type SxProps, type Theme } from "@mui/material";
import { tokens } from "../../theme/theme";

export interface TextareaProps extends Omit<TextFieldProps, "variant"> {
  label?: string;
  labelIcon?: React.ReactNode;
  headerRight?: React.ReactNode;
  containerSx?: SxProps<Theme>;
}

export const Textarea = React.forwardRef<HTMLDivElement, TextareaProps>(
  (
    {
      label,
      labelIcon,
      headerRight,
      containerSx,
      fullWidth = true,
      minRows = 3,
      placeholder,
      value,
      onChange,
      disabled,
      error,
      helperText,
      sx,
      ...rest
    },
    ref
  ) => {
    return (
      <Box sx={{ width: fullWidth ? "100%" : "auto", ...containerSx }}>
        {(label || headerRight) && (
          <Stack
            direction='row'
            spacing={1}
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
              mb: 0.8,
            }}
          >
            {label && (
              <Stack direction='row' spacing={1} sx={{ alignItems: "center" }}>
                {labelIcon}
                <Typography variant='body2' sx={{ fontWeight: 700, color: tokens.textPrimary }}>
                  {label}
                </Typography>
              </Stack>
            )}
            {headerRight}
          </Stack>
        )}

        <TextField
          ref={ref}
          multiline
          minRows={minRows}
          fullWidth={fullWidth}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          error={error}
          helperText={helperText}
          variant='outlined'
          sx={{
            "& .MuiInputBase-root": {
              bgcolor: tokens.bgInput,
              color: tokens.textPrimary,
              borderRadius: `${tokens.radiusMd}px`,
              fontSize: "0.88rem",
              border: `1px solid ${error ? tokens.error : tokens.borderDefault}`,
              transition: "border-color 0.15s ease",
              "&:hover": {
                borderColor: error ? tokens.error : tokens.borderHover,
              },
              "&.Mui-focused": {
                borderColor: error ? tokens.error : tokens.primary,
              },
            },
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
            "& .MuiInputBase-input": {
              "&::placeholder": {
                color: tokens.textMuted,
                opacity: 1,
              },
            },
            ...sx,
          }}
          {...rest}
        />
      </Box>
    );
  }
);

Textarea.displayName = "Textarea";
