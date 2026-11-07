"use client";

import { useMemo, useState } from "react";
import { useQueryState, parseAsInteger, parseAsString } from "nuqs";
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

export function OrdersClient() {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [search, setSearch] = useQueryState("search", parseAsString.withDefault(""));
  const [status, setStatus] = useQueryState("status", parseAsString.withDefault("all"));

  const [searchInput, setSearchInput] = useState(search);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const { data, isLoading } = useOrders({
    page,
    limit: 10,
    search: search.trim() || undefined,
    status: status && status !== "all" ? status : undefined,
  });

  const { mutateAsync: updateStatusAsync } = useUpdateOrderStatus();
  const { mutate: deleteOrder } = useDeleteOrder();

  const orders = data?.orders ?? [];
  const totalCount = data?.metadata?.total ?? 0;

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim() || null);
  };

  const handleStatusFilterChange = (value: string) => {
    setPage(1);
    setStatus(value === "all" ? null : value);
  };

  const handleStatusChange = async (id: string, newStatus: OrderStatus) => {
    await updateStatusAsync({ id, status: newStatus });
  };

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

  const columns: DataTableColumn<any>[] = useMemo(
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
    [],
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Search & Filter Bar */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
        <Box component='form' onSubmit={handleSearchSubmit} sx={{ display: "flex", alignItems: "center", flex: 1, maxWidth: 384 }}>
          <InputBase
            placeholder='Search name, phone, or address...'
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
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
        rowsPerPage={10}
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
          order={selectedOrder}
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
