"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import { MenuItem } from "@/components/ui/select";
import { Divider } from "@/components/ui/divider";
import { Avatar } from "@/components/ui/avatar";
import { CountBadge } from "@/components/ui/badge";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import LogoutIcon from "@mui/icons-material/Logout";

import { useCart } from "@/hooks/useCart";
import { useSession, signOut } from "@/lib/auth-client";
import { tokens } from "@/theme/theme";

function MobileBottomNavContent() {
  const locale = useLocale();
  const isBn = locale === "bn";
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { totalCount } = useCart();
  const { data: sessionData } = useSession();

  const [accountAnchorEl, setAccountAnchorEl] = useState<HTMLElement | null>(null);

  const user = sessionData?.user as
    | { name?: string; email?: string; image?: string | null; role?: string }
    | undefined;

  const isDealsActive =
    pathname.startsWith("/products") &&
    (searchParams.get("onSale") === "true" || searchParams.get("filter") === "offers");
  const isHomeActive = pathname === "/";
  const isShopActive = pathname.startsWith("/products") && !isDealsActive;
  const isCartActive = pathname.startsWith("/cart");
  const isAuthActive = pathname.startsWith("/auth");

  const handleSignOut = async () => {
    setAccountAnchorEl(null);
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  const navItems = [
    {
      key: "home",
      label: isBn ? "হোম" : "Home",
      href: "/",
      active: isHomeActive,
      Icon: isHomeActive ? HomeRoundedIcon : HomeOutlinedIcon,
    },
    {
      key: "shop",
      label: isBn ? "শপ" : "Shop",
      href: "/products",
      active: isShopActive,
      Icon: isShopActive ? StorefrontRoundedIcon : StorefrontOutlinedIcon,
    },
    {
      key: "deals",
      label: isBn ? "অফার" : "Deals",
      href: "/products?onSale=true",
      active: isDealsActive,
      Icon: isDealsActive ? LocalOfferRoundedIcon : LocalOfferOutlinedIcon,
    },
    {
      key: "cart",
      label: isBn ? "কার্ট" : "Cart",
      href: "/cart",
      active: isCartActive,
      Icon: isCartActive ? ShoppingBagRoundedIcon : ShoppingBagOutlinedIcon,
      badge: totalCount,
    },
  ];

  return (
    <>
      <Box
        component="nav"
        aria-label="Mobile Bottom Navigation"
        sx={{
          display: { xs: "flex", md: "none" },
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1150,
          bgcolor: "rgba(255, 255, 255, 0.94)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderTop: `1px solid ${tokens.borderDefault}`,
          boxShadow: "0 -6px 24px rgba(15, 23, 42, 0.06)",
          pb: "env(safe-area-inset-bottom)",
          height: "calc(62px + env(safe-area-inset-bottom))",
          px: 0.75,
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        {navItems.map((item) => {
          const IconComp = item.Icon;
          return (
            <Box
              key={item.key}
              component={Link}
              href={item.href}
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.35,
                py: 0.75,
                textDecoration: "none",
                color: item.active ? tokens.primaryDark : tokens.textSecondary,
                position: "relative",
                transition: "color 150ms ease",
                "&:active": {
                  transform: "scale(0.95)",
                },
              }}
            >
              {item.active && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    width: 24,
                    height: 2.5,
                    borderRadius: "0 0 4px 4px",
                    bgcolor: tokens.primary,
                  }}
                />
              )}

              {item.badge !== undefined && item.badge > 0 ? (
                <CountBadge
                  badgeContent={item.badge}
                  color="primary"
                  sx={{
                    "& .MuiBadge-badge": {
                      fontSize: "0.625rem",
                      height: 16,
                      minWidth: 16,
                      px: 0.5,
                    },
                  }}
                >
                  <IconComp sx={{ fontSize: 22 }} />
                </CountBadge>
              ) : (
                <IconComp sx={{ fontSize: 22 }} />
              )}

              <Typography
                sx={{
                  fontSize: 10.5,
                  fontWeight: item.active ? 700 : 600,
                  lineHeight: 1.1,
                  letterSpacing: isBn ? "normal" : "-0.01em",
                }}
              >
                {item.label}
              </Typography>
            </Box>
          );
        })}

        {/* Account Item */}
        {user ? (
          <Box
            component="button"
            type="button"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => setAccountAnchorEl(e.currentTarget)}
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.35,
              py: 0.75,
              border: "none",
              bgcolor: "transparent",
              cursor: "pointer",
              color: Boolean(accountAnchorEl) ? tokens.primaryDark : tokens.textSecondary,
              fontFamily: "inherit",
            }}
          >
            <Avatar
              src={user.image || undefined}
              alt={user.name || "User"}
              sx={{
                width: 22,
                height: 22,
                fontSize: "0.7rem",
                bgcolor: tokens.primary,
                color: tokens.onPrimary,
              }}
            >
              {(user.name || user.email || "U")[0]?.toUpperCase()}
            </Avatar>
            <Typography
              sx={{
                fontSize: 10.5,
                fontWeight: 600,
                lineHeight: 1.1,
              }}
            >
              {isBn ? "অ্যাকাউন্ট" : "Account"}
            </Typography>
          </Box>
        ) : (
          <Box
            component={Link}
            href="/auth/sign-in"
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.35,
              py: 0.75,
              textDecoration: "none",
              color: isAuthActive ? tokens.primaryDark : tokens.textSecondary,
              position: "relative",
              "&:active": {
                transform: "scale(0.95)",
              },
            }}
          >
            {isAuthActive && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  width: 24,
                  height: 2.5,
                  borderRadius: "0 0 4px 4px",
                  bgcolor: tokens.primary,
                }}
              />
            )}
            <PersonOutlineOutlinedIcon sx={{ fontSize: 22 }} />
            <Typography
              sx={{
                fontSize: 10.5,
                fontWeight: isAuthActive ? 700 : 600,
                lineHeight: 1.1,
              }}
            >
              {isBn ? "লগইন" : "Account"}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Signed-in Account Quick Menu */}
      <Menu
        anchorEl={accountAnchorEl}
        open={Boolean(accountAnchorEl)}
        onClose={() => setAccountAnchorEl(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "bottom", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              minWidth: 210,
              borderRadius: "14px",
              boxShadow: tokens.elevation3,
              border: `1px solid ${tokens.borderDefault}`,
              mb: 1,
            },
          },
        }}
      >
        {user && (
          <Box sx={{ px: 2, py: 1.25 }}>
            <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: tokens.textPrimary }} noWrap>
              {user.name || "User"}
            </Typography>
            <Typography sx={{ fontSize: 11.5, color: tokens.textMuted }} noWrap>
              {user.email}
            </Typography>
          </Box>
        )}
        <Divider />
        {user?.role === "ADMIN" && (
          <MenuItem
            onClick={() => {
              setAccountAnchorEl(null);
              router.push("/admin");
            }}
            sx={{ gap: 1.25, fontSize: 13.5, py: 1 }}
          >
            <DashboardOutlinedIcon sx={{ fontSize: 18, color: tokens.primary }} />
            <span>{isBn ? "অ্যাডমিন ড্যাশবোর্ড" : "Admin Dashboard"}</span>
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            setAccountAnchorEl(null);
            router.push("/cart");
          }}
          sx={{ gap: 1.25, fontSize: 13.5, py: 1 }}
        >
          <ShoppingBagOutlinedIcon sx={{ fontSize: 18, color: tokens.textSecondary }} />
          <span>{isBn ? "আমার কার্ট" : "My Cart"}</span>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={handleSignOut}
          sx={{ gap: 1.25, fontSize: 13.5, py: 1, color: tokens.danger }}
        >
          <LogoutIcon sx={{ fontSize: 18 }} />
          <span>{isBn ? "লগআউট" : "Sign Out"}</span>
        </MenuItem>
      </Menu>
    </>
  );
}

export function MobileBottomNav() {
  return (
    <Suspense fallback={null}>
      <MobileBottomNavContent />
    </Suspense>
  );
}
