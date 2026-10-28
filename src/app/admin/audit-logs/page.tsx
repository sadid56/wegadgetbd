"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import SearchIcon from "@mui/icons-material/Search";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloseIcon from "@mui/icons-material/Close";

import { useAuditLogs } from "@/query-client/audit-logs";
import { format } from "date-fns";

// ─── Action constants ─────────────────────────────────────────────
const ACTION_COLORS: Record<string, { bgcolor: string; color: string; borderColor: string }> = {
  CREATE_PRODUCT: { bgcolor: "#dcfce7", color: "#166534", borderColor: "#bbf7d0" },
  UPDATE_PRODUCT: { bgcolor: "#dbeafe", color: "#1e40af", borderColor: "#bfdbfe" },
  DELETE_PRODUCT: { bgcolor: "#fee2e2", color: "#991b1b", borderColor: "#fecaca" },
  STATUS_CHANGE: { bgcolor: "#fef9c3", color: "#854d0e", borderColor: "#fef08a" },
  LOGIN: { bgcolor: "#f3e8ff", color: "#6b21a8", borderColor: "#e9d5ff" },
  SESSION_REVOKE: { bgcolor: "#ffedd5", color: "#9a3412", borderColor: "#fed7aa" },
  BLOCK_USER: { bgcolor: "#fee2e2", color: "#991b1b", borderColor: "#fecaca" },
  UNBLOCK_USER: { bgcolor: "#dcfce7", color: "#166534", borderColor: "#bbf7d0" },
  UPDATE_SETTINGS: { bgcolor: "#e0e7ff", color: "#3730a3", borderColor: "#c7d2fe" },
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

const LIMIT_OPTIONS = [10, 20, 50, 100];

// ─── Simple dropdown ─────────────────────────────────────────────
function FilterSelect({
  value,
  onChange,
  options,
  width,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  width: number;
}) {
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const current = options.find((o) => o.value === value) ?? options[0];

  return (
    <>
      <Box
        component='button'
        type='button'
        onClick={(e) => setAnchor(e.currentTarget)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          height: 40,
          width,
          px: 1.75,
          borderRadius: "8px",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          fontSize: 14,
          fontWeight: 500,
          color: "text.primary",
          cursor: "pointer",
          textAlign: "left",
          "&:hover": { borderColor: "text.disabled" },
        }}
      >
        <Box component='span' sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {current.label}
        </Box>
        <KeyboardArrowDownIcon
          sx={{
            fontSize: 18,
            color: "text.secondary",
            transition: "transform 200ms",
            transform: anchor ? "rotate(180deg)" : "rotate(0deg)",
            flexShrink: 0,
          }}
        />
      </Box>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            sx: {
              mt: 0.5,
              minWidth: width,
              borderRadius: "8px",
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
              py: 0.5,
              maxHeight: 320,
            },
          },
        }}
      >
        {options.map((opt) => (
          <MenuItem
            key={opt.value}
            onClick={() => {
              onChange(opt.value);
              setAnchor(null);
            }}
            selected={opt.value === value}
            sx={{
              fontSize: 14,
              py: 1,
              "&.Mui-selected": { bgcolor: "action.selected", fontWeight: 600 },
              "&.Mui-selected:hover": { bgcolor: "action.selected" },
            }}
          >
            {opt.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

// ─── Main page ────────────────────────────────────────────────────
export default function AuditLogsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [actionFilter, setActionFilter] = useState("ALL");
  const [selectedMetadata, setSelectedMetadata] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, isLoading } = useAuditLogs({
    search,
    page,
    limit,
    action: actionFilter === "ALL" ? undefined : actionFilter,
  });

  const totalPages = data?.totalPages || 1;
  const currentPage = data?.currentPage || 1;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
        <Box>
          <Typography component='h1' sx={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em", color: "text.primary" }}>
            Audit Logs
          </Typography>
          <Typography sx={{ fontSize: 14, color: "text.secondary", mt: 0.25 }}>
            Track all administrative actions and system events
          </Typography>
        </Box>
        <Chip label={`Total: ${data?.total || 0} logs`} variant='outlined' sx={{ fontSize: 13, fontWeight: 500, height: 28 }} />
      </Box>

      {/* Filters */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
          gap: 1.5,
        }}
      >
        <Box sx={{ position: "relative", flex: 1, maxWidth: { sm: 384 }, width: "100%" }}>
          <SearchIcon
            sx={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 16,
              color: "text.secondary",
              pointerEvents: "none",
            }}
          />
          <InputBase
            placeholder='Search by actor or metadata...'
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
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

        <FilterSelect
          value={actionFilter}
          onChange={(v) => {
            setActionFilter(v);
            setPage(1);
          }}
          options={ACTION_OPTIONS}
          width={200}
        />

        <FilterSelect
          value={limit.toString()}
          onChange={(v) => {
            setLimit(Number(v));
            setPage(1);
          }}
          options={LIMIT_OPTIONS.map((n) => ({ value: n.toString(), label: `${n} / page` }))}
          width={120}
        />
      </Box>

      {/* Table */}
      <TableContainer
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: "8px",
          overflow: "auto",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              {["Action", "Actor", "Actor Type", "Metadata", "Timestamp"].map((head) => (
                <TableCell
                  key={head}
                  sx={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "text.secondary",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    bgcolor: "action.hover",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    py: 1.25,
                  }}
                >
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ height: 96, textAlign: "center" }}>
                  <CircularProgress size={24} sx={{ color: "primary.main" }} />
                </TableCell>
              </TableRow>
            ) : data?.logs?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ height: 96, textAlign: "center" }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                      color: "text.secondary",
                    }}
                  >
                    <DescriptionOutlinedIcon sx={{ fontSize: 32 }} />
                    <Box component='p' sx={{ m: 0, fontSize: 14 }}>
                      No audit logs found.
                    </Box>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              data?.logs?.map((log: any) => {
                const colorStyle = ACTION_COLORS[log.action] || {
                  bgcolor: "#f3f4f6",
                  color: "#1f2937",
                  borderColor: "#e5e7eb",
                };
                return (
                  <TableRow
                    key={log.id}
                    sx={{
                      "&:hover": { bgcolor: "action.hover" },
                      "& td": { borderBottom: "1px solid", borderColor: "divider", py: 1.5 },
                    }}
                  >
                    <TableCell>
                      <Chip
                        label={ACTION_LABELS[log.action] || log.action}
                        size='small'
                        variant='outlined'
                        sx={{
                          ...colorStyle,
                          fontSize: 11,
                          fontWeight: 600,
                          height: 22,
                          border: `1px solid ${colorStyle.borderColor}`,
                          "& .MuiChip-label": { px: 1 },
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Box component='span' sx={{ fontSize: 14, fontWeight: 500, color: "text.primary" }}>
                          {log.user?.name || "Unknown"}
                        </Box>
                        <Box component='span' sx={{ fontSize: 12, color: "text.secondary", mt: 0.25 }}>
                          {log.user?.email || log.actorId}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.actorType}
                        size='small'
                        sx={{
                          fontSize: 11,
                          fontWeight: 600,
                          height: 22,
                          bgcolor: log.actorType === "ADMIN" ? "primary.main" : "action.hover",
                          color: log.actorType === "ADMIN" ? "primary.contrastText" : "text.primary",
                          "& .MuiChip-label": { px: 1 },
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {log.metadata ? (
                        <Button
                          size='small'
                          variant='text'
                          onClick={() => {
                            setSelectedMetadata(log.metadata);
                            setIsDialogOpen(true);
                          }}
                          startIcon={<VisibilityOutlinedIcon sx={{ fontSize: 14 }} />}
                          sx={{
                            fontSize: 12,
                            textTransform: "none",
                            color: "text.primary",
                            minWidth: 0,
                            px: 1,
                            "&:hover": { bgcolor: "action.hover" },
                          }}
                        >
                          View
                        </Button>
                      ) : (
                        <Box component='span' sx={{ fontSize: 12, color: "text.secondary" }}>
                          -
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>
                      <Box component='span' sx={{ fontSize: 13, color: "text.primary" }}>
                        {format(new Date(log.timestamp), "MMM d, yyyy h:mm a")}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
          <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
            Page {currentPage} of {totalPages}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              size='small'
              variant='outlined'
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              startIcon={<ChevronLeftIcon sx={{ fontSize: 16 }} />}
              sx={{ textTransform: "none", fontSize: 13, borderColor: "divider", color: "text.primary" }}
            >
              Previous
            </Button>
            <Button
              size='small'
              variant='outlined'
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              endIcon={<ChevronRightIcon sx={{ fontSize: 16 }} />}
              sx={{ textTransform: "none", fontSize: 13, borderColor: "divider", color: "text.primary" }}
            >
              Next
            </Button>
          </Box>
        </Box>
      )}

      {/* Metadata dialog */}
      <Modal open={isDialogOpen} onClose={() => setIsDialogOpen(false)} closeAfterTransition>
        <Fade in={isDialogOpen} timeout={200}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "calc(100% - 32px)",
              maxWidth: 768,
              maxHeight: "80vh",
              bgcolor: "background.paper",
              borderRadius: "12px",
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              overflow: "auto",
              outline: "none",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                p: 2.5,
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box>
                <Typography component='h2' sx={{ fontSize: 18, fontWeight: 700, color: "text.primary", lineHeight: 1.3 }}>
                  Audit Log Metadata
                </Typography>
                <Typography sx={{ fontSize: 14, color: "text.secondary", mt: 0.5 }}>
                  Detailed information about this audit log entry
                </Typography>
              </Box>
              <IconButton
                onClick={() => setIsDialogOpen(false)}
                size='small'
                aria-label='Close'
                sx={{
                  borderRadius: "8px",
                  color: "text.secondary",
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <CloseIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>

            <Box sx={{ p: 2.5 }}>
              <Box
                component='pre'
                sx={{
                  fontSize: 12,
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  bgcolor: "action.hover",
                  p: 2,
                  borderRadius: "8px",
                  overflow: "auto",
                  maxHeight: "60vh",
                  border: "1px solid",
                  borderColor: "divider",
                  m: 0,
                  color: "text.primary",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {selectedMetadata ? JSON.stringify(selectedMetadata, null, 2) : "No metadata available"}
              </Box>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
}
