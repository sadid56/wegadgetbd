"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/routing";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import { IconButton } from "@/components/ui/icon-button";
import { Divider } from "@/components/ui/divider";
import { Drawer } from "@/components/ui/drawer";
import CloseIcon from "@mui/icons-material/Close";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import DevicesOtherRoundedIcon from "@mui/icons-material/DevicesOtherRounded";

import { tokens } from "@/theme/theme";
import { BrandLogo } from "@/components/common/BrandLogo";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { getAssetUrl } from "@/lib/storage";

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
  links: NavLinkItem[];
  categories?: NavbarMobileCategory[];
}

export function NavbarMobile({ open, onClose, links, categories = [] }: NavbarMobileProps) {
  const [categoriesOpen, setCategoriesOpen] = useState(true);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: "86%",
            maxWidth: 340,
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
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
        <BrandLogo variant="dark" size="sm" href="/" />
        <IconButton onClick={onClose} sx={{ color: tokens.textWhite }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)", mb: 2 }} />

      <Box sx={{ overflowY: "auto", flex: 1, pr: 0.5 }}>
        {/* Navigation Links */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
          {links.map((link) => {
            const Icon = link.Icon;
            return (
              <Box
                key={link.name}
                component={Link}
                href={link.href}
                onClick={onClose}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  textDecoration: "none",
                  color: "rgba(255, 255, 255, 0.9)",
                  fontSize: 15,
                  fontWeight: 600,
                  py: 1,
                  px: 1.5,
                  borderRadius: "10px",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: "rgba(0, 191, 166, 0.12)",
                    color: tokens.primary,
                  },
                }}
              >
                {Icon && <Icon sx={{ fontSize: 20, color: tokens.primary }} />}
                {link.name}
              </Box>
            );
          })}
        </Box>

        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)", my: 2 }} />

        {/* Categories Section */}
        <Box sx={{ mb: 2 }}>
          <Box
            onClick={() => setCategoriesOpen(!categoriesOpen)}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              py: 1,
              px: 1.5,
              borderRadius: "10px",
              cursor: "pointer",
              bgcolor: "rgba(0, 191, 166, 0.1)",
              border: "1px solid rgba(0, 191, 166, 0.25)",
              color: tokens.textWhite,
              mb: 1.5,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
              <GridViewRoundedIcon sx={{ fontSize: 18, color: tokens.primary }} />
              <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                Categories
              </Typography>
            </Box>
            {categoriesOpen ? (
              <ExpandLessRoundedIcon sx={{ fontSize: 20, color: tokens.primary }} />
            ) : (
              <ExpandMoreRoundedIcon sx={{ fontSize: 20, color: tokens.primary }} />
            )}
          </Box>

          <Collapse in={categoriesOpen}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, pl: 0.5 }}>
              {categories.map((cat) => {
                const iconUrl = cat.icon ? getAssetUrl(cat.icon) : null;
                return (
                  <Box
                    key={cat.slug}
                    component={Link}
                    href={`/products?category=${cat.slug}`}
                    onClick={onClose}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      p: "8px 12px",
                      borderRadius: "12px",
                      textDecoration: "none",
                      color: "rgba(255, 255, 255, 0.85)",
                      bgcolor: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor: "rgba(0, 191, 166, 0.15)",
                        borderColor: "rgba(0, 191, 166, 0.3)",
                        color: tokens.textWhite,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 34,
                        height: 34,
                        minWidth: 34,
                        borderRadius: "8px",
                        bgcolor: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        p: 0.5,
                        overflow: "hidden",
                      }}
                    >
                      {iconUrl ? (
                        <Box
                          component="img"
                          src={iconUrl}
                          alt={cat.name}
                          sx={{ width: "100%", height: "100%", objectFit: "contain" }}
                        />
                      ) : (
                        <DevicesOtherRoundedIcon sx={{ fontSize: 18, color: tokens.primary }} />
                      )}
                    </Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 500, lineHeight: 1.3 }}>
                      {cat.name}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Collapse>
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
