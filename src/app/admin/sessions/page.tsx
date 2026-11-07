"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { useQueryState, parseAsInteger } from "nuqs";
import { useToast } from "@/context/toast-context";

import Box from "@mui/material/Box";
import { DashboardHeader } from "@/components/admin/dashboard-header";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Dropdown } from "@/components/ui/dropdown";
import { AlertDialog } from "@/components/ui/alert-dialog";

import SmartphoneIcon from "@mui/icons-material/Smartphone";
import MonitorIcon from "@mui/icons-material/Monitor";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";

import { useSessions, useRevokeSession } from "@/query-client/admin";

export default function SessionsPage() {
  const toast = useToast();
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [rowsPerPage, setRowsPerPage] = useQueryState("limit", parseAsInteger.withDefault(10));
  const [sessionToRevoke, setSessionToRevoke] = useState<string | null>(null);

  const { data, isLoading } = useSessions({
    page,
    limit: rowsPerPage,
  });

  const { mutate: revokeSession } = useRevokeSession();

  const confirmRevoke = () => {
    if (sessionToRevoke) {
      revokeSession(sessionToRevoke, {
        onSuccess: () => {
          toast.success("Session revoked successfully");
          setSessionToRevoke(null);
        },
      });
    }
  };

  const columns: DataTableColumn<any>[] = useMemo(
    () => [
      {
        id: "user",
        header: "User",
        cell: (session) => (
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box component='span' sx={{ fontWeight: 500, color: "text.primary" }}>
              {session.user?.name || "Unknown"}
            </Box>
            <Box component='span' sx={{ fontSize: 12, color: "text.secondary", mt: 0.25 }}>
              {session.user?.email || "—"}
            </Box>
          </Box>
        ),
      },
      {
        id: "device",
        header: "Device / User Agent",
        cell: (session) => {
          const isMobile = session.userAgent?.toLowerCase().includes("mobile");
          const DeviceIcon = isMobile ? SmartphoneIcon : MonitorIcon;
          return (
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
                {session.userAgent || "Unknown"}
              </Box>
            </Box>
          );
        },
      },
      {
        id: "ip",
        header: "IP Address",
        cell: (session) => (
          <Box component='span' sx={{ fontSize: 13, color: "text.primary" }}>
            {session.ipAddress || session.ip || "Unknown"}
          </Box>
        ),
      },
      {
        id: "expires",
        header: "Expires",
        cell: (session) => (
          <Box component='span' sx={{ fontSize: 13, color: "text.secondary" }}>
            {session.expiresAt ? format(new Date(session.expiresAt), "PP p") : "—"}
          </Box>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        align: "right",
        cell: (session) => (
          <Dropdown
            title='Actions'
            items={[
              {
                label: "Revoke Session",
                icon: <DeleteOutlineIcon sx={{ fontSize: 18 }} />,
                danger: true,
                action: () => setSessionToRevoke(session.id),
              },
            ]}
          />
        ),
      },
    ],
    [],
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Dashboard Header */}
      <DashboardHeader
        title='Active Sessions'
        description='Monitor and manage all active user sessions across the platform.'
      />

      {/* Reusable DataTable with Backend Pagination */}
      <DataTable
        columns={columns}
        data={data?.sessions ?? []}
        keyExtractor={(session) => session.id}
        isLoading={isLoading}
        emptyMessage='No active sessions found.'
        page={page - 1}
        rowsPerPage={rowsPerPage}
        totalCount={data?.total ?? 0}
        onPageChange={(_, newPage) => setPage(newPage + 1)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(1);
        }}
      />

      {/* Revoke Confirmation Alert Dialog */}
      <AlertDialog
        open={!!sessionToRevoke}
        onClose={() => setSessionToRevoke(null)}
        onConfirm={confirmRevoke}
        title='Revoke Session?'
        description='This will immediately log out the user on this device. They will need to log in again.'
        confirmText='Revoke'
        confirmVariant='destructive'
      />
    </Box>
  );
}
