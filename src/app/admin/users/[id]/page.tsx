"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { useToast } from "@/context/toast-context";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Chip } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FormControl, Select, MenuItem } from "@/components/ui/select";
import { CircularProgress } from "@/components/ui/spinner";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@/components/ui/dialog";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import GppBadIcon from "@mui/icons-material/GppBad";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import MonitorIcon from "@mui/icons-material/Monitor";

import { useUser, useUpdateUser } from "@/query-client/users";
import { useRevokeSession } from "@/query-client/admin";
import { parseDevice } from "@/lib/parse-device";
import { tokens } from "@/theme/theme";

const cardSx = {
  border: "1px solid",
  borderColor: "divider",
  borderRadius: "12px",
  bgcolor: "background.paper",
  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
} as const;

const cardHeaderSx = { pb: 1 } as const;

const selectSx = {
  borderRadius: "8px",
  fontSize: 14,
  bgcolor: "background.paper",
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "divider" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "text.disabled" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "primary.main" },
} as const;

export default function UserDetailsPage() {
  const toast = useToast();
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: user, isLoading } = useUser(id);
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const { mutate: revokeSession } = useRevokeSession();

  const [sessionToRevoke, setSessionToRevoke] = useState<string | null>(null);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress size={32} sx={{ color: "primary.main" }} />
      </Box>
    );
  }

  if (!user) {
    return <Box sx={{ py: 6, textAlign: "center", color: "text.secondary", fontSize: 14 }}>User not found</Box>;
  }

  const handleRoleChange = (role: string) => {
    updateUser({ id, data: { role } }, { onSuccess: () => toast.success("Role updated") });
  };

  const handleBanToggle = () => {
    const newStatus = !user.banned;
    updateUser(
      { id, data: { banned: newStatus } },
      {
        onSuccess: () => toast.success(newStatus ? "User banned" : "User unbanned"),
      },
    );
  };

  const handleRevokeSession = (sessionId: string) => {
    revokeSession(sessionId, {
      onSuccess: () => toast.success("Session revoked"),
    });
  };

  const confirmRevoke = () => {
    if (sessionToRevoke) {
      handleRevokeSession(sessionToRevoke);
      setSessionToRevoke(null);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <IconButton
          onClick={() => router.back()}
          aria-label='Go back'
          sx={{
            width: 36,
            height: 36,
            borderRadius: "8px",
            color: "text.primary",
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          <ArrowBackIcon sx={{ fontSize: 18 }} />
        </IconButton>
        <Typography
          component='h1'
          sx={{
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "text.primary",
          }}
        >
          User Details
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
        }}
      >
        {/* ─── Profile info card ─────────────────────────── */}
        <Card elevation={0} sx={cardSx}>
          <CardHeader
            title={
              <Typography component='h3' sx={{ fontSize: 18, fontWeight: 700, color: "text.primary", lineHeight: 1.3 }}>
                Profile Information
              </Typography>
            }
            subheader={<Typography sx={{ fontSize: 14, color: "text.secondary", mt: 0.5 }}>Basic details about the user.</Typography>}
            sx={cardHeaderSx}
          />
          <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Avatar row */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {user.image ? (
                <Box
                  component='img'
                  src={user.image}
                  alt={user.name}
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    border: "1px solid",
                    borderColor: "divider",
                    objectFit: "cover",
                    flexShrink: 0,
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    bgcolor: "action.hover",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    fontWeight: 700,
                    color: "text.primary",
                    flexShrink: 0,
                  }}
                >
                  {user.name.charAt(0)}
                </Box>
              )}
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: 18, fontWeight: 700, color: "text.primary", lineHeight: 1.3 }}>{user.name}</Typography>
                <Typography
                  sx={{
                    fontSize: 14,
                    color: "text.secondary",
                    mt: 0.25,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user.email}
                </Typography>
                <Typography sx={{ fontSize: 12, color: "text.secondary", mt: 0.25 }}>ID: {user.id}</Typography>
              </Box>
            </Box>

            {/* Joined / Status */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 2,
                pt: 2,
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box>
                <Box component='span' sx={{ fontSize: 14, color: "text.secondary" }}>
                  Joined
                </Box>
                <Typography sx={{ fontWeight: 500, color: "text.primary", mt: 0.25 }}>{format(new Date(user.createdAt), "PPP")}</Typography>
              </Box>
              <Box>
                <Box component='span' sx={{ fontSize: 14, color: "text.secondary" }}>
                  Status
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                  {user.banned ? (
                    <Chip
                      label='Banned'
                      size='small'
                      sx={{
                        height: 22,
                        fontSize: 11,
                        fontWeight: 700,
                        bgcolor: "error.main",
                        color: "error.contrastText",
                        "& .MuiChip-label": { px: 1.25 },
                      }}
                    />
                  ) : (
                    <Chip
                      label='Active'
                      size='small'
                      variant='outlined'
                      sx={{
                        height: 22,
                        fontSize: 11,
                        fontWeight: 700,
                        bgcolor: tokens.accentLight,
                        color: tokens.successText,
                        borderColor: tokens.successBorder,
                        "& .MuiChip-label": { px: 1.25 },
                      }}
                    />
                  )}
                </Box>
              </Box>
            </Box>

            {/* Role + Ban */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                pt: 2,
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Box component='label' htmlFor='user-role' sx={{ fontSize: 14, fontWeight: 500, color: "text.primary" }}>
                  Role
                </Box>
                <FormControl fullWidth size='small' disabled={isUpdating}>
                  <Select id='user-role' value={user.role} onChange={(e) => handleRoleChange(e.target.value as string)} sx={selectSx}>
                    <MenuItem value='USER' sx={{ fontSize: 14 }}>
                      User
                    </MenuItem>
                    <MenuItem value='ADMIN' sx={{ fontSize: 14 }}>
                      Admin
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Button
                fullWidth
                variant={user.banned ? "outlined" : "contained"}
                color={user.banned ? "inherit" : "error"}
                disableElevation
                onClick={handleBanToggle}
                disabled={isUpdating}
                startIcon={user.banned ? <CheckCircleIcon sx={{ fontSize: 16 }} /> : <BlockIcon sx={{ fontSize: 16 }} />}
                sx={{
                  height: 40,
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: 14,
                  ...(user.banned
                    ? {
                        borderColor: "divider",
                        color: "text.primary",
                        "&:hover": {
                          borderColor: "text.disabled",
                          bgcolor: "action.hover",
                        },
                      }
                    : {
                        bgcolor: "error.main",
                        color: "error.contrastText",
                        "&:hover": { bgcolor: "error.dark" },
                      }),
                }}
              >
                {user.banned ? "Unban User" : "Ban User"}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* ─── Right column ──────────────────────────────── */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Permissions card */}
          <Card elevation={0} sx={cardSx}>
            <CardHeader
              title={
                <Typography component='h3' sx={{ fontSize: 18, fontWeight: 700, color: "text.primary", lineHeight: 1.3 }}>
                  Permissions
                </Typography>
              }
              sx={cardHeaderSx}
            />
            <CardContent sx={{ pt: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                {user.role === "ADMIN" ? (
                  <GppBadIcon sx={{ fontSize: 20, color: tokens.danger }} />
                ) : (
                  <ShieldOutlinedIcon sx={{ fontSize: 20, color: tokens.info }} />
                )}
                <Box component='span' sx={{ fontWeight: 500, color: "text.primary" }}>
                  Current Role: {user.role}
                </Box>
              </Box>
              <Typography sx={{ fontSize: 14, color: "text.secondary", lineHeight: 1.6 }}>
                {user.role === "ADMIN"
                  ? "This user has full access to the admin dashboard, including product managment, user controls, and system settings."
                  : "This user has standard access to the storefront and their own order history."}
              </Typography>
            </CardContent>
          </Card>

          {/* Sessions card */}
          <Card elevation={0} sx={cardSx}>
            <CardHeader
              title={
                <Typography component='h3' sx={{ fontSize: 18, fontWeight: 700, color: "text.primary", lineHeight: 1.3 }}>
                  Active Sessions
                </Typography>
              }
              sx={cardHeaderSx}
            />
            <CardContent sx={{ pt: 1 }}>
              {user.sessions && user.sessions.length > 0 ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {user.sessions.map((session: any, idx: number) => {
                    const { device, os, browser } = parseDevice(session.userAgent);
                    const isMobile = device === "mobile";
                    const DeviceIcon = isMobile ? SmartphoneIcon : MonitorIcon;
                    const isLast = idx === (user.sessions?.length ?? 0) - 1;
                    return (
                      <Box
                        key={session.id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 2,
                          pb: isLast ? 0 : 2,
                          borderBottom: isLast ? "none" : "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        <Box sx={{ fontSize: 14, minWidth: 0 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: 500, color: "text.primary" }}>
                            <DeviceIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                            <Box component='span'>
                              {os} • {browser}
                            </Box>
                          </Box>
                          <Box component='p' title={session.userAgent} sx={{ fontSize: 12, color: "text.secondary", m: 0, mt: 0.25 }}>
                            {device.charAt(0).toUpperCase() + device.slice(1)} - {session.ipAddress || "Unknown IP"}
                          </Box>
                          <Box component='p' sx={{ fontSize: 12, color: "text.secondary", m: 0, mt: 0.25 }}>
                            Expires: {format(new Date(session.expiresAt), "PP")}
                          </Box>
                        </Box>

                        <IconButton
                          onClick={() => setSessionToRevoke(session.id)}
                          aria-label='Revoke session'
                          sx={{
                            width: 32,
                            height: 32,
                            flexShrink: 0,
                            color: tokens.danger,
                            "&:hover": {
                              color: tokens.dangerHover,
                              bgcolor: tokens.dangerSubtle,
                            },
                          }}
                        >
                          <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>
                    );
                  })}
                </Box>
              ) : (
                <Typography sx={{ fontSize: 14, color: "text.secondary" }}>No active sessions.</Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* ─── Revoke session confirmation ──────────────────── */}
      <Dialog
        open={!!sessionToRevoke}
        onClose={() => setSessionToRevoke(null)}
        maxWidth='xs'
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: "12px" } } }}
      >
        <DialogTitle sx={{ fontSize: 18, fontWeight: 700 }}>Revoke Session?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: 14, color: "text.secondary" }}>
            Are you sure you want to revoke this session? The user will be signed out from this device.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setSessionToRevoke(null)}
            variant='outlined'
            disableElevation
            sx={{
              textTransform: "none",
              fontWeight: 600,
              fontSize: 14,
              borderRadius: "8px",
              borderColor: "divider",
              color: "text.primary",
              "&:hover": { borderColor: "text.disabled", bgcolor: "action.hover" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmRevoke}
            variant='contained'
            disableElevation
            sx={{
              textTransform: "none",
              fontWeight: 600,
              fontSize: 14,
              borderRadius: "8px",
              bgcolor: tokens.danger,
              color: tokens.textWhite,
              "&:hover": { bgcolor: tokens.dangerHover },
            }}
          >
            Revoke
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
