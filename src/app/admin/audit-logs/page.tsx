"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { useQueryState, parseAsInteger } from "nuqs";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import {
  Button,
  IconButton,
  InputBase,
  Badge,
  Modal,
  ModalTitle,
  ModalContent,
  ModalActions,
  DataTable,
  type DataTableColumn,
  Dropdown,
} from "@/components/ui";
import { DashboardHeader } from "@/components/admin/dashboard-header";

import SearchIcon from "@mui/icons-material/Search";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloseIcon from "@mui/icons-material/Close";

import { useAuditLogs } from "@/query-client/audit-logs";
import { tokens } from "@/theme/theme";

const ACTION_VARIANTS: Record<string, "success" | "info" | "danger" | "warning" | "gaming" | "sale" | "secondary"> = {
  CREATE_PRODUCT: "success",
  UPDATE_PRODUCT: "info",
  DELETE_PRODUCT: "danger",
  STATUS_CHANGE: "warning",
  LOGIN: "gaming",
  SESSION_REVOKE: "sale",
  BLOCK_USER: "danger",
  UNBLOCK_USER: "success",
  UPDATE_SETTINGS: "info",
};

const ACTION_LABELS: Record<string, string> = {
  CREATE_PRODUCT: "Product Created",
  UPDATE_PRODUCT: "Product Updated",
  DELETE_PRODUCT: "Product Deleted",
  STATUS_CHANGE: "Status Changed",
  LOGIN: "User Login",
  SESSION_REVOKE: "Session Revoked",
  BLOCK_USER: "User Blocked",
  UNBLOCK_USER: "User Unblocked",
  UPDATE_SETTINGS: "Settings Updated",
};

const ACTION_OPTIONS = [
  { value: "ALL", label: "All Actions" },
  ...Object.entries(ACTION_LABELS).map(([value, label]) => ({ value, label })),
];

export default function AuditLogsPage() {
  const [search, setSearch] = useQueryState("search", { defaultValue: "", shallow: false });
  const [actionFilter, setActionFilter] = useQueryState("action", { defaultValue: "ALL", shallow: false });
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [rowsPerPage, setRowsPerPage] = useQueryState("limit", parseAsInteger.withDefault(20));

  const [selectedMetadata, setSelectedMetadata] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, isLoading } = useAuditLogs({
    search: search.trim() || undefined,
    page,
    limit: rowsPerPage,
    action: actionFilter === "ALL" ? undefined : actionFilter,
  });

  const columns: DataTableColumn<any>[] = useMemo(
    () => [
      {
        id: "action",
        header: "Action",
        cell: (log) => (
          <Badge variant={ACTION_VARIANTS[log.action] ?? "secondary"}>
            {ACTION_LABELS[log.action] || log.action}
          </Badge>
        ),
      },
      {
        id: "actor",
        header: "Actor",
        cell: (log) => (
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="body2" sx={{ fontSize: "0.875rem", fontWeight: 500, color: "text.primary" }}>
              {log.user?.name || "Unknown"}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: "0.75rem", color: "text.secondary", mt: 0.25 }}>
              {log.user?.email || log.actorId}
            </Typography>
          </Box>
        ),
      },
      {
        id: "actorType",
        header: "Actor Type",
        cell: (log) => (
          <Badge variant={log.actorType === "ADMIN" ? "default" : "secondary"}>
            {log.actorType}
          </Badge>
        ),
      },
      {
        id: "timestamp",
        header: "Timestamp",
        cell: (log) => (
          <Typography variant="body2" sx={{ fontSize: "0.8125rem", color: "text.secondary" }}>
            {format(new Date(log.timestamp), "MMM d, yyyy h:mm a")}
          </Typography>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        align: "right",
        cell: (log) => (
          <Dropdown
            title="Actions"
            items={[
              {
                label: "View Payload",
                icon: <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />,
                disabled: !log.metadata,
                action: () => {
                  setSelectedMetadata(log.metadata);
                  setIsDialogOpen(true);
                },
              },
            ]}
          />
        ),
      },
    ],
    [],
  );

  const currentActionLabel =
    ACTION_OPTIONS.find((opt) => opt.value === actionFilter)?.label ?? "All Actions";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Dashboard Header */}
      <DashboardHeader
        title="Audit Logs"
        description="Track all administrative actions and system events."
      />

      {/* Filters Bar */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
        <Box sx={{ display: "flex", alignItems: "center", flex: 1, maxWidth: 384 }}>
          <InputBase
            placeholder="Search by actor or metadata..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value || null);
              setPage(1);
            }}
            startIcon={<SearchIcon sx={{ fontSize: 18 }} />}
          />
        </Box>

        <Dropdown
          trigger={
            <Button
              variant="outline"
              endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 18 }} />}
              sx={{ minWidth: 180, justifyContent: "space-between" }}
            >
              {currentActionLabel}
            </Button>
          }
          items={ACTION_OPTIONS.map((opt) => ({
            label: opt.label,
            action: () => {
              setActionFilter(opt.value === "ALL" ? null : opt.value);
              setPage(1);
            },
          }))}
        />
      </Box>

      {/* Reusable DataTable */}
      <DataTable
        columns={columns}
        data={data?.logs ?? []}
        keyExtractor={(log) => log.id}
        isLoading={isLoading}
        emptyMessage="No audit logs found."
        page={page - 1}
        rowsPerPage={rowsPerPage}
        totalCount={data?.total ?? 0}
        onPageChange={(_, newPage) => setPage(newPage + 1)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(1);
        }}
      />

      {/* Metadata Modal */}
      <Modal
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <ModalTitle sx={{ fontSize: 18, fontWeight: 700, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Audit Log Metadata</span>
          <IconButton onClick={() => setIsDialogOpen(false)} size="small" aria-label="Close">
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </ModalTitle>
        <ModalContent dividers>
          <Box
            component="pre"
            sx={{
              fontSize: "0.75rem",
              fontFamily: "monospace",
              bgcolor: tokens.bgSubtle,
              p: 2,
              borderRadius: `${tokens.radiusMd}px`,
              overflow: "auto",
              maxHeight: "60vh",
              border: `1px solid ${tokens.borderDefault}`,
              m: 0,
              color: tokens.textPrimary,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {selectedMetadata ? JSON.stringify(selectedMetadata, null, 2) : "No metadata available"}
          </Box>
        </ModalContent>
        <ModalActions sx={{ p: 2 }}>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Close
          </Button>
        </ModalActions>
      </Modal>
    </Box>
  );
}
