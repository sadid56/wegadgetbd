"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { useToast } from "@/context/toast-context";

import Box from "@mui/material/Box";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { InputBase } from "@/components/ui/input";
import { Menu, MenuItem } from "@/components/ui/menu";
import { Chip } from "@/components/ui/badge";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { CircularProgress } from "@/components/ui/spinner";

import SearchIcon from "@mui/icons-material/Search";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { OrderEndpoints } from "@/query-client/orders";
import { orderStatusEnum, type OrderStatus } from "@/db/schema";
import { OrderDetailsModal } from "./order-details-modal";
import { tokens } from "@/theme/theme";

interface OrdersClientProps {
  initialOrders?: any[];
  metadata?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  search?: string;
  status?: OrderStatus;
}

const STATUS_CHIP_STYLE: Record<string, { bgcolor: string; color: string; borderColor: string }> = {
  PENDING: { bgcolor: tokens.warningSubtle, color: tokens.warningHover, borderColor: "transparent" },
  COMPLETED: { bgcolor: tokens.successSubtle, color: tokens.successText, borderColor: tokens.successBorder },
  CANCELLED: { bgcolor: tokens.dangerSubtle, color: tokens.dangerHover, borderColor: "transparent" },
  RETURNED: { bgcolor: tokens.errorSubtle, color: tokens.danger, borderColor: tokens.dangerBorder },
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
          >
            {STATUS_LABEL[s] ?? s}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

// ─── Main component ───────────────────────────────────────────
export function OrdersClient({ initialOrders = [], metadata: initMeta }: OrdersClientProps) {
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1");
  const searchParam = searchParams.get("search") || "";
  const statusParam = searchParams.get("status") as OrderStatus | undefined;

  const [orders, setOrders] = useState<any[]>(initialOrders);
  const [metadata, setMetadata] = useState(
    initMeta || { total: initialOrders.length, page: 1, limit: 10, totalPages: 1 }
  );
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchClientOrders() {
      setLoading(true);
      try {
        const res = await OrderEndpoints.getOrders({
          page,
          limit: 10,
          search: searchParam,
          status: statusParam && (statusParam as string) !== "all" ? statusParam : undefined,
        });

        if (isMounted && res) {
          setOrders(res.orders || []);
          setMetadata(res.metadata || null);
        }
      } catch (err) {
        console.error("Failed to load client orders:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchClientOrders();

    return () => {
      isMounted = false;
    };
  }, [page, searchParam, statusParam, refreshKey]);

  const buildQuery = (pageNum: number, query: string, statusVal?: string) => {
    const statusPart = statusVal && statusVal !== "all" ? `&status=${statusVal}` : "";
    return `?page=${pageNum}&search=${encodeURIComponent(query)}${statusPart}`;
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("search") as string;
    router.push(buildQuery(1, query, statusParam));
  };

  const handleStatusFilterChange = (value: string) => {
    router.push(buildQuery(1, searchParam, value));
  };

  const handleStatusChange = async (id: string, newStatus: OrderStatus) => {
    try {
      const res = await OrderEndpoints.updateOrderStatus({ id, status: newStatus });
      if (res) {
        toast.success(`Status updated to ${newStatus}`);
        setRefreshKey((prev) => prev + 1);
      } else {
        toast.error("Failed to update status");
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await OrderEndpoints.deleteOrder(deleteId);
      if (res) {
        toast.success("Order deleted successfully");
        setDeleteId(null);
        setRefreshKey((prev) => prev + 1);
      } else {
        toast.error("Failed to delete order");
      }
    } catch {
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
              defaultValue={searchParam}
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

        <FilterSelect value={statusParam || "all"} onChange={handleStatusFilterChange} options={statusFilterOptions} width={180} />
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ height: 160, textAlign: "center" }}>
                  <CircularProgress size={30} />
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ height: 96, textAlign: "center", color: "text.secondary" }}>
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
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
                          color: tokens.info,
                          "&:hover": { bgcolor: tokens.infoSubtle },
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
            onChange={(_: any, pageNum: number = 1) => {
              router.push(buildQuery(pageNum, searchParam, statusParam));
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
