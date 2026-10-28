"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useToast } from "@/context/toast-context";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";

import SearchIcon from "@mui/icons-material/Search";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { deleteOrder, updateOrderStatus } from "@/actions/orders";
import { orderStatusEnum, type OrderStatus } from "@/db/schema";
import { OrderDetailsModal } from "./order-details-modal";

interface OrdersClientProps {
  initialOrders: any[];
  metadata: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  search: string;
  status?: OrderStatus;
}

const STATUS_CHIP_STYLE: Record<string, { bgcolor: string; color: string; borderColor: string }> = {
  PENDING: { bgcolor: "#ffedd5", color: "#c2410c", borderColor: "transparent" },
  COMPLETED: { bgcolor: "#dcfce7", color: "#166534", borderColor: "#bbf7d0" },
  CANCELLED: { bgcolor: "#fee2e2", color: "#991b1b", borderColor: "transparent" },
  RETURNED: { bgcolor: "#fef2f2", color: "#dc2626", borderColor: "#fecaca" },
};

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pending",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  RETURNED: "Returned",
};

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
} as const;

function StatusChip({ status }: { status: OrderStatus }) {
  const style = STATUS_CHIP_STYLE[status] ?? {
    bgcolor: "action.hover",
    color: "text.primary",
    borderColor: "divider",
  };
  return (
    <Chip
      label={STATUS_LABEL[status] ?? status}
      size='small'
      variant={STATUS_CHIP_STYLE[status]?.borderColor ? "outlined" : "filled"}
      sx={{
        height: 22,
        fontSize: 11,
        fontWeight: 700,
        bgcolor: style.bgcolor,
        color: style.color,
        border: STATUS_CHIP_STYLE[status]?.borderColor ? `1px solid ${style.borderColor}` : "none",
        "& .MuiChip-label": { px: 1.25 },
        pointerEvents: "none",
      }}
    />
  );
}

// ─── Filter dropdown (single-select) ──────────────────────────
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
          fontSize: 13,
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
              fontSize: 13,
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

// ─── Inline status changer (badge → menu) ─────────────────────
function StatusCell({ status, onChange }: { status: OrderStatus; onChange: (s: OrderStatus) => void }) {
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);

  return (
    <>
      <Box
        component='button'
        type='button'
        onClick={(e) => setAnchor(e.currentTarget)}
        sx={{
          bgcolor: "transparent",
          border: 0,
          p: 0,
          cursor: "pointer",
          display: "inline-flex",
        }}
      >
        <StatusChip status={status} />
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
              minWidth: 130,
              borderRadius: "8px",
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
              py: 0.5,
            },
          },
        }}
      >
        {orderStatusEnum.enumValues.map((s) => (
          <MenuItem
            key={s}
            onClick={() => {
              onChange(s);
              setAnchor(null);
            }}
            selected={s === status}
            sx={{
              fontSize: 13,
              py: 1,
              "&.Mui-selected": { bgcolor: "action.selected", fontWeight: 600 },
            }}
          >
            {STATUS_LABEL[s] ?? s}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

// ─── Main component ───────────────────────────────────────────
export function OrdersClient({ initialOrders, metadata, search, status }: OrdersClientProps) {
  const toast = useToast();
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const buildQuery = (page: number, query: string, statusVal?: string) => {
    const statusPart = statusVal && statusVal !== "all" ? `&status=${statusVal}` : "";
    return `?page=${page}&search=${encodeURIComponent(query)}${statusPart}`;
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("search") as string;
    router.push(buildQuery(1, query, status));
  };

  const handleStatusFilterChange = (value: string) => {
    router.push(buildQuery(1, search, value));
  };

  const handleStatusChange = async (id: string, newStatus: OrderStatus) => {
    const res = await updateOrderStatus(id, newStatus);
    if (res.success) {
      toast.success(`Status updated to ${newStatus}`);
    } else {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const res = await deleteOrder(deleteId);
    if (res.success) {
      toast.success("Order deleted successfully");
      setDeleteId(null);
    } else {
      toast.error("Failed to delete order");
    }
  };

  const statusFilterOptions = [
    { value: "all", label: "All Statuses" },
    ...orderStatusEnum.enumValues.map((s) => ({
      value: s,
      label: STATUS_LABEL[s] ?? s,
    })),
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Filters row */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
        <Box sx={{ position: "relative", flex: 1, minWidth: 240, maxWidth: 384 }}>
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
          <Box component='form' onSubmit={handleSearch} sx={{ display: "flex" }}>
            <InputBase
              name='search'
              placeholder='Search by name, phone, or address...'
              defaultValue={search}
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

        <FilterSelect value={status || "all"} onChange={handleStatusFilterChange} options={statusFilterOptions} width={180} />
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
              <TableCell sx={{ ...tableHeadSx, width: 120 }}>Date</TableCell>
              <TableCell sx={tableHeadSx}>Customer</TableCell>
              <TableCell sx={tableHeadSx}>Phone</TableCell>
              <TableCell sx={tableHeadSx}>Amount</TableCell>
              <TableCell sx={tableHeadSx}>Status</TableCell>
              <TableCell sx={{ ...tableHeadSx, textAlign: "right" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {initialOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ height: 96, textAlign: "center", color: "text.secondary" }}>
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              initialOrders.map((order) => (
                <TableRow
                  key={order.id}
                  sx={{
                    "&:hover": { bgcolor: "action.hover" },
                    "& td": { borderBottom: "1px solid", borderColor: "divider", py: 1.5 },
                  }}
                >
                  <TableCell sx={{ fontSize: 12, color: "text.secondary" }}>
                    {format(new Date(order.createdAt), "MMM dd, yyyy HH:mm")}
                  </TableCell>
                  <TableCell
                    title={order.customerName}
                    sx={{
                      fontWeight: 500,
                      color: "text.primary",
                      maxWidth: 150,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {order.customerName}
                  </TableCell>
                  <TableCell sx={{ fontSize: 12, color: "text.primary" }}>{order.phoneNumber}</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>৳{Number(order.totalAmount).toLocaleString()}</TableCell>
                  <TableCell>
                    <StatusCell status={order.status} onChange={(s) => handleStatusChange(order.id, s)} />
                  </TableCell>
                  <TableCell sx={{ textAlign: "right" }}>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
                      <IconButton
                        size='small'
                        onClick={() => setSelectedOrder(order)}
                        aria-label='View order'
                        sx={{
                          width: 32,
                          height: 32,
                          color: "#3b82f6",
                          "&:hover": { bgcolor: "rgba(59,130,246,0.1)" },
                        }}
                      >
                        <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                      <IconButton
                        size='small'
                        onClick={() => setDeleteId(order.id)}
                        aria-label='Delete order'
                        sx={{
                          width: 32,
                          height: 32,
                          color: "error.main",
                          "&:hover": { bgcolor: "rgba(239,68,68,0.1)" },
                        }}
                      >
                        <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {metadata.totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Pagination
            count={metadata.totalPages}
            page={metadata.page}
            onChange={(_, page) => {
              router.push(buildQuery(page, search, status));
            }}
            showFirstButton
            showLastButton
            siblingCount={1}
            shape='rounded'
            sx={{
              "& .MuiPaginationItem-root": {
                fontSize: 13,
                borderRadius: "6px",
                border: "1px solid",
                borderColor: "divider",
                color: "text.primary",
                minWidth: 32,
                height: 32,
                "&:hover": { bgcolor: "action.hover" },
              },
              "& .MuiPaginationItem-page.Mui-selected": {
                bgcolor: "primary.main",
                color: "primary.contrastText",
                borderColor: "primary.main",
                "&:hover": { bgcolor: "primary.dark" },
              },
            }}
          />
        </Box>
      )}

      {/* Order details modal */}
      {selectedOrder && (
        <OrderDetailsModal
          open={!!selectedOrder}
          onOpenChange={(open) => !open && setSelectedOrder(null)}
          order={selectedOrder}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Delete confirmation */}
      <Dialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        maxWidth='xs'
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: "12px" } } }}
      >
        <DialogTitle sx={{ fontSize: 18, fontWeight: 700 }}>Delete Order?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: 14, color: "text.secondary" }}>
            This action will permanently delete this order record from the database. It cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setDeleteId(null)}
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
            onClick={handleDelete}
            variant='contained'
            disableElevation
            sx={{
              textTransform: "none",
              fontWeight: 600,
              fontSize: 14,
              borderRadius: "8px",
              bgcolor: "error.main",
              color: "error.contrastText",
              "&:hover": { bgcolor: "error.dark" },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
