"use client";

import React, { useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import { IconButton } from "@/components/ui/icon-button";
import { Divider } from "@/components/ui/divider";
import { Drawer } from "@/components/ui/drawer";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

import { tokens } from "@/theme/theme";
import { BrandLogo } from "@/components/common/BrandLogo";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { NAV_CATEGORIES, type NavCategoryItem } from "./nav-data";

export interface NavLinkItem {
  name: string;
  href: string;
  Icon?: React.ElementType;
}

export interface NavbarMobileCategory {
  name: string;
  slug: string;
  icon?: string | null;
}

export interface NavbarMobileProps {
  open: boolean;
  onClose: () => void;
  links?: NavLinkItem[];
  categories?: NavbarMobileCategory[];
}

export function NavbarMobile({ open, onClose }: NavbarMobileProps) {
  const locale = useLocale();
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);

  const toggleCategory = (id: string) => {
    setExpandedCategoryId((prev) => (prev === id ? null : id));
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: "88%",
            maxWidth: 360,
            bgcolor: "#0b151a",
            color: tokens.textWhite,
            p: 2.5,
            borderLeft: "1px solid rgba(0, 191, 166, 0.2)",
            display: "flex",
            flexDirection: "column",
          },
        },
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <BrandLogo variant="dark" size="sm" href="/" />
        <IconButton onClick={onClose} sx={{ color: tokens.textWhite }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)", mb: 2 }} />

      {/* Categories with Expandable Sub-items */}
      <Box sx={{ overflowY: "auto", flex: 1, pr: 0.5 }}>
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 700,
            color: tokens.primary,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            mb: 1.5,
            px: 0.5,
          }}
        >
          {locale === "bn" ? "গ্যাজেট কালেকশন" : "Gadget Collections"}
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {NAV_CATEGORIES.map((category) => {
            const isExpanded = expandedCategoryId === category.id;
            const displayName = locale === "bn" ? category.nameBn : category.name;
            const subCategories = category.subCategories || [];

            return (
              <Box
                key={category.id}
                sx={{
                  borderRadius: "12px",
                  bgcolor: isExpanded ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.02)",
                  border: `1px solid ${isExpanded ? "rgba(0, 191, 166, 0.3)" : "rgba(255, 255, 255, 0.06)"}`,
                  overflow: "hidden",
                  transition: "all 0.2s ease",
                }}
              >
                {/* Category Header Row */}
                <Box
                  onClick={() => toggleCategory(category.id)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: "11px 14px",
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.03)",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: isExpanded ? tokens.primary : tokens.textWhite,
                    }}
                  >
                    {displayName}
                  </Typography>

                  {isExpanded ? (
                    <ExpandLessRoundedIcon sx={{ fontSize: 20, color: tokens.primary }} />
                  ) : (
                    <ExpandMoreRoundedIcon sx={{ fontSize: 20, color: "rgba(255, 255, 255, 0.5)" }} />
                  )}
                </Box>

                {/* Subcategories Accordion Content */}
                <Collapse in={isExpanded}>
                  <Box
                    sx={{
                      p: "6px 14px 14px",
                      borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 1.5,
                    }}
                  >
                    {subCategories.map((sub) => (
                      <Box key={sub.id}>
                        <Box
                          component={Link}
                          href={sub.href}
                          onClick={onClose}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            textDecoration: "none",
                            mb: 0.75,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: 11.5,
                              fontWeight: 700,
                              color: tokens.primary,
                              textTransform: "uppercase",
                              letterSpacing: "0.04em",
                            }}
                          >
                            {locale === "bn" && sub.nameBn ? sub.nameBn : sub.name}
                          </Typography>
                          <ArrowForwardRoundedIcon sx={{ fontSize: 12, color: tokens.primary }} />
                        </Box>

                        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.4 }}>
                          {sub.items.map((item) => (
                            <Box
                              key={item.title}
                              component={Link}
                              href={item.href}
                              onClick={onClose}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                py: 0.5,
                                px: 1,
                                borderRadius: "6px",
                                textDecoration: "none",
                                color: "rgba(255, 255, 255, 0.8)",
                                fontSize: 13,
                                transition: "all 0.15s ease",
                                "&:hover": {
                                  bgcolor: "rgba(0, 191, 166, 0.12)",
                                  color: tokens.textWhite,
                                },
                              }}
                            >
                              <span>{item.title}</span>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    ))}

                    <Box
                      component={Link}
                      href={category.href}
                      onClick={onClose}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.75,
                        pt: 1,
                        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                        color: tokens.primary,
                        fontSize: 12.5,
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      <span>Explore All {displayName} →</span>
                    </Box>
                  </Box>
                </Collapse>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Language Switcher in Mobile Drawer */}
      <Box
        sx={{
          pt: 2,
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography sx={{ fontSize: "0.8125rem", color: "rgba(255, 255, 255, 0.7)", fontWeight: 500 }}>
          Language / ভাষা
        </Typography>
        <LanguageSwitcher variant="footer" showIcon={false} />
      </Box>
    </Drawer>
  );
}

export default NavbarMobile;
