"use client";

import { format } from "date-fns";

import Box from "@mui/material/Box";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";

import { Badge } from "@/components/ui/badge";
import { Dropdown } from "@/components/ui/dropdown";
import type { DataTableColumn } from "@/components/ui/data-table";
import { formatBdt } from "@/lib/utils";
import { tokens } from "@/theme/theme";
import type { AdminSaleItem } from "../page";

const ellipsisTextSx = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  display: "block",
} as const;

export function SaleStatusChip({ status }: { status: string }) {
  if (status === "COMPLETED" || status === "DELIVERED") {
    return <Badge variant='success'>{status}</Badge>;
  }
  if (status === "RETURNED") {
    return <Badge variant='danger'>{status}</Badge>;
  }
  return <Badge variant='secondary'>{status}</Badge>;
}

function PriceCell({ value, color = "text.primary" }: { value: number; color?: string }) {
  return (
    <Box component='span' sx={{ fontSize: 12, color }}>
      {formatBdt(value)}
    </Box>
  );
}

interface SalesColumnHandlers {
  onEdit: (sale: AdminSaleItem) => void;
  onDelete: (id: string) => void;
}

export function createSalesColumns({ onEdit, onDelete }: SalesColumnHandlers): DataTableColumn<AdminSaleItem>[] {
  return [
    {
      id: "date",
      header: "Date",
      width: 100,
      cell: (sale) => (
        <Box component='span' sx={{ fontSize: 12, color: "text.secondary" }}>
          {format(new Date(sale.date), "dd/MM/yy")}
        </Box>
      ),
    },
    {
      id: "product",
      header: "Product",
      cell: (sale) => (
        <Box component='span' title={sale.productName} sx={{ ...ellipsisTextSx, fontWeight: 500, color: "text.primary", maxWidth: 150 }}>
          {sale.productName}
        </Box>
      ),
    },
    {
      id: "customer",
      header: "Customer",
      cell: (sale) => (
        <Box component='span' title={sale.customerName} sx={{ ...ellipsisTextSx, color: "text.primary", maxWidth: 120 }}>
          {sale.customerName}
        </Box>
      ),
    },
    {
      id: "seller",
      header: "Seller",
      cell: (sale) => (
        <Box component='span' sx={{ fontSize: 13, color: "text.primary" }}>
          {sale.sellerName || "—"}
        </Box>
      ),
    },
    {
      id: "phone",
      header: "Phone",
      cell: (sale) => (
        <Box component='span' sx={{ fontSize: 12, color: "text.primary" }}>
          {sale.phoneNumber || "—"}
        </Box>
      ),
    },
    {
      id: "quantity",
      header: "Qty",
      cell: (sale) => (
        <Box component='span' sx={{ fontWeight: 600, color: "text.primary" }}>
          {sale.quantity}
        </Box>
      ),
    },
    {
      id: "sellPrice",
      header: "S.Price",
      cell: (sale) => <PriceCell value={sale.sellPrice} />,
    },
    {
      id: "buyPrice",
      header: "B.Price",
      cell: (sale) => <PriceCell value={sale.buyPrice} color='text.secondary' />,
    },
    {
      id: "boostingCost",
      header: "Boosting",
      cell: (sale) => <PriceCell value={sale.boostingCost} color='text.secondary' />,
    },
    {
      id: "profit",
      header: "Profit",
      cell: (sale) => (
        <Box
          component='span'
          sx={{
            fontWeight: 700,
            color: sale.profit >= 0 ? tokens.successText : tokens.danger,
          }}
        >
          {formatBdt(sale.profit)}
        </Box>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (sale) => <SaleStatusChip status={sale.status} />,
    },
    {
      id: "actions",
      header: "Actions",
      align: "right",
      cell: (sale) => (
        <Dropdown
          title='Actions'
          items={[
            {
              label: "Edit",
              icon: <EditOutlinedIcon sx={{ fontSize: 18 }} />,
              action: () => onEdit(sale),
            },
            "divider",
            {
              label: "Delete",
              icon: <DeleteOutlineIcon sx={{ fontSize: 18 }} />,
              danger: true,
              action: () => onDelete(sale.id),
            },
          ]}
        />
      ),
    },
  ];
}
