"use client";

import { useState, type ElementType } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { IconButton } from "@/components/ui/icon-button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Menu from "@mui/material/Menu";
import { MenuItem } from "@/components/ui/select";
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

type DropdownItem = {
  label: string;
  href: string;
  Icon: ElementType;
  accent?: boolean;
  badge?: number;
};

export function NavbarUserDropdown() {
  const t = useTranslations("navbar");
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
        component={Link}
        href="/auth/sign-in"
        sx={{
          color: "#0F172A",
          p: 1,
          borderRadius: "50%",
          bgcolor: "rgba(15, 23, 42, 0.04)",
          border: "1px solid rgba(15, 23, 42, 0.06)",
          transition: "all 0.2s ease",
          "&:hover": {
            color: tokens.primary,
            bgcolor: "rgba(0, 191, 166, 0.1)",
            borderColor: "rgba(0, 191, 166, 0.25)",
          },
        }}
        aria-label={t("login")}
      >
        <PersonOutlineOutlinedIcon sx={{ fontSize: 20 }} />
      </IconButton>
    );
  }

  const isAdmin = user.role === "ADMIN";

  const menuItems: DropdownItem[] = [
    ...(isAdmin
      ? [{ label: t("adminDashboard"), href: "/admin", Icon: DashboardOutlinedIcon, accent: true }]
      : []),
    { label: t("cart"), href: "/cart", Icon: ShoppingBagOutlinedIcon, badge: totalCount },
    { label: t("products"), href: "/products", Icon: StorefrontOutlinedIcon },
    { label: t("about"), href: "/about", Icon: SupportAgentOutlinedIcon },
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
        disableScrollLock
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
            <Badge variant="default" size="small">
              Administrator
            </Badge>
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
              <Badge variant="default" size="small">
                {badge}
              </Badge>
            )}
          </MenuItem>
        ))}

        <Divider sx={{ my: 0.75, borderColor: tokens.borderDefault }} />

        <MenuItem variant="danger" onClick={handleSignOut}>
          <LogoutIcon />
          {t("logout")}
        </MenuItem>
      </Menu>
    </>
  );
}

export default NavbarUserDropdown;