import React from "react";
import {
  Box,
  Stack,
  Typography,
  TextField as MuiTextField,
  InputBase as MuiInputBase,
  InputAdornment as MuiInputAdornment,
  type TextFieldProps as MuiTextFieldProps,
  type InputBaseProps as MuiInputBaseProps,
  type InputAdornmentProps as MuiInputAdornmentProps,
  type SxProps,
  type Theme,
} from "@mui/material";
import { tokens } from "../../theme/theme";

export type TextFieldProps = MuiTextFieldProps;
export type InputBaseProps = MuiInputBaseProps;
export type InputAdornmentProps = MuiInputAdornmentProps;

export const InputAdornment = MuiInputAdornment;

export const InputBase = React.forwardRef<HTMLDivElement, InputBaseProps>(function InputBase(
  { sx, ...props },
  ref
) {
  return (
    <MuiInputBase
      ref={ref}
      sx={[
        {
          color: tokens.textPrimary,
          fontSize: "0.875rem",
          "& input::placeholder, & textarea::placeholder": {
            color: tokens.textMuted,
            opacity: 1,
          },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      {...props}
    />
  );
});

export const TextField = React.forwardRef<HTMLDivElement, TextFieldProps>(function TextField(
  { sx, size = "small", ...props },
  ref
) {
  return (
    <MuiTextField
      ref={ref}
      size={size}
      sx={[
        {
          "& .MuiOutlinedInput-root": {
            bgcolor: tokens.bgInput,
            color: tokens.textPrimary,
            borderRadius: `${tokens.radiusMd}px`,
            fontSize: "0.875rem",
            "& fieldset": {
              borderColor: tokens.borderDefault,
            },
            "&:hover fieldset": {
              borderColor: tokens.borderHover,
            },
            "&.Mui-focused fieldset": {
              borderColor: tokens.primary,
            },
          },
          "& .MuiInputLabel-root": {
            color: tokens.textSecondary,
            "&.Mui-focused": {
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

export interface InputProps extends Omit<MuiTextFieldProps, "variant"> {
  label?: string;
  labelIcon?: React.ReactNode;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  headerRight?: React.ReactNode;
  containerSx?: SxProps<Theme>;
}

export const Input = React.forwardRef<any, InputProps>(function Input(
  {
    label,
    labelIcon,
    startIcon,
    endIcon,
    headerRight,
    containerSx,
    fullWidth = true,
    size = "small",
    placeholder,
    value,
    onChange,
    disabled,
    error,
    helperText,
    sx,
    inputRef,
    ...rest
  },
  ref
) {
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
              <Typography variant='body2' sx={{ fontWeight: 600, fontSize: "0.86rem", color: tokens.textPrimary }}>
                {label}
              </Typography>
            </Stack>
          )}
          {headerRight}
        </Stack>
      )}

      <MuiTextField
        inputRef={inputRef || ref}
        fullWidth={fullWidth}
        size={size}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        error={error}
        helperText={helperText}
        variant='outlined'
        slotProps={{
          input: {
            startAdornment: startIcon ? <MuiInputAdornment position='start'>{startIcon}</MuiInputAdornment> : undefined,
            endAdornment: endIcon ? <MuiInputAdornment position='end'>{endIcon}</MuiInputAdornment> : undefined,
          },
        }}
        sx={{
          "& .MuiInputBase-root": {
            bgcolor: tokens.bgInput,
            color: tokens.textPrimary,
            borderRadius: `${tokens.radiusMd}px`,
            fontSize: "0.88rem",
            border: `1px solid ${error ? tokens.error : tokens.borderDefault}`,
            transition: "all 0.15s ease",
            overflow: "hidden",
            "&:hover": {
              borderColor: error ? tokens.error : tokens.borderHover,
            },
            "&.Mui-focused": {
              borderColor: error ? tokens.error : tokens.primary,
              boxShadow: error ? `0 0 0 3px ${tokens.dangerSubtle}` : `0 0 0 3px ${tokens.primarySubtle}`,
            },
          },
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          "& .MuiInputBase-input": {
            py: 1,
            background: "transparent !important",
            backgroundColor: "transparent !important",
            "&::placeholder": {
              color: tokens.textMuted,
              opacity: 1,
            },
            "&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus, &:-webkit-autofill:active, &:autofill, &:autofill:hover, &:autofill:focus, &:autofill:active": {
              WebkitBoxShadow: `0 0 0 1000px ${tokens.bgInput} inset !important`,
              boxShadow: `0 0 0 1000px ${tokens.bgInput} inset !important`,
              WebkitTextFillColor: `${tokens.textPrimary} !important`,
              caretColor: `${tokens.textPrimary} !important`,
              transition: "background-color 5000s ease-in-out 0s",
              borderRadius: "inherit",
            },
          },
          "& .MuiFormHelperText-root": {
            mx: 0.5,
            mt: 0.5,
            fontSize: "0.74rem",
            color: error ? tokens.error : tokens.textMuted,
          },
          ...sx,
        }}
        {...rest}
      />
    </Box>
  );
});

Input.displayName = "Input";
export default Input;
