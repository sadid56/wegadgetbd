"use client";

import NextLink from "next/link";
import { useState } from "react";
import { format } from "date-fns";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button } from "@/components/ui/button";
import { InputBase } from "@/components/ui/input";
import { Chip } from "@/components/ui/badge";
import { CircularProgress } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@/components/ui/table";

import SearchIcon from "@mui/icons-material/Search";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import { useUsers } from "@/query-client/users";
import { tokens } from "@/theme/theme";

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

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useUsers({ search, limit: 50 });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Typography
          component='h1'
          sx={{
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "text.primary",
          }}
        >
          Users
        </Typography>
      </Box>

      {/* Search */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box sx={{ position: "relative", flex: 1, maxWidth: 384 }}>
          <SearchIcon
            sx={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 16,
              color: "text.secondary",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
          <InputBase
            placeholder='Search users...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              width: "100%",
              height: 40,
              pl: "32px",
              pr: 1.5,
              borderRadius: "8px",
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              fontSize: 14,
              transition: "border-color 200ms",
              "& input::placeholder": { color: "text.secondary", opacity: 1 },
              "&.Mui-focused": { borderColor: "primary.main" },
            }}
          />
        </Box>
      </Box>

      {/* Table */}
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
              <TableCell sx={tableHeadSx}>Email</TableCell>
              <TableCell sx={tableHeadSx}>Role</TableCell>
              <TableCell sx={tableHeadSx}>Joined</TableCell>
              <TableCell sx={tableHeadSx}>Status</TableCell>
              <TableCell sx={{ ...tableHeadSx, textAlign: "right" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ height: 96, textAlign: "center" }}>
                  <CircularProgress size={24} sx={{ color: "primary.main" }} />
                </TableCell>
              </TableRow>
            ) : data?.users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ height: 96, textAlign: "center", color: "text.secondary" }}>
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              data?.users.map((user) => (
                <TableRow
                  key={user.id}
                  sx={{
                    "&:hover": { bgcolor: "action.hover" },
                    "& td": {
                      borderBottom: "1px solid",
                      borderColor: "divider",
                      py: 1.5,
                    },
                  }}
                >
                  {/* User */}
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {user.image ? (
                        <Box
                          component='img'
                          src={user.image}
                          alt={user.name || "User"}
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            objectFit: "cover",
                            flexShrink: 0,
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            bgcolor: "action.hover",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 12,
                            fontWeight: 600,
                            color: "text.secondary",
                            flexShrink: 0,
                          }}
                        >
                          ?
                        </Box>
                      )}
                      <Box component='span' sx={{ fontWeight: 500, color: "text.primary" }}>
                        {user.name}
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Email */}
                  <TableCell sx={{ fontSize: 14, color: "text.primary" }}>{user.email}</TableCell>

                  {/* Role */}
                  <TableCell>
                    <Chip
                      label={user.role}
                      size='small'
                      sx={{
                        height: 22,
                        fontSize: 11,
                        fontWeight: 700,
                        bgcolor: user.role === "ADMIN" ? "primary.main" : "action.hover",
                        color: user.role === "ADMIN" ? "primary.contrastText" : "text.primary",
                        "& .MuiChip-label": { px: 1.25 },
                      }}
                    />
                  </TableCell>

                  {/* Joined */}
                  <TableCell sx={{ fontSize: 14, color: "text.primary" }}>{format(new Date(user.createdAt), "MMM d, yyyy")}</TableCell>

                  {/* Status */}
                  <TableCell>
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
                  </TableCell>

                  {/* Actions */}
                  <TableCell sx={{ textAlign: "right" }}>
                    <Button
                      component={NextLink}
                      href={`/admin/users/${user.id}`}
                      size='small'
                      disableElevation
                      startIcon={<VisibilityOutlinedIcon sx={{ fontSize: 14 }} />}
                      sx={{
                        textTransform: "none",
                        fontSize: 13,
                        fontWeight: 600,
                        borderRadius: "8px",
                        color: "text.primary",
                        px: 1.5,
                        minWidth: 0,
                        "&:hover": { bgcolor: "action.hover" },
                      }}
                    >
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
