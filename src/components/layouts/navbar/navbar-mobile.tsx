"use client";

import NextLink from "next/link";
import Box from "@mui/material/Box";
import { IconButton } from "@/components/ui/icon-button";
import { Divider } from "@/components/ui/divider";
import { Drawer } from "@/components/ui/drawer";
import CloseIcon from "@mui/icons-material/Close";

import { tokens } from "@/theme/theme";
import { BrandLogo } from "@/components/common/BrandLogo";

export interface NavLinkItem {
  name: string;
  href: string;
}

export interface NavbarMobileProps {
  open: boolean;
  onClose: () => void;
  links: NavLinkItem[];
}

export function NavbarMobile({ open, onClose, links }: NavbarMobileProps) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: "82%",
            maxWidth: 320,
            bgcolor: tokens.bgDark,
            color: tokens.textWhite,
            p: 3,
            borderLeft: `1px solid ${tokens.borderDark}`,
          },
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <BrandLogo variant="dark" size="sm" href="/" />
        <IconButton onClick={onClose} sx={{ color: tokens.textWhite }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ borderColor: tokens.borderDark, mb: 2 }} />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {links.map((link) => (
          <Box
            key={link.name}
            component={NextLink}
            href={link.href}
            onClick={onClose}
            sx={{
              textDecoration: "none",
              color: tokens.textWhite,
              fontSize: 16,
              fontWeight: 500,
              py: 1,
              borderBottom: `1px solid ${tokens.borderDark}`,
            }}
          >
            {link.name}
          </Box>
        ))}
      </Box>
    </Drawer>
  );
}

export default NavbarMobile;

