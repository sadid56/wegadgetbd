"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ButtonBase from "@mui/material/ButtonBase";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { type SxProps, type Theme } from "@mui/material/styles";
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

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function isSameDay(d1?: Date | null, d2?: Date | null) {
  if (!d1 || !d2) return false;
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function Calendar({
  selected,
  onSelect,
  sx,
  disabled,
}: CalendarProps) {
  const initialDate = Array.isArray(selected) ? selected[0] ?? new Date() : selected ?? new Date();
  const [currentMonth, setCurrentMonth] = React.useState(
    new Date(initialDate.getFullYear(), initialDate.getMonth(), 1),
  );

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const days: { date: Date; isCurrentMonth: boolean }[] = [];

  // Previous month trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, month - 1, daysInPrevMonth - i),
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: new Date(year, month, i),
      isCurrentMonth: true,
    });
  }

  // Next month leading days (fill to multiple of 7)
  const remaining = 42 - days.length;
  for (let i = 1; i <= (remaining >= 7 ? remaining - 7 : remaining); i++) {
    days.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false,
    });
  }

  const monthLabel = currentMonth.toLocaleString("default", { month: "long", year: "numeric" });
  const today = new Date();

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: `${tokens.radiusMd}px`,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        width: "fit-content",
        userSelect: "none",
        ...sx,
      }}
    >
      {/* Month Navigation Header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: "text.primary" }}>{monthLabel}</Typography>
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <IconButton size='small' onClick={prevMonth} sx={{ p: 0.5, color: "text.secondary" }}>
            <ChevronLeftIcon sx={{ fontSize: 20 }} />
          </IconButton>
          <IconButton size='small' onClick={nextMonth} sx={{ p: 0.5, color: "text.secondary" }}>
            <ChevronRightIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>
      </Box>

      {/* Weekdays Row */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 36px)", gap: 0.5, mb: 1, textAlign: "center" }}>
        {WEEKDAYS.map((w) => (
          <Typography
            key={w}
            variant='caption'
            sx={{
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "text.disabled",
              lineHeight: "24px",
            }}
          >
            {w}
          </Typography>
        ))}
      </Box>

      {/* Days Grid */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 36px)", gap: 0.5 }}>
        {days.map(({ date, isCurrentMonth }, idx) => {
          const isSelected = Array.isArray(selected) ? selected.some((s) => isSameDay(s, date)) : isSameDay(selected, date);

          const isToday = isSameDay(date, today);
          const isDisabled = disabled ? disabled(date) : false;

          return (
            <ButtonBase
              key={idx}
              disabled={isDisabled}
              onClick={() => {
                if (!isDisabled) {
                  onSelect?.(date);
                }
              }}
              sx={{
                width: 36,
                height: 36,
                borderRadius: `${tokens.radiusSm}px`,
                fontSize: "0.82rem",
                fontWeight: isSelected || isToday ? 700 : 500,
                color: isSelected ? tokens.textWhite : !isCurrentMonth ? "text.disabled" : isToday ? "primary.main" : "text.primary",
                bgcolor: isSelected ? "primary.main" : isToday ? "action.hover" : "transparent",
                border: isToday && !isSelected ? "1px solid" : "none",
                borderColor: isToday && !isSelected ? "primary.main" : "transparent",
                opacity: isDisabled ? 0.35 : 1,
                transition: "all 0.15s ease",
                "&:hover": {
                  bgcolor: isSelected ? "primary.dark" : "action.hover",
                },
              }}
            >
              {date.getDate()}
            </ButtonBase>
          );
        })}
      </Box>
    </Box>
  );
}
