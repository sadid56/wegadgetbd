"use client";

import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useLocale } from "next-intl";
import { useTransition } from "react";

import { MenuItem, Select } from "@/components/ui/select";
import { LOCALES, LOCALE_MAP, type Locale } from "@/i18n/config";
import { usePathname, useRouter } from "@/i18n/routing";
import { tokens } from "@/theme/theme";

export interface LanguageSwitcherProps {
  variant?: "footer" | "navbar" | "inline";
  showIcon?: boolean;
}

export function LanguageSwitcher({
  variant = "footer",
  showIcon = true,
}: LanguageSwitcherProps) {
  const currentLocale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLocaleChange = (newLocale: string) => {
    if (newLocale === currentLocale) return;
    startTransition(() => {
      router.replace(pathname, { locale: newLocale as Locale });
    });
  };

  const isFooter = variant === "footer";

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
        opacity: isPending ? 0.6 : 1,
        transition: "opacity 0.2s ease",
      }}
    >
      <Select
        size="small"
        value={currentLocale || "en"}
        onChange={(e) => handleLocaleChange(String(e.target.value))}
        IconComponent={KeyboardArrowDownRoundedIcon}
        aria-label="Language selector"
        sx={{
          height: isFooter ? 34 : 36,
          minWidth: isFooter ? 115 : 120,
          borderRadius: "999px",
          bgcolor: isFooter ? "#16222F" : "#FFFFFF",
          color: isFooter ? "#FFFFFF" : tokens.textPrimary,
          fontSize: "0.8125rem",
          fontWeight: 600,
          "& .MuiSelect-select": {
            display: "flex",
            alignItems: "center",
            gap: 1,
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: isFooter
              ? "rgba(0, 191, 166, 0.3)"
              : tokens.borderDefault,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: tokens.primary,
          },
          "& .MuiSelect-icon": {
            color: isFooter ? tokens.primary : tokens.textSecondary,
            fontSize: 18,
          },
        }}
      >
        {LOCALES.map((code) => {
          const item = LOCALE_MAP[code];
          return (
            <MenuItem
              key={code}
              value={code}
              sx={{
                fontSize: "0.8125rem",
                fontWeight: currentLocale === code ? 700 : 500,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <span>{item.flag}</span>
              <Typography
                component="span"
                sx={{ fontSize: "0.8125rem", fontWeight: "inherit" }}
              >
                {item.nativeName}
              </Typography>
            </MenuItem>
          );
        })}
      </Select>
    </Box>
  );
}

export default LanguageSwitcher;
