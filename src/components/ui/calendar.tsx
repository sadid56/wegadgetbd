"use client";

import * as React from "react";
import dayjs, { type Dayjs } from "dayjs";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { type SxProps, type Theme } from "@mui/material/styles";
import { format } from "date-fns";
import { TextField, InputAdornment } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, MenuItem } from "@/components/ui/select";
import { tokens } from "@/theme/theme";

export interface CalendarProps {
  mode?: "single" | "multiple" | "range";
  selected?: Date | Date[];
  onSelect?: (date: Date | undefined) => void;
  className?: string;
  sx?: SxProps<Theme>;
  showOutsideDays?: boolean;
  disabled?: (date: Date) => boolean;
}

export function Calendar({
  selected,
  onSelect,
  sx,
  disabled,
}: CalendarProps) {
  const selectedDate = Array.isArray(selected) ? selected[0] : selected;
  const dayjsValue: Dayjs | null = selectedDate ? dayjs(selectedDate) : null;

  return (
    <Box
      sx={[
        {
          borderRadius: `${tokens.radiusMd}px`,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          width: "fit-content",
          overflow: "hidden",
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          value={dayjsValue}
          onChange={(newValue) => onSelect?.(newValue ? newValue.toDate() : undefined)}
          shouldDisableDate={disabled ? (day) => disabled(day.toDate()) : undefined}
          sx={{
            width: 300,
            maxHeight: 310,
            "& .MuiPickersDay-root.Mui-selected": {
              bgcolor: tokens.primary,
              color: tokens.onPrimary,
              "&:hover, &:focus": {
                bgcolor: tokens.primaryHover,
              },
            },
          }}
        />
      </LocalizationProvider>
    </Box>
  );
}

export interface DatePickerProps {
  value?: Date | string | null;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  maxDate?: Date;
  minDate?: Date;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  disabled = false,
  maxDate,
  minDate,
}: DatePickerProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const parsedDate = React.useMemo(() => {
    if (!value) return undefined;
    const d = value instanceof Date ? value : new Date(value);
    return Number.isNaN(d.getTime()) ? undefined : d;
  }, [value]);

  const isDateDisabled = (date: Date) => {
    if (maxDate) {
      const maxDay = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
      const curDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      if (curDay > maxDay) return true;
    }
    if (minDate) {
      const minDay = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
      const curDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      if (curDay < minDay) return true;
    }
    return false;
  };

  const displayText = parsedDate ? format(parsedDate, "MMM d, yyyy") : "";

  return (
    <>
      <TextField
        size="small"
        fullWidth
        value={displayText}
        placeholder={placeholder}
        disabled={disabled}
        onClick={(e) => !disabled && setAnchorEl(e.currentTarget)}
        slotProps={{
          input: {
            readOnly: true,
            sx: { cursor: disabled ? "not-allowed" : "pointer" },
            endAdornment: (
              <InputAdornment position="end" sx={{ gap: 0.25 }}>
                {parsedDate && !disabled && (
                  <IconButton
                    size="small"
                    aria-label="Clear date"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange(undefined);
                    }}
                    sx={{ p: 0.35, color: "text.secondary" }}
                  >
                    <CloseIcon sx={{ fontSize: 15 }} />
                  </IconButton>
                )}
                <CalendarTodayOutlinedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              </InputAdornment>
            ),
          },
        }}
      />

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            sx: {
              mt: 0.75,
              borderRadius: `${tokens.radiusLg}px`,
              border: `1px solid ${tokens.borderDefault}`,
              boxShadow: tokens.shadowPopover,
              bgcolor: tokens.bgPanel,
              p: 0.5,
            },
          },
        }}
      >
        <Calendar
          selected={parsedDate}
          disabled={isDateDisabled}
          onSelect={(date) => {
            onChange(date);
            setAnchorEl(null);
          }}
          sx={{ border: "none" }}
        />
      </Popover>
    </>
  );
}

export interface DateTimePickerProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

function toLocalIsoMinute(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function DateTimePicker({
  value = "",
  onChange,
  placeholder = "Select date & time",
  disabled = false,
}: DateTimePickerProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const parsedDate = React.useMemo(() => {
    if (!value) return undefined;
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? undefined : d;
  }, [value]);

  const activeDate = parsedDate ?? new Date();
  const hours = activeDate.getHours();
  const minutes = activeDate.getMinutes();

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    const next = new Date(date);
    next.setHours(parsedDate ? hours : 12, parsedDate ? minutes : 0, 0, 0);
    onChange(toLocalIsoMinute(next));
  };

  const handleTimeChange = (newHours: number, newMinutes: number) => {
    const next = new Date(parsedDate ?? new Date());
    next.setHours(newHours, newMinutes, 0, 0);
    onChange(toLocalIsoMinute(next));
  };

  const displayText = parsedDate ? format(parsedDate, "MMM d, yyyy · hh:mm a") : "";

  return (
    <>
      <TextField
        size="small"
        fullWidth
        value={displayText}
        placeholder={placeholder}
        disabled={disabled}
        onClick={(e) => !disabled && setAnchorEl(e.currentTarget)}
        slotProps={{
          input: {
            readOnly: true,
            sx: { cursor: disabled ? "not-allowed" : "pointer" },
            endAdornment: (
              <InputAdornment position="end" sx={{ gap: 0.25 }}>
                {value && !disabled && (
                  <IconButton
                    size="small"
                    aria-label="Clear date"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange("");
                    }}
                    sx={{ p: 0.35, color: "text.secondary" }}
                  >
                    <CloseIcon sx={{ fontSize: 15 }} />
                  </IconButton>
                )}
                <CalendarTodayOutlinedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              </InputAdornment>
            ),
          },
        }}
      />

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            sx: {
              mt: 0.75,
              borderRadius: `${tokens.radiusLg}px`,
              border: `1px solid ${tokens.borderDefault}`,
              boxShadow: tokens.shadowPopover,
              bgcolor: tokens.bgPanel,
              p: 1,
            },
          },
        }}
      >
        <Calendar
          selected={parsedDate}
          onSelect={handleDateSelect}
          sx={{ border: "none" }}
        />

        {/* Time Selector Row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            pt: 1.25,
            mt: 0.5,
            px: 1,
            pb: 0.5,
            borderTop: `1px solid ${tokens.borderSubtle}`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <Select
              size="small"
              value={hours}
              onChange={(e) => handleTimeChange(Number(e.target.value), minutes)}
              sx={{ minWidth: 68, "& .MuiSelect-select": { py: 0.5, px: 1.25, fontSize: 13 } }}
            >
              {Array.from({ length: 24 }).map((_, h) => (
                <MenuItem key={h} value={h}>
                  {String(h).padStart(2, "0")}
                </MenuItem>
              ))}
            </Select>
            <Typography sx={{ fontWeight: 700, color: tokens.textSecondary }}>:</Typography>
            <Select
              size="small"
              value={minutes}
              onChange={(e) => handleTimeChange(hours, Number(e.target.value))}
              sx={{ minWidth: 68, "& .MuiSelect-select": { py: 0.5, px: 1.25, fontSize: 13 } }}
            >
              {Array.from({ length: 60 }).map((_, m) => (
                <MenuItem key={m} value={m}>
                  {String(m).padStart(2, "0")}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            {value && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onChange("");
                  setAnchorEl(null);
                }}
                sx={{ minHeight: 30, px: 1.25, py: 0.35, fontSize: 12 }}
              >
                Clear
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              onClick={() => setAnchorEl(null)}
              sx={{ minHeight: 30, px: 1.5, py: 0.35, fontSize: 12 }}
            >
              Done
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
}
