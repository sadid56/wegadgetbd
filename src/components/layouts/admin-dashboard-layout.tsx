"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Tooltip } from "@/components/ui/tooltip";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import { DashboardLayout, ThemeSwitcher } from "@toolpad/core/DashboardLayout";
import { Account } from "@toolpad/core/Account";
import { NextAppProvider } from "@toolpad/core/nextjs";
import type { Authentication, Session } from "@toolpad/core/AppProvider";
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
  const ToolbarAccountSlot = slots?.toolbarAccount ?? Account;
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
            pt: { xs: 3, sm: 3.5, md: 4 },
            pb: { xs: 6, sm: 8, md: 10 },
            minHeight: "100%",
          }}
        >
          {children}
        </Box>
      </DashboardLayout>
    </NextAppProvider>
  );
}
