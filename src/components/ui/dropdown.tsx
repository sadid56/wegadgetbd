import React from "react";
import { Box, Stack, Typography, Select, MenuItem, type SelectChangeEvent, type SxProps, type Theme } from "@mui/material";
import { tokens } from "../../theme/theme";

export interface DropdownOption<T = string | number> {
  value: T;
  label: React.ReactNode;
  subtitle?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface DropdownProps<T = string | number> {
  value: T;
  onChange: (value: T) => void;
  options: DropdownOption<T>[];
  label?: string;
  icon?: React.ReactNode;
  placeholder?: string;
  truncate?: boolean;
  fullWidth?: boolean;
  size?: "small" | "medium";
  disabled?: boolean;
  headerRight?: React.ReactNode;
  renderValue?: (value: T) => React.ReactNode;
  menuWidth?: number | string | Record<string, number | string>;
  sx?: SxProps<Theme>;
}

export function Dropdown<T extends string | number = string>({
  value,
  onChange,
  options,
  label,
  icon,
  placeholder,
  truncate = true,
  fullWidth = true,
  size = "small",
  disabled = false,
  headerRight,
  renderValue,
  menuWidth = { xs: "calc(100vw - 48px)", sm: 352 },
  sx,
}: DropdownProps<T>) {
  const handleChange = (e: SelectChangeEvent<any>) => {
    onChange(e.target.value as T);
  };

  const defaultRenderValue = (selectedVal: any) => {
    const selectedOption = options.find((opt) => opt.value === selectedVal);
    if (!selectedOption) {
      return (
        <Typography variant='body2' sx={{ color: tokens.textMuted }}>
          {placeholder || "Select..."}
        </Typography>
      );
    }

    if (truncate) {
      return (
        <Typography
          noWrap
          sx={{
            fontSize: "0.86rem",
            fontWeight: 500,
            color: tokens.textPrimary,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            display: "block",
          }}
        >
          {selectedOption.label}
        </Typography>
      );
    }

    return selectedOption.label;
  };

  return (
    <Box sx={{ width: fullWidth ? "100%" : "auto" }}>
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
              {icon}
              <Typography variant='body2' sx={{ fontWeight: 700, color: tokens.textPrimary }}>
                {label}
              </Typography>
            </Stack>
          )}
          {headerRight}
        </Stack>
      )}

      <Select
        fullWidth={fullWidth}
        size={size}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        renderValue={renderValue || defaultRenderValue}
        MenuProps={{
          anchorOrigin: { vertical: "bottom", horizontal: "left" },
          transformOrigin: { vertical: "top", horizontal: "left" },
          slotProps: {
            paper: {
              sx: {
                width: menuWidth,
                boxSizing: "border-box",
                bgcolor: `${tokens.bgElevated} !important`,
                backgroundImage: "none !important",
                border: `1px solid ${tokens.borderElevated} !important`,
                boxShadow: `${tokens.shadowPopover}, 0 0 0 1px ${tokens.borderDefault} !important`,
                borderRadius: `${tokens.radiusLg}px !important`,
                mt: 0.6,
                p: 0.5,
              },
            },
          },
        }}
        sx={{
          bgcolor: tokens.bgInput,
          color: tokens.textPrimary,
          borderRadius: `${tokens.radiusMd}px`,
          fontSize: "0.88rem",
          border: `1px solid ${tokens.borderDefault}`,
          "& .MuiOutlinedInput-notchedOutline": { border: "none" },
          "&:hover": { borderColor: tokens.borderHover },
          "&.Mui-focused": { borderColor: tokens.primary },
          "& .MuiSelect-select": {
            py: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          },
          ...sx,
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={String(option.value)}
            value={option.value as any}
            disabled={option.disabled}
            sx={{
              fontSize: "0.85rem",
              py: option.subtitle ? 1 : 0.8,
              borderRadius: `${tokens.radiusSm}px`,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              display: "block",
              "&:hover": {
                bgcolor: tokens.bgSubtle,
              },
              "&.Mui-selected": {
                bgcolor: `${tokens.primarySubtle} !important`,
                color: `${tokens.primaryLight} !important`,
                "&:hover": {
                  bgcolor: `${tokens.primarySubtle} !important`,
                },
              },
            }}
          >
            <Stack direction='row' spacing={1} sx={{ alignItems: "center", width: "100%" }}>
              {option.icon}
              <Box sx={{ width: "100%", overflow: "hidden" }}>
                <Typography
                  noWrap={truncate}
                  sx={{
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    color: tokens.textPrimary,
                    overflow: truncate ? "hidden" : "visible",
                    textOverflow: truncate ? "ellipsis" : "clip",
                    whiteSpace: truncate ? "nowrap" : "normal",
                    display: "block",
                  }}
                >
                  {option.label}
                </Typography>
                {option.subtitle && (
                  <Typography
                    variant='caption'
                    noWrap={truncate}
                    sx={{
                      color: tokens.textMuted,
                      display: "block",
                      fontSize: "0.72rem",
                      overflow: truncate ? "hidden" : "visible",
                      textOverflow: truncate ? "ellipsis" : "clip",
                      whiteSpace: truncate ? "nowrap" : "normal",
                    }}
                  >
                    {option.subtitle}
                  </Typography>
                )}
              </Box>
            </Stack>
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}
