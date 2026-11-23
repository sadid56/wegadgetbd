"use client";

import { useCallback, useMemo, useState } from "react";
import { parseAsString } from "nuqs";
import { format } from "date-fns";

import Box from "@mui/material/Box";
import {
  Button,
  InputBase,
  Badge,
  DataTable,
  Dropdown,
  AlertDialog,
  type DataTableColumn,
} from "@/components/ui";

import SearchIcon from "@mui/icons-material/Search";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { useOrders, useUpdateOrderStatus, useDeleteOrder } from "@/query-client/orders";
import { useListQuery } from "@/hooks/use-list-query";
import { useDebounce } from "@/hooks/use-debounce";
import { orderStatusEnum, type OrderStatus } from "@/db/schema";
import { OrderDetailsModal } from "./order-details-modal";

const STATUS_VARIANT: Record<string, "warning" | "success" | "danger" | "secondary"> = {
  PENDING: "warning",
  COMPLETED: "success",
  CANCELLED: "danger",
  RETURNED: "danger",
};

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pending",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  RETURNED: "Returned",
};

function StatusChip({ status }: { status: OrderStatus }) {
  return (
    <Badge variant={STATUS_VARIANT[status] ?? "secondary"} sx={{ pointerEvents: "none" }}>
      {STATUS_LABEL[status] ?? status}
    </Badge>
  );
}

function StatusCell({ status, onChange }: { status: OrderStatus; onChange: (s: OrderStatus) => void }) {
  return (
    <Dropdown
      align='left'
      trigger={
        <Box component='span' sx={{ cursor: "pointer", display: "inline-block" }}>
          <StatusChip status={status} />
        </Box>
      }
      items={orderStatusEnum.enumValues.map((s) => ({
        label: STATUS_LABEL[s] ?? s,
        action: () => onChange(s),
      }))}
    />
  );
}

export interface AdminOrderItem {
  id: string;
  customerName: string;
  phoneNumber: string;
  address: string;
  city?: string | null;
  area?: string | null;
  status: OrderStatus;
  totalAmount: number;
  shippingCost?: number | null;
  discountAmount?: number | null;
  paymentMethod?: string | null;
  notes?: string | null;
  whatsappMessage?: string | null;
  createdAt: string | Date;
  updatedAt?: string | Date;
  items?: Array<{
    id: string;
    productTitle: string;
    price: number;
    quantity: number;
    image?: string | null;
    [key: string]: unknown;
  }>;
  device?: string | null;
  ipAddress?: string | null;
  [key: string]: unknown;
}

export function OrdersClient() {
  const {
    search,
    page,
    rowsPerPage,
    status,
    setSearch,
    setPage,
    setQuery,
  } = useListQuery({
    status: parseAsString.withDefault("all"),
  });

  const debouncedSearch = useDebounce(search, 300);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderItem | null>(null);

  const { data, isLoading } = useOrders({
    page,
    limit: rowsPerPage,
    search: debouncedSearch.trim() || undefined,
    status: status && status !== "all" ? status : undefined,
  });

  const { mutateAsync: updateStatusAsync } = useUpdateOrderStatus();
  const { mutate: deleteOrder } = useDeleteOrder();

  const orders = (data?.orders ?? []) as unknown as AdminOrderItem[];
  const totalCount = data?.metadata?.total ?? 0;

  const handleStatusFilterChange = (value: string) => {
    void setQuery({ status: value === "all" ? null : value, page: 1 });
  };

  const handleStatusChange = useCallback(
    async (id: string, newStatus: OrderStatus) => {
      await updateStatusAsync({ id, status: newStatus });
      setSelectedOrder((prev) => (prev && prev.id === id ? { ...prev, status: newStatus } : prev));
    },
    [updateStatusAsync],
  );

  const handleDelete = () => {
    if (!deleteId) return;
    deleteOrder(deleteId, {
      onSuccess: () => {
        setDeleteId(null);
      },
    });
  };

  const statusFilterOptions = [
    { value: "all", label: "All Statuses" },
    ...orderStatusEnum.enumValues.map((s) => ({
      value: s,
      label: STATUS_LABEL[s] ?? s,
    })),
  ];

  const columns: DataTableColumn<AdminOrderItem>[] = useMemo(
    () => [
      {
        id: "date",
        header: "Date",
        width: 140,
        cell: (order) => (
          <Box component='span' sx={{ fontSize: 12, color: "text.secondary" }}>
            {format(new Date(order.createdAt), "MMM dd, yyyy HH:mm")}
          </Box>
        ),
      },
      {
        id: "customer",
        header: "Customer",
        cell: (order) => (
          <Box
            component='span'
            title={order.customerName}
            sx={{
              fontWeight: 500,
              color: "text.primary",
              display: "block",
              maxWidth: 160,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {order.customerName}
          </Box>
        ),
      },
      {
        id: "phone",
        header: "Phone",
        cell: (order) => (
          <Box component='span' sx={{ fontSize: 13, color: "text.primary" }}>
            {order.phoneNumber}
          </Box>
        ),
      },
      {
        id: "amount",
        header: "Amount",
        cell: (order) => (
          <Box component='span' sx={{ fontWeight: 600, color: "text.primary" }}>
            ৳{Number(order.totalAmount).toLocaleString()}
          </Box>
        ),
      },
      {
        id: "status",
        header: "Status",
        cell: (order) => <StatusCell status={order.status} onChange={(s) => handleStatusChange(order.id, s)} />,
      },
      {
        id: "actions",
        header: "Actions",
        align: "right",
        cell: (order) => (
          <Dropdown
            title='Actions'
            items={[
              {
                label: "View Details",
                icon: <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />,
                action: () => setSelectedOrder(order),
              },
              "divider",
              {
                label: "Delete",
                icon: <DeleteOutlineIcon sx={{ fontSize: 18 }} />,
                danger: true,
                action: () => setDeleteId(order.id),
              },
            ]}
          />
        ),
      },
    ],
    [handleStatusChange],
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Search & Filter Bar */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
        <Box sx={{ display: "flex", alignItems: "center", flex: 1, maxWidth: 384 }}>
          <InputBase
            placeholder='Search name, phone, or address...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            startIcon={<SearchIcon sx={{ fontSize: 18 }} />}
          />
        </Box>

        <Dropdown
          align='left'
          trigger={
            <Button
              variant='outline'
              size='small'
              endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 18 }} />}
            >
              {statusFilterOptions.find((o) => o.value === (status || "all"))?.label ?? "All Statuses"}
            </Button>
          }
          items={statusFilterOptions.map((opt) => ({
            label: opt.label,
            action: () => handleStatusFilterChange(opt.value),
          }))}
        />
      </Box>

      {/* Reusable DataTable */}
      <DataTable
        columns={columns}
        data={orders}
        keyExtractor={(order) => order.id}
        isLoading={isLoading}
        emptyMessage='No orders found.'
        page={page - 1}
        rowsPerPage={rowsPerPage}
        totalCount={totalCount}
        onPageChange={(_, newPage) => {
          setPage(newPage + 1);
        }}
      />

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          open={!!selectedOrder}
          onOpenChange={(open) => !open && setSelectedOrder(null)}
          order={orders.find((o) => o.id === selectedOrder.id) ?? selectedOrder}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title='Move Order to Trash?'
        description='This will move the order to Trash. You can restore it anytime or delete it permanently from the Trash.'
        confirmText='Move to Trash'
        confirmVariant='destructive'
      />
    </Box>
  );
}
