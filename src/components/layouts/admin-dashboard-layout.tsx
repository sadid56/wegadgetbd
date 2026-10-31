"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Popover from "@mui/material/Popover";
import Divider from "@mui/material/Divider";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Tooltip } from "@/components/ui/tooltip";
import { Avatar } from "@/components/ui/avatar";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { DashboardLayout, ThemeSwitcher } from "@toolpad/core/DashboardLayout";
import { NextAppProvider } from "@toolpad/core/nextjs";
import { AuthenticationContext, SessionContext, type Authentication, type Session } from "@toolpad/core/AppProvider";
import { useRouter } from "next/navigation";
import NextLink from "next/link";

import { NAVIGATION } from "@/app/admin/_components/Sidebar";
import { authClient } from "@/lib/auth-client";
import theme, { tokens } from "@/theme/theme";
import { BrandLogo } from "@/components/common/BrandLogo";

const BRANDING = {
  title: "We Gadget Admin",
  homeUrl: "/admin",
};

function CustomAppTitle() {
  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", ml: 0.5 }}>
      <BrandLogo variant="light" size="sm" href="/admin" />
    </Box>
  );
}

function CustomToolbarActions() {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Button
        component={NextLink}
        href='/'
        target='_blank'
        size='small'
        variant='outlined'
        startIcon={<StorefrontOutlinedIcon sx={{ fontSize: 16 }} />}
        sx={{
          textTransform: "none",
          fontSize: 13,
          fontWeight: 600,
          borderRadius: "8px",
          color: "text.secondary",
          borderColor: "divider",
          "&:hover": {
            borderColor: "primary.main",
            color: "primary.main",
            bgcolor: "action.hover",
          },
        }}
      >
        View Store
      </Button>
    </Box>
  );
}

function CustomAccount() {
  const session = React.useContext(SessionContext);
  const authentication = React.useContext(AuthenticationContext);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  if (!session?.user) {
    if (!authentication) return null;
    return (
      <Button
        variant='outlined'
        size='small'
        onClick={() => authentication.signIn?.()}
        sx={{ textTransform: "none", borderRadius: "8px" }}
      >
        Sign in
      </Button>
    );
  }

  const user = session.user;

  return (
    <>
      <Tooltip title={user.name || "Account"}>
        <IconButton
          onClick={(e) => setAnchorEl(e.currentTarget)}
          size='small'
          aria-haspopup='true'
          aria-expanded={open ? "true" : undefined}
          sx={{ p: 0.5 }}
        >
          <Avatar
            src={user.image || ""}
            alt={user.name || "User"}
            sx={{ width: 34, height: 34 }}
          />
        </IconButton>
      </Tooltip>

      <Popover
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        onClick={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              mt: 1,
              minWidth: 220,
              borderRadius: "12px",
              border: "1px solid",
              borderColor: "divider",
              boxShadow: tokens.shadowLg,
              p: 1.5,
            },
          },
        }}
      >
        {/* User Info Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1 }}>
          <Avatar
            src={user.image || ""}
            alt={user.name || "User"}
            sx={{ width: 40, height: 40 }}
          />
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 14, color: "text.primary" }} noWrap>
              {user.name}
            </Typography>
            <Typography sx={{ fontSize: 12, color: "text.secondary" }} noWrap>
              {user.email}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Sign Out Button */}
        <Button
          fullWidth
          size='small'
          onClick={() => authentication?.signOut?.()}
          startIcon={<LogoutIcon sx={{ fontSize: 16 }} />}
          sx={{
            justifyContent: "flex-start",
            textTransform: "none",
            color: tokens.danger,
            fontSize: 13,
            fontWeight: 600,
            borderRadius: "8px",
            px: 1.5,
            py: 0.75,
            "&:hover": {
              bgcolor: tokens.dangerSubtle,
              color: tokens.dangerHover,
            },
          }}
        >
          Sign out
        </Button>
      </Popover>
    </>
  );
}

interface CustomDashboardHeaderProps {
  menuOpen: boolean;
  onToggleMenu: (open: boolean) => void;
  hideMenuButton?: boolean;
  slots?: {
    appTitle?: React.ElementType;
    toolbarActions?: React.ElementType;
    toolbarAccount?: React.ElementType;
  };
  slotProps?: any;
}

function CustomDashboardHeader(props: CustomDashboardHeaderProps) {
  const { menuOpen, onToggleMenu, hideMenuButton, slots, slotProps } = props;
  const ToolbarActionsSlot = slots?.toolbarActions ?? CustomToolbarActions;
  const ToolbarAccountSlot = slots?.toolbarAccount ?? CustomAccount;
  const AppTitleSlot = slots?.appTitle ?? CustomAppTitle;

  return (
    <AppBar
      color='inherit'
      position='absolute'
      sx={{
        borderWidth: 0,
        borderBottomWidth: 1,
        borderStyle: "solid",
        borderColor: "divider",
        boxShadow: "none",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: "background.paper",
      }}
    >
      <Toolbar
        sx={{
          minHeight: "64px !important",
          height: 64,
          backgroundColor: "inherit",
          mx: { xs: -0.75, sm: -1 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            width: "100%",
          }}
        >
          {/* Left section: menu hamburger toggle & app title */}
          <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1 }}>
            {!hideMenuButton && (
              <Tooltip title={`${menuOpen ? "Collapse" : "Expand"} menu`} enterDelay={1000}>
                <div>
                  <IconButton aria-label={`${menuOpen ? "Collapse" : "Expand"} navigation menu`} onClick={() => onToggleMenu(!menuOpen)}>
                    {menuOpen ? <MenuOpenIcon /> : <MenuIcon />}
                  </IconButton>
                </div>
              </Tooltip>
            )}
            <AppTitleSlot {...slotProps?.appTitle} />
          </Box>

          {/* Right section: custom actions, theme switcher, account popover */}
          <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1.5, ml: "auto" }}>
            <ToolbarActionsSlot {...slotProps?.toolbarActions} />
            <ThemeSwitcher />
            <ToolbarAccountSlot {...slotProps?.toolbarAccount} />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
}

export function AdminDashboardLayout({ children, user }: AdminDashboardLayoutProps) {
  const router = useRouter();

  const session = React.useMemo<Session>(
    () => ({
      user: {
        name: user.name || "Admin",
        email: user.email || "",
        image: user.image || undefined,
      },
    }),
    [user],
  );

  const authentication = React.useMemo<Authentication>(
    () => ({
      signIn: () => router.push("/auth/sign-in"),
      signOut: async () => {
        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push("/auth/sign-in");
            },
          },
        });
      },
    }),
    [router],
  );

  return (
    <NextAppProvider navigation={NAVIGATION} branding={BRANDING} session={session} authentication={authentication} theme={theme}>
      <DashboardLayout
        slots={{
          header: CustomDashboardHeader,
          appTitle: CustomAppTitle,
          toolbarActions: CustomToolbarActions,
          toolbarAccount: CustomAccount,
        }}
        sidebarExpandedWidth={260}
      >
        <Box
          sx={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            gap: { xs: 2.5, sm: 3 },
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 2.5, sm: 3 },
            maxWidth: 1600,
            mx: "auto",
            width: "100%",
          }}
        >
          {children}
        </Box>
      </DashboardLayout>
    </NextAppProvider>
  );
}
