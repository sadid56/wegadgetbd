"use client";

import { useState, type ElementType } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { IconButton } from "@/components/ui/icon-button";
import { Avatar } from "@/components/ui/avatar";
import { Menu, MenuItem } from "@/components/ui/menu";
import { Divider } from "@/components/ui/divider";

import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";

import { useSession, signOut } from "@/lib/auth-client";
import { useCart } from "@/hooks/useCart";
import { tokens } from "@/theme/theme";

const badgeSx = {
  px: 0.9,
  py: 0.15,
  borderRadius: `${tokens.radiusPill}px`,
  bgcolor: tokens.primarySubtle,
  color: tokens.primary,
  fontSize: 11,
  fontWeight: 700,
};

type DropdownItem = {
  label: string;
  href: string;
  Icon: ElementType;
  accent?: boolean;
  badge?: number;
};

export function NavbarUserDropdown() {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const { data: sessionData } = useSession();
  const { totalCount } = useCart();
  const user = sessionData?.user as
    | { name?: string; email?: string; image?: string | null; role?: string }
    | undefined;

  const handleNavigate = (href: string) => {
    setAnchorEl(null);
    router.push(href);
  };

  const handleSignOut = async () => {
    setAnchorEl(null);
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  if (!user) {
    return (
      <IconButton
        component={NextLink}
        href="/auth/sign-in"
        sx={{
          color: "rgba(255, 255, 255, 0.85)",
          p: 1,
          "&:hover": { color: tokens.textWhite, bgcolor: "rgba(255, 255, 255, 0.08)" },
        }}
        aria-label="Account"
      >
        <PersonOutlineOutlinedIcon sx={{ fontSize: 22 }} />
      </IconButton>
    );
  }

  const isAdmin = user.role === "ADMIN";

  const menuItems: DropdownItem[] = [
    ...(isAdmin
      ? [{ label: "Admin Dashboard", href: "/admin", Icon: DashboardOutlinedIcon, accent: true }]
      : []),
    { label: "My Shopping Bag", href: "/cart", Icon: ShoppingBagOutlinedIcon, badge: totalCount },
    { label: "Browse All Gadgets", href: "/products", Icon: StorefrontOutlinedIcon },
    { label: "Help & Support", href: "/contact-us", Icon: SupportAgentOutlinedIcon },
  ];

  return (
    <>
      <IconButton
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{ p: 0.5 }}
        aria-label="User profile"
      >
        <Avatar
          src={user.image || undefined}
          alt={user.name || "User"}
          sx={{
            width: 34,
            height: 34,
            bgcolor: tokens.primary,
            color: tokens.textWhite,
            fontSize: 13.5,
            fontWeight: 700,
            border: "2px solid rgba(52, 211, 153, 0.35)",
          }}
        >
          {user.name?.charAt(0).toUpperCase() || "U"}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: { sx: { width: 280 } },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            bgcolor: tokens.bgSubtle,
            border: `1px solid ${tokens.borderSubtle}`,
            borderRadius: `${tokens.radiusMd}px`,
            p: 2,
            mb: 1,
          }}
        >
          <Avatar
            src={user.image || undefined}
            alt={user.name || "User"}
            sx={{
              width: 52,
              height: 52,
              bgcolor: tokens.primary,
              color: tokens.textWhite,
              fontSize: 20,
              fontWeight: 800,
              mb: 1,
              boxShadow: `0 0 0 3px ${tokens.bgPanel}, 0 0 0 5px ${tokens.primaryBorder}`,
            }}
          >
            {user.name?.charAt(0).toUpperCase() || "U"}
          </Avatar>

          <Typography sx={{ fontWeight: 700, fontSize: 15, color: tokens.textPrimary, lineHeight: 1.3 }}>
            {user.name || "Account"}
          </Typography>

          <Typography
            sx={{
              fontSize: 12.5,
              color: tokens.textMuted,
              mb: isAdmin ? 1 : 0,
              wordBreak: "break-all",
            }}
          >
            {user.email}
          </Typography>

          {isAdmin && (
            <Box
              sx={{
                px: 1.25,
                py: 0.25,
                borderRadius: `${tokens.radiusPill}px`,
                bgcolor: tokens.primarySubtle,
                color: tokens.primaryHover,
                border: `1px solid ${tokens.primaryBorder}`,
                fontSize: 10.5,
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              Administrator
            </Box>
          )}
        </Box>

        {menuItems.map(({ label, href, Icon, accent, badge }) => (
          <MenuItem
            key={label}
            variant={accent ? "accent" : "default"}
            onClick={() => handleNavigate(href)}
          >
            <Icon />
            <Box sx={{ flex: 1 }}>{label}</Box>
            {badge !== undefined && badge > 0 && (
              <Box component="span" sx={badgeSx}>
                {badge}
              </Box>
            )}
          </MenuItem>
        ))}

        <Divider sx={{ my: 0.75, borderColor: tokens.borderDefault }} />

        <MenuItem variant="danger" onClick={handleSignOut}>
          <LogoutIcon />
          Sign Out
        </MenuItem>
      </Menu>
    </>
  );
}

export default NavbarUserDropdown;