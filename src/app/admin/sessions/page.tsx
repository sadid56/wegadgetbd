"use client";

import { format } from "date-fns";
import { useToast } from "@/context/toast-context";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import SmartphoneIcon from "@mui/icons-material/Smartphone";
import MonitorIcon from "@mui/icons-material/Monitor";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";

import { useSessions, useRevokeSession } from "@/query-client/admin";

const tableHeadSx = {
  fontSize: 12,
  fontWeight: 600,
  color: "text.secondary",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  bgcolor: "action.hover",
  borderBottom: "1px solid",
  borderColor: "divider",
  py: 1.25,
  whiteSpace: "nowrap",
} as const;

export default function SessionsPage() {
  const toast = useToast();
  const { data: sessions, isLoading } = useSessions();
  const { mutate: revokeSession } = useRevokeSession();

  const handleRevoke = (id: string) => {
    revokeSession(id, {
      onSuccess: () => toast.success("Session revoked successfully"),
    });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box>
        <Typography
          component='h1'
          sx={{
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "text.primary",
          }}
        >
          Active Sessions
        </Typography>
        <Typography sx={{ fontSize: 14, color: "text.secondary", mt: 0.5 }}>
          Monitor and manage all active user sessions across the platform.
        </Typography>
      </Box>

      <TableContainer
        sx={{
          borderRadius: "8px",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          overflow: "auto",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={tableHeadSx}>User</TableCell>
              <TableCell sx={tableHeadSx}>Device / User Agent</TableCell>
              <TableCell sx={tableHeadSx}>IP Address</TableCell>
              <TableCell sx={tableHeadSx}>Expires</TableCell>
              <TableCell sx={{ ...tableHeadSx, textAlign: "right" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ height: 96, textAlign: "center" }}>
                  <CircularProgress size={24} sx={{ color: "primary.main" }} />
                </TableCell>
              </TableRow>
            ) : sessions?.sessions?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ height: 96, textAlign: "center", color: "text.secondary" }}>
                  No active sessions found.
                </TableCell>
              </TableRow>
            ) : (
              sessions?.sessions?.map((session: any) => {
                const isMobile = session.userAgent?.toLowerCase().includes("mobile");
                const DeviceIcon = isMobile ? SmartphoneIcon : MonitorIcon;

                return (
                  <TableRow
                    key={session.id}
                    sx={{
                      "&:hover": { bgcolor: "action.hover" },
                      "& td": {
                        borderBottom: "1px solid",
                        borderColor: "divider",
                        py: 1.5,
                      },
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Box component='span' sx={{ fontWeight: 500, color: "text.primary" }}>
                          {session.user.name}
                        </Box>
                        <Box component='span' sx={{ fontSize: 12, color: "text.secondary", mt: 0.25 }}>
                          {session.user.email}
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          minWidth: 0,
                        }}
                        title={session.userAgent}
                      >
                        <DeviceIcon sx={{ fontSize: 16, color: "text.secondary", flexShrink: 0 }} />
                        <Box
                          component='span'
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: 300,
                            fontSize: 14,
                            color: "text.primary",
                          }}
                        >
                          {session.userAgent}
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell sx={{ fontSize: 14, color: "text.primary" }}>{session.ip || "Unknown"}</TableCell>

                    <TableCell sx={{ fontSize: 14, color: "text.primary" }}>{format(new Date(session.expiresAt), "PP p")}</TableCell>

                    <TableCell sx={{ textAlign: "right" }}>
                      <IconButton
                        size='small'
                        onClick={() => handleRevoke(session.id)}
                        aria-label='Revoke session'
                        sx={{
                          width: 32,
                          height: 32,
                          color: "#ef4444",
                          "&:hover": {
                            color: "#dc2626",
                            bgcolor: "rgba(239,68,68,0.1)",
                          },
                        }}
                      >
                        <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
